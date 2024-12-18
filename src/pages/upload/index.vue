<template>
  <view class="upload-container">
    <view v-if="userStore.isAuthenticated" class="upload-content">
      <text class="title">{{ $t('message.upload.title') }}</text>
      <video-uploader />
    </view>
    <view v-else class="auth-required">
      <text class="message">{{ $t('auth.loginRequired') }}</text>
      <button class="auth-btn" @click="goToLogin">{{ $t('auth.login') }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import VideoUploader from '@/components/VideoUploader.vue'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()

onMounted(() => {
  if (!userStore.isAuthenticated) {
    uni.showToast({
      title: t('auth.loginRequired'),
      icon: 'none'
    })
  }
})

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}
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

.auth-required {
  max-width: 800rpx;
  margin: 40rpx auto;
  padding: 40rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  text-align: center;
}

.message {
  font-size: 32rpx;
  color: #666666;
}

.auth-btn {
  padding: 20rpx 40rpx;
  background-color: #4a90e2;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
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
