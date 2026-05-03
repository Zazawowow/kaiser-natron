<script setup>
/**
 * Step 3 — Shipping & billing addresses. Defaults billing to "same
 * as shipping" so the form stays short for the common case;
 * unchecking expands a second address block.
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/design-system/components/Input.vue'
import Button from '@/design-system/components/Button.vue'
import { useCheckoutStore } from '@/stores/checkout.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const checkout = useCheckoutStore()
const router = useRouter()

const error = ref('')

const countries = [
  { code: 'AT', label: 'Österreich' },
  { code: 'DE', label: 'Deutschland' },
  { code: 'CH', label: 'Schweiz' },
  { code: 'IT', label: 'Italien' },
  { code: 'FR', label: 'Frankreich' },
]

const addressIncomplete = computed(() => !checkout.shippingComplete)

function onSubmit() {
  error.value = ''
  if (addressIncomplete.value) {
    error.value = t('checkout.error.addressIncomplete')
    return
  }
  checkout.persist()
  router.push('/checkout/payment')
}
</script>

<template>
  <form class="flex flex-col gap-8" novalidate @submit.prevent="onSubmit">
    <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
      <div class="grid gap-5 md:grid-cols-2">
        <Input
          :model-value="checkout.shippingAddress.name"
          :label="t('checkout.field.name')"
          required
          @update:model-value="checkout.updateShipping({ name: $event })"
        />
        <Input
          :model-value="checkout.shippingAddress.company"
          :label="t('checkout.field.company')"
          @update:model-value="checkout.updateShipping({ company: $event })"
        />
        <div class="md:col-span-2">
          <Input
            :model-value="checkout.shippingAddress.street"
            :label="t('checkout.field.street')"
            required
            @update:model-value="checkout.updateShipping({ street: $event })"
          />
        </div>
        <Input
          :model-value="checkout.shippingAddress.postalCode"
          :label="t('checkout.field.postal')"
          required
          @update:model-value="checkout.updateShipping({ postalCode: $event })"
        />
        <Input
          :model-value="checkout.shippingAddress.city"
          :label="t('checkout.field.city')"
          required
          @update:model-value="checkout.updateShipping({ city: $event })"
        />
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
            {{ t('checkout.field.country') }}<span class="text-danger"> *</span>
          </label>
          <select
            :value="checkout.shippingAddress.country"
            required
            class="w-full rounded-sm border border-line bg-paper px-4 py-3 text-[15px] text-ink transition-colors duration-base focus:outline-none focus:border-brand"
            @change="checkout.updateShipping({ country: $event.target.value })"
          >
            <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.label }}</option>
          </select>
        </div>
        <Input
          :model-value="checkout.shippingAddress.phone"
          :label="t('checkout.field.phone')"
          type="tel"
          :hint="t('checkout.hint.phone')"
          @update:model-value="checkout.updateShipping({ phone: $event })"
        />
      </div>
    </section>

    <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
      <label class="inline-flex items-center gap-3 cursor-pointer select-none">
        <input
          :checked="checkout.billingSame"
          type="checkbox"
          class="w-5 h-5 rounded-xs border border-line accent-brand"
          @change="checkout.update({ billingSame: $event.target.checked })"
        />
        <span class="text-sm text-ink">{{ t('checkout.field.billingSame') }}</span>
      </label>
      <div v-if="!checkout.billingSame" class="grid gap-5 md:grid-cols-2">
        <Input
          :model-value="checkout.billingAddress.name"
          :label="t('checkout.field.name')"
          required
          @update:model-value="checkout.updateBilling({ name: $event })"
        />
        <Input
          :model-value="checkout.billingAddress.company"
          :label="t('checkout.field.company')"
          @update:model-value="checkout.updateBilling({ company: $event })"
        />
        <div class="md:col-span-2">
          <Input
            :model-value="checkout.billingAddress.street"
            :label="t('checkout.field.street')"
            required
            @update:model-value="checkout.updateBilling({ street: $event })"
          />
        </div>
        <Input
          :model-value="checkout.billingAddress.postalCode"
          :label="t('checkout.field.postal')"
          required
          @update:model-value="checkout.updateBilling({ postalCode: $event })"
        />
        <Input
          :model-value="checkout.billingAddress.city"
          :label="t('checkout.field.city')"
          required
          @update:model-value="checkout.updateBilling({ city: $event })"
        />
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
            {{ t('checkout.field.country') }}<span class="text-danger"> *</span>
          </label>
          <select
            :value="checkout.billingAddress.country"
            required
            class="w-full rounded-sm border border-line bg-paper px-4 py-3 text-[15px] text-ink transition-colors duration-base focus:outline-none focus:border-brand"
            @change="checkout.updateBilling({ country: $event.target.value })"
          >
            <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.label }}</option>
          </select>
        </div>
        <Input
          :model-value="checkout.billingAddress.phone"
          :label="t('checkout.field.phone')"
          type="tel"
          @update:model-value="checkout.updateBilling({ phone: $event })"
        />
      </div>
    </section>

    <p
      v-if="error"
      class="text-sm text-danger"
      role="alert"
      aria-live="polite"
    >{{ error }}</p>

  </form>

  <footer
    class="fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-line"
    role="contentinfo"
  >
    <div
      class="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 flex gap-3 sm:justify-between"
      :style="{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }"
    >
      <RouterLink to="/checkout/account" class="flex-1 sm:flex-initial">
        <Button variant="primary" size="lg" block type="button">
          {{ t('checkout.back') }}
        </Button>
      </RouterLink>
      <div class="flex-1 sm:flex-initial">
        <Button
          variant="accent"
          size="lg"
          block
          :disabled="addressIncomplete"
          @click="onSubmit"
        >{{ t('checkout.shipping.cta.continue') }}</Button>
      </div>
    </div>
  </footer>
</template>
