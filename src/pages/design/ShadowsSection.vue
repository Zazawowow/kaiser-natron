<script setup>
import { computed } from 'vue'
import SectionShell from './SectionShell.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const shadows = computed(() => [
  { name: 'sm', css: 'var(--shadow-sm)', note: t('ds.shadows.sm.note') },
  { name: 'md', css: 'var(--shadow-md)', note: t('ds.shadows.md.note') },
  { name: 'lg', css: 'var(--shadow-lg)', note: t('ds.shadows.lg.note') },
])
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.tokens')"
    :title="t('ds.shadows.title')"
    :description="t('ds.shadows.description')"
  >
    <div class="grid sm:grid-cols-3 gap-8">
      <div v-for="s in shadows" :key="s.name" class="space-y-4">
        <div
          class="h-36 rounded-md bg-paper"
          :style="{ boxShadow: s.css }"
        />
        <div>
          <code class="font-mono text-[12px] text-ink block">--shadow-{{ s.name }}</code>
          <p class="text-[13px] text-muted mt-1">{{ s.note }}</p>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
