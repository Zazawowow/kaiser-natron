<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Logo from '@/design-system/components/Logo.vue'
import LanguageSwitcher from '@/design-system/components/LanguageSwitcher.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const groups = computed(() => [
  {
    title: t('ds.sidebar.brand'),
    items: [
      { name: 'ds-logo', label: t('ds.nav.logo') },
    ],
  },
  {
    title: t('ds.sidebar.tokens'),
    items: [
      { name: 'ds-colors', label: t('ds.nav.colors') },
      { name: 'ds-typography', label: t('ds.nav.typography') },
      { name: 'ds-radii', label: t('ds.nav.radii') },
      { name: 'ds-shadows', label: t('ds.nav.shadows') },
    ],
  },
  {
    title: t('ds.sidebar.components'),
    items: [
      { name: 'ds-icons', label: t('ds.nav.icons') },
      { name: 'ds-buttons', label: t('ds.nav.buttons') },
      { name: 'ds-badges', label: t('ds.nav.badges') },
      { name: 'ds-inputs', label: t('ds.nav.inputs') },
      { name: 'ds-cards', label: t('ds.nav.cards') },
      { name: 'ds-products', label: t('ds.nav.products') },
      { name: 'ds-navbar', label: t('ds.nav.navbar') },
      { name: 'ds-language', label: t('ds.nav.language') },
    ],
  },
])
</script>

<template>
  <div class="h-screen flex bg-surface text-ink overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-[260px] shrink-0 border-r border-line bg-paper flex flex-col">
      <div class="px-6 py-6 border-b border-line">
        <RouterLink to="/" class="block text-brand" aria-label="Kaiser Natron home">
          <Logo class="w-16 h-auto" />
        </RouterLink>
        <p class="eyebrow mt-3">{{ t('ds.eyebrow.designSystem') }}</p>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div v-for="group in groups" :key="group.title">
          <p class="eyebrow px-3 mb-2">{{ group.title }}</p>
          <div class="flex flex-col gap-0.5">
            <RouterLink
              v-for="item in group.items"
              :key="item.name"
              :to="{ name: item.name }"
              class="px-3 py-2 rounded-sm text-[14px] font-medium text-muted hover:text-brand hover:bg-brand-wash transition-colors"
              active-class="!text-brand !bg-brand-soft-wash"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="px-6 py-4 border-t border-line">
        <RouterLink
          to="/"
          class="text-[13px] text-muted hover:text-brand transition-colors"
        >
          {{ t('ds.sidebar.back') }}
        </RouterLink>
      </div>
    </aside>

    <!-- Main scrolling content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Global language switcher, floating top-right -->
    <LanguageSwitcher floating />
  </div>
</template>
