const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    // Accept only video files
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

// Routes
app.post('/api/upload', upload.single('video'), (req, res) => {
  console.log('Received upload request');
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: '请选择要上传的视频文件' });
    }
    console.log('File uploaded successfully:', req.file);
    res.json({
      message: '视频上传成功',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: '视频上传失败: ' + error.message });
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
