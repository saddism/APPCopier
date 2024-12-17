<template>
  <view class="upload">
    <text class="title">{{ $t('message.upload.title') }}</text>
    <video-uploader />
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VideoUploader from '@/components/VideoUploader.vue'

const { t } = useI18n()
</script>

<style>
.upload {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36rpx;
  margin-bottom: 30rpx;
}
</style>
