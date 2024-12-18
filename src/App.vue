<template>
  <view :class="{ 'h5-mode': isH5Platform }">
    <Layout>
      <slot></slot>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import Layout from '@/components/Layout.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { locale } = useI18n()
const userStore = useUserStore()
const isH5Platform = ref(false)

// Platform detection helper
const detectH5Platform = () => {
  isH5Platform.value = process.env.UNI_PLATFORM === 'h5'
  console.log('Platform detection:', {
    uniPlatform: process.env.UNI_PLATFORM,
    isH5: isH5Platform.value
  })
}

onMounted(() => {
  detectH5Platform()
  const savedLanguage = uni.getStorageSync('language') || 'zh'
  locale.value = savedLanguage
  uni.setStorageSync('language', savedLanguage)
})

onLaunch(() => {
  detectH5Platform()
  const savedLanguage = uni.getStorageSync('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  userStore.init()
})

onShow(() => {
  detectH5Platform()
  console.log("App Show", {
    currentLocale: locale.value,
    isH5: isH5Platform.value,
    env: process.env.UNI_PLATFORM
  })
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style>
page {
  background-color: #f8f8f8;
}

.h5-mode {
  min-height: 100vh;
}

/* Hide tabBar in H5 mode with increased specificity */
.h5-mode :deep(.uni-tabbar),
.h5-mode :deep(.uni-tabbar-wrapper),
.h5-mode :deep(.uni-app--showtabbar),
.h5-mode :deep([class*="uni-tabbar"]) {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
  position: absolute !important;
  left: -9999px !important;
}

/* Force web layout in H5 mode */
.h5-mode {
  display: flex;
  flex-direction: column;
}
</style>
