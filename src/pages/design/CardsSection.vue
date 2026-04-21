<script setup>
import SectionShell from './SectionShell.vue'
import Card from '@/design-system/components/Card.vue'
import Badge from '@/design-system/components/Badge.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.cards.title')"
    :description="t('ds.cards.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.tones') }}</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <Card tone="paper">
          <Badge variant="subtle" class="mb-4">{{ t('ds.cards.paper') }}</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.paperTitle') }}</h3>
          <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.cards.paperBody') }}</p>
        </Card>
        <Card tone="cream">
          <Badge variant="subtle" class="mb-4">{{ t('ds.cards.cream') }}</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.creamTitle') }}</h3>
          <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.cards.creamBody') }}</p>
        </Card>
        <Card tone="brand">
          <Badge variant="accent" class="mb-4">{{ t('ds.cards.brand') }}</Badge>
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.brandTitle') }}</h3>
          <p class="text-[14px] opacity-80 leading-relaxed">{{ t('ds.cards.brandBody') }}</p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.interactive') }}</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <Card tone="paper" interactive>
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.hoverMe') }}</h3>
          <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.cards.hoverBody') }}</p>
        </Card>
        <Card tone="cream" interactive>
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.hoverMeToo') }}</h3>
          <p class="text-[14px] text-muted leading-relaxed">{{ t('ds.cards.hoverBodyAlt') }}</p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.withoutPadding') }}</h2>
      <Card tone="paper" :padded="false">
        <div class="h-40 bg-cream rounded-t-md" />
        <div class="p-7">
          <h3 class="font-display text-2xl font-normal mb-2">{{ t('ds.cards.mediaTitle') }}</h3>
          <p class="text-[14px] text-muted leading-relaxed">
            {{ t('ds.cards.mediaBody') }} <code class="font-mono text-[12px]">:padded="false"</code>.
          </p>
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
