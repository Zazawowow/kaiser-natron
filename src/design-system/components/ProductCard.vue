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
})

defineEmits(['add'])

const { t } = useI18n()

const tones = {
  paper: {
    surface: 'bg-paper',
    media: 'bg-cream',
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
    <!-- Media -->
    <component
      :is="href ? 'a' : 'div'"
      :href="href || null"
      :class="[
        'relative block aspect-[4/5] overflow-hidden',
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
        class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-slow ease-out group-hover:scale-105"
      />
    </component>

    <!-- Body -->
    <div class="flex flex-col gap-3 p-6">
      <div class="flex flex-col gap-1">
        <component
          :is="href ? 'a' : 'h3'"
          :href="href || null"
          :class="[
            'font-display text-xl font-normal leading-tight text-ink',
            href ? 'hover:text-brand transition-colors duration-base' : '',
          ]"
        >{{ title }}</component>
        <p v-if="size" class="text-sm text-muted tracking-label">{{ size }}</p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-3 pt-2">
        <span class="font-display text-2xl font-normal text-brand">{{ priceLabel }}</span>
        <span
          v-if="!inStock"
          class="text-xs font-semibold tracking-label uppercase text-danger"
        >{{ t('ds.product.outOfStock') }}</span>
      </div>

      <Button
        variant="primary"
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
