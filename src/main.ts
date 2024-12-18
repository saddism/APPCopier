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
      'nav.productDetail': '产品详情'
    },
    'en': {
      'nav.home': 'Home',
      'nav.upload': 'Upload',
      'nav.products': 'Products',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Login',
      'nav.productDetail': 'Product Detail'
    }
  };

  // Merge navigation translations
  i18nInstance.global.mergeLocaleMessage('zh', navTranslations.zh);
  i18nInstance.global.mergeLocaleMessage('en', navTranslations.en);

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
