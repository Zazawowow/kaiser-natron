<script setup>
import Navbar from '@/design-system/components/Navbar.vue'
import Hero from '@/design-system/components/Hero.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const imgPulver250 =
  '/products/cutouts/kaiser-natron-pulver-250-g-gro%C3%9Fpackung-removebg-preview.png'
</script>

<template>
  <div class="min-h-screen bg-brand">
    <Navbar variant="brand" layout="standard" :cart-count="0" />

    <Hero
      variant="split"
      tone="brand"
      :eyebrow="t('ds.hero.eyebrow')"
      :subheadline="t('ds.hero.sub')"
      :image="imgPulver250"
      image-alt="Kaiser-Natron Pulver 250 g Großpackung"
      :badge="t('ds.badges.featured')"
      :cta-label="t('ds.buttons.addToCart')"
      :secondary-label="t('ds.buttons.learnMore')"
      cta-href="/shop"
      secondary-href="/anwendungen"
    >
      <template #headline>
        {{ t('ds.hero.headline.a') }}
        <em class="italic font-light text-accent-soft">{{ t('ds.hero.headline.em') }}</em>
        {{ t('ds.hero.headline.b') }}
      </template>
    </Hero>
  </div>
</template>
