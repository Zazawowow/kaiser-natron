<!--
  ProductTeaser.vue
  -------------------------------------------------------------------
  Three-card product teaser sitting above the primary product hero on
  the homepage. Picks one product per use-case (Cook / Clean / Care)
  so the row reads as a representative sample rather than a curated
  bestseller list — the "Shop Kaiser Natron" CTA underneath funnels
  the visitor into the full catalogue.
-->
<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from './ProductCard.vue'
import Button from './Button.vue'

defineProps({
  eyebrow: { type: String, default: '' },
  headline: { type: String, default: '' },
  sub: { type: String, default: '' },
  /** Three products. Card layout assumes a 3-up grid on md+. */
  products: { type: Array, required: true },
  ctaLabel: { type: String, default: '' },
  ctaHref: { type: String, default: '/shop' },
  tone: {
    type: String,
    default: 'cream',
    validator: (t) => ['cream', 'paper', 'surface'].includes(t),
  },
})

defineEmits(['add'])

const tones = {
  cream: 'bg-cream',
  paper: 'bg-paper',
  surface: 'bg-surface',
}
</script>

<template>
  <section
    :class="[
      'relative px-6 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24',
      tones[tone],
    ]"
  >
    <div class="mx-auto w-full max-w-6xl flex flex-col items-center gap-10 md:gap-14">
      <header class="flex flex-col items-center gap-3 text-center max-w-2xl">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2
          v-if="headline"
          class="font-display font-normal leading-[1.08] tracking-tight text-ink text-[1.625rem] sm:text-[2rem] md:text-[2.5rem]"
        >{{ headline }}</h2>
        <p v-if="sub" class="text-lg leading-relaxed text-muted">{{ sub }}</p>
      </header>

      <!-- Three-up grid. Stacks on mobile, two-up on md (so the third
           card doesn't get squashed below 1024px), three-up on lg+. -->
      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :title="p.name || p.title"
          :size="p.size || ''"
          :price="p.price"
          :image="p.image"
          :image-alt="p.imageAlt || p.name || p.title"
          :badge="p.badge || ''"
          :badge-variant="p.badgeVariant || 'accent'"
          :href="p.href || (p.id ? `/shop/${p.id}` : '')"
          tone="brand"
          @add="$emit('add', p.id)"
        />
      </div>

      <div v-if="ctaLabel" class="flex justify-center">
        <RouterLink :to="ctaHref" class="inline-flex">
          <Button variant="primary" size="lg">{{ ctaLabel }}</Button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
