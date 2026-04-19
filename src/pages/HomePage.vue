<script setup>
import { RouterLink } from 'vue-router'
import Button from '@/design-system/components/Button.vue'
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-28 text-center">
    <p class="eyebrow mb-4">Scaffolding</p>
    <h1
      class="font-display font-normal tracking-[var(--tracking-tight)] leading-[1.05]"
      style="font-size: clamp(3rem, 5vw, 4.5rem);"
    >
      Design system <em class="italic font-light text-[var(--color-brand-soft)]">first</em>.
    </h1>
    <p class="mt-5 text-[var(--color-muted)] max-w-xl mx-auto">
      Tokens, primitives, and patterns live in <code class="font-mono text-sm">/src/design-system</code>.
      Browse the live reference and iterate.
    </p>
    <RouterLink to="/design" class="inline-block mt-10">
      <Button size="lg">Open design system</Button>
    </RouterLink>
  </section>
</template>
