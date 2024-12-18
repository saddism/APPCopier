<template>
  <view class="app-container" :class="{ 'h5-mode': isH5Platform || isWebPlatform }">
    <router-view v-slot="{ Component }">
      <Layout>
        <component :is="Component" />
      </Layout>
    </router-view>
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
const isWebPlatform = ref(false)

// Platform detection helper
const detectPlatform = () => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    console.log('App.vue Raw System Info:', systemInfo)

    // Check if running in H5/Web environment
    const isWeb = systemInfo?.platform?.toLowerCase() === 'web'
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
    isH5Platform.value = isBrowser
    isWebPlatform.value = isWeb || isBrowser

    // Force H5/Web mode styles
    if ((isH5Platform.value || isWebPlatform.value) && typeof document !== 'undefined') {
      document.documentElement.classList.add('h5-mode')
      document.documentElement.classList.remove('uni-app--showtabbar')

      // Force immediate style application
      document.documentElement.style.setProperty('display', 'flex', 'important')
      document.documentElement.style.setProperty('flex-direction', 'column', 'important')
    }

    console.log('App.vue Platform Detection:', {
      rawPlatform: systemInfo?.platform,
      isWeb,
      isBrowser,
      isH5: isH5Platform.value,
      isWebPlatform: isWebPlatform.value,
      userAgent: window?.navigator?.userAgent
    })
  } catch (error) {
    console.error('Platform detection error:', error)
    // Fallback to browser check in case of error
    const hasBrowser = typeof window !== 'undefined'
    isH5Platform.value = hasBrowser
    isWebPlatform.value = hasBrowser
  }
}

onMounted(() => {
  detectPlatform()
  const savedLanguage = uni.getStorageSync('language') || 'zh'
  locale.value = savedLanguage
})

onLaunch(() => {
  detectPlatform()
  const savedLanguage = uni.getStorageSync('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  userStore.init()
})

onShow(() => {
  detectPlatform()
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style>
page {
  background-color: #f8f8f8;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.h5-mode {
  min-height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  overflow-x: hidden !important;
  background-color: #f8f8f8 !important;
}

/* Hide tabBar in H5 mode - Enhanced specificity */
.h5-mode :deep(.uni-tabbar),
.h5-mode :deep(.uni-tabbar__content),
.h5-mode :deep(.uni-tabbar-wrapper),
.h5-mode :deep(.uni-app--showtabbar),
.h5-mode :deep([class*="uni-tabbar"]) {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
  position: fixed !important;
  bottom: -9999px !important;
  left: -9999px !important;
  z-index: -999 !important;
  transform: translateY(200%) !important;
  clip: rect(0, 0, 0, 0) !important;
}

/* Additional H5 specific styles */
.h5-mode :deep(.uni-page-head) {
  display: none !important;
}

.h5-mode :deep(.uni-page-wrapper) {
  height: 100vh !important;
  min-height: 100vh !important;
  position: relative !important;
}

/* Force content visibility */
.h5-mode :deep(.uni-page-body) {
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh !important;
}
</style>
