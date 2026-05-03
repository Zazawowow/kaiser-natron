<script setup>
/**
 * CheckoutPage — layout for the stepped checkout. Replaces the
 * standard sitewide chrome (Navbar + Footer) with a minimal sticky
 * top bar (logo + stepper + back-to-shopping). Per-step logic lives
 * in `src/pages/checkout/*Step.vue`; per-step state in the
 * `useCheckoutStore` Pinia store.
 *
 * Layout shape: a flex-column wrapper with min-h-svh — the sticky
 * header takes its natural height; the main fills the remaining
 * viewport via flex-1 and (on lg+) centers its content vertically.
 */
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Logo from '@/design-system/components/Logo.vue'
import CheckoutStepper from '@/design-system/components/CheckoutStepper.vue'
import CheckoutSummary from '@/design-system/components/CheckoutSummary.vue'
import ExpressCheckoutMount from '@/design-system/components/ExpressCheckoutMount.vue'
import { fetchCart, createExpressIntent, clearCart } from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useCheckoutStore } from '@/stores/checkout.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const checkout = useCheckoutStore()
const route = useRoute()
const router = useRouter()

const expressIntent = ref(null)
const expressBusy = ref(false)
const expressError = ref('')
const expressMountRef = ref(null)

const expressReturnUrl = computed(() => {
  if (typeof window === 'undefined') return '/checkout/processing'
  return `${window.location.origin}/checkout/processing?order=${expressIntent.value?.orderId || ''}`
})

async function placeExpress({ wallet }) {
  if (!cart.items.length) {
    expressError.value = t('checkout.error.empty')
    return
  }
  expressError.value = ''
  expressBusy.value = true
  try {
    const response = await createExpressIntent({ wallet })
    expressIntent.value = response
    await nextTick()
    const result = await expressMountRef.value?.confirm()
    if (result?.error) {
      expressError.value = result.error.message || t('checkout.error.payment')
      return
    }
    if (result?.paymentIntent?.status === 'succeeded') {
      const orderId = response.orderId
      await clearCart()
      checkout.reset()
      router.push({ path: '/checkout/success', query: { order: orderId } })
    }
  } catch (err) {
    expressError.value = err?.message || t('checkout.error.generic')
  } finally {
    expressBusy.value = false
  }
}

function onExpressErr(err) {
  expressError.value = err?.message || t('checkout.error.payment')
  expressBusy.value = false
}

const SHIPPING_FLAT_EUR = 4.9
const VAT_RATE = 0.19

const subtotal = computed(() => cart.subtotal)
const shipping = computed(() => (cart.items.length ? SHIPPING_FLAT_EUR : 0))
const total = computed(() => +(subtotal.value + shipping.value).toFixed(2))
const tax = computed(() =>
  cart.items.length ? +(((subtotal.value + shipping.value) * VAT_RATE) / (1 + VAT_RATE)).toFixed(2) : 0,
)

const steps = computed(() => [
  {
    key: 'cart',
    label: t('checkout.step.cart'),
    to: '/checkout/cart',
    completed: cart.items.length > 0,
  },
  {
    key: 'account',
    label: t('checkout.step.account'),
    to: '/checkout/account',
    completed: checkout.accountComplete,
  },
  {
    key: 'shipping',
    label: t('checkout.step.shipping'),
    to: '/checkout/shipping',
    completed: checkout.shippingComplete,
  },
  {
    key: 'payment',
    label: t('checkout.step.payment'),
    to: '/checkout/payment',
    completed: false,
  },
])

const activeKey = computed(() => {
  const seg = route.path.split('/')[2] || 'cart'
  return ['cart', 'account', 'shipping', 'payment'].includes(seg) ? seg : 'cart'
})

const swapCols = computed(() => activeKey.value === 'cart' && !cart.isEmpty)

// Section title for the current step. Rendered in the layout (above
// the grid) as a full-width row so the form column and summary column
// start at the same y-position on desktop.
const sectionHeader = computed(() => {
  switch (activeKey.value) {
    case 'cart':
      return { title: t('checkout.cart.title'), sub: '' }
    case 'account':
      return { title: t('checkout.account.heading'), sub: t('checkout.account.sub') }
    case 'shipping':
      return { title: t('checkout.section.shipping'), sub: t('checkout.shipping.sub') }
    case 'payment':
      return { title: t('checkout.section.payment'), sub: t('checkout.payment.sub') }
    default:
      return { title: '', sub: '' }
  }
})

