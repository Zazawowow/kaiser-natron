<script setup>
/**
 * CheckoutPage — the single-page checkout. Three logical blocks:
 *
 *   1. Contact      — email
 *   2. Shipping     — address fields
 *   3. Billing      — same as shipping toggle, otherwise full fields
 *   4. Payment      — Stripe Payment Element mount (themed)
 *
 * Right column (lg+) is the order summary, sticky so it stays
 * visible as the form scrolls. On md and below the summary stacks
 * above the form so the user sees what they're paying for first.
 *
 * Submit flow:
 *   1. User fills form, clicks Place order.
 *   2. We call `createCheckoutIntent(...)` — backend returns
 *      `{ orderId, clientSecret, publishableKey }`.
 *   3. The intent flips into the page state, which prompts the
 *      `<StripePaymentMount>` to load Stripe.js, instantiate
 *      Elements, and mount the Payment Element.
 *   4. User finishes card / SEPA / Apple Pay capture in the
 *      Stripe iframe and clicks Place order again — the page
 *      calls `paymentMountRef.value.confirm()`, which triggers
 *      `stripe.confirmPayment(...)`. Stripe redirects the
 *      browser to `return_url` on success.
 *   5. The return-url page polls `confirmCheckout({ orderId })`
 *      to fetch the final Order. (Not built here — out of scope
 *      for this draft.)
 *
 * No backend? No problem: the API stub returns a synthetic intent,
 * and the Stripe component falls back to a placeholder card so
 * the page is fully reviewable for design.
 */
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import Navbar from '@/design-system/components/Navbar.vue'
import Input from '@/design-system/components/Input.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import CheckoutSummary from '@/design-system/components/CheckoutSummary.vue'
import StripePaymentMount from '@/design-system/components/StripePaymentMount.vue'
import ExpressCheckoutMount from '@/design-system/components/ExpressCheckoutMount.vue'
import {
  products,
  fetchCart,
  createCheckoutIntent,
  createExpressIntent,
  clearCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()

// Site-wide nav split mirrors the rest of the app.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]
const navSecondaryItems = []

// `--nav-h` is defaulted in global styles; this ResizeObserver
// refines it so the sticky order summary's `top` offset matches
// the real navbar height.
const navRef = ref(null)
let navResizeObserver = null
function syncNavHeight() {
  const el = navRef.value
  const node = el && (el.$el || el)
  if (!node || typeof window === 'undefined') return
  const h = Math.round(node.getBoundingClientRect().height)
  document.documentElement.style.setProperty('--nav-h', `${h}px`)
}

// ─── Form state ────────────────────────────────────────────────────
// One flat object so each field is a primitive — easier to reason
// about and to validate. Backend expects `Address` shape exactly,
// so the keys mirror the contract in `docs/api/checkout.md`.
const form = ref({
  email: '',
  acceptsMarketing: false,
  billingSame: true,
  shippingAddress: {
    name: '',
    company: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'AT',
    phone: '',
  },
  billingAddress: {
    name: '',
    company: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'AT',
    phone: '',
  },
})

// Per-field errors. Populated when the API responds with an
// `address.invalid` style error or when the local guard catches
// a missing required field on submit.
const errors = ref({})

// CheckoutIntent (response from the API). Until the user clicks
// Place order, this is null and the StripePaymentMount renders the
// design placeholder. Setting it triggers Stripe Elements to mount.
const intent = ref(null)
const submitting = ref(false)
const submitError = ref('')

const paymentMountRef = ref(null)
const expressMountRef = ref(null)
// Separate intent + busy state for the express path so a wallet
// confirmation in flight doesn't block the regular form submit and
// vice-versa.
const expressIntent = ref(null)
const expressBusy = ref(false)

// Country options. ISO-3166 alpha-2 codes; backend validates against
// its own canonical list. Order is by frequency for our market.
const countries = [
  { code: 'AT', label: 'Österreich' },
  { code: 'DE', label: 'Deutschland' },
  { code: 'CH', label: 'Schweiz' },
  { code: 'IT', label: 'Italien' },
  { code: 'FR', label: 'Frankreich' },
]

// Totals: shown in the summary panel. While the backend hasn't
// confirmed yet, we mirror the stub's flat-rate calculation so the
// number on screen matches what the API will compute. The intent
// response is the source of truth once it lands.
const subtotal = computed(() => cart.subtotal)
const shipping = computed(() => (cart.items.length ? 4.9 : 0))
const tax = computed(() =>
  cart.items.length ? +(((subtotal.value + shipping.value) * 0.19) / 1.19).toFixed(2) : 0,
)
const total = computed(() => +(subtotal.value + shipping.value).toFixed(2))

// Submit handler. Two-phase:
//   • No intent yet → request one from the API. UI rerenders with
//     the Payment Element mounted; user enters card details.
//   • Intent present → hand off to Stripe.js for confirmPayment.
async function placeOrder() {
  submitError.value = ''
  if (!cart.items.length) {
    submitError.value = t('checkout.error.empty')
    return
  }

  submitting.value = true
  try {
    if (!intent.value) {
      const billing = form.value.billingSame
        ? form.value.shippingAddress
        : form.value.billingAddress
      const response = await createCheckoutIntent({
        email: form.value.email,
        shippingAddress: form.value.shippingAddress,
        billingAddress: billing,
        acceptsMarketing: form.value.acceptsMarketing,
      })
      intent.value = response
      submitting.value = false
      return
    }

    // Second click — confirm the payment.
    //
    // Real Stripe path: Stripe.js redirects the browser to
    // `return_url` on success and we never reach the lines below.
    //
    // Mock path (StripePaymentMount detects the stub clientSecret):
    // resolves locally with `{ paymentIntent: { status:
    // 'succeeded' } }` so we handle the post-success transitions
    // ourselves — clear the cart, route to the thank-you page
    // with the orderId so it can call `confirmCheckout()` for the
    // final order shape.
    const result = await paymentMountRef.value?.confirm()
    if (result?.error) {
      submitError.value = result.error.message || t('checkout.error.payment')
      return
    }
    if (result?.paymentIntent?.status === 'succeeded') {
      const orderId = intent.value.orderId
      await clearCart()
      router.push({ path: '/checkout/success', query: { order: orderId } })
      return
    }
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
    if (err?.code === 'checkout.addressInvalid') {
      // The stub throws once the first missing field is found —
      // surface it generically until the backend returns a fielded
      // error response.
      errors.value.shippingAddress = err.message
    }
  } finally {
    submitting.value = false
  }
}

// Wallet (Apple Pay / Google Pay) one-click handler. Mirrors the
// regular `placeOrder` two-phase shape: first call gets an intent
// from the API, second confirms. In real Stripe mode the Express
// Element drives confirmation itself via its own `confirm` event;
// here we re-use the mock branch so design review covers the
// success page + cart clearing end-to-end.
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
    // Wait for the mount to observe the new intent prop before
    // calling confirm — mirrors the real flow where Stripe needs
    // Elements bound to the clientSecret first.
    await nextTick()
    const result = await expressMountRef.value?.confirm()
    if (result?.error) {
      submitError.value = result.error.message || t('checkout.error.payment')
      return
    }
    if (result?.paymentIntent?.status === 'succeeded') {
      const orderId = response.orderId
      await clearCart()
      router.push({ path: '/checkout/success', query: { order: orderId } })
    }
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
  } finally {
    expressBusy.value = false
  }
}

