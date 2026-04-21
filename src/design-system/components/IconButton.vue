<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  /** Icon name forwarded to the Icon component. */
  icon: { type: String, required: true },
  /** Override the icon render size (defaults are size-aware). */
  iconSize: { type: Number, default: null },
  /** Icon stroke width passthrough. */
  iconStrokeWidth: { type: [Number, String], default: null },
  /**
   * Surface treatment:
   *  - 'float'      — raised pine on brand surfaces (mobile FABs)
   *  - 'accent'     — warm yellow CTA (cart)
   *  - 'cream-wash' — translucent cream on brand overlays (overlay close)
   *  - 'brand-wash' — subtle brand tint on light surfaces (compact chrome)
   *  - 'ghost'      — transparent → brand-wash on hover (sheet close)
   */
  variant: {
    type: String,
    default: 'float',
    validator: (v) => ['float', 'accent', 'cream-wash', 'brand-wash', 'ghost'].includes(v),
  },
  /** Button diameter: xs=36px, sm=40px, md=44px, lg=56px. */
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  /**
   * Shadow depth. Null uses the variant default (float → lg, others → none).
   * Set explicitly when a non-float variant needs elevation (e.g. mobile cart).
   */
  shadow: {
    type: String,
    default: null,
    validator: (v) => v === null || ['none', 'sm', 'md', 'lg'].includes(v),
  },
  /** Optional numeric overlay (cart count, unread, etc.). Hidden when 0/null. */
  count: { type: Number, default: null },
  ariaLabel: { type: String, default: '' },
  type: { type: String, default: 'button' },
})

defineEmits(['click'])

// Raised-affordance variants get a subtle lift on hover; flatter variants
// only swap colors. Matches the prior inline behavior one-to-one.
const RAISED = new Set(['float', 'accent'])

const variants = {
  float: 'bg-brand-float text-accent',
  accent: 'bg-accent text-brand hover:bg-accent-soft',
  'cream-wash': 'bg-cream-wash text-cream hover:bg-cream-wash-strong',
  'brand-wash': 'bg-brand-wash text-brand',
  ghost: 'bg-transparent text-muted hover:bg-brand-wash hover:text-brand',
}

const defaultShadow = {
  float: 'shadow-lg',
  accent: '',
  'cream-wash': '',
  'brand-wash': '',
  ghost: '',
}

const shadowClass = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

const sizes = {
  xs: { box: 'w-9 h-9', icon: 18 },
  sm: { box: 'w-10 h-10', icon: 20 },
  md: { box: 'w-11 h-11', icon: 20 },
  lg: { box: 'w-14 h-14', icon: 22 },
}

const raised = computed(() => RAISED.has(props.variant))

const motion = computed(() =>
  raised.value
    ? 'transition-transform duration-base ease-out hover:-translate-y-0.5 active:translate-y-0'
    : 'transition-colors',
)

const elevation = computed(() =>
  props.shadow === null ? defaultShadow[props.variant] : shadowClass[props.shadow],
)

const classes = computed(() => [
  'relative inline-flex items-center justify-center rounded-full',
  sizes[props.size].box,
  variants[props.variant],
  elevation.value,
  motion.value,
])

const resolvedIconSize = computed(() => props.iconSize ?? sizes[props.size].icon)
</script>

<template>
  <button :type="type" :class="classes" :aria-label="ariaLabel || undefined" @click="$emit('click', $event)">
    <Icon :name="icon" :size="resolvedIconSize" :stroke-width="iconStrokeWidth ?? undefined" />
    <span
      v-if="count !== null && count > 0"
      class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center"
    >{{ count }}</span>
    <slot />
  </button>
</template>
