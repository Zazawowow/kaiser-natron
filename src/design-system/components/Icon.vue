<script setup>
import { computed } from 'vue'
import { icons } from './icons.js'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
  strokeWidth: { type: [String, Number], default: 1.8 },
  label: { type: String, default: null },
})

const icon = computed(() => icons[props.name])
const a11yLabel = computed(() => props.label ?? null)
</script>

<template>
  <svg
    v-if="icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="a11yLabel ? 'img' : 'presentation'"
    :aria-label="a11yLabel"
    :aria-hidden="a11yLabel ? null : 'true'"
    v-html="icon.path"
  />
</template>
