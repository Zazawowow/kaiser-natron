<script setup>
import { ref, computed } from 'vue'
import SectionShell from './SectionShell.vue'
import CheckoutStepper from '@/design-system/components/CheckoutStepper.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const activeKey = ref('shipping')

const steps = computed(() => [
  { key: 'cart', label: t('checkout.step.cart'), to: '/checkout/cart', completed: true },
  { key: 'account', label: t('checkout.step.account'), to: '/checkout/account', completed: true },
  { key: 'shipping', label: t('checkout.step.shipping'), to: '/checkout/shipping', completed: false },
  { key: 'payment', label: t('checkout.step.payment'), to: '/checkout/payment', completed: false },
])

const stepKeys = ['cart', 'account', 'shipping', 'payment']
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.checkoutStepper.title')"
    :description="t('ds.checkoutStepper.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <div class="flex flex-col gap-6">
        <div
          v-for="key in stepKeys"
          :key="key"
          class="rounded-md border border-line bg-paper p-6 flex flex-col gap-3"
        >
          <p class="eyebrow text-muted">{{ t(`checkout.step.${key}`) }} active</p>
          <CheckoutStepper :steps="steps" :active-key="key" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.interactive') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="key in stepKeys"
            :key="key"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-pill border text-[12px] font-semibold tracking-label',
              activeKey === key
                ? 'bg-brand text-cream border-brand'
                : 'bg-paper text-brand border-line hover:border-brand',
            ]"
            @click="activeKey = key"
          >{{ t(`checkout.step.${key}`) }}</button>
        </div>
        <CheckoutStepper :steps="steps" :active-key="activeKey" />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;CheckoutStepper
  :steps="steps"
  :active-key="activeKey"
/&gt;

// steps: [{ key, label, to, completed }, ...]</pre>
      </div>
    </section>
  </SectionShell>
</template>
