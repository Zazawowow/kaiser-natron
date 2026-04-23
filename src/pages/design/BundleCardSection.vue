<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import BundleCard from '@/design-system/components/BundleCard.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const lastAdded = ref('')
function onAdd(id) {
  lastAdded.value = id
  setTimeout(() => {
    if (lastAdded.value === id) lastAdded.value = ''
  }, 2000)
}

// One shared product fixture across the whole page. Using the transparent
// cutout (not the jpg product shot) because it sits cleanly on the cream
// media panel without a visible square crop edge.
const sampleImage =
  '/products/cutouts/kaiser-natron-pulver-250-g-grosspackung-removebg-preview-1.png'

const sample = {
  name: 'Haushalts-Bundle',
  usage: '2–3× pro Quartal empfohlen',
  items: [
    '1× Kaiser-Natron Pulver 250 g',
    '1× Allzweck-Spray 500 ml',
    '1× Spülmittel 500 ml',
  ],
  price: 24.9,
  memberPrice: 21.17,
  image: sampleImage,
  imageAlt: 'Haushalts-Bundle',
}

// For the "overflow" state — same bundle identity, extra items so the
// `+ N weitere` line renders.
const sampleWithOverflow = {
  ...sample,
  items: [
    ...sample.items,
    '1× Holste Wasch-Soda 500 g',
    '1× Allzweckreiniger 750 ml',
  ],
}
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.bundleCard.title')"
    :description="t('ds.bundleCard.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.default') }}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BundleCard v-bind="sample" @add="onAdd('default')" />
        <BundleCard
          v-bind="sample"
          badge="Bestseller"
          badge-variant="accent"
          @add="onAdd('bestseller')"
        />
        <BundleCard v-bind="sample" tone="cream" @add="onAdd('cream')" />
      </div>
      <p v-if="lastAdded" class="mt-5 text-sm text-muted">
        {{ t('ds.product.added') }}: <code class="font-mono text-[12px]">{{ lastAdded }}</code>
      </p>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Horizontal layout</h2>
      <p class="text-sm text-muted mb-5 max-w-2xl">
        Passed as <code class="font-mono text-[12px]">layout="horizontal"</code>. From
        <code class="font-mono text-[12px]">md</code> up the media takes ~38% of the row and
        the body fills the rest, with the CTA inlined next to the price block. Below
        <code class="font-mono text-[12px]">md</code> it collapses back to vertical.
      </p>
      <div class="grid gap-6">
        <BundleCard
          v-bind="sample"
          layout="horizontal"
          badge="Bestseller"
          badge-variant="accent"
          @add="onAdd('horizontal')"
        />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <p class="text-sm text-muted mb-5 max-w-2xl">
        Same bundle across both cards — only the state being demonstrated changes.
      </p>
      <div class="grid sm:grid-cols-2 gap-6">
        <!-- Out of stock -->
        <BundleCard v-bind="sample" :in-stock="false" />
        <!-- More than three items → "+ N weitere" overflow line -->
        <BundleCard v-bind="sampleWithOverflow" @add="onAdd('overflow')" />
      </div>
      <p class="mt-3 text-sm text-muted max-w-2xl">
        More than three items collapse the tail into a <code class="font-mono text-[12px]">+ N weitere</code>
        line so the card stays scannable.
      </p>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;BundleCard
  name="Haushalts-Bundle"
  usage="2–3× pro Quartal empfohlen"
  :items="[
    '1× Kaiser-Natron Pulver 250 g',
    '1× Allzweck-Spray 500 ml',
    '1× Spülmittel 500 ml',
  ]"
  :price="24.9"
  :member-price="21.17"
  image="/products/cutouts/…-removebg-preview.png"
  badge="Bestseller"
  badge-variant="accent"
  tone="paper"
  layout="horizontal"
  @add="addBundle(bundleId)"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
