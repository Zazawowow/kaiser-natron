<script setup>
import { RouterLink } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Button from '@/design-system/components/Button.vue'
</script>

<template>
  <div class="min-h-screen bg-surface">
    <Navbar variant="brand" layout="floating" :cart-count="0" />

    <section class="mx-auto max-w-4xl px-6 py-28 text-center">
      <p class="eyebrow mb-4">Scaffolding</p>
      <h1
        class="font-display font-normal tracking-[var(--tracking-tight)] leading-[1.05]"
        style="font-size: clamp(3rem, 5vw, 4.5rem);"
      >
        Design system <em class="italic font-light text-brand-soft">first</em>.
      </h1>
      <p class="mt-5 text-muted max-w-xl mx-auto">
        Tokens, primitives, and patterns live in <code class="font-mono text-sm">/src/design-system</code>.
        Browse the live reference and iterate.
      </p>
      <RouterLink to="/design" class="inline-block mt-10">
        <Button size="lg">Open design system</Button>
      </RouterLink>
    </section>
  </div>
</template>
