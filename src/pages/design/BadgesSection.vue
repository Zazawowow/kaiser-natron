<script setup>
import SectionShell from './SectionShell.vue'
import Badge from '@/design-system/components/Badge.vue'
import Card from '@/design-system/components/Card.vue'
</script>

<template>
  <SectionShell
    eyebrow="Components"
    title="Badges"
    description="Small uppercase labels for metadata, status, and eyebrows above headings."
  >
    <section>
      <h2 class="eyebrow mb-5">Variants</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Non-uppercase</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Badge variant="brand" :uppercase="false">New release</Badge>
          <Badge variant="accent" :uppercase="false">Featured</Badge>
          <Badge variant="subtle" :uppercase="false">v2.1.0</Badge>
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
