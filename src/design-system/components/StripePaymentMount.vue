<script setup>
/**
 * StripePaymentMount — host element for Stripe's Payment Element,
 * with a built-in mock mode for development and design review.
 *
 * Three runtime states:
 *
 *   1. No intent yet            → design placeholder card.
 *   2. Mock intent (clientSecret prefixed `pi_stub_`)
 *                              → renders a faux card-entry form
 *                                (card number / expiry / CVC).
 *                                `confirm()` validates basic
 *                                shape and resolves with a fake
 *                                success after a short delay so
 *                                the rest of the checkout flow
 *                                (success page, cart clearing)
 *                                can be exercised end-to-end.
 *   3. Real intent              → loads `@stripe/stripe-js`,
 *                                instantiates Elements with the
 *                                clientSecret, mounts the Payment
 *                                Element into the host node.
 *                                `confirm()` calls
 *                                `stripe.confirmPayment(...)`.
 *
 * The Payment Element (not the deprecated Card Element) is the
 * right surface — single component covers cards, SEPA, Apple Pay,
 * Google Pay; themed via the `appearance` API to match the DS
 * (brand green / white / Zeitung / 10px radius).
 *
 * The parent (`CheckoutPage`) calls `confirm()` on this component
 * via `defineExpose`. The return shape mirrors `stripe.confirmPayment`:
 *   { error?: { message: string }, paymentIntent?: { id, status } }
 * — so the page handles real and mock the same way.
 */
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Input from './Input.vue'

const props = defineProps({
  /** CheckoutIntent response from the API; `null` while pending. */
  intent: {
    type: Object,
    default: null,
  },
  /** URL Stripe redirects the customer to after a successful
   *  confirm. Should land on a "processing/success" page that
   *  polls `confirmCheckout({ orderId })`. */
  returnUrl: {
    type: String,
    required: true,
  },
})

defineEmits(['ready', 'error'])

// Refs to the Stripe.js + Elements instances. Held at module scope
// of the component so `confirm()` can use them without re-creating.
const stripeRef = ref(null)
const elementsRef = ref(null)
const ready = ref(false)
const loadError = ref('')

// Mock state — driven entirely by the clientSecret prefix. Stub
// secrets emitted by `src/api/checkout.js` start with `pi_stub_`,
// so the page can flip into mock mode without an extra prop.
const isMock = computed(() => /^pi_stub_/.test(props.intent?.clientSecret || ''))
const card = ref({ number: '', expiry: '', cvc: '' })
const cardErrors = ref({})

// Strip everything but digits and group into 4-char blocks for
// readability while typing. The mock doesn't validate against
// Luhn / specific BIN ranges — any 13-19 digit string passes.
function formatCardNumber(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
function onCardInput(field, raw) {
  if (field === 'number') card.value.number = formatCardNumber(raw)
  else if (field === 'expiry') card.value.expiry = formatExpiry(raw)
  else card.value.cvc = String(raw).replace(/\D/g, '').slice(0, 4)
  // Clear field-level error as soon as the user retries.
  if (cardErrors.value[field]) delete cardErrors.value[field]
}

async function mountElement() {
  if (!props.intent || typeof window === 'undefined') return
  // Mock intents skip Stripe.js — the mock form below handles the
  // payment surface and `confirm()` simulates success.
  if (isMock.value) {
    ready.value = true
    return
  }
  try {
    // Lazy import — keeps Stripe out of the initial bundle AND
    // lets us defer adding `@stripe/stripe-js` to package.json
    // until the backend integration lands. Vite's dev-server
    // import-analysis ignores the `@vite-ignore` hint for dynamic
    // imports, so the specifier is built at runtime (the parts
    // are joined per-call) — that's fully opaque to static
    // analysis. Build & dev-server both succeed when the package
    // isn't installed; once the user reaches the payment step a
    // runtime "module not found" surfaces in the UI's `loadError`
    // state for clear diagnosis. Backend dev: `npm i @stripe/stripe-js`.
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
          colorDanger: '#b23a2a',
          fontFamily: '"Zeitung", ui-sans-serif, system-ui, -apple-system, Arial, sans-serif',
          borderRadius: '10px',
          spacingUnit: '4px',
        },
        rules: {
          '.Input': {
            border: '1px solid color-mix(in srgb, #006548 11%, transparent)',
            boxShadow: 'none',
            padding: '12px 16px',
          },
          '.Input:focus': {
            border: '1px solid #006548',
            boxShadow: 'none',
          },
          '.Label': {
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'color-mix(in oklch, #006548, white 35%)',
          },
        },
      },
    })
    elementsRef.value = elements

    const paymentElement = elements.create('payment', {
      layout: { type: 'tabs', defaultCollapsed: false },
    })
    paymentElement.mount('#stripe-payment-element')
    paymentElement.on('ready', () => {
      ready.value = true
      // Surface to parent so it can flip its loading state if any.
      // eslint-disable-next-line vue/no-mutating-props
    })
    paymentElement.on('loaderror', (e) => {
      loadError.value = e?.error?.message || 'Failed to load payment form.'
    })
  } catch (err) {
    loadError.value = err?.message || String(err)
  }
}

