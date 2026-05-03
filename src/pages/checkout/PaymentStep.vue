<script setup>
/**
 * Step 4 — Payment. Express wallet buttons up top (Apple Pay /
 * Google Pay) for one-tap finish, the Stripe Payment Element below
 * for the regular flow. Two-phase submit — first click requests an
 * intent from the API, second click confirms via Stripe.js.
 */
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/design-system/components/Button.vue'
import StripePaymentMount from '@/design-system/components/StripePaymentMount.vue'
import ExpressCheckoutMount from '@/design-system/components/ExpressCheckoutMount.vue'
import {
  createCheckoutIntent,
  createExpressIntent,
  clearCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useCheckoutStore } from '@/stores/checkout.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const checkout = useCheckoutStore()
const router = useRouter()

const intent = ref(null)
const submitting = ref(false)
const submitError = ref('')

const expressIntent = ref(null)
const expressBusy = ref(false)
const paymentMountRef = ref(null)
const expressMountRef = ref(null)

const ctaLabel = computed(() =>
  intent.value ? t('checkout.cta.pay') : t('checkout.cta.review'),
)

const returnUrl = computed(() => {
  if (typeof window === 'undefined') return '/checkout/processing'
  return `${window.location.origin}/checkout/processing?order=${intent.value?.orderId || ''}`
})

async function placeOrder() {
  submitError.value = ''
  if (!cart.items.length) {
    submitError.value = t('checkout.error.empty')
    return
  }

  submitting.value = true
  try {
    if (!intent.value) {
      const billing = checkout.billingSame
        ? checkout.shippingAddress
        : checkout.billingAddress
      const response = await createCheckoutIntent({
        email: checkout.email,
        shippingAddress: checkout.shippingAddress,
        billingAddress: billing,
        acceptsMarketing: checkout.acceptsMarketing,
      })
      intent.value = response
      submitting.value = false
      return
    }

    const result = await paymentMountRef.value?.confirm()
    if (result?.error) {
      submitError.value = result.error.message || t('checkout.error.payment')
      return
    }
    if (result?.paymentIntent?.status === 'succeeded') {
      const orderId = intent.value.orderId
      await clearCart()
      checkout.reset()
      router.push({ path: '/checkout/success', query: { order: orderId } })
      return
    }
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
  } finally {
    submitting.value = false
  }
}

async function placeExpress({ wallet }) {
  if (!cart.items.length) {
    submitError.value = t('checkout.error.empty')
    return
  }
  submitError.value = ''
  expressBusy.value = true
  try {
    const response = await createExpressIntent({ wallet })
    expressIntent.value = response
    await nextTick()
    const result = await expressMountRef.value?.confirm()
    if (result?.error) {
      submitError.value = result.error.message || t('checkout.error.payment')
      return
    }
    if (result?.paymentIntent?.status === 'succeeded') {
      const orderId = response.orderId
      await clearCart()
      checkout.reset()
      router.push({ path: '/checkout/success', query: { order: orderId } })
    }
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
  } finally {
    expressBusy.value = false
  }
}

function onExpressError(err) {
  submitError.value = err?.message || t('checkout.error.payment')
  expressBusy.value = false
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <section class="rounded-md border border-line bg-paper p-6 md:p-8">
      <ExpressCheckoutMount
        ref="expressMountRef"
        :intent="expressIntent"
        :return-url="returnUrl"
        :busy="expressBusy"
        @pay="placeExpress"
        @error="onExpressError"
      />
    </section>

    <section class="rounded-md border border-line bg-paper p-6 md:p-8">
      <StripePaymentMount
        ref="paymentMountRef"
        :intent="intent"
        :return-url="returnUrl"
      />
    </section>

    <p
      v-if="submitError"
      class="text-sm text-danger"
      role="alert"
      aria-live="polite"
    >{{ submitError }}</p>

  </section>

  <footer
    class="fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-line"
    role="contentinfo"
  >
    <div
      class="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 flex gap-3 sm:justify-between"
      :style="{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }"
    >
      <RouterLink to="/checkout/shipping" class="flex-1 sm:flex-initial">
        <Button variant="primary" size="lg" block type="button">
          {{ t('checkout.back') }}
        </Button>
      </RouterLink>
      <div class="flex-1 sm:flex-initial">
        <Button
          variant="accent"
          size="lg"
          block
          :loading="submitting"
          :disabled="!cart.items.length"
          @click="placeOrder"
        >{{ ctaLabel }}</Button>
      </div>
    </div>
  </footer>
</template>
