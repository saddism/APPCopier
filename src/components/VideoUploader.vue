<template>
  <view class="video-uploader" :class="{ 'loading': uploading }">
    <!-- Loading State -->
    <view v-if="uploading" class="loading-state">
      <uni-icons type="spinner-cycle" size="32" color="#007AFF" :class="{ 'spin': true }"></uni-icons>
      <text class="loading-text">{{ t('common.loading') }}</text>
    </view>

    <!-- Error Message Display -->
    <view v-if="errorMessage" class="error-container" :class="{ 'ios-error': isIOS }">
      <uni-icons type="error" size="24" color="#ff4d4f"></uni-icons>
      <text class="error-message">{{ errorMessage }}</text>
    </view>

    <!-- #ifdef H5 -->
    <view v-if="!currentFile" class="empty-state">
      <uni-file-picker
        v-model="fileList"
        fileMediatype="video"
        :auto-upload="false"
        @select="handleSelect"
        @delete="handleDelete"
        :title="t('upload.tip')"
      >
        <template #default>
          <view class="upload-header">
            <uni-icons type="camera-filled" size="48" color="#909399"></uni-icons>
            <text class="upload-tip">{{ t('upload.tip') }}</text>
          </view>
        </template>
      </uni-file-picker>
    </view>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view v-if="!currentFile" class="empty-state" @click="handleSelect">
      <view class="upload-header">
        <uni-icons type="camera-filled" size="48" color="#909399"></uni-icons>
        <text class="upload-tip">{{ t('upload.tip') }}</text>
      </view>
    </view>
    <!-- #endif -->

    <view class="preview" v-if="currentFile">
      <text class="file-name">{{ currentFile.name }}</text>
      <view class="progress" v-if="uploading">
        <uni-progress :percent="uploadProgress" :showText="true"></uni-progress>
      </view>
      <view class="action-buttons">
        <button
          type="primary"
          @click="handleUpload"
          :disabled="uploading"
          :class="{ 'loading': uploading }"
        >
          {{ uploading ? t('upload.uploading') : t('upload.start') }}
        </button>
        <button
          type="warn"
          @click="cancelUpload"
          :disabled="uploading"
        >
          {{ t('upload.cancel') }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()

// Constants
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const IOS_MAX_SIZE = 300 * 1024 * 1024 // 300MB for iOS (more conservative)

// State
const fileList = ref<any[]>([])
const currentFile = ref<any>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const isSafari = ref(false)
const isIOS = ref(false)

// Platform detection
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  isIOS.value = systemInfo.platform === 'ios'
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase()
  isSafari.value = /safari/.test(ua) && !/chrome/.test(ua)
  // #endif
})

const showError = (key: string, platformSpecific = true) => {
  errorMessage.value = platformSpecific && (isIOS.value || isSafari.value)
    ? t(`upload.error.ios.${key}`)
    : t(`upload.error.${key}`)
}

const validateFile = (file: any) => {
  const maxSize = isIOS.value ? IOS_MAX_SIZE : MAX_FILE_SIZE
  let isValidType = false
  let fileSize = 0
  let fileFormat = ''

  // Platform-specific validation
  // #ifdef H5
  isValidType = file.type?.startsWith('video/')
  fileSize = file.size
  fileFormat = file.name?.split('.').pop()?.toLowerCase() || ''

  // Safari-specific validation
  if (isSafari.value) {
    if (!['mp4', 'mov'].includes(fileFormat)) {
      showError('format', true)
      return false
    }
  }
  // #endif

  // #ifdef APP-PLUS
  isValidType = !!file.tempFilePath && file.size > 0
  fileSize = file.size
  fileFormat = file.tempFilePath?.split('.').pop()?.toLowerCase() || ''

  // iOS-specific validation
  if (isIOS.value && !['mp4', 'mov'].includes(fileFormat)) {
    showError('format', true)
    return false
  }
  // #endif

  if (!isValidType) {
    showError('invalidType', true)
    return false
  }

  if (fileSize > maxSize) {
    showError(isIOS.value ? 'iosSizeLimit' : 'tooLarge', true)
    return false
  }

  return true
}

