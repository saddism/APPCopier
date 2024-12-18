import { createSSRApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import i18n from './i18n';
import './utils/navigation';

declare const uni: any;

// Platform detection utility
const getPlatformInfo = () => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    // Force H5 mode in browser environment
    const isH5 = typeof window !== 'undefined' && typeof document !== 'undefined';
    const platform = isH5 ? 'h5' : systemInfo.platform.toLowerCase();

    console.log('Platform Detection:', {
      platform,
      isH5,
      hasWindow: typeof window !== 'undefined',
      hasDocument: typeof document !== 'undefined',
      systemInfo
    });

    return { isH5, platform };
  } catch (error) {
    console.error('Platform detection error:', error);
    return { isH5: false, platform: 'unknown' };
  }
};

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const { isH5 } = getPlatformInfo();

  // Initialize i18n with stored language preference
  const savedLanguage = uni.getStorageSync('language') || 'zh';
  const i18nInstance = i18n;
  i18nInstance.global.locale.value = savedLanguage;

  // Configure i18n settings
  i18nInstance.global.fallbackWarn = false;
  i18nInstance.global.missingWarn = false;

  // Set platform-specific configurations
  if (isH5 && typeof document !== 'undefined') {
    document.documentElement.classList.add('h5-mode');
    // Force immediate style application
    document.documentElement.style.display = 'flex';
    document.documentElement.style.flexDirection = 'column';
    app.config.globalProperties.isH5 = true;
  }

  app.use(pinia);
  app.use(i18nInstance);
  app.config.globalProperties.$i18n = i18nInstance;
  app.config.globalProperties.$t = i18nInstance.global.t;

  return { app, i18n: i18nInstance };
}
