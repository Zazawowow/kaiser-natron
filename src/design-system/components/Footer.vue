<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n/index.js'
import Logo from './Logo.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'cream',
    validator: (v) => ['cream', 'brand', 'paper'].includes(v),
  },
})

const { t } = useI18n()

const tone = computed(() => {
  if (props.variant === 'brand') {
    return {
      surface: 'bg-brand text-cream',
      topRule: 'border-cream-line',
      bottomRule: 'border-cream-line/40',
      muted: 'text-cream/80',
      logo: 'text-cream',
      link: 'hover:text-highlight',
    }
  }
  if (props.variant === 'paper') {
    return {
      surface: 'bg-paper text-brand',
      topRule: 'border-line',
      bottomRule: 'border-line/60',
      muted: 'text-muted',
      logo: 'text-brand',
      link: 'hover:text-brand-hover',
    }
  }
  return {
    surface: 'bg-cream text-brand',
    topRule: 'border-line',
    bottomRule: 'border-line/60',
    muted: 'text-muted',
    logo: 'text-brand',
    link: 'hover:text-brand-hover',
  }
})

const legalLinks = [
  { key: 'footer.legal.impressum', href: '/impressum' },
  { key: 'footer.legal.datenschutz', href: '/datenschutz' },
]

const exploreLinks = [
  { key: 'footer.explore.shop', href: '/shop' },
  { key: 'footer.explore.pflege', href: '/pflege' },
  { key: 'footer.explore.haushalt', href: '/haushalt' },
  { key: 'footer.explore.bundles', href: '/#bundles' },
  { key: 'footer.explore.about', href: '/#about' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer :class="['border-t', tone.surface, tone.topRule]">
    <div
      class="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-14 md:px-12 md:py-16 lg:px-16"
    >
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
        <div class="flex flex-col gap-4 max-w-sm">
          <Logo :class="['w-20 md:w-24 h-auto', tone.logo]" />
          <p :class="['text-sm leading-relaxed', tone.muted]">
            {{ t('footer.tagline') }}
          </p>
        </div>

        <nav :aria-label="t('footer.explore.heading')" class="flex flex-col gap-3">
          <p :class="['eyebrow', tone.muted]">{{ t('footer.explore.heading') }}</p>
          <ul class="flex flex-col gap-2">
            <li v-for="link in exploreLinks" :key="link.href">
              <a
                :href="link.href"
                :class="['text-sm underline-offset-4 decoration-1 hover:underline', tone.link]"
              >{{ t(link.key) }}</a>
            </li>
          </ul>
        </nav>

        <nav :aria-label="t('footer.legal.heading')" class="flex flex-col gap-3">
          <p :class="['eyebrow', tone.muted]">{{ t('footer.legal.heading') }}</p>
          <ul class="flex flex-col gap-2">
            <li v-for="link in legalLinks" :key="link.href">
              <a
                :href="link.href"
                :class="['text-sm underline-offset-4 decoration-1 hover:underline', tone.link]"
              >{{ t(link.key) }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        :class="[
          'mt-12 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
          tone.bottomRule,
        ]"
      >
        <p :class="['text-xs', tone.muted]">
          © {{ year }} {{ t('footer.copyright') }}
        </p>
        <p :class="['text-xs', tone.muted]">
          {{ t('footer.madeIn') }}
        </p>
      </div>
    </div>
  </footer>
</template>
