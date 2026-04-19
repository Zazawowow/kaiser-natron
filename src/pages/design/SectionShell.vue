<script setup>
defineProps({
  eyebrow: { type: String, default: 'Design system' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-10 lg:px-16 py-16">
    <header class="mb-14 max-w-2xl">
      <p class="eyebrow mb-3">{{ eyebrow }}</p>
      <h1 class="font-display text-5xl font-normal tracking-[var(--tracking-tight)] leading-[1.05] text-[var(--color-ink)]">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-5 text-[17px] text-[var(--color-muted)] leading-relaxed">
        {{ description }}
      </p>
    </header>
    <div class="space-y-16">
      <slot />
    </div>
  </div>
</template>
