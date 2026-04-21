<script setup>
import SectionShell from './SectionShell.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const radii = [
  { name: 'xs', value: '6px' },
  { name: 'sm', value: '10px' },
  { name: 'md', value: '16px' },
  { name: 'lg', value: '20px' },
  { name: 'xl', value: '28px' },
  { name: 'pill', value: '100px' },
]
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.tokens')"
    :title="t('ds.radii.title')"
    :description="t('ds.radii.description')"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      <div v-for="r in radii" :key="r.name" class="flex flex-col items-center">
        <div
          class="h-32 w-full bg-paper border border-line mb-4 shadow-sm"
          :style="{ borderRadius: `var(--radius-${r.name})` }"
        />
        <code class="font-mono text-[12px] text-ink block">--radius-{{ r.name }}</code>
        <span class="text-[12px] text-muted mt-1">{{ r.value }}</span>
      </div>
    </div>
  </SectionShell>
</template>
