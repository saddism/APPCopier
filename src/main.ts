import { createSSRApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import i18n from './i18n';
import { useI18n } from 'vue-i18n';
import './utils/navigation';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  // Initialize i18n with stored language preference
  const savedLanguage = uni.getStorageSync('language') || 'zh';
  i18n.global.locale.value = savedLanguage;

  app.use(pinia);
  app.use(i18n);

  // Make i18n available in setup
  app.mixin({
    setup() {
      const { t } = useI18n();
      return { t };
    }
  });

  return {
    app,
  };
}
