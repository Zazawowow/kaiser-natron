<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'accent', 'secondary', 'ghost', 'danger'].includes(v),
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
  'rounded-pill border transition-all duration-base ease-out ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

const variants = {
  primary:
    'bg-brand text-accent border-brand ' +
    'hover:bg-brand-hover hover:-translate-y-0.5 hover:shadow-md',
  accent:
    'bg-accent text-brand border-accent ' +
    'hover:bg-accent-soft hover:-translate-y-0.5 hover:shadow-md',
  secondary:
    'bg-transparent text-brand border-brand ' +
    'hover:bg-brand hover:text-accent',
  ghost:
    'bg-transparent text-brand border-transparent hover:bg-brand-wash',
  danger:
    'bg-danger text-white border-danger ' +
    'hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md',
}

const sizes = {
  sm: 'text-[13px] px-[18px] py-[9px] tracking-label',
  md: 'text-[15px] px-[26px] py-[13px] tracking-label',
  lg: 'text-[16px] px-[34px] py-[17px] tracking-label',
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
    <slot name="before" />
    <slot />
    <slot name="after" />
  </button>
</template>
