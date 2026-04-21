<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  src: { type: String, required: true },
  initial: {
    type: String,
    default: 'desktop',
    validator: (v) => ['mobile', 'tablet', 'desktop'].includes(v),
  },
  height: { type: Number, default: 560 },
})

const devices = [
  { id: 'mobile', label: 'Mobile', width: 390 },
  { id: 'tablet', label: 'Tablet', width: 820 },
  { id: 'desktop', label: 'Desktop', width: 1280 },
]

const current = ref(props.initial)
const device = computed(() => devices.find((d) => d.id === current.value))
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-4 flex-wrap">
      <slot name="controls" />
      <div
        role="tablist"
        aria-label="Preview viewport"
        class="inline-flex items-center p-1 gap-0.5 rounded-pill border border-line bg-paper ml-auto"
      >
        <button
          v-for="d in devices"
          :key="d.id"
          type="button"
          role="tab"
          :aria-selected="current === d.id"
          :class="[
            'inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold tracking-label rounded-pill transition-colors duration-base',
            current === d.id ? 'bg-brand text-accent' : 'text-muted hover:text-brand',
          ]"
          @click="current = d.id"
        >
          <Icon :name="d.id" :size="14" />
          {{ d.label }}
        </button>
      </div>
    </div>

    <div class="rounded-md border border-line bg-surface p-6 overflow-x-auto">
      <div
        class="mx-auto transition-[width] duration-base ease-out"
        :style="{ width: device.width + 'px' }"
      >
        <iframe
          :src="src"
          :title="`${device.label} preview`"
          :style="{ height: height + 'px' }"
          class="w-full block rounded-sm border border-line bg-paper"
          loading="lazy"
        />
        <p class="mt-2 text-center font-mono text-[11px] text-muted">
          {{ device.width }}px
        </p>
      </div>
    </div>
  </div>
</template>
