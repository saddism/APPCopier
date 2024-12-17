<template>
  <view class="upload-container">
    <view class="upload-content">
      <text class="title">{{ $t('message.upload.title') }}</text>
      <video-uploader />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VideoUploader from '@/components/VideoUploader.vue'

const { t } = useI18n()
</script>

<style>
.upload-container {
  min-height: 100vh;
  padding: 20rpx;
  background-color: #f8f9fa;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}

.upload-content {
  max-width: 800rpx;
  margin: 0 auto;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  text-align: center;
  -webkit-font-smoothing: antialiased;
}

@supports (-webkit-touch-callout: none) {
  .upload-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
