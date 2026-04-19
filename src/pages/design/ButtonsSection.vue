<script setup>
import SectionShell from './SectionShell.vue'
import Button from '@/design-system/components/Button.vue'
import Card from '@/design-system/components/Card.vue'
</script>

<template>
  <SectionShell
    eyebrow="Components"
    title="Buttons"
    description="Pill-shaped, pine-green primary with a warm-yellow label. Secondary, ghost, and danger variants for supporting actions."
  >
    <section>
      <h2 class="eyebrow mb-5">Variants</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Sizes</h2>
      <Card tone="paper">
        <div class="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">States</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3 items-center">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Block</h2>
      <Card tone="paper">
        <div class="max-w-md">
          <Button block variant="primary">Full-width primary</Button>
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
