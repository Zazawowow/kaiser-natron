<script setup>
/**
 * Standalone /register page. New customers arrive here from the
 * login page's "no account yet" link or from marketing CTAs.
 * Mirrors the AccountStep register tab so the experience is
 * consistent — same fields, same validation, same backend call.
 */
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import Input from '@/design-system/components/Input.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import {
  products,
  register,
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
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.kaiserhacks', href: '/kaiserhacks' },
]
const navSecondaryItems = []

const salutation = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptsMarketing = ref(false)
const acceptsTerms = ref(false)

const submitting = ref(false)
const submitError = ref('')

const passwordsMatch = computed(() => password.value === passwordConfirm.value)
const submitDisabled = computed(
  () =>
    !email.value ||
    password.value.length < 8 ||
    !passwordsMatch.value ||
    !acceptsTerms.value,
)

async function onSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    await register({
      email: email.value,
      password: password.value,
      salutation: salutation.value,
      firstName: firstName.value,
      lastName: lastName.value,
      acceptsMarketing: acceptsMarketing.value,
      acceptsTerms: acceptsTerms.value,
    })
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
    :secondary-items="navSecondaryItems"
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
        <p class="eyebrow">{{ t('auth.register.eyebrow') }}</p>
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md">
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-[14px] text-muted">{{ t('auth.register.sub') }}</p>
      </header>

      <form
        class="flex flex-col gap-5 rounded-md border border-line bg-paper p-6 md:p-8"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold uppercase tracking-eyebrow text-muted">
            {{ t('checkout.field.salutation') }}
          </label>
          <div class="relative">
            <select
              v-model="salutation"
              class="appearance-none w-full rounded-sm border border-line bg-paper pl-4 pr-10 py-3 text-[15px] text-ink transition-colors duration-base focus:outline-none focus:border-brand"
            >
              <option value="">{{ t('checkout.field.salutation.placeholder') }}</option>
              <option value="frau">{{ t('checkout.field.salutation.frau') }}</option>
              <option value="herr">{{ t('checkout.field.salutation.herr') }}</option>
              <option value="divers">{{ t('checkout.field.salutation.divers') }}</option>
            </select>
            <Icon
              name="chevron-down"
              :size="18"
              :stroke-width="2"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <Input
            v-model="firstName"
            :label="t('checkout.field.firstName')"
          />
          <Input
            v-model="lastName"
            :label="t('checkout.field.lastName')"
          />
        </div>
        <Input
          v-model="email"
          :label="t('checkout.field.email')"
          type="email"
          required
          :placeholder="t('checkout.placeholder.email')"
        />
        <Input
          v-model="password"
          :label="t('checkout.field.password')"
          type="password"
          required
          :hint="t('checkout.hint.password')"
        />
        <Input
          v-model="passwordConfirm"
          :label="t('checkout.field.passwordConfirm')"
          type="password"
          required
          :error="passwordConfirm && !passwordsMatch ? t('checkout.error.passwordMismatch') : ''"
        />

        <label class="inline-flex items-start gap-3 cursor-pointer select-none">
          <input
            v-model="acceptsMarketing"
            type="checkbox"
            class="mt-0.5 w-5 h-5 shrink-0 rounded-xs border border-line accent-brand"
          />
          <span class="text-sm text-ink">{{ t('checkout.field.marketing') }}</span>
        </label>

        <label class="inline-flex items-start gap-3 cursor-pointer select-none">
          <input
            v-model="acceptsTerms"
            type="checkbox"
            required
            class="mt-0.5 w-5 h-5 shrink-0 rounded-xs border border-line accent-brand"
          />
          <span class="text-sm text-ink">
            {{ t('auth.register.terms.before') }}
            <RouterLink to="/datenschutz" class="text-brand underline">
              {{ t('auth.register.terms.link') }}
            </RouterLink>
            {{ t('auth.register.terms.after') }}
          </span>
        </label>

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
        >{{ t('auth.register.cta') }}</Button>
      </form>

      <p class="mt-8 text-center text-[14px] text-muted">
        {{ t('auth.register.haveAccount') }}
        <RouterLink to="/login" class="text-brand hover:underline">
          {{ t('auth.register.cta.signIn') }}
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
