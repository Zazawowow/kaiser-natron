<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import ProductCard from '@/design-system/components/ProductCard.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const lastAdded = ref('')
function onAdd(name) {
  lastAdded.value = name
  setTimeout(() => { if (lastAdded.value === name) lastAdded.value = '' }, 2000)
}

const imgPulver250 = '/products/cutouts/kaiser-natron-pulver-250-g-grosspackung-removebg-preview-1.png'
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.product.title')"
    :description="t('ds.product.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.default') }}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          title="Kaiser-Natron® Pulver"
          size="250 g Großpackung"
          :price="4.49"
          :image="imgPulver250"
          image-alt="Kaiser-Natron Pulver 250 g Großpackung"
          href="#"
          @add="onAdd('pulver-250')"
        />
        <ProductCard
          title="Kaiser-Natron® Pulver"
          size="250 g Großpackung"
          :price="4.49"
          :image="imgPulver250"
          :badge="t('ds.badges.featured')"
          badge-variant="accent"
          href="#"
          @add="onAdd('pulver-250-featured')"
        />
        <ProductCard
          title="Kaiser-Natron® Pulver"
          size="250 g Großpackung"
          :price="4.49"
          :image="imgPulver250"
          tone="cream"
          href="#"
          @add="onAdd('pulver-250-cream')"
        />
      </div>
      <p v-if="lastAdded" class="mt-5 text-sm text-muted">
        {{ t('ds.product.added') }}: <code class="font-mono text-[12px]">{{ lastAdded }}</code>
      </p>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          title="Kaiser-Natron® Pulver"
          size="250 g Großpackung"
          :price="4.49"
          :image="imgPulver250"
          :in-stock="false"
        />
        <ProductCard
          title="Kaiser-Natron® Pulver"
          size="250 g Großpackung"
          :price="4.49"
          :image="imgPulver250"
          :badge="t('ds.badges.newRelease')"
          badge-variant="brand"
          href="#"
        />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;ProductCard
  title="Kaiser-Natron® Pulver"
  size="250 g Großpackung"
  :price="4.49"
  image="/products/cutouts/…-removebg-preview.png"
  badge="Bestseller"
  badge-variant="accent"
  tone="paper"
  href="/kaiser-natron-pulver-250-g-grosspackung"
  @add="addToCart(sku)"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
