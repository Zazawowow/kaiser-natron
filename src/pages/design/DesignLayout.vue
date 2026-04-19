<script setup>
import { RouterLink, RouterView } from 'vue-router'

const groups = [
  {
    title: 'Tokens',
    items: [
      { name: 'ds-colors', label: 'Colors' },
      { name: 'ds-typography', label: 'Typography' },
      { name: 'ds-radii', label: 'Radii' },
      { name: 'ds-shadows', label: 'Shadows' },
    ],
  },
  {
    title: 'Components',
    items: [
      { name: 'ds-buttons', label: 'Buttons' },
      { name: 'ds-badges', label: 'Badges' },
      { name: 'ds-inputs', label: 'Inputs' },
      { name: 'ds-cards', label: 'Cards' },
    ],
  },
]
</script>

<template>
  <div class="h-screen flex bg-[#fafafa] text-[var(--color-ink)] overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-[260px] shrink-0 border-r border-[var(--color-line)] bg-[var(--color-paper)] flex flex-col">
      <div class="px-6 py-6 border-b border-[var(--color-line)]">
        <RouterLink to="/" class="font-display text-[20px] leading-tight text-[var(--color-ink)]">
          Kaiser<em class="italic font-light text-[var(--color-brand-soft)]"> Natron</em>
        </RouterLink>
        <p class="eyebrow mt-2">Design system</p>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div v-for="group in groups" :key="group.title">
          <p class="eyebrow px-3 mb-2">{{ group.title }}</p>
          <div class="flex flex-col gap-0.5">
            <RouterLink
              v-for="item in group.items"
              :key="item.name"
              :to="{ name: item.name }"
              class="px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-medium text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[rgba(28,58,40,0.05)] transition-colors"
              active-class="!text-[var(--color-brand)] !bg-[rgba(28,58,40,0.08)]"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="px-6 py-4 border-t border-[var(--color-line)]">
        <RouterLink
          to="/"
          class="text-[13px] text-[var(--color-muted)] hover:text-[var(--color-brand)] transition-colors"
        >
          ← Back to site
        </RouterLink>
      </div>
    </aside>

    <!-- Main scrolling content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