/**
 * Confirm the payment. Parent calls this on form submit. Returns
 * `{ error?: { message }, paymentIntent? }` — same shape regardless
 * of mock or real Stripe so the page logic stays uniform.
 *
 * Mock branch:
 *   - Validates the three fields are present + roughly the right
 *     length. Surfaces field errors back to the form.
 *   - Simulates a 600ms network round-trip then resolves with
 *     `{ paymentIntent: { id, status: 'succeeded' } }` so the
 *     parent can navigate to the success page and clear the cart.
 *   - Does NOT redirect the browser (Stripe normally would on
 *     success); the page handles routing itself in mock mode.
 *
 * Real branch:
 *   - Defers to `stripe.confirmPayment(...)`. Stripe redirects to
 *     `return_url` on success; on local errors (e.g. validation,
 *     `payment.declined`) the promise resolves with an `error`
 *     object the page renders inline.
 */
async function confirm() {
  if (isMock.value) {
    const errs = {}
    const digits = card.value.number.replace(/\s+/g, '')
    if (digits.length < 13) errs.number = 'Bitte vollständige Kartennummer eingeben.'
    if (!/^\d{2}\/\d{2}$/.test(card.value.expiry)) errs.expiry = 'MM/JJ'
    if (card.value.cvc.length < 3) errs.cvc = 'CVC fehlt'
    cardErrors.value = errs
    if (Object.keys(errs).length) {
      return { error: { message: 'Bitte Kartendaten prüfen.' } }
    }
    // Simulated network delay so the loading state is visible.
    await new Promise((r) => setTimeout(r, 600))
    return {
      paymentIntent: {
        id: (props.intent.clientSecret || '').split('_secret_')[0] || 'pi_stub',
        status: 'succeeded',
      },
    }
  }

  if (!stripeRef.value || !elementsRef.value) {
    return { error: { message: 'Payment form not ready.' } }
  }
  return stripeRef.value.confirmPayment({
    elements: elementsRef.value,
    confirmParams: {
      return_url: props.returnUrl,
    },
  })
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
  // Stripe Elements clean themselves up when their container is
  // removed, but null the refs so a re-mount creates a fresh
  // Elements instance with the next clientSecret.
  stripeRef.value = null
  elementsRef.value = null
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Mock card form. Active whenever the intent's clientSecret
         looks like a stub (`pi_stub_*`). Mirrors the visual
         hierarchy of the real Stripe Payment Element (eyebrow
         labels, soft border, brand focus ring) so the page reads
         the same way once the real Element takes over. The fields
         use the existing DS `Input` so styling, focus and error
         states stay consistent with the rest of the form above. -->
    <div
      v-if="isMock"
      class="flex flex-col gap-4 rounded-sm border border-line bg-paper p-5"
    >
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <p class="eyebrow">Karte</p>
        <p class="text-[11px] text-muted">Demo · keine echte Belastung</p>
      </div>
      <Input
        :model-value="card.number"
        label="Kartennummer"
        placeholder="4242 4242 4242 4242"
        :error="cardErrors.number"
        required
        @update:model-value="onCardInput('number', $event)"
      />
      <div class="grid grid-cols-2 gap-4">
        <Input
          :model-value="card.expiry"
          label="Ablauf"
          placeholder="MM/JJ"
          :error="cardErrors.expiry"
          required
          @update:model-value="onCardInput('expiry', $event)"
        />
        <Input
          :model-value="card.cvc"
          label="CVC"
          placeholder="123"
          :error="cardErrors.cvc"
          required
          @update:model-value="onCardInput('cvc', $event)"
        />
      </div>
    </div>

    <!-- Real Payment Element mount. Stripe injects an iframe here
         once `mountElement()` runs; the iframe carries Stripe's PCI-
         compliant card input + alternative payment methods. We never
         see raw card numbers in our DOM. -->
    <div
      v-else-if="intent"
      id="stripe-payment-element"
      class="rounded-sm border border-line bg-paper p-4 min-h-[280px]"
      :class="{ 'opacity-60': !ready }"
      aria-live="polite"
    />

    <p v-if="loadError" class="text-[13px] text-danger">{{ loadError }}</p>

    <!-- Design-time placeholder — renders before the page has
         requested a CheckoutIntent. Mirrors the rough shape of the
         eventual Payment Element so the layout reads end-to-end. -->
    <div
      v-if="!intent"
      class="flex flex-col gap-4 rounded-sm border border-dashed border-line-strong bg-paper p-6"
      role="presentation"
      aria-hidden="true"
    >
      <p class="eyebrow">Zahlung</p>
      <p class="text-[13px] text-muted leading-relaxed">
        Das Zahlungsformular erscheint nach dem nächsten Schritt.
      </p>
      <div class="flex flex-col gap-3 opacity-60">
        <div class="h-3 rounded-xs bg-brand-wash w-1/3" />
        <div class="h-12 rounded-sm bg-cream border border-line" />
        <div class="h-3 rounded-xs bg-brand-wash w-1/4" />
        <div class="grid grid-cols-2 gap-3">
          <div class="h-12 rounded-sm bg-cream border border-line" />
          <div class="h-12 rounded-sm bg-cream border border-line" />
        </div>
      </div>
    </div>
  </div>
</template>
