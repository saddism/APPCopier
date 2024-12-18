import { createSSRApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import i18n from './i18n';
import './utils/navigation';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  // Initialize i18n with stored language preference
  const savedLanguage = uni.getStorageSync('language') || 'zh';
  const i18nInstance = i18n;

  // Force immediate locale setup
  uni.setStorageSync('language', savedLanguage);
  i18nInstance.global.locale.value = savedLanguage;

  // Configure i18n settings
  i18nInstance.global.fallbackWarn = false;
  i18nInstance.global.missingWarn = false;

  // Enhanced platform detection
  const systemInfo = uni.getSystemInfoSync();
  const isH5 = process.env.UNI_PLATFORM === 'h5';

  console.log('Enhanced Platform Detection:', {
    platform: systemInfo.platform,
    osName: systemInfo.osName,
    browserName: systemInfo.browserName,
    uniPlatform: process.env.UNI_PLATFORM,
    isH5: isH5
  });

  // Set platform-specific configurations
  if (isH5 && typeof document !== 'undefined') {
    document.documentElement.classList.add('h5-mode');
    app.config.globalProperties.isH5 = true;
  }

  app.use(pinia);
  app.use(i18nInstance);

  // Make i18n available globally
  app.config.globalProperties.$i18n = i18nInstance;
  app.config.globalProperties.$t = i18nInstance.global.t;

  return {
    app,
    i18n: i18nInstance
  };
}
