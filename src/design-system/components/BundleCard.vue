<script setup>
import { computed } from 'vue'
import Button from './Button.vue'
import Badge from './Badge.vue'
import Icon from './Icon.vue'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  name: { type: String, required: true },
  // Each item is a short label like "1× Kaiser-Natron Pulver 250g".
  // Capped visually at 3 to honour the "max 3 things" rule; any extras
  // collapse into a "+ N weitere" line so the card stays scannable.
  items: { type: Array, required: true },
  price: { type: Number, required: true },
  memberPrice: { type: Number, default: null },
  usage: { type: String, default: '' },
  image: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeVariant: {
    type: String,
    default: 'accent',
    validator: (v) =>
      ['neutral', 'brand', 'accent', 'subtle', 'success', 'warning', 'danger'].includes(v),
  },
  tone: {
    type: String,
    default: 'paper',
    validator: (t) => ['paper', 'cream'].includes(t),
  },
  // Vertical = image on top, body below (grid use).
  // Horizontal = image on the left and body on the right from md up
  // (featured / carousel use, where the card owns the full row width).
  layout: {
    type: String,
    default: 'vertical',
    validator: (l) => ['vertical', 'horizontal'].includes(l),
  },
  inStock: { type: Boolean, default: true },
  currency: { type: String, default: '€' },
  href: { type: String, default: '' },
})

defineEmits(['add'])

const { t } = useI18n()

const tones = {
  paper: { surface: 'bg-paper', media: 'bg-cream', border: 'border-line' },
  cream: { surface: 'bg-cream', media: 'bg-paper', border: 'border-line' },
}
const tone = computed(() => tones[props.tone])

function formatMoney(amount) {
  return `${props.currency} ${amount.toFixed(2).replace('.', ',')}`
}

const priceLabel = computed(() => formatMoney(props.price))
const memberLabel = computed(() =>
  props.memberPrice != null ? formatMoney(props.memberPrice) : '',
)

const MAX_ITEMS = 3
const visibleItems = computed(() => props.items.slice(0, MAX_ITEMS))
const extraCount = computed(() => Math.max(0, props.items.length - MAX_ITEMS))
</script>

<template>
  <article
    :class="[
      'group flex overflow-hidden rounded-md border transition-all duration-base ease-out',
      layout === 'horizontal' ? 'flex-col md:flex-row' : 'flex-col',
      tone.surface,
      tone.border,
      'hover:-translate-y-1 hover:shadow-md hover:border-brand-soft',
    ]"
  >
    <!-- Media. In horizontal mode the media column is a tighter ~38% of the
         row from md up and drops its mobile aspect ratio so flex-stretch
         can match the body height. -->
    <component
      :is="href ? 'a' : 'div'"
      :href="href || null"
      :class="[
        'relative block overflow-hidden',
        layout === 'horizontal'
          ? 'aspect-[4/3] md:aspect-auto md:w-[38%] md:shrink-0 md:min-h-[300px]'
          : 'aspect-[4/3]',
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
        :alt="imageAlt || name"
        loading="lazy"
        decoding="async"
        :class="[
          'absolute inset-0 w-full h-full object-contain transition-transform duration-slow ease-out group-hover:scale-105',
          layout === 'horizontal' ? 'p-6 md:p-5' : 'p-8',
        ]"
      />
    </component>

    <!-- Body -->
    <div
      :class="[
        'flex flex-col gap-4 p-6',
        layout === 'horizontal' ? 'md:p-6 md:flex-1' : '',
      ]"
    >
      <div class="flex flex-col gap-1.5">
        <span
          v-if="usage"
          class="text-xs font-semibold tracking-label text-muted uppercase"
        >{{ usage }}</span>
        <component
          :is="href ? 'a' : 'h3'"
          :href="href || null"
          :class="[
            'font-display text-xl font-normal leading-tight text-ink',
            href ? 'hover:text-brand transition-colors duration-base' : '',
          ]"
        >{{ name }}</component>
      </div>

      <ul class="flex flex-col gap-1.5">
        <li
          v-for="label in visibleItems"
          :key="label"
          class="text-sm text-ink/80 leading-relaxed"
        >{{ label }}</li>
        <li
          v-if="extraCount > 0"
          class="text-sm text-muted tracking-label"
        >+ {{ extraCount }} {{ t('bundles.card.moreItems') }}</li>
      </ul>

      <!-- Footer. Vertical cards stack price + block button; horizontal
           cards put them side-by-side (price info left, compact CTA right)
           to cut the empty white the block button left behind. -->
      <div
        :class="[
          'mt-auto pt-4 border-t border-line flex gap-3',
          layout === 'horizontal'
            ? 'flex-col sm:flex-row sm:items-end sm:justify-between'
            : 'flex-col',
        ]"
      >
        <div class="flex flex-col gap-0.5">
          <span class="text-xs tracking-label text-muted uppercase">
            {{ t('bundles.card.priceLabel') }}
          </span>
          <span class="font-display text-2xl font-normal text-brand leading-none">
            {{ priceLabel }}
          </span>
          <span v-if="memberLabel" class="text-xs text-muted mt-1">
            {{ t('bundles.card.memberPrefix') }} {{ memberLabel }}
          </span>
          <span
            v-if="!inStock"
            class="text-xs font-semibold tracking-label uppercase text-danger mt-1"
          >{{ t('ds.product.outOfStock') }}</span>
        </div>

        <Button
          variant="primary"
          size="md"
          :block="layout === 'vertical'"
          :disabled="!inStock"
          @click="$emit('add')"
        >
          <template #before><Icon name="plus" :size="16" /></template>
          {{ t('ds.buttons.addToCart') }}
        </Button>
      </div>
    </div>
  </article>
</template>
