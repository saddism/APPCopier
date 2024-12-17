import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

const savedLanguage = uni.getStorageSync('language') || 'zh'

const i18n = createI18n({
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  },
  legacy: false,
  globalInjection: true
})

export default i18n
