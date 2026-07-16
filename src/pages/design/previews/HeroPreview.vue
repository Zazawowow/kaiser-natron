<script setup>
import { publicAsset } from '@/lib/publicAsset.js'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Hero from '@/design-system/components/Hero.vue'
import { useI18n } from '@/i18n/index.js'

const route = useRoute()
const { t } = useI18n()

const variant = computed(() =>
  ['split', 'centered'].includes(route.query.variant) ? route.query.variant : 'split',
)
const tone = computed(() =>
  ['cream', 'paper', 'brand', 'kitchen', 'clean', 'wash', 'care'].includes(route.query.tone)
    ? route.query.tone
    : 'cream',
)
const reverse = computed(() => route.query.reverse === '1')

// Navbar only has cream/paper/brand chrome variants; category-tone
// previews keep a neutral cream nav above the coloured banner.
const navVariant = computed(() =>
  ['cream', 'paper', 'brand'].includes(tone.value) ? tone.value : 'cream',
)
const imgPulver250 = publicAsset('products/kaiser-natron-pulver-250-g-grosspackung.webp')
const imgBad = publicAsset('products/kaiser-natron-bad-500-g.webp')
const image = computed(() => (reverse.value ? imgBad : imgPulver250))
const imageAlt = computed(() =>
  reverse.value ? 'Kaiser-Natron Bad 500 g' : 'Kaiser-Natron Pulver 250 g Großpackung',
)
</script>

<template>
  <div :class="['min-h-screen', tone === 'brand' ? 'bg-brand' : 'bg-surface']">
    <Navbar :variant="navVariant" :cart-count="0" />
    <Hero
      :variant="variant"
      :tone="tone"
      :reverse="reverse"
      :eyebrow="reverse ? t('home.banner.eyebrow') : t('ds.hero.eyebrow')"
      :subheadline="reverse ? t('home.banner.sub') : t('ds.hero.sub')"
      :image="image"
      :image-alt="imageAlt"
      :badge="reverse ? '' : t('ds.badges.featured')"
      :cta-label="t('ds.buttons.addToCart')"
      :secondary-label="t('ds.buttons.learnMore')"
    >
      <template #headline>
        <template v-if="reverse">
          {{ t('home.banner.headline.a') }}
          <em class="italic font-light text-brand-soft">{{ t('home.banner.headline.em') }}</em>
          {{ t('home.banner.headline.b') }}
        </template>
        <template v-else>
          {{ t('ds.hero.headline.a') }}
          <em class="italic font-light text-brand-soft">{{ t('ds.hero.headline.em') }}</em>
          {{ t('ds.hero.headline.b') }}
        </template>
      </template>
    </Hero>
  </div>
</template>
