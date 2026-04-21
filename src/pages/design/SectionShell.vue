<script setup>
defineProps({
  eyebrow: { type: String, default: 'Design system' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="['mx-auto py-16', wide ? 'max-w-none px-6 lg:px-8' : 'max-w-5xl px-10 lg:px-16']">
    <header class="mb-14 max-w-2xl">
      <p class="eyebrow mb-3">{{ eyebrow }}</p>
      <h1 class="font-display text-5xl font-normal tracking-tight leading-[1.05] text-ink">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-5 text-[17px] text-muted leading-relaxed">
        {{ description }}
      </p>
    </header>
    <div class="space-y-16">
      <slot />
    </div>
  </div>
</template>
