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

  // Load navigation translations
  const navTranslations = {
    'zh': {
      'nav.home': '首页',
      'nav.upload': '上传',
      'nav.products': '产品',
      'nav.dashboard': '仪表板',
      'nav.login': '登录',
      'nav.productDetail': '产品详情',
      'nav.appTitle': 'APP分析工具'
    },
    'en': {
      'nav.home': 'Home',
      'nav.upload': 'Upload',
      'nav.products': 'Products',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Login',
      'nav.productDetail': 'Product Detail',
      'nav.appTitle': 'APP Analyzer'
    }
  } as const;

  // Merge navigation translations immediately
  (Object.keys(navTranslations) as Array<keyof typeof navTranslations>).forEach(locale => {
    i18nInstance.global.mergeLocaleMessage(locale, navTranslations[locale]);
  });

  // Force platform detection for H5
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'web') {
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
