<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import QuantityStepper from '@/design-system/components/QuantityStepper.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const a = ref(1)
const b = ref(3)
const c = ref(5)
const d = ref(2)
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.qtyStepper.title')"
    :description="t('ds.qtyStepper.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.sizes') }}</h2>
      <div class="flex flex-wrap items-center gap-6">
        <QuantityStepper
          v-model="a"
          size="sm"
          :decrease-label="t('cart.qty.decrease')"
          :increase-label="t('cart.qty.increase')"
        />
        <QuantityStepper
          v-model="b"
          size="md"
          :decrease-label="t('cart.qty.decrease')"
          :increase-label="t('cart.qty.increase')"
        />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col gap-2">
          <span class="eyebrow">{{ t('ds.qtyStepper.minBoundary') }}</span>
          <QuantityStepper
            :model-value="0"
            :min="0"
            :decrease-label="t('cart.qty.decrease')"
            :increase-label="t('cart.qty.increase')"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="eyebrow">{{ t('ds.qtyStepper.maxBoundary') }}</span>
          <QuantityStepper
            v-model="c"
            :max="5"
            :decrease-label="t('cart.qty.decrease')"
            :increase-label="t('cart.qty.increase')"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="eyebrow">{{ t('ds.buttons.disabled') }}</span>
          <QuantityStepper
            v-model="d"
            disabled
            :decrease-label="t('cart.qty.decrease')"
            :increase-label="t('cart.qty.increase')"
          />
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;QuantityStepper
  v-model="quantity"
  :min="0"
  :max="10"
  decrease-label="Menge verringern"
  increase-label="Menge erhöhen"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
