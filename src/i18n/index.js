// Lightweight, reactive i18n with localStorage persistence.
// Also syncs across same-origin windows (parent ↔ iframes) via the 'storage' event,
// so the design-system preview iframe updates when you switch language in the host.

import { reactive, computed } from 'vue'
import messages from './messages.js'

const STORAGE_KEY = 'kn-locale'
const DEFAULT_LOCALE = 'de'

export const availableLocales = [
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'at', label: 'AT', name: 'Österreich' },
  { code: 'en', label: 'EN', name: 'English' },
]

const codes = availableLocales.map((l) => l.code)
const fromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
const initial = codes.includes(fromStorage) ? fromStorage : DEFAULT_LOCALE

const state = reactive({ locale: initial })

if (typeof document !== 'undefined') document.documentElement.lang = state.locale

export function setLocale(code) {
  if (!codes.includes(code) || state.locale === code) return
  state.locale = code
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, code)
  if (typeof document !== 'undefined') document.documentElement.lang = code
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !codes.includes(event.newValue)) return
    state.locale = event.newValue
    if (typeof document !== 'undefined') document.documentElement.lang = event.newValue
  })
}

export function useI18n() {
  const locale = computed({
    get: () => state.locale,
    set: setLocale,
  })
  const t = (key) => {
    const bundle = messages[state.locale] || messages[DEFAULT_LOCALE]
    return bundle[key] ?? messages[DEFAULT_LOCALE][key] ?? key
  }
  return { locale, setLocale, t, availableLocales }
}
