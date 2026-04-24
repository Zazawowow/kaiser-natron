<script setup>
import { computed } from 'vue'
import Button from './Button.vue'
import Badge from './Badge.vue'
import Icon from './Icon.vue'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  title: { type: String, required: true },
  size: { type: String, default: '' },
  price: { type: [String, Number], required: true },
  currency: { type: String, default: '€' },
  image: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeVariant: {
    type: String,
    default: 'accent',
    validator: (v) => ['neutral', 'brand', 'accent', 'subtle', 'success', 'warning', 'danger'].includes(v),
  },
  tone: {
    type: String,
    default: 'paper',
    validator: (t) => ['paper', 'cream'].includes(t),
  },
  inStock: { type: Boolean, default: true },
  href: { type: String, default: '' },
  /** Add-to-cart button variant. Defaults to `primary` (brand
   *  green); shop sections alternate this to `accent` (yellow) to
   *  differentiate use-case bands visually. Accepts any Button
   *  variant; a subset list isn't enforced here so consumers can
   *  experiment without gatekeeping from the card. */
  ctaVariant: { type: String, default: 'primary' },
})

defineEmits(['add'])

const { t } = useI18n()

// Media background is pinned to `bg-paper` (white) for both tones
// while the product PNGs still carry baked-in solid backgrounds.
// Once the imagery is re-exported with transparency we can reinstate
// the tone-coupled media tint (paper→cream, cream→paper) for the
// subtle surface contrast the DS originally called for.
const tones = {
  paper: {
    surface: 'bg-paper',
    media: 'bg-paper',
    border: 'border-line',
  },
  cream: {
    surface: 'bg-cream',
    media: 'bg-paper',
    border: 'border-line',
  },
}

const tone = computed(() => tones[props.tone])

const priceLabel = computed(() => {
  if (typeof props.price === 'number') {
    return `${props.currency} ${props.price.toFixed(2).replace('.', ',')}`
  }
  return `${props.currency} ${props.price}`
})
</script>

<template>
  <article
    :class="[
      'group flex flex-col overflow-hidden rounded-md border transition-all duration-base ease-out',
      tone.surface,
      tone.border,
      'hover:-translate-y-1 hover:shadow-md hover:border-brand-soft',
    ]"
  >
    <!-- Media. Height sized to frame the (small) product image
         comfortably rather than inflating the card with empty
         whitespace. Image occupies most of the media area so the
         visible product reads clearly; the card body carries the
         weight below. Interim sizing — once we have
         transparent-background imagery the media area can revisit
         aspect ratios to match the product silhouettes. -->
    <component
      :is="href ? 'a' : 'div'"
      :href="href || null"
      :class="[
        'relative flex items-center justify-center h-40 md:h-48 overflow-hidden',
        tone.media,
      ]"
    >
      <Badge
        v-if="badge"
        :variant="badgeVariant"
        class="absolute top-4 left-4 z-[1]"
      >{{ badge }}</Badge>
      <img
        :src="image"
        :alt="imageAlt || title"
        loading="lazy"
        decoding="async"
        class="max-w-[55%] max-h-[80%] object-contain transition-transform duration-slow ease-out group-hover:scale-105"
      />
    </component>

    <!-- Body -->
    <div class="flex flex-col gap-3 p-6">
      <div class="flex flex-col gap-1">
        <!-- Title reserves exactly 2 lines (`min-h-[2lh]`) so cards
             in a row align their body/price/CTA even when one
             title wraps and another doesn't. `lh` = computed
             line-height, so the reservation auto-tracks
             font-size × leading without hardcoded pixel values. -->
        <component
          :is="href ? 'a' : 'h3'"
          :href="href || null"
          :class="[
            'font-display text-xl font-normal leading-tight text-ink min-h-[2lh]',
            href ? 'hover:text-brand transition-colors duration-base' : '',
          ]"
        >{{ title }}</component>
        <!-- Size slot is always reserved (even when empty) so the
             row of price + CTA sits at the same y across cards. -->
        <p class="text-sm text-muted tracking-label min-h-[1lh]">{{ size || '\xa0' }}</p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-3 pt-2">
        <span class="font-display text-2xl font-normal text-brand">{{ priceLabel }}</span>
        <span
          v-if="!inStock"
          class="text-xs font-semibold tracking-label uppercase text-danger"
        >{{ t('ds.product.outOfStock') }}</span>
      </div>

      <Button
        :variant="ctaVariant"
        size="md"
        block
        :disabled="!inStock"
        @click="$emit('add')"
      >
        <template #before><Icon name="plus" :size="16" /></template>
        {{ t('ds.buttons.addToCart') }}
      </Button>
    </div>
  </article>
</template>
