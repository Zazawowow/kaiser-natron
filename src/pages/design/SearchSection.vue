<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import Search from '@/design-system/components/Search.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import { products, searchProducts } from '@/api/products.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const demoOpen = ref(false)

// Static preview of a canned query, so the showcase communicates the
// output shape without requiring the reader to open the live overlay.
const previewQuery = 'natron pulver'
const previewResults = searchProducts(previewQuery, products, 4)
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.search.title')"
    :description="t('ds.search.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.default') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="primary" @click="demoOpen = true">
          <template #before>
            <Icon name="search" :size="18" />
          </template>
          {{ t('ds.search.demo.label') }}
        </Button>
        <p class="text-[13px] text-muted">{{ t('ds.search.demo.hint') }}</p>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.variants') }} — "{{ previewQuery }}"</h2>
      <ul class="rounded-md border border-line bg-paper divide-y divide-line overflow-hidden">
        <li
          v-for="product in previewResults"
          :key="product.id"
          class="flex items-center gap-4 px-4 py-3"
        >
          <img
            :src="product.image"
            :alt="product.title"
            loading="lazy"
            decoding="async"
            class="shrink-0 w-12 h-12 rounded-sm object-cover bg-cream"
          />
          <div class="min-w-0 flex-1">
            <p class="text-[14px] font-semibold text-ink truncate">{{ product.title }}</p>
            <p class="text-[12px] text-muted truncate">{{ product.size }} · {{ product.category }}</p>
          </div>
          <span class="shrink-0 text-[13px] font-semibold text-brand">€ {{ product.price.toFixed(2).replace('.', ',') }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">import { products } from '@/api/products.js'
import Search from '@/design-system/components/Search.vue'

const open = ref(false)

&lt;Search v-model:open="open" :products="products" /&gt;

// Navbar already renders its own Search overlay, so most callers
// just pass the catalogue in:

&lt;Navbar :products="products" /&gt;</pre>
      </div>
    </section>

    <Search v-model:open="demoOpen" :products="products" />
  </SectionShell>
</template>
