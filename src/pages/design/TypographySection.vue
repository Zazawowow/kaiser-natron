<script setup>
import SectionShell from './SectionShell.vue'
import Card from '@/design-system/components/Card.vue'
</script>

<template>
  <SectionShell
    eyebrow="Tokens"
    title="Typography"
    description="Fraunces for display — warm, organic, optical-sized. DM Sans for body and UI — clean and geometric."
  >
    <section class="grid md:grid-cols-2 gap-6">
      <Card tone="paper">
        <p class="eyebrow mb-3">Display</p>
        <p class="font-display text-5xl font-normal leading-[1.05] mb-3">Fraunces</p>
        <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
          Serif with optical sizing. Use for hero, section titles, product names.
        </p>
        <code class="font-mono text-[11px] text-[var(--color-muted)] block mt-5">var(--font-serif)</code>
      </Card>
      <Card tone="paper">
        <p class="eyebrow mb-3">Body</p>
        <p class="font-sans text-5xl font-medium leading-[1.05] mb-3">DM Sans</p>
        <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
          Clean geometric sans. Use for body, UI, navigation, labels.
        </p>
        <code class="font-mono text-[11px] text-[var(--color-muted)] block mt-5">var(--font-sans)</code>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-6">Scale</h2>
      <div class="divide-y divide-[var(--color-line)] rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-paper)] px-6">
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-xs</code>
          <span class="text-xs">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-sm</code>
          <span class="text-sm">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-base</code>
          <span class="text-base">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-lg</code>
          <span class="text-lg">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-xl</code>
          <span class="text-xl">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-2xl</code>
          <span class="text-2xl">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-3xl</code>
          <span class="text-3xl">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-4xl</code>
          <span class="text-4xl">The quick brown fox</span>
        </div>
        <div class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-5xl</code>
          <span class="text-5xl">The quick brown fox</span>
        </div>
      </div>
    </section>
  </SectionShell>
</template>
