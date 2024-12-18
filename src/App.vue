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
  try {
    const systemInfo = uni.getSystemInfoSync();
    const platform = systemInfo.platform.toLowerCase();
    isH5Platform.value = platform === 'web' || platform === 'h5' ||
                        (typeof window !== 'undefined' && typeof document !== 'undefined');

    console.log('Platform Detection:', {
      platform,
      isH5: isH5Platform.value,
      hasWindow: typeof window !== 'undefined',
      hasDocument: typeof document !== 'undefined'
    });
  } catch (error) {
    console.error('Platform detection error:', error);
    isH5Platform.value = false;
  }
}

onMounted(() => {
  detectH5Platform()
  // Force immediate style application if H5
  if (isH5Platform.value && typeof document !== 'undefined') {
    document.documentElement.classList.add('h5-mode');
  }
  const savedLanguage = uni.getStorageSync('language') || 'zh'
  locale.value = savedLanguage
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
  min-height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  overflow-x: hidden !important;
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
</style>