function onExpressError(error) {
  submitError.value = error?.message || t('checkout.error.payment')
  expressBusy.value = false
}

const ctaLabel = computed(() =>
  intent.value ? t('checkout.cta.pay') : t('checkout.cta.continue'),
)

const returnUrl = computed(() => {
  if (typeof window === 'undefined') return '/checkout/processing'
  return `${window.location.origin}/checkout/processing?order=${intent.value?.orderId || ''}`
})

onMounted(() => {
  fetchCart()
  syncNavHeight()
  if (typeof ResizeObserver !== 'undefined' && navRef.value) {
    const node = navRef.value.$el || navRef.value
    navResizeObserver = new ResizeObserver(syncNavHeight)
    navResizeObserver.observe(node)
  }
  window.addEventListener('resize', syncNavHeight)
})
onBeforeUnmount(() => {
  if (navResizeObserver) navResizeObserver.disconnect()
  if (typeof window !== 'undefined') window.removeEventListener('resize', syncNavHeight)
})
</script>

<template>
  <Navbar
    ref="navRef"
    variant="paper"
    layout="standard"
    :items="navItems"
    :secondary-items="navSecondaryItems"
    :cart-count="cart.count"
    :products="products"
  />

  <!-- Page surface. Cream ground keeps the rhythm with home/shop;
       the form/summary cards sit on `bg-paper` for separation. -->
  <main class="bg-cream text-ink min-h-svh">
    <div class="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
      <!-- Page heading. Banner-style mixed font, matches
           Hero/About — preserves the typographic rhythm of the
           rest of the site even on a transactional page. -->
      <header class="flex flex-col gap-3 max-w-3xl mb-10 md:mb-14">
        <p class="eyebrow">{{ t('checkout.eyebrow') }}</p>
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md">
          {{ t('checkout.headline') }}
          <em class="italic font-light text-brand">{{ t('checkout.headline.em') }}</em>
        </h1>
        <p class="text-base leading-relaxed text-muted max-w-xl">
          {{ t('checkout.sub') }}
        </p>
      </header>

      <!-- Mobile-first stack; lg+ splits into form (1.1fr) +
           summary (0.9fr). The summary sits sticky so it stays
           visible as the form scrolls. -->
      <div class="grid gap-8 md:gap-10 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <form
          class="flex flex-col gap-8 min-w-0"
          novalidate
          @submit.prevent="placeOrder"
        >
          <!-- Section: Express checkout. Wallet buttons up top so
               returning customers can finish in one tap; the full
               form below is the fallback. The "or" rule visually
               separates the two paths so it doesn't read like the
               buttons are part of the contact section. -->
          <section class="flex flex-col gap-4 rounded-md border border-line bg-paper p-6 md:p-8">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <h2 class="font-display text-xl font-normal text-brand leading-none">
                {{ t('checkout.section.express') }}
              </h2>
              <span class="text-[12px] text-muted">
                {{ t('checkout.express.sub') }}
              </span>
            </div>
            <ExpressCheckoutMount
              ref="expressMountRef"
              :intent="expressIntent"
              :return-url="returnUrl"
              :busy="expressBusy"
              @pay="placeExpress"
              @error="onExpressError"
            />
          </section>

          <!-- Visual divider between the express and form paths.
               Two soft rules with a centred "or" — purely
               presentational, role="presentation". -->
          <div
            role="presentation"
            class="flex items-center gap-4 -my-2"
            aria-hidden="true"
          >
            <span class="h-px flex-1 bg-line" />
            <span class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
              {{ t('checkout.express.or') }}
            </span>
            <span class="h-px flex-1 bg-line" />
          </div>

          <!-- Section: Contact -->
          <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
            <h2 class="font-display text-xl font-normal text-brand leading-none">
              {{ t('checkout.section.contact') }}
            </h2>
            <Input
              v-model="form.email"
              :label="t('checkout.field.email')"
              type="email"
              required
              :placeholder="t('checkout.placeholder.email')"
              :hint="t('checkout.hint.email')"
            />
            <label class="inline-flex items-center gap-3 cursor-pointer select-none">
              <input
                v-model="form.acceptsMarketing"
                type="checkbox"
                class="w-5 h-5 rounded-xs border border-line accent-brand"
              />
              <span class="text-sm text-ink">{{ t('checkout.field.marketing') }}</span>
            </label>
          </section>

          <!-- Section: Shipping. Two-column grid at md+ packs the
               address rows so the form doesn't read as a single
               very long column. -->
          <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
            <h2 class="font-display text-xl font-normal text-brand leading-none">
              {{ t('checkout.section.shipping') }}
            </h2>
            <div class="grid gap-5 md:grid-cols-2">
              <Input
                v-model="form.shippingAddress.name"
                :label="t('checkout.field.name')"
                required
              />
              <Input
                v-model="form.shippingAddress.company"
                :label="t('checkout.field.company')"
              />
              <div class="md:col-span-2">
                <Input
                  v-model="form.shippingAddress.street"
                  :label="t('checkout.field.street')"
                  required
                />
              </div>
              <Input
                v-model="form.shippingAddress.postalCode"
                :label="t('checkout.field.postal')"
                required
              />
              <Input
                v-model="form.shippingAddress.city"
                :label="t('checkout.field.city')"
                required
              />
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
                  {{ t('checkout.field.country') }}<span class="text-danger"> *</span>
                </label>
                <select
                  v-model="form.shippingAddress.country"
                  required
                  class="w-full rounded-sm border border-line bg-paper px-4 py-3 text-[15px] text-ink transition-colors duration-base focus:outline-none focus:border-brand"
                >
                  <option v-for="c in countries" :key="c.code" :value="c.code">
                    {{ c.label }}
                  </option>
                </select>
              </div>
              <Input
                v-model="form.shippingAddress.phone"
                :label="t('checkout.field.phone')"
                type="tel"
                :hint="t('checkout.hint.phone')"
              />
            </div>
          </section>

          <!-- Section: Billing. Same-as-shipping default keeps the
               form short for the common case. -->
          <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <h2 class="font-display text-xl font-normal text-brand leading-none">
                {{ t('checkout.section.billing') }}
              </h2>
              <label class="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  v-model="form.billingSame"
                  type="checkbox"
                  class="w-5 h-5 rounded-xs border border-line accent-brand"
                />
                <span class="text-sm text-ink">{{ t('checkout.field.billingSame') }}</span>
              </label>
            </div>
            <div v-if="!form.billingSame" class="grid gap-5 md:grid-cols-2">
              <Input v-model="form.billingAddress.name" :label="t('checkout.field.name')" required />
              <Input v-model="form.billingAddress.company" :label="t('checkout.field.company')" />
              <div class="md:col-span-2">
                <Input v-model="form.billingAddress.street" :label="t('checkout.field.street')" required />
              </div>
              <Input v-model="form.billingAddress.postalCode" :label="t('checkout.field.postal')" required />
              <Input v-model="form.billingAddress.city" :label="t('checkout.field.city')" required />
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
                  {{ t('checkout.field.country') }}<span class="text-danger"> *</span>
                </label>
                <select
                  v-model="form.billingAddress.country"
                  required
                  class="w-full rounded-sm border border-line bg-paper px-4 py-3 text-[15px] text-ink transition-colors duration-base focus:outline-none focus:border-brand"
                >
                  <option v-for="c in countries" :key="c.code" :value="c.code">
                    {{ c.label }}
                  </option>
                </select>
              </div>
              <Input v-model="form.billingAddress.phone" :label="t('checkout.field.phone')" type="tel" />
            </div>
          </section>

          <!-- Section: Payment. Hosts the Stripe mount component;
               the actual <iframe> only attaches once we have a
               clientSecret from the backend. -->
          <section class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <h2 class="font-display text-xl font-normal text-brand leading-none">
                {{ t('checkout.section.payment') }}
              </h2>
              <span class="inline-flex items-center gap-2 text-[12px] text-muted">
                <Icon name="check" :size="14" :stroke-width="2.2" class="text-brand" />
                {{ t('checkout.payment.secure') }}
              </span>
            </div>
            <StripePaymentMount
              ref="paymentMountRef"
              :intent="intent"
              :return-url="returnUrl"
            />
          </section>

          <!-- Inline error from the API or Stripe.js. Aria-live so
               screen readers announce it when it appears. -->
          <p
            v-if="submitError"
            class="text-sm text-danger px-2"
            role="alert"
            aria-live="polite"
          >{{ submitError }}</p>

          <!-- Mobile-only submit (the lg+ summary panel renders
               its own CTA so the customer always has a button in
               sight). -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            block
            class="lg:hidden"
            :loading="submitting"
            :disabled="!cart.items.length"
          >{{ ctaLabel }}</Button>
        </form>

        <!-- Order summary. `lg:sticky` keeps it in view as the form
             scrolls; `lg:top-[calc(var(--nav-h)+1rem)]` clears the
             sticky navbar. CTA inline so desktop users always have
             a Place order button alongside the totals. -->
        <CheckoutSummary
          :items="cart.items"
          :subtotal="subtotal"
          :shipping="shipping"
          :tax="tax"
          :total="total"
          :heading="t('checkout.summary.heading')"
          :cta-label="ctaLabel"
          :cta-loading="submitting"
          :cta-disabled="!cart.items.length"
          class="hidden lg:flex lg:sticky lg:top-[calc(var(--nav-h)+1rem)]"
          @submit="placeOrder"
        />
      </div>
    </div>
  </main>

  <!-- Mobile bottom clearance — same pattern as Home/Shop. -->
  <div
    aria-hidden="true"
    class="md:hidden"
    style="height: calc(64px + env(safe-area-inset-bottom));"
  />
</template>
