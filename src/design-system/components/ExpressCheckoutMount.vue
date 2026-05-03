<script setup>
/**
 * ExpressCheckoutMount — wallet-button surface for Apple Pay /
 * Google Pay one-click checkout. Sibling to StripePaymentMount;
 * the shape mirrors it on purpose so both surfaces feel like one
 * boundary to the rest of the app.
 *
 * Three runtime states:
 *
 *   1. No intent yet            → renders the two wallet buttons
 *                                (Apple / Google). Clicking emits
 *                                `pay({ wallet })` so the parent
 *                                can call `createExpressIntent` and
 *                                pass the response back as `:intent`.
 *   2. Mock intent (clientSecret prefixed `pi_stub_express_`)
 *                              → resolves immediately as success
 *                                so the rest of the flow (success
 *                                page, cart clearing) is exercisable
 *                                end-to-end.
 *   3. Real intent              → loads `@stripe/stripe-js`,
 *                                instantiates Elements with the
 *                                clientSecret, mounts the *Express
 *                                Checkout Element* into the host
 *                                node. Stripe renders the official
 *                                Apple Pay / Google Pay / Link
 *                                buttons (HIG-compliant) and drives
 *                                the wallet sheet end-to-end.
 *
 * The Express Checkout Element is the right Stripe surface for
 * wallet buttons that live *outside* the full Payment Element —
 * it's purpose-built for one-click flows on PDPs, carts, and the
 * top of a checkout page.
 *
 * Real-mode confirm flow follows Stripe's Express Element contract:
 *   element.on('confirm', async () => {
 *     await stripe.confirmPayment({ elements, clientSecret,
 *       confirmParams: { return_url } })
 *     // Stripe redirects on success.
 *   })
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  /** CheckoutIntent response from `createExpressIntent`; `null`
   *  before the user taps a wallet button. */
  intent: {
    type: Object,
    default: null,
  },
  /** URL Stripe redirects to after a successful wallet confirm. */
  returnUrl: {
    type: String,
    required: true,
  },
  /** When true, the buttons render in a disabled state — used
   *  while the intent is being created or confirmed. */
  busy: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['pay', 'error'])

// Stripe.js + Elements instances; held at component scope so
// re-mounts can null them and rebuild cleanly.
const stripeRef = ref(null)
const elementsRef = ref(null)
const ready = ref(false)
const loadError = ref('')

const isMock = computed(() =>
  /^pi_stub_express_/.test(props.intent?.clientSecret || ''),
)

function onWalletClick(wallet) {
  if (props.busy || props.intent) return
  emit('pay', { wallet })
}

async function mountElement() {
  if (!props.intent || typeof window === 'undefined') return
  // Mock skips Stripe.js — `confirm()` simulates success below.
  if (isMock.value) {
    ready.value = true
    return
  }
  try {
    // Lazy-import keeps Stripe out of the initial bundle and lets
    // us defer adding `@stripe/stripe-js` to package.json until the
    // backend integration lands. Same approach as StripePaymentMount.
    const stripeSpecifier = ['@stripe', 'stripe-js'].join('/')
    const stripeModule = await import(/* @vite-ignore */ stripeSpecifier)
    const { loadStripe } = stripeModule
    const stripe = await loadStripe(props.intent.publishableKey)
    if (!stripe) throw new Error('Stripe.js failed to initialise.')
    stripeRef.value = stripe

    const elements = stripe.elements({
      clientSecret: props.intent.clientSecret,
      appearance: {
        theme: 'flat',
        variables: {
          colorPrimary: '#006548',
          colorBackground: '#ffffff',
          colorText: '#0f3825',
          fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
          borderRadius: '10px',
          spacingUnit: '4px',
        },
      },
    })
    elementsRef.value = elements

    const expressElement = elements.create('expressCheckout', {
      buttonType: { applePay: 'buy', googlePay: 'buy' },
      buttonTheme: { applePay: 'black', googlePay: 'black' },
      buttonHeight: 48,
    })
    expressElement.mount('#express-checkout-element')
    expressElement.on('ready', () => {
      ready.value = true
    })
    expressElement.on('loaderror', (e) => {
      loadError.value = e?.error?.message || 'Failed to load wallet buttons.'
    })
    expressElement.on('confirm', async () => {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: props.intent.clientSecret,
        confirmParams: { return_url: props.returnUrl },
      })
      if (result?.error) emit('error', result.error)
      // Stripe redirects on success; nothing further to do here.
    })
  } catch (err) {
    loadError.value = err?.message || String(err)
  }
}