onMounted(() => {
  fetchCart()
})
</script>

<template>
  <div class="min-h-svh flex flex-col bg-cream">
    <header class="sticky top-0 z-30 bg-cream border-b border-line shrink-0">
      <!-- 3-column grid keeps the stepper centered at viewport midpoint
           regardless of how wide the side elements are. On mobile the
           right column is empty (back-to-shopping is hidden) but still
           1fr, so the stepper stays centered. -->
      <div
        class="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6"
      >
        <RouterLink to="/" class="shrink-0 justify-self-start" :aria-label="t('checkout.home')">
          <Logo class="w-9 md:w-12 h-auto text-brand" />
        </RouterLink>

        <div class="justify-self-center min-w-0">
          <CheckoutStepper
            :steps="steps"
            :active-key="activeKey"
            :aria-label="t('checkout.stepper.label')"
          />
        </div>

        <RouterLink
          to="/shop"
          class="shrink-0 justify-self-end hidden sm:inline-flex items-center text-[13px] font-semibold text-brand hover:underline whitespace-nowrap"
        >{{ t('checkout.backToShopping') }}</RouterLink>
      </div>
    </header>

    <main class="text-ink flex-1 lg:flex lg:flex-col lg:justify-center">
      <div
        class="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 pt-5 pb-28 sm:pt-7 sm:pb-32 md:pt-8 md:pb-32 lg:pt-10 lg:pb-32"
      >
        <header
          v-if="activeKey === 'cart'"
          class="flex flex-col gap-2 mb-8 md:mb-10"
        >
          <h1
            class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md"
          >
            {{ t('checkout.headline') }}
            <em class="italic font-light text-brand">{{ t('checkout.headline.em') }}</em>
          </h1>
        </header>

        <header
          v-else-if="sectionHeader.title"
          class="flex flex-col gap-2 mb-8 md:mb-10"
        >
          <h2
            class="font-display text-2xl font-normal text-ink leading-none"
          >{{ sectionHeader.title }}</h2>
          <p
            v-if="sectionHeader.sub"
            class="text-[14px] text-muted max-w-2xl"
          >{{ sectionHeader.sub }}</p>
        </header>

        <!-- Empty cart on the cart step: single centered column. -->
        <div
          v-if="activeKey === 'cart' && cart.isEmpty"
          class="flex justify-center"
        >
          <div class="w-full max-w-2xl">
            <router-view />
          </div>
        </div>

        <div
          v-else
          :class="[
            'grid gap-8 md:gap-10 lg:gap-12 lg:items-start',
            swapCols ? 'lg:grid-cols-[0.9fr_1.1fr]' : 'lg:grid-cols-[1.1fr_0.9fr]',
          ]"
        >
          <aside
            v-if="swapCols"
            class="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--checkout-bar-h,72px)+1rem)]"
            :aria-label="t('checkout.section.express')"
          >
            <div class="flex flex-col gap-4 rounded-md border border-line bg-paper p-6 md:p-8">
              <h2 class="font-display text-xl font-normal text-brand leading-none">
                {{ t('checkout.section.express') }}
              </h2>
              <ExpressCheckoutMount
                ref="expressMountRef"
                :intent="expressIntent"
                :return-url="expressReturnUrl"
                :busy="expressBusy"
                @pay="placeExpress"
                @error="onExpressErr"
              />
            </div>
            <p
              v-if="expressError"
              class="text-sm text-danger"
              role="alert"
              aria-live="polite"
            >{{ expressError }}</p>
          </aside>

          <div class="min-w-0">
            <router-view />
          </div>

          <!-- Right column for non-cart steps: order summary + an action
               slot that each step teleports its Back / Continue buttons
               into. On mobile the column stacks below the form, so the
               buttons end up at the bottom of the page naturally. -->
          <CheckoutSummary
            v-if="activeKey !== 'cart'"
            :items="cart.items"
            :subtotal="subtotal"
            :shipping="shipping"
            :tax="tax"
            :total="total"
            :heading="t('checkout.summary.heading')"
            class="lg:sticky lg:top-[calc(var(--checkout-bar-h,72px)+1rem)]"
          />
        </div>
      </div>
    </main>
  </div>
</template>
