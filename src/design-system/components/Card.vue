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
  paper: 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-line)]',
  cream: 'bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-line)]',
  brand: 'bg-[var(--color-brand)] text-[var(--color-accent)] border-transparent',
}
</script>

<template>
  <div
    class="rounded-[var(--radius-md)] border"
    :class="[
      tones[tone],
      padded ? 'p-7' : '',
      interactive
        ? 'transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(28,58,40,0.10)] hover:border-[var(--color-brand-soft)] cursor-pointer'
        : '',
    ]"
  >
    <slot />
  </div>
</template>
