<script setup>
import SectionShell from './SectionShell.vue'

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
    eyebrow="Tokens"
    title="Radii"
    description="From subtle 6px rounding on small elements to full pills on buttons. Matches the reference site's soft, organic feel."
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      <div v-for="r in radii" :key="r.name" class="flex flex-col items-center">
        <div
          class="h-32 w-full bg-[var(--color-paper)] border border-[var(--color-line)] mb-4 shadow-[var(--shadow-sm)]"
          :style="{ borderRadius: `var(--radius-${r.name})` }"
        />
        <code class="font-mono text-[12px] text-[var(--color-ink)] block">--radius-{{ r.name }}</code>
        <span class="text-[12px] text-[var(--color-muted)] mt-1">{{ r.value }}</span>
      </div>
    </div>
  </SectionShell>
</template>
