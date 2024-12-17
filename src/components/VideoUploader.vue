<template>
  <view class="video-uploader">
    <view class="upload-container">
      <button class="upload-btn" @click="handleChooseVideo">
        {{ $t('message.upload.select') }}
      </button>
      <text v-if="errorMessage" class="error-message">{{ errorMessage }}</text>
      <text v-if="uploadProgress" class="status-message">{{ uploadProgress }}</text>
      <text v-if="successMessage" class="success-message">{{ successMessage }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const errorMessage = ref('')
const successMessage = ref('')
const uploadProgress = ref('')

const CHUNK_SIZE = 1024 * 1024 * 2 // 2MB chunks
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

interface ChunkInfo {
  chunk: string  // 使用临时文件路径
  index: number
  count: number
  filename: string
}

const uploadChunk = async (chunk: ChunkInfo) => {
  try {
    const formData = {
      'index': chunk.index.toString(),
      'count': chunk.count.toString(),
      'filename': chunk.filename
    }

    const [error, response] = await uni.uploadFile({
      url: 'https://video-analysis-app-tunnel-dgup6riq.devinapps.com/api/upload/chunk',
      filePath: chunk.chunk,
      name: 'chunk',
      formData: formData,
      header: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Basic ' + uni.base64Encode('devin:8d55f0c17d37edef9d44c20307bbfbfb')
      }
    });

    if (error) {
      console.error('Upload error:', error);
      return false;
    }

    if (response.statusCode === 200) {
      const progress = Math.round(((chunk.index + 1) / chunk.count) * 100)
      uploadProgress.value = `${t('message.upload.uploading')} ${progress}%`
      return true
    }
    return false
  } catch (error) {
    console.error('Chunk upload error:', error)
    return false
  }
}

const handleChooseVideo = async () => {
  try {
    const result = await uni.chooseVideo({
      count: 1,
      sourceType: ['album', 'camera'],
      maxDuration: 600,
    })

    if (!result) {
      errorMessage.value = t('message.upload.error')
      return
    }

    // 验证文件类型
    const fileType = result.tempFilePath.split('.').pop()?.toLowerCase()
    const validTypes = ['mp4', 'mov', 'avi']
    if (!validTypes.includes(fileType || '')) {
      errorMessage.value = t('message.upload.invalidType')
      return
    }

    const fileSize = result.size
    if (fileSize > MAX_FILE_SIZE) {
      errorMessage.value = t('message.upload.maxSize')
      return
    }

    uploadProgress.value = t('message.upload.uploading')
    errorMessage.value = ''
    successMessage.value = ''

    // 读取文件并分片
    const tempFilePath = result.tempFilePath
    const chunks: ChunkInfo[] = []
    const chunkCount = Math.ceil(fileSize / CHUNK_SIZE)
    const filename = tempFilePath.split('/').pop() || 'video.mp4'

    // 使用FileSystemManager读取文件并创建分片
    const fs = uni.getFileSystemManager()
    const buffer = fs.readFileSync(tempFilePath)

    // 创建分片
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, fileSize)
      const chunkBuffer = buffer.slice(start, end)

      // 将分片写入临时文件
      const tempChunkPath = `${uni.env.USER_DATA_PATH}/chunk_${i}.tmp`
      fs.writeFileSync(tempChunkPath, chunkBuffer)

      chunks.push({
        chunk: tempChunkPath,
        index: i,
        count: chunkCount,
        filename
      })
    }

    // 上传分片
    let uploadedChunks = 0
    for (const chunk of chunks) {
      const success = await uploadChunk(chunk)
      if (!success) {
        errorMessage.value = t('message.upload.error')
        uploadProgress.value = ''
        // 清理临时文件
        chunks.forEach(c => {
          try {
            fs.unlinkSync(c.chunk)
          } catch (error) {
            console.error('Clean up error:', error)
          }
        })
        return
      }
      uploadedChunks++
      const progress = Math.round((uploadedChunks / chunkCount) * 100)
      uploadProgress.value = `${t('message.upload.uploading')} ${progress}%`
    }

    // 清理临时文件
    chunks.forEach(chunk => {
      try {
        fs.unlinkSync(chunk.chunk)
      } catch (error) {
        console.error('Clean up error:', error)
      }
    })

    successMessage.value = t('message.upload.success')
    uploadProgress.value = ''
  } catch (error) {
    console.error('Video upload error:', error)
    errorMessage.value = t('message.upload.error')
    uploadProgress.value = ''
  }
}
</script>

<style>
.video-uploader {
  padding: 20px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.upload-btn {
  background-color: #007AFF;
  color: #ffffff;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  border: none;
}

.error-message {
  color: #ff0000;
  font-size: 28rpx;
}

.success-message {
  color: #00aa00;
  font-size: 28rpx;
}

.status-message {
  color: #666666;
  font-size: 28rpx;
}
</style>
