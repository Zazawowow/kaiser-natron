<script setup>
import SectionShell from './SectionShell.vue'
import Card from '@/design-system/components/Card.vue'
import Badge from '@/design-system/components/Badge.vue'
</script>

<template>
  <SectionShell
    eyebrow="Components"
    title="Cards"
    description="Surfaces for grouping content. Three tones — paper, cream, brand — and an optional interactive lift on hover."
  >
    <section>
      <h2 class="eyebrow mb-5">Tones</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <Card tone="paper">
          <Badge variant="subtle" class="mb-4">Paper</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">Default surface</h3>
          <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
            The go-to card for most content. High contrast on the cream page background.
          </p>
        </Card>
        <Card tone="cream">
          <Badge variant="subtle" class="mb-4">Cream</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">Warm surface</h3>
          <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
            A softer alternative for secondary sections or callouts.
          </p>
        </Card>
        <Card tone="brand">
          <Badge variant="accent" class="mb-4">Brand</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">Dark surface</h3>
          <p class="text-[14px] opacity-80 leading-relaxed">
            For feature panels, CTAs, and moments that want to stand out.
          </p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Interactive</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <Card tone="paper" interactive>
          <h3 class="font-display text-2xl font-normal mb-2">Hover me</h3>
          <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
            Lifts on hover with a soft green-tinted shadow. Use for clickable items in a grid.
          </p>
        </Card>
        <Card tone="cream" interactive>
          <h3 class="font-display text-2xl font-normal mb-2">Hover me too</h3>
          <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
            Same behavior on the warm surface.
          </p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Without padding</h2>
      <Card tone="paper" :padded="false">
        <div class="h-40 bg-[var(--color-cream)] rounded-t-[var(--radius-md)]" />
        <div class="p-7">
          <h3 class="font-display text-2xl font-normal mb-2">Media card</h3>
          <p class="text-[14px] text-[var(--color-muted)] leading-relaxed">
            When the card needs a full-bleed image or header, pass <code class="font-mono text-[12px]">:padded="false"</code>.
          </p>
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
