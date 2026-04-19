<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isDesign = computed(() => route.name === 'design')

const designSections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'radii', label: 'Radii' },
  { id: 'shadows', label: 'Shadows' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'cards', label: 'Cards' },
]
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 w-[260px] border-r border-[var(--color-line)] bg-[var(--color-surface)] flex flex-col z-40"
    >
      <!-- Logo -->
      <div class="h-[78px] shrink-0 flex items-center px-6 border-b border-[var(--color-line)]">
        <RouterLink
          to="/"
          class="font-display text-[20px] font-normal tracking-[-0.01em] text-[var(--color-ink)]"
        >
          Kaiser<span class="italic font-light text-[var(--color-brand-soft)]"> Natron</span>
        </RouterLink>
      </div>

      <!-- Primary nav -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-medium text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[rgba(28,58,40,0.06)] transition-colors"
          active-class="!text-[var(--color-brand)] !bg-[rgba(28,58,40,0.08)]"
        >
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          Home
        </RouterLink>

        <div>
          <RouterLink
            to="/design"
            class="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-medium text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[rgba(28,58,40,0.06)] transition-colors"
            active-class="!text-[var(--color-brand)] !bg-[rgba(28,58,40,0.08)]"
          >
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            Design system
          </RouterLink>

          <!-- Nested sub-sections, visible only on /design -->
          <div
            v-if="isDesign"
            class="mt-1 ml-[18px] pl-3 border-l border-[var(--color-line)] flex flex-col"
          >
            <a
              v-for="s in designSections"
              :key="s.id"
              :href="`#${s.id}`"
              class="px-3 py-1.5 rounded-[var(--radius-sm)] text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-brand)] hover:bg-[rgba(28,58,40,0.05)] transition-colors"
            >
              {{ s.label }}
            </a>
          </div>
        </div>
      </nav>

      <!-- Sidebar footer -->
      <div class="shrink-0 p-4 border-t border-[var(--color-line)]">
        <p class="text-[11px] font-bold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-muted)]">
          Kaiser Natron · v0.1
        </p>
      </div>
    </aside>

    <!-- Main content (offset by sidebar width) -->
    <main class="flex-1 ml-[260px] min-w-0">
      <slot />
    </main>
  </div>
</template>
