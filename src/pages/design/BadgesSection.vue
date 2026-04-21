<script setup>
import SectionShell from './SectionShell.vue'
import Badge from '@/design-system/components/Badge.vue'
import Card from '@/design-system/components/Card.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.badges.title')"
    :description="t('ds.badges.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.variants') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Badge variant="neutral">{{ t('ds.badges.neutral') }}</Badge>
          <Badge variant="brand">{{ t('ds.badges.brand') }}</Badge>
          <Badge variant="accent">{{ t('ds.badges.accent') }}</Badge>
          <Badge variant="subtle">{{ t('ds.badges.subtle') }}</Badge>
          <Badge variant="success">{{ t('ds.badges.success') }}</Badge>
          <Badge variant="warning">{{ t('ds.badges.warning') }}</Badge>
          <Badge variant="danger">{{ t('ds.badges.danger') }}</Badge>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.nonUppercase') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Badge variant="brand" :uppercase="false">{{ t('ds.badges.newRelease') }}</Badge>
          <Badge variant="accent" :uppercase="false">{{ t('ds.badges.featured') }}</Badge>
          <Badge variant="subtle" :uppercase="false">v2.1.0</Badge>
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
