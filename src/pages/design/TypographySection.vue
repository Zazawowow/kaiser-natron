<script setup>
import SectionShell from './SectionShell.vue'
import Card from '@/design-system/components/Card.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const scale = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.tokens')"
    :title="t('ds.typography.title')"
    :description="t('ds.typography.description')"
  >
    <section class="grid md:grid-cols-2 gap-6">
      <Card tone="paper">
        <p class="eyebrow mb-3">{{ t('ds.heading.display') }}</p>
        <p class="font-display text-5xl font-normal leading-[1.05] mb-3">Fraunces</p>
        <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.typography.serifDesc') }}</p>
        <code class="font-mono text-[11px] text-muted block mt-5">var(--font-serif)</code>
      </Card>
      <Card tone="paper">
        <p class="eyebrow mb-3">{{ t('ds.heading.body') }}</p>
        <p class="font-sans text-5xl font-medium leading-[1.05] mb-3">DM Sans</p>
        <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.typography.sansDesc') }}</p>
        <code class="font-mono text-[11px] text-muted block mt-5">var(--font-sans)</code>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-6">{{ t('ds.heading.scale') }}</h2>
      <div class="divide-y divide-line rounded-md border border-line bg-paper px-6">
        <div v-for="size in scale" :key="size" class="flex items-baseline gap-8 py-4">
          <code class="font-mono text-[11px] text-muted w-24 shrink-0">text-{{ size }}</code>
          <span :class="`text-${size}`">{{ t('ds.typography.sample') }}</span>
        </div>
      </div>
    </section>
  </SectionShell>
</template>
