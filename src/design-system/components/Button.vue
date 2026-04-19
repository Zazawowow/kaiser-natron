<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})

defineEmits(['click'])

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold ' +
  'rounded-[var(--radius-pill)] border transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]'

const variants = {
  primary:
    'bg-[var(--color-brand)] text-[var(--color-accent)] border-[var(--color-brand)] ' +
    'hover:bg-[var(--color-brand-hover)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(28,58,40,0.22)]',
  secondary:
    'bg-transparent text-[var(--color-brand)] border-[var(--color-brand)] ' +
    'hover:bg-[var(--color-brand)] hover:text-[var(--color-accent)]',
  ghost:
    'bg-transparent text-[var(--color-brand)] border-transparent ' +
    'hover:bg-[rgba(28,58,40,0.06)]',
  danger:
    'bg-[var(--color-danger)] text-white border-[var(--color-danger)] hover:opacity-90',
}

const sizes = {
  sm: 'text-[13px] px-[18px] py-[9px] tracking-[var(--tracking-label)]',
  md: 'text-[15px] px-[26px] py-[13px] tracking-[var(--tracking-label)]',
  lg: 'text-[16px] px-[34px] py-[17px] tracking-[var(--tracking-label)]',
}

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
  props.block ? 'w-full' : '',
])
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes" @click="$emit('click', $event)">
    <span v-if="loading" class="inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
    <slot />
  </button>
</template>
