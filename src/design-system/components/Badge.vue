<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (v) => ['neutral', 'brand', 'accent', 'subtle', 'success', 'warning', 'danger'].includes(v),
  },
  uppercase: { type: Boolean, default: true },
})

const variants = {
  neutral: 'bg-[var(--color-cream)] text-[var(--color-muted)] border border-[var(--color-line)]',
  brand: 'bg-[var(--color-brand)] text-[var(--color-accent)]',
  accent: 'bg-[var(--color-accent)] text-[var(--color-accent-ink)]',
  subtle: 'bg-[rgba(61,122,85,0.08)] text-[var(--color-brand-soft)]',
  success: 'bg-[rgba(61,122,85,0.12)] text-[var(--color-success)]',
  warning: 'bg-[rgba(198,144,15,0.15)] text-[var(--color-warning)]',
  danger: 'bg-[rgba(178,58,42,0.12)] text-[var(--color-danger)]',
}

const classes = computed(() => [
  'inline-flex items-center gap-1 px-[11px] py-[5px] rounded-[var(--radius-pill)] text-[11px] font-bold',
  'tracking-[var(--tracking-eyebrow)]',
  props.uppercase ? 'uppercase' : '',
  variants[props.variant],
])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
