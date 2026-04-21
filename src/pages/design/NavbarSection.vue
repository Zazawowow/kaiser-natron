<script setup>
import { ref, computed } from 'vue'
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const tones = computed(() => [
  { id: 'paper', label: t('ds.navbar.tone.paper'), swatch: '#ffffff' },
  { id: 'cream', label: t('ds.navbar.tone.cream'), swatch: 'var(--color-cream)' },
  { id: 'brand', label: t('ds.navbar.tone.brand'), swatch: 'var(--color-brand)' },
])
const layouts = computed(() => [
  { id: 'standard', label: t('ds.navbar.layout.standard') },
  { id: 'floating', label: t('ds.navbar.layout.floating') },
])

const tone = ref('paper')
const layout = ref('standard')
const src = computed(
  () => `/design/preview/navbar?variant=${tone.value}&layout=${layout.value}`,
)
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.navbar.title')"
    :description="t('ds.navbar.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="mobile" :height="720">
        <template #controls>
          <div
            role="tablist"
            :aria-label="t('ds.navbar.layout')"
            class="inline-flex items-center p-1 gap-0.5 rounded-pill border border-line bg-paper"
          >
            <button
              v-for="l in layouts"
              :key="l.id"
              type="button"
              role="tab"
              :aria-selected="layout === l.id"
              :class="[
                'px-3 py-1.5 text-[12px] font-semibold tracking-label rounded-pill transition-colors duration-base',
                layout === l.id ? 'bg-brand text-accent' : 'text-muted hover:text-brand',
              ]"
              @click="layout = l.id"
            >{{ l.label }}</button>
          </div>
          <div
            role="tablist"
            :aria-label="t('ds.navbar.tone')"
            class="inline-flex items-center p-1 gap-0.5 rounded-pill border border-line bg-paper"
          >
            <button
              v-for="v in tones"
              :key="v.id"
              type="button"
              role="tab"
              :aria-selected="tone === v.id"
              :class="[
                'inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold tracking-label rounded-pill transition-colors duration-base',
                tone === v.id ? 'bg-brand text-accent' : 'text-muted hover:text-brand',
              ]"
              @click="tone = v.id"
            >
              <span
                class="w-2.5 h-2.5 rounded-full border border-line-strong"
                :style="{ backgroundColor: v.swatch }"
              />
              {{ v.label }}
            </button>
          </div>
        </template>
      </DevicePreview>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
        <pre class="whitespace-pre-wrap">&lt;Navbar
  variant="paper"
  layout="floating"
  :items="[{ key: 'nav.shop', href: '/shop' }]"
  :cart-count="2"
  @cart="openCart"
  @nav="onNav"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