const handleUpload = async () => {
  if (!currentFile.value || uploading.value) return

  try {
    uploading.value = true
    uploadProgress.value = 0
    errorMessage.value = ''

    // Chunk size: 2MB for iOS/Safari, 5MB for others
    const chunkSize = (isIOS.value || isSafari.value) ? 2 * 1024 * 1024 : 5 * 1024 * 1024
    const file = currentFile.value.file || currentFile.value
    const chunks = Math.ceil(file.size / chunkSize)

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)

      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('index', i.toString())
      formData.append('total', chunks.toString())
      formData.append('filename', file.name)

      const response = await uni.request({
        url: 'https://video-analysis-app-tunnel-dgup6riq.devinapps.com/api/upload/chunk',
        method: 'POST',
        data: formData,
        header: {
          'content-type': 'multipart/form-data',
          'Authorization': 'Basic ' + uni.base64Encode('devin:8d55f0c17d37edef9d44c20307bbfbfb')
        }
      })

      if (response.statusCode !== 200) {
        throw new Error('Chunk upload failed')
      }

      uploadProgress.value = Math.round(((i + 1) / chunks) * 100)
    }

    handleDelete()
    uni.showToast({
      title: t('upload.success'),
      icon: 'success'
    })
  } catch (error) {
    console.error('Upload error:', error)
    showError(isIOS.value ? 'uploadFailed' : 'uploadFailed', true)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const handleSelect = async (e?: any) => {
  try {
    let file
    // #ifdef H5
    if (e?.tempFiles?.length) {
      file = e.tempFiles[0]

      // Show Safari warning before proceeding
      if (isSafari.value) {
        showError('safari', true)
      }
    }
    // #endif

    // #ifdef APP-PLUS
    const result = await uni.chooseVideo({
      count: 1,
      sourceType: ['album', 'camera'],
      compressed: isIOS.value, // Enable compression for iOS
      maxDuration: 600,
    })
    if (result) {
      file = {
        ...result,
        name: result.tempFilePath.split('/').pop(),
        type: 'video/mp4'
      }
    }
    // #endif

    if (file && validateFile(file)) {
      currentFile.value = file
      errorMessage.value = ''
    }
  } catch (error) {
    console.error('Video selection error:', error)
    const errorKey = isIOS.value ? 'ios.selection' :
                    isSafari.value ? 'safari' : 'uploadFailed'
    showError(errorKey, true)
  }
}

const handleDelete = () => {
  currentFile.value = null
  fileList.value = []
  errorMessage.value = ''
  uploadProgress.value = 0
}

const cancelUpload = () => {
  // TODO: Implement upload cancellation
  uploading.value = false
  uploadProgress.value = 0
  errorMessage.value = ''
}

// Upload progress tracking
uni.onProgressUpdate((res) => {
  if (res.progress > 0) {
    uploadProgress.value = res.progress
    errorMessage.value = '' // Clear error when upload progresses
  }
})
</script>

<style>
.video-uploader {
  padding: 20rpx;
  min-height: 400rpx; /* Increased minimum height */
  background-color: #ffffff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx;
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  will-change: transform;
  z-index: 1;
}
</style>

.upload-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  min-height: 120rpx;
}

.upload-tip {
  font-size: 24rpx;
  color: #909399;
  margin-top: 20rpx;
  text-align: center;
}

.preview {
  margin-top: 20rpx;
  padding: 20rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  background-color: #ffffff;
  min-height: 150rpx;
}

.file-name {
  font-size: 28rpx;
  color: #606266;
  margin-bottom: 20rpx;
  word-break: break-all;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 20rpx;
}

.progress {
  margin: 20rpx 0;
  background-color: #f5f7fa;
}

/* Loading state styles */
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.loading-text {
  margin-top: 20rpx;
  color: #007AFF;
  font-size: 28rpx;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Touch feedback styles */
button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Error message styles */
.error-container {
  margin: 20rpx;
  padding: 16rpx;
  border-radius: 8rpx;
  background-color: #fff2f0;
  border: 1rpx solid #ffccc7;
  display: flex;
  align-items: center;
  gap: 12rpx;
  transform: translateZ(0);
}

.error-message {
  color: #ff4d4f;
  font-size: 28rpx;
  flex: 1;
}

.ios-error {
  background-color: #fff7e6;
  border-color: #ffd591;
}

/* Safari-specific styles */
@supports (-webkit-touch-callout: none) {
  .video-uploader * {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-transform-style: preserve-3d;
    will-change: transform;
  }

  .empty-state, .loading-state {
    position: relative;
    z-index: 2;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  /* Fix Safari scrolling and rendering issues */
  .preview {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    position: relative;
    z-index: 3;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
  }

  button {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    z-index: 4;
    transform: translate3d(0,0,0);
    -webkit-transform: translate3d(0,0,0);
  }
}

/* Empty state styles */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  min-height: 300rpx;
  transition: all 0.3s ease;
}

.empty-state:active {
  background-color: #e9ecef;
  transform: scale(0.98);
}
</style>
