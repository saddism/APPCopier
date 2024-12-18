<template>
  <view class="language-switcher">
    <button class="switch-btn" @click="toggleLanguage">
      {{ currentLanguage === 'zh' ? 'English' : '中文' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = computed(() => locale.value)

const toggleLanguage = () => {
  const newLang = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = newLang
  uni.setStorageSync('language', newLang)

  // Refresh current page to apply language change
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage) {
    uni.redirectTo({
      url: '/' + currentPage.route
    })
  }
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
