const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { createWorker } = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = process.env.PORT || 8000;

// Create uploads and frames directories if they don't exist
const uploadDir = path.join(__dirname, 'uploads');
const framesDir = path.join(__dirname, 'frames');
[uploadDir, framesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Verify API key is configured
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error('Error: GOOGLE_GEMINI_API_KEY is not configured');
  process.exit(1);
}

// Test Gemini API configuration
async function testGeminiAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    await model.generateContent('Test connection');
    console.log('Gemini API configured successfully');
  } catch (error) {
    console.error('Gemini API configuration error:', error);
    process.exit(1);
  }
}

// Run API test
testGeminiAPI();

// Middleware with specific CORS configuration
app.use(cors({
  origin: ['https://video-analysis-app-mxggqzsu.devinapps.com'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只支持视频文件上传'));
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024 // 限制文件大小为 500MB
  }
});

// Extract frames from video
async function extractFrames(videoPath, outputDir) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .screenshots({
        count: 30,
        folder: outputDir,
        filename: 'frame-%i.jpg',
        size: '1280x720'
      });
  });
}

// Analyze frames using Tesseract OCR
async function analyzeFrames(framesDir) {
  const worker = await createWorker('chi_sim');
  const results = [];
  const frames = fs.readdirSync(framesDir).filter(file => file.endsWith('.jpg'));

  for (const frame of frames) {
    const { data: { text } } = await worker.recognize(path.join(framesDir, frame));
    results.push({ frame, text });
  }

  await worker.terminate();
  return results;
}

// Analyze app functionality using Gemini
async function analyzeAppFunctionality(ocrResults) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare context from OCR results
    const context = ocrResults.map(result => result.text).join('\n');

    // Create prompt for Gemini
    const prompt = `分析以下APP界面文本，生成详细的产品需求文档：

${context}

请按照以下格式输出分析结果：
1. 应用定位和目标用户群
2. 应用导航结构
3. 功能列表和操作流程
4. 技术功能清单
5. 数据流程
6. 功能实现建议
7. 单元测试计划`;

    // Generate analysis using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    // Parse Gemini's response into structured format
    const sections = analysis.split(/\d+\./);
    return {
      appInfo: {
        positioning: sections[1]?.trim() || "无法确定应用定位",
        targetUsers: sections[1]?.trim() || "无法确定目标用户群",
      },
      navigation: sections[2]?.trim().split('\n').filter(Boolean) || [],
      features: sections[3]?.trim().split('\n').filter(Boolean) || [],
      technical: {
        implementation: sections[4]?.trim().split('\n').filter(Boolean) || [],
        dataFlow: sections[5]?.trim().split('\n').filter(Boolean) || [],
        functionality: sections[6]?.trim().split('\n').filter(Boolean) || [],
        testing: sections[7]?.trim().split('\n').filter(Boolean) || []
      }
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    // Fallback to basic analysis if Gemini fails
    return {
      appInfo: {
        positioning: "分析失败 - 使用基础分析模式",
        targetUsers: "分析失败 - 使用基础分析模式",
      },
      features: [],
      navigation: [],
      technical: {
        implementation: [],
        dataFlow: [],
        functionality: [],
        testing: []
      }
    };
  }
}

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
  console.log('Received upload request');
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: '请选择要上传的视频文件' });
    }

    console.log('File uploaded successfully:', req.file);

    // Extract frames from video
    await extractFrames(req.file.path, framesDir);

    // Analyze frames using OCR
    const ocrResults = await analyzeFrames(framesDir);

    // Analyze app functionality using basic analysis
    const analysis = await analyzeAppFunctionality(ocrResults);

    res.json({
      message: '视频分析完成',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      },
      analysis
    });
  } catch (error) {
    console.error('Upload/Analysis error:', error);
    res.status(500).json({ error: '视频处理失败: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制 (500MB)' });
    }
    return res.status(400).json({ error: '文件上传错误: ' + err.message });
  }
  res.status(500).json({ error: '服务器错误: ' + err.message });
});

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});
