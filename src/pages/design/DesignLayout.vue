<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Logo from '@/design-system/components/Logo.vue'
import LanguageSwitcher from '@/design-system/components/LanguageSwitcher.vue'
import Icon from '@/design-system/components/Icon.vue'
import IconButton from '@/design-system/components/IconButton.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const route = useRoute()

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
      { name: 'ds-motion', label: t('ds.nav.motion') },
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
      { name: 'ds-bundle-card', label: t('ds.nav.bundleCard') },
      { name: 'ds-hero', label: t('ds.nav.hero') },
      { name: 'ds-navbar', label: t('ds.nav.navbar') },
      { name: 'ds-search', label: t('ds.nav.search') },
      { name: 'ds-quantity-stepper', label: t('ds.nav.qtyStepper') },
      { name: 'ds-cart-drawer', label: t('ds.nav.cartDrawer') },
      { name: 'ds-language', label: t('ds.nav.language') },
    ],
  },
  {
    title: t('ds.sidebar.sections'),
    items: [
      { name: 'ds-bundles', label: t('ds.nav.bundles') },
      { name: 'ds-revitalization', label: t('ds.nav.revitalization') },
      { name: 'ds-about', label: t('ds.nav.about') },
    ],
  },
])

const flatItems = computed(() => groups.value.flatMap((g) => g.items))
const currentLabel = computed(() => {
  const hit = flatItems.value.find((i) => i.name === route.name)
  return hit ? hit.label : t('ds.eyebrow.designSystem')
})

const sheetOpen = ref(false)
function openSheet() { sheetOpen.value = true }
function closeSheet() { sheetOpen.value = false }

// Close the sheet whenever navigation happens.
watch(() => route.name, closeSheet)
</script>

<template>
  <div class="h-screen flex bg-surface text-ink overflow-hidden">
    <!-- Sidebar — desktop only (lg+) -->
    <aside class="hidden lg:flex w-[260px] shrink-0 border-r border-line bg-paper flex-col">
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

    <!-- Main scrolling content. Extra bottom padding below lg so the fixed
         nav bar doesn't hide the last section of content. -->
    <main class="flex-1 overflow-y-auto pb-20 lg:pb-0">
      <RouterView />
    </main>

    <!-- Mobile / tablet bottom nav bar -->
    <button
      type="button"
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-5 py-3 bg-paper border-t border-line text-left shadow-[0_-4px_16px_rgba(28,58,40,0.06)]"
      :aria-expanded="sheetOpen"
      aria-controls="ds-mobile-sheet"
      @click="openSheet"
    >
      <span class="flex flex-col min-w-0">
        <span class="eyebrow">{{ t('ds.mobile.currentPage') }}</span>
        <span class="truncate text-[15px] font-semibold text-ink">{{ currentLabel }}</span>
      </span>
      <span class="inline-flex items-center justify-center w-10 h-10 rounded-pill bg-brand-wash text-brand shrink-0">
        <Icon name="chevron-up" :size="20" :label="t('ds.mobile.selectPage')" />
      </span>
    </button>

    <!-- Backdrop -->
    <Transition name="ds-backdrop">
      <div
        v-if="sheetOpen"
        class="lg:hidden fixed inset-0 z-50 bg-ink/40"
        @click="closeSheet"
      />
    </Transition>

    <!-- Bottom sheet — ~50% of viewport, scrolls internally -->
    <Transition name="ds-sheet">
      <aside
        v-if="sheetOpen"
        id="ds-mobile-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="t('ds.mobile.selectPage')"
        class="lg:hidden fixed bottom-0 inset-x-0 z-50 h-[50svh] bg-paper border-t border-line rounded-t-xl flex flex-col shadow-[0_-12px_32px_rgba(28,58,40,0.18)]"
      >
        <div class="shrink-0 flex items-center justify-between px-5 pt-3 pb-3 border-b border-line">
          <span class="flex flex-col">
            <span class="eyebrow">{{ t('ds.eyebrow.designSystem') }}</span>
            <span class="text-[15px] font-semibold">{{ t('ds.mobile.selectPage') }}</span>
          </span>
          <IconButton
            icon="close"
            variant="ghost"
            size="xs"
            :icon-size="22"
            :aria-label="t('menu.close')"
            @click="closeSheet"
          />
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div v-for="group in groups" :key="group.title">
            <p class="eyebrow px-3 mb-2">{{ group.title }}</p>
            <div class="flex flex-col gap-0.5">
              <RouterLink
                v-for="item in group.items"
                :key="item.name"
                :to="{ name: item.name }"
                class="px-3 py-2.5 rounded-sm text-[15px] font-medium text-muted hover:text-brand hover:bg-brand-wash transition-colors"
                active-class="!text-brand !bg-brand-soft-wash"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>

          <div class="px-3 pt-3 border-t border-line">
            <RouterLink
              to="/"
              class="inline-block text-[14px] text-muted hover:text-brand transition-colors"
            >
              {{ t('ds.sidebar.back') }}
            </RouterLink>
          </div>
        </nav>
      </aside>
    </Transition>

    <!-- Global language switcher, floating top-right -->
    <LanguageSwitcher floating />
  </div>
</template>

<style scoped>
.ds-sheet-enter-active,
.ds-sheet-leave-active {
  transition: transform 0.26s ease;
}
.ds-sheet-enter-from,
.ds-sheet-leave-to {
  transform: translateY(100%);
}
.ds-backdrop-enter-active,
.ds-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.ds-backdrop-enter-from,
.ds-backdrop-leave-to {
  opacity: 0;
}
</style>
