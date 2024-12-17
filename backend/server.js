const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
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
  origin: ['http://localhost:3000', 'https://video-analysis-app-tunnel-dgup6riq.devinapps.com'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

// Add authentication middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Basic ' + Buffer.from('devin:8d55f0c17d37edef9d44c20307bbfbfb').toString('base64')) {
    return res.status(401).json({ error: '认证失败' });
  }
  next();
});

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.path.includes('/chunk') ?
      path.join(uploadDir, 'chunks') :
      uploadDir;

    // Create chunks directory if it doesn't exist
    if (req.path.includes('/chunk') && !fs.existsSync(path.join(uploadDir, 'chunks'))) {
      fs.mkdirSync(path.join(uploadDir, 'chunks'), { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (req.path.includes('/chunk')) {
      // For chunks, use format: timestamp-originalname-chunknumber
      const { index } = req.body;
      cb(null, `${Date.now()}-${file.originalname}-${index}`);
    } else {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: req => {
      return req.path.includes('/chunk') ?
        1 * 1024 * 1024 : // 1MB for chunks
        500 * 1024 * 1024; // 500MB for direct uploads
    }
  },
  fileFilter: (req, file, cb) => {
    // Skip MIME type validation for chunk uploads
    if (req.path.includes('/chunk')) {
      cb(null, true);
      return;
    }
    // Validate MIME type for complete file uploads
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只支持视频文件上传'));
    }
  }
});

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: 'smtpdm.aliyun.com',
  port: 465,
  secure: true,
  auth: {
    user: 'appcopier@guixian.cn',
    pass: 'GuiXian7758'
  }
});

// Store verification codes temporarily (in production, use Redis)
const verificationCodes = new Map();

// Email verification endpoints
app.post('/api/auth/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const code = Math.random().toString().slice(2, 8);

    const mailOptions = {
      from: 'appcopier@guixian.cn',
      to: email,
      subject: '邮箱验证码 - APPCopier',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>APPCopier 邮箱验证</h2>
          <p>您好！</p>
          <p>您的验证码是：</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>验证码有效期为10分钟，请尽快完成验证。</p>
          <p>如果您没有请求此验证码，请忽略此邮件。</p>
          <p>谢谢！</p>
          <p>APPCopier 团队</p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);

    // Store code with timestamp
    verificationCodes.set(email, {
      code,
      timestamp: Date.now()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    res.status(500).json({ success: false, error: 'Failed to send verification email' });
  }
});

app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;
  const verification = verificationCodes.get(email);

  if (!verification) {
    return res.json({ success: false, error: 'No verification code found' });
  }

  const isExpired = Date.now() - verification.timestamp > 10 * 60 * 1000; // 10 minutes
  if (isExpired) {
    verificationCodes.delete(email);
    return res.json({ success: false, error: 'Verification code expired' });
  }

  const isValid = verification.code === code;
  if (isValid) {
    verificationCodes.delete(email);
  }

  res.json({ success: isValid, error: isValid ? null : 'Invalid verification code' });
});

// Extract frames from video for app analysis
async function extractFramesForAnalysis(videoPath, outputDir) {
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

// Analyze app functionality using Gemini
async function analyzeAppFunctionality(frames) {
  try {
    const context = frames.join('\n');

    const prompt = `详细分析以下APP界面文本，生成产品需求文档：

${context}

请按照以下格式输出分析结果：

1. 应用定位和目标用户群
   - 产品定位：详细说明产品的核心价值和市场定位
   - 目标用户特征：描述目标用户的人口统计学特征、行为习惯和使用场景
   - 用户痛点和需求：列举用户面临的主要问题和需求点

2. 应用导航结构
   - 主要页面层级：描述应用的整体页面架构和层级关系
   - 功能模块划分：列举主要功能模块及其组织方式
   - 导航逻辑：说明页面间的跳转逻辑和用户访问路径

3. 功能列表和操作流程
   - 核心功能描述：详细说明每个主要功能的作用和特点
   - 用户操作流程：描述完成各项功能的具体操作步骤
   - 界面交互设计：说明界面元素的布局和交互方式

4. 技术功能清单
   - 前端技术栈：推荐的前端框架、UI组件库和工具
   - 后端架构：建议的服务器架构、API设计和数据库选型
   - 第三方服务集成：需要集成的外部服务和SDK

5. 数据流程
   - 数据模型设计：核心数据实体及其关系
   - 数据处理流程：数据的采集、处理、存储和展示流程
   - 存储方案：数据库选型和存储架构设计

6. 功能实现建议
   - 技术选型建议：各模块的具体技术实现方案
   - 开发难点分析：潜在的技术挑战和解决方案
   - 性能优化方案：性能瓶颈分析和优化建议

7. 单元测试计划
   - 测试范围：需要覆盖的功能点和测试边界
   - 测试用例：典型场景的测试用例设计
   - 测试工具和方法：推荐的测试框架和自动化方案

请确保分析结果详细、具体，并针对视频中展示的APP功能进行深入分析。`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 解析文本结果为结构化数据
    const sections = text.split(/\d+\./);
    const analysis = {
      appInfo: {
        positioning: sections[1] || '',
        targetUsers: sections[1] || ''
      },
      navigation: sections[2] ? sections[2].split('\n').filter(Boolean) : [],
      features: sections[3] ? sections[3].split('\n').filter(Boolean) : [],
      technical: {
        implementation: sections[4] ? sections[4].split('\n').filter(Boolean) : [],
        dataFlow: sections[5] ? sections[5].split('\n').filter(Boolean) : [],
        functionality: sections[6] ? sections[6].split('\n').filter(Boolean) : [],
        testing: sections[7] ? sections[7].split('\n').filter(Boolean) : []
      }
    };

    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('视频分析失败: ' + error.message);
  }
}

app.post('/api/upload', upload.single('video'), async (req, res) => {
  console.log('Received upload request');
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: '请选择要上传的视频文件' });
    }

    console.log('File uploaded successfully:', req.file);

    // Extract frames from video for app analysis
    await extractFramesForAnalysis(req.file.path, framesDir);

    // Get frame file paths
    const frames = fs.readdirSync(framesDir)
      .filter(f => f.endsWith('.jpg'))
      .map(f => path.join(framesDir, f));

    // Analyze app functionality using Gemini
    const analysis = await analyzeAppFunctionality(frames);

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
    console.error('Upload/Analysis error:', error.stack || error);
    res.status(500).json({ error: '视频处理失败，详细信息: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const isChunk = req.path.includes('/chunk');
      return res.status(400).json({
        error: isChunk ?
          '分片大小超过限制 (2MB)' :
          '文件大小超过限制 (500MB)'
      });
    }
    return res.status(400).json({ error: '文件上传错误: ' + err.message });
  }
  res.status(500).json({ error: '服务器错误: ' + err.message });
});

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});