/**
 * Confirm a mock express payment. Real mode redirects via Stripe's
 * `confirm` event handler above, so the parent only needs to call
 * this in mock mode after the intent prop lands.
 *
 * Same return shape as `stripe.confirmPayment`:
 *   { error?: { message }, paymentIntent?: { id, status } }
 */
async function confirm() {
  if (!props.intent) return { error: { message: 'No intent.' } }
  if (isMock.value) {
    await new Promise((r) => setTimeout(r, 600))
    return {
      paymentIntent: {
        id: (props.intent.clientSecret || '').split('_secret_')[0] || 'pi_stub',
        status: 'succeeded',
      },
    }
  }
  return { error: { message: 'Express confirm is driven by Stripe.' } }
}

defineExpose({ confirm, ready })

onMounted(() => {
  if (props.intent) mountElement()
})
watch(
  () => props.intent?.clientSecret,
  (next) => {
    if (next) mountElement()
  },
)
onBeforeUnmount(() => {
  stripeRef.value = null
  elementsRef.value = null
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Real Express Element mount. Stripe injects the official
         wallet buttons (HIG-compliant Apple Pay, branded Google
         Pay, optional Link) once `mountElement()` runs. Buttons
         only render on browsers/devices where the wallet is
         actually available. -->
    <div
      v-if="intent && !isMock"
      id="express-checkout-element"
      class="min-h-[52px]"
      :class="{ 'opacity-60': !ready }"
      aria-live="polite"
    />

    <!-- Mock buttons. Rendered until a non-stub intent lands.
         Logos are inline SVGs (Apple wordmark glyph + Google "G")
         so we don't need to ship brand assets through the icon
         set; the real Stripe element replaces these once wired. -->
    <div v-else class="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-sm bg-ink h-12 px-5 text-paper transition-colors duration-base hover:bg-brand disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="busy"
        :aria-label="t('checkout.express.applePay.aria')"
        @click="onWalletClick('apple')"
      >
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M14.94 11.36c-.02-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.94-3.61-1.96-1.54-.16-3 .9-3.78.9-.78 0-1.98-.88-3.26-.86-1.68.02-3.23.97-4.1 2.47-1.74 3.02-.45 7.5 1.25 9.95.83 1.2 1.82 2.55 3.12 2.5 1.25-.05 1.72-.81 3.23-.81 1.51 0 1.93.81 3.25.78 1.34-.02 2.2-1.22 3.02-2.43.95-1.4 1.34-2.75 1.36-2.82-.03-.01-2.61-1-2.61-3.96zM12.6 4.05c.7-.85 1.16-2.02 1.04-3.18-1 .04-2.21.66-2.93 1.5-.65.74-1.21 1.93-1.06 3.07 1.11.09 2.25-.56 2.95-1.39z"
          />
        </svg>
        <span class="text-[14px] font-medium tracking-tight">Pay</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-sm bg-ink h-12 px-5 text-paper transition-colors duration-base hover:bg-brand disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="busy"
        :aria-label="t('checkout.express.googlePay.aria')"
        @click="onWalletClick('google')"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M19.6 10.23c0-.68-.06-1.36-.18-2.03H10v3.84h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.22c1.89-1.74 2.98-4.31 2.98-7.34z"
            fill="#4285F4"
          />
          <path
            d="M10 20c2.7 0 4.97-.89 6.62-2.42l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.81-1.76-5.6-4.13H1.07v2.59A10 10 0 0 0 10 20z"
            fill="#34A853"
          />
          <path
            d="M4.4 11.91a6 6 0 0 1 0-3.83V5.5H1.07a10 10 0 0 0 0 9l3.33-2.59z"
            fill="#FBBC04"
          />
          <path
            d="M10 3.96a5.4 5.4 0 0 1 3.83 1.5l2.85-2.85A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.07 5.5L4.4 8.08C5.19 5.71 7.4 3.96 10 3.96z"
            fill="#EA4335"
          />
        </svg>
        <span class="text-[14px] font-medium tracking-tight">Pay</span>
      </button>
    </div>

    <p v-if="loadError" class="text-[13px] text-danger">{{ loadError }}</p>
  </div>
</template>
