<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Bundles from '@/design-system/components/Bundles.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const route = useRoute()

// Variant selection travels in as a URL query param so the section
// page's iframe can switch layouts without reloading the component
// registry. Falls back to the default 'sidebar' layout if the param
// is missing or not one of the component's recognised variants.
const layout = computed(() => {
  const q = route.query.layout
  return q === 'stacked' ? 'stacked' : 'sidebar'
})

// Demo fixtures — mirrors HomePage's real content so the preview is
// representative rather than lorem-ipsum. Kept inline because preview
// pages are standalone by design: no imports from the pages layer.
const bundles = [
  {
    id: 'haushalt',
    name: 'Haushalts-Bundle',
    usage: '2–3× pro Quartal empfohlen',
    items: [
      '1× Kaiser-Natron Pulver 250 g',
      '1× Allzweck-Spray 500 ml',
      '1× Spülmittel 500 ml',
    ],
    price: 24.9,
    memberPrice: 21.17,
    image:
      '/products/cutouts/kaiser-natron-pulver-250-g-grosspackung-removebg-preview-1.png',
    imageAlt: 'Haushalts-Bundle mit Kaiser-Natron',
    badge: 'Bestseller',
    badgeVariant: 'accent',
  },
  {
    id: 'waesche',
    name: 'Wäsche & Pflege',
    usage: '1–2× pro Quartal',
    items: [
      '1× Holste Wasch-Soda 500 g',
      '1× Gazelle Wäschestärke 1 l',
      '1× Linda Fleckenweg 200 ml',
    ],
    price: 22.9,
    memberPrice: 19.47,
    image: '/products/holste-wasch-soda-500-g-beutel.jpg',
    imageAlt: 'Wäsche & Pflege Bundle',
  },
  {
    id: 'wohlfuehl',
    name: 'Wohlfühl-Bundle',
    usage: '1× pro Quartal',
    items: [
      '1× Kaiser-Natron Tabletten 100 g',
      '1× Kaiser-Natron Bad 500 g',
      '1× Kaiser-Natron Fußbad 500 g',
    ],
    price: 29.9,
    memberPrice: 25.42,
    image: '/products/kaiser-natron-bad-500-g.jpg',
    imageAlt: 'Wohlfühl-Bundle',
  },
]

const benefits = computed(() => [
  t('bundles.benefit.1.title'),
  t('bundles.benefit.2.title'),
  t('bundles.benefit.3.title'),
])
</script>

<template>
  <div class="min-h-screen bg-surface">
    <Bundles
      :layout="layout"
      :bundles="bundles"
      :headline="t('bundles.headline.a')"
      :headline-em="t('bundles.headline.em')"
      :sub="t('bundles.sub')"
      :benefits="benefits"
      :join-cta="t('bundles.joinCta')"
    />
  </div>
</template>
