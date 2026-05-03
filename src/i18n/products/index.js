// Per-product long-form copy lookup. Mirrors the messages.js fallback chain
// (current locale → DE → empty) but keeps editorial content out of the UI
// catalog so it can be edited / translated independently.

import { computed, isRef } from 'vue'
import { useI18n } from '@/i18n/index.js'
import de from './de.js'
import at from './at.js'
import en from './en.js'

const bundles = { de, at, en }
const FALLBACK = 'de'

export function getProductCopy(slug, locale) {
  const code = bundles[locale] ? locale : FALLBACK
  const fallback = bundles[FALLBACK]?.[slug] ?? null
  const primary = bundles[code]?.[slug] ?? null
  if (!fallback && !primary) return null
  return { ...(fallback || {}), ...(primary || {}) }
}

export function useProductCopy(slug) {
  const { locale } = useI18n()
  return computed(() => {
    const id = isRef(slug) ? slug.value : typeof slug === 'function' ? slug() : slug
    return id ? getProductCopy(id, locale.value) : null
  })
}
