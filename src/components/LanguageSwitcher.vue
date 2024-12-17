<template>
  <view class="language-switcher">
    <button class="switch-btn" @click="toggleLanguage">
      {{ $t('common.switchLang') }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  // 保存语言偏好到本地存储
  uni.setStorageSync('language', locale.value)
}
</script>

<style>
.language-switcher {
  padding: 10rpx;
}

.switch-btn {
  padding: 10rpx 20rpx;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style>
