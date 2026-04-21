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
  neutral: 'bg-cream text-muted border border-line',
  brand: 'bg-brand text-accent',
  accent: 'bg-accent text-accent-ink',
  subtle: 'bg-brand-soft-wash text-brand-soft',
  success: 'bg-success-wash text-success',
  warning: 'bg-warning-wash text-warning',
  danger: 'bg-danger-wash text-danger',
}

const classes = computed(() => [
  'inline-flex items-center gap-1 px-[11px] py-[5px] rounded-pill text-[11px] font-bold tracking-eyebrow',
  props.uppercase ? 'uppercase' : '',
  variants[props.variant],
])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
