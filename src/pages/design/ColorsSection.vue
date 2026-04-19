<script setup>
import SectionShell from './SectionShell.vue'

const groups = [
  { title: 'Brand', names: ['brand', 'brand-hover', 'brand-soft'] },
  { title: 'Accent', names: ['accent', 'accent-soft', 'accent-ink'] },
  { title: 'Surface', names: ['surface', 'paper', 'cream'] },
  { title: 'Ink', names: ['ink', 'muted'] },
  { title: 'Line', names: ['line', 'line-strong'] },
  { title: 'Semantic', names: ['success', 'warning', 'danger'] },
]
</script>

<template>
  <SectionShell
    eyebrow="Tokens"
    title="Colors"
    description="Pine green on cream, with a warm yellow accent. All UI color flows from these tokens — never hand-pick values in components."
  >
    <section v-for="group in groups" :key="group.title">
      <h2 class="eyebrow mb-5">{{ group.title }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          v-for="name in group.names"
          :key="name"
          class="rounded-[var(--radius-md)] border border-[var(--color-line)] overflow-hidden bg-[var(--color-paper)]"
        >
          <div
            class="h-28 border-b border-[var(--color-line)]"
            :style="{ background: `var(--color-${name})` }"
          />
          <div class="px-4 py-3">
            <code class="font-mono text-[12px] text-[var(--color-ink)] block">--color-{{ name }}</code>
          </div>
        </div>
      </div>
    </section>
  </SectionShell>
</template>
