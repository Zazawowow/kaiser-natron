<script setup>
import { computed } from 'vue'
import SectionShell from './SectionShell.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const groups = computed(() => [
  { title: t('ds.colors.group.brand'), names: ['brand', 'brand-hover', 'brand-soft'] },
  { title: t('ds.colors.group.accent'), names: ['accent', 'accent-soft', 'accent-ink'] },
  { title: t('ds.colors.group.surface'), names: ['surface', 'paper', 'cream'] },
  { title: t('ds.colors.group.ink'), names: ['ink', 'muted'] },
  { title: t('ds.colors.group.line'), names: ['line', 'line-strong'] },
  { title: t('ds.colors.group.semantic'), names: ['success', 'warning', 'danger'] },
])
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.tokens')"
    :title="t('ds.colors.title')"
    :description="t('ds.colors.description')"
  >
    <section v-for="group in groups" :key="group.title">
      <h2 class="eyebrow mb-5">{{ group.title }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          v-for="name in group.names"
          :key="name"
          class="rounded-md border border-line overflow-hidden bg-paper"
        >
          <div
            class="h-28 border-b border-line"
            :style="{ background: `var(--color-${name})` }"
          />
          <div class="px-4 py-3">
            <code class="font-mono text-[12px] text-ink block">--color-{{ name }}</code>
          </div>
        </div>
      </div>
    </section>
  </SectionShell>
</template>
