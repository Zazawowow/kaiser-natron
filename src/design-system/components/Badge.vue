<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
    validator: (v) => ['neutral', 'brand', 'accent', 'subtle', 'success', 'warning', 'danger'].includes(v),
  },
  uppercase: { type: Boolean, default: true },
  /**
   * Render as a button when this badge is interactive (e.g. an inline
   * "Clear" affordance). Default is a non-interactive span.
   */
  as: {
    type: String,
    default: 'span',
    validator: (v) => ['span', 'button'].includes(v),
  },
})

defineEmits(['click'])

const variants = {
  neutral: 'bg-cream text-muted border border-line',
  brand: 'bg-brand text-accent',
  accent: 'bg-accent text-accent-ink',
  subtle: 'bg-brand-soft-wash text-brand-soft',
  success: 'bg-success-wash text-success',
  warning: 'bg-warning-wash text-warning',
  danger: 'bg-danger-wash text-danger',
}

// Accent needs a softer hover when clickable; other variants just lighten.
const interactiveHover = {
  neutral: 'hover:bg-cream-wash',
  brand: 'hover:bg-brand-hover',
  accent: 'hover:bg-accent-soft',
  subtle: 'hover:bg-brand-wash',
  success: 'hover:opacity-90',
  warning: 'hover:opacity-90',
  danger: 'hover:opacity-90',
}

const classes = computed(() => [
  'inline-flex items-center gap-1 px-[11px] py-[5px] rounded-pill text-[11px] font-bold tracking-eyebrow',
  props.uppercase ? 'uppercase' : '',
  variants[props.variant],
  props.as === 'button' ? `${interactiveHover[props.variant]} transition-colors` : '',
])
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :class="classes"
    @click="as === 'button' && $emit('click', $event)"
  >
    <slot />
  </component>
</template>
