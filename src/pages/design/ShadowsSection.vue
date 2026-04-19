<script setup>
import SectionShell from './SectionShell.vue'

const shadows = [
  { name: 'sm', css: 'var(--shadow-sm)', note: 'Subtle — nav on scroll, resting cards' },
  { name: 'md', css: 'var(--shadow-md)', note: 'Medium — primary button hover' },
  { name: 'lg', css: 'var(--shadow-lg)', note: 'Large — floating cards, overlays' },
]
</script>

<template>
  <SectionShell
    eyebrow="Tokens"
    title="Shadows"
    description="All shadows are tinted green rather than neutral black — they feel warm and part of the palette."
  >
    <div class="grid sm:grid-cols-3 gap-8">
      <div v-for="s in shadows" :key="s.name" class="space-y-4">
        <div
          class="h-36 rounded-[var(--radius-md)] bg-[var(--color-paper)]"
          :style="{ boxShadow: s.css }"
        />
        <div>
          <code class="font-mono text-[12px] text-[var(--color-ink)] block">--shadow-{{ s.name }}</code>
          <p class="text-[13px] text-[var(--color-muted)] mt-1">{{ s.note }}</p>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
