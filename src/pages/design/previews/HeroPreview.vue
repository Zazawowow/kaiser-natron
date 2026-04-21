<script setup>
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
  ['cream', 'paper', 'brand'].includes(route.query.tone) ? route.query.tone : 'cream',
)

const navVariant = computed(() => (tone.value === 'brand' ? 'brand' : tone.value))
const imgPulver250 =
  '/products/cutouts/kaiser-natron-pulver-250-g-gro%C3%9Fpackung-removebg-preview.png'
</script>

<template>
  <div :class="['min-h-screen', tone === 'brand' ? 'bg-brand' : 'bg-surface']">
    <Navbar :variant="navVariant" :cart-count="0" />
    <Hero
      :variant="variant"
      :tone="tone"
      :eyebrow="t('ds.hero.eyebrow')"
      :subheadline="t('ds.hero.sub')"
      :image="imgPulver250"
      image-alt="Kaiser-Natron Pulver 250 g Großpackung"
      :badge="t('ds.badges.featured')"
      :cta-label="t('ds.buttons.addToCart')"
      :secondary-label="t('ds.buttons.learnMore')"
    >
      <template #headline>
        {{ t('ds.hero.headline.a') }}
        <em class="italic font-light text-brand-soft">{{ t('ds.hero.headline.em') }}</em>
        {{ t('ds.hero.headline.b') }}
      </template>
    </Hero>
  </div>
</template>
