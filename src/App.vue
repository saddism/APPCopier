<template>
  <view class="container">
    <LanguageSwitcher class="lang-switcher" />
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

onLaunch(() => {
  const savedLanguage = uni.getStorageSync('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  console.log("App Launch", {
    currentLocale: locale.value,
    platform: uni.getSystemInfoSync().platform
  })
})

onShow(() => {
  console.log("App Show", { currentLocale: locale.value })
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style>
.container {
  width: 100%;
  min-height: 100vh;
  padding: 20rpx;
}

.lang-switcher {
  position: fixed;
  top: 20rpx;
  right: 20rpx;
  z-index: 1000;
}
</style>
