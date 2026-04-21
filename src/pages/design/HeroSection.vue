<script setup>
import { ref, computed } from 'vue'
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const variants = computed(() => [
  { id: 'split', label: t('ds.hero.variant.split') },
  { id: 'centered', label: t('ds.hero.variant.centered') },
])

const tones = computed(() => [
  { id: 'cream', label: t('ds.navbar.tone.cream'), swatch: 'var(--color-cream)' },
  { id: 'paper', label: t('ds.navbar.tone.paper'), swatch: '#ffffff' },
  { id: 'brand', label: t('ds.navbar.tone.brand'), swatch: 'var(--color-brand)' },
])

const variant = ref('split')
const tone = ref('cream')
const src = computed(
  () => `/design/preview/hero?variant=${variant.value}&tone=${tone.value}`,
)
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.hero.title')"
    :description="t('ds.hero.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="760">
        <template #controls>
          <div
            role="tablist"
            :aria-label="t('ds.hero.variant.label')"
            class="inline-flex items-center p-1 gap-0.5 rounded-pill border border-line bg-paper"
          >
            <button
              v-for="v in variants"
              :key="v.id"
              type="button"
              role="tab"
              :aria-selected="variant === v.id"
              :class="[
                'px-3 py-1.5 text-[12px] font-semibold tracking-label rounded-pill transition-colors duration-base',
                variant === v.id ? 'bg-brand text-accent' : 'text-muted hover:text-brand',
              ]"
              @click="variant = v.id"
            >{{ v.label }}</button>
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
<pre class="whitespace-pre-wrap">&lt;Hero
  variant="split"
  tone="cream"
  eyebrow="Neu"
  headline="Kaiser-Natron Pulver"
  subheadline="Reinigt. Backt. Neutralisiert."
  image="/products/cutouts/…-removebg-preview.png"
  image-alt="Kaiser-Natron Pulver 250 g"
  badge="Bestseller"
  cta-label="In den Warenkorb"
  secondary-label="Mehr erfahren"
  @cta="addToCart(sku)"
  @secondary="router.push('/anwendungen')"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
