<script setup>
/**
 * Standalone /login page. Returning customers arrive here from the
 * navbar account link or from email password-reset flows. The form
 * is intentionally narrow — single email + password pair, with a
 * link over to /register for new customers.
 */
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import Input from '@/design-system/components/Input.vue'
import Button from '@/design-system/components/Button.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import {
  products,
  signIn,
  requestPasswordReset,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const cartOpen = ref(false)

function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}
async function onSearchSelect(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
}
async function onQty({ productId, quantity }) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
}

const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]

const email = ref('')
const password = ref('')
const submitting = ref(false)
const submitError = ref('')

const resetMode = ref(false)
const resetSent = ref(false)

const submitDisabled = computed(() => {
  if (!email.value) return true
  if (resetMode.value) return false
  return password.value.length < 8
})

async function onSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    if (resetMode.value) {
      await requestPasswordReset({ email: email.value })
      resetSent.value = true
      return
    }
    await signIn({ email: email.value, password: password.value })
    const next = String(route.query.next || '/')
    router.push(next)
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
  } finally {
    submitting.value = false
  }
}

const navRef = ref(null)
let navResizeObserver = null
function syncNavHeight() {
  const el = navRef.value
  const node = el && (el.$el || el)
  if (!node || typeof window === 'undefined') return
  const h = Math.round(node.getBoundingClientRect().height)
  document.documentElement.style.setProperty('--nav-h', `${h}px`)
}
onMounted(() => {
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
    variant="cream"
    layout="standard"
    :items="navItems"
    :cart-count="cart.count"
    :products="products"
    @cart="cartOpen = true"
    @search="onSearchSelect"
  />

  <main class="bg-cream text-ink min-h-svh">
    <div
      class="mx-auto w-full max-w-md px-6 py-14 sm:px-8 sm:py-20 md:py-24"
    >
      <header class="flex flex-col gap-3 mb-8 text-center">
        <p class="eyebrow">{{ t('auth.login.eyebrow') }}</p>
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md">
          {{ resetMode ? t('auth.reset.title') : t('auth.login.title') }}
        </h1>
        <p class="text-[14px] text-muted">
          {{ resetMode ? t('auth.reset.sub') : t('auth.login.sub') }}
        </p>
      </header>

      <form
        v-if="!resetSent"
        class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8"
        novalidate
        @submit.prevent="onSubmit"
      >
        <Input
          v-model="email"
          :label="t('checkout.field.email')"
          type="email"
          required
          :placeholder="t('checkout.placeholder.email')"
        />
        <Input
          v-if="!resetMode"
          v-model="password"
          :label="t('checkout.field.password')"
          type="password"
          required
        />

        <p
          v-if="submitError"
          class="text-sm text-danger"
          role="alert"
          aria-live="polite"
        >{{ submitError }}</p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="submitting"
          :disabled="submitDisabled"
        >{{ resetMode ? t('auth.reset.cta') : t('auth.login.cta') }}</Button>

        <button
          type="button"
          class="text-[13px] text-brand hover:underline self-start"
          @click="resetMode = !resetMode"
        >
          {{ resetMode ? t('auth.reset.back') : t('auth.login.forgot') }}
        </button>
      </form>

      <div
        v-else
        class="rounded-md border border-line bg-paper p-6 md:p-8 flex flex-col gap-3 text-center"
      >
        <h2 class="font-display text-xl text-brand">{{ t('auth.reset.sent.title') }}</h2>
        <p class="text-[14px] text-muted">{{ t('auth.reset.sent.body') }}</p>
        <button
          type="button"
          class="text-[13px] text-brand hover:underline self-center mt-2"
          @click="resetMode = false; resetSent = false"
        >
          {{ t('auth.reset.back') }}
        </button>
      </div>

      <p class="mt-8 text-center text-[14px] text-muted">
        {{ t('auth.login.newCustomer') }}
        <RouterLink to="/register" class="text-brand hover:underline">
          {{ t('auth.login.cta.register') }}
        </RouterLink>
      </p>
    </div>
  </main>

  <Footer />

  <CartDrawer
    v-model="cartOpen"
    :items="cart.items"
    :subtotal="cart.subtotal"
    :count="cart.count"
    @update-quantity="onQty"
    @remove="onRemove"
    @checkout="goCheckout"
  />
</template>
