import { createSSRApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import i18n from './i18n';
import './utils/navigation';
import router from './router/index';

declare const uni: any;

// Platform detection utility
const getPlatformInfo = () => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const isH5 = typeof window !== 'undefined' && typeof document !== 'undefined';
    const platform = systemInfo?.platform?.toLowerCase() || 'unknown';

    console.log('Main.ts Platform Detection:', {
      rawSystemInfo: systemInfo,
      isH5,
      platform,
      hasWindow: typeof window !== 'undefined',
      hasDocument: typeof document !== 'undefined',
      userAgent: window?.navigator?.userAgent
    });

    return {
      isH5,
      platform,
      isWeb: platform === 'web' || isH5
    };
  } catch (error) {
    console.error('Platform detection error:', error);
    return {
      isH5: typeof window !== 'undefined',
      platform: 'unknown',
      isWeb: typeof window !== 'undefined'
    };
  }
};

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const { isH5, isWeb } = getPlatformInfo();

  // Initialize i18n with stored language preference
  const savedLanguage = uni.getStorageSync('language') || 'zh';
  i18n.global.locale.value = savedLanguage;

  // Configure i18n settings
  i18n.global.fallbackWarn = false;
  i18n.global.missingWarn = false;

  app.use(pinia);
  app.use(i18n);

  // Set platform-specific configurations
  if (isH5 || isWeb) {
    console.log('Initializing H5/Web mode');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('h5-mode');
      document.documentElement.style.setProperty('display', 'flex', 'important');
      document.documentElement.style.setProperty('flex-direction', 'column', 'important');
    }
    app.config.globalProperties.isH5 = true;
    app.config.globalProperties.isWeb = true;
    app.use(router);
  }

  return { app, i18n, router };
}
