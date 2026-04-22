<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: Infinity },
  disabled: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  decreaseLabel: { type: String, default: 'Decrease' },
  increaseLabel: { type: String, default: 'Increase' },
})

const emit = defineEmits(['update:modelValue', 'decrease', 'increase'])

const sizes = {
  sm: { btn: 'w-8 h-8', icon: 14, label: 'text-[13px]' },
  md: { btn: 'w-9 h-9', icon: 16, label: 'text-[14px]' },
}
const dims = computed(() => sizes[props.size])

const canDecrease = computed(() => !props.disabled && props.modelValue > props.min)
const canIncrease = computed(() => !props.disabled && props.modelValue < props.max)

function decrease() {
  if (!canDecrease.value) return
  const next = props.modelValue - 1
  emit('update:modelValue', next)
  emit('decrease', next)
}
function increase() {
  if (!canIncrease.value) return
  const next = props.modelValue + 1
  emit('update:modelValue', next)
  emit('increase', next)
}
</script>

<template>
  <div class="inline-flex items-center rounded-pill border border-line bg-paper font-sans">
    <button
      type="button"
      :class="[
        dims.btn,
        'inline-flex items-center justify-center rounded-l-pill text-brand transition-colors',
        'hover:bg-brand-wash disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
      ]"
      :disabled="!canDecrease"
      :aria-label="decreaseLabel"
      @click="decrease"
    >
      <Icon name="minus" :size="dims.icon" />
    </button>
    <span
      :class="[
        'min-w-[2ch] px-2 font-semibold text-ink tabular-nums text-center',
        dims.label,
      ]"
      aria-live="polite"
    >{{ modelValue }}</span>
    <button
      type="button"
      :class="[
        dims.btn,
        'inline-flex items-center justify-center rounded-r-pill text-brand transition-colors',
        'hover:bg-brand-wash disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
      ]"
      :disabled="!canIncrease"
      :aria-label="increaseLabel"
      @click="increase"
    >
      <Icon name="plus" :size="dims.icon" />
    </button>
  </div>
</template>
