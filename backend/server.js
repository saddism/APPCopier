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
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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

// Analyze app functionality using basic analysis
async function analyzeAppFunctionality(ocrResults) {
  // Basic analysis of OCR results without Gemini
  const analysis = {
    appInfo: {
      positioning: "基于OCR文本分析的应用定位",
      targetUsers: "根据界面文本推断的目标用户群",
    },
    features: [],
    navigation: [],
    workflow: [],
    technical: {
      implementation: [],
      dataFlow: [],
      testing: []
    }
  };

  // Analyze each frame's text
  for (const result of ocrResults) {
    const text = result.text.toLowerCase();

    // Extract features and navigation items
    const lines = text.split('\n').filter(line => line.trim());
    for (const line of lines) {
      // Identify potential navigation items
      if (line.includes('首页') || line.includes('列表') || line.includes('设置')) {
        analysis.navigation.push(line.trim());
      }

      // Identify potential features
      if (line.includes('按钮') || line.includes('选择') || line.includes('搜索')) {
        analysis.features.push(line.trim());
      }

      // Identify workflow steps
      if (line.includes('步骤') || line.includes('下一步') || line.includes('完成')) {
        analysis.workflow.push(line.trim());
      }
    }

    // Basic technical analysis
    if (text.includes('登录') || text.includes('注册')) {
      analysis.technical.implementation.push('用户认证系统');
      analysis.technical.dataFlow.push('用户数据流程');
      analysis.technical.testing.push('用户认证测试');
    }
    if (text.includes('列表') || text.includes('数据')) {
      analysis.technical.implementation.push('数据展示模块');
      analysis.technical.dataFlow.push('数据获取和展示流程');
      analysis.technical.testing.push('数据加载测试');
    }
  }

  // Remove duplicates
  analysis.navigation = [...new Set(analysis.navigation)];
  analysis.features = [...new Set(analysis.features)];
  analysis.workflow = [...new Set(analysis.workflow)];
  analysis.technical.implementation = [...new Set(analysis.technical.implementation)];
  analysis.technical.dataFlow = [...new Set(analysis.technical.dataFlow)];
  analysis.technical.testing = [...new Set(analysis.technical.testing)];

  return analysis;
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
