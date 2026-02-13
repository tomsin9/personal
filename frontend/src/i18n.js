import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

const LOCALE_STORAGE_KEY = 'app-locale'
const SUPPORTED_LOCALES = ['en', 'zh']

function getStoredLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  } catch (_) {}
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages: { en, zh },
})

export { LOCALE_STORAGE_KEY }
