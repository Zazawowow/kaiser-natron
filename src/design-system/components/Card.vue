<script setup>
defineProps({
  padded: { type: Boolean, default: true },
  interactive: { type: Boolean, default: false },
  tone: {
    type: String,
    default: 'paper',
    validator: (t) => ['paper', 'cream', 'brand'].includes(t),
  },
})

const tones = {
  paper: 'bg-paper text-ink border-line',
  cream: 'bg-cream text-ink border-line',
  brand: 'bg-brand text-accent border-transparent',
}
</script>

<template>
  <div
    class="rounded-md border"
    :class="[
      tones[tone],
      padded ? 'p-7' : '',
      interactive
        ? 'transition-all duration-base ease-out hover:-translate-y-1 hover:shadow-md hover:border-brand-soft cursor-pointer'
        : '',
    ]"
  >
    <slot />
  </div>
</template>
