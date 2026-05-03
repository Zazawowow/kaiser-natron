<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import {
  products,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  kind: {
    type: String,
    required: true,
    validator: (v) => ['impressum', 'datenschutz'].includes(v),
  },
})

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()
const cartOpen = ref(false)

function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]

// Section keys are intentionally a flat list per page so legal copy can be
// edited in one place (i18n) without touching the template. Each entry maps
// to `legal.<kind>.section.<id>.heading` + `…body` keys.
const sectionsByKind = {
  impressum: ['operator', 'contact', 'register', 'vat', 'authority', 'liability', 'copyright'],
  datenschutz: ['controller', 'scope', 'legalBasis', 'data', 'cookies', 'analytics', 'payments', 'rights', 'retention', 'contact'],
}

const sections = computed(() =>
  sectionsByKind[props.kind].map((id) => ({
    id,
    heading: t(`legal.${props.kind}.section.${id}.heading`),
    body: t(`legal.${props.kind}.section.${id}.body`),
  })),
)

const lastUpdated = computed(() => t(`legal.${props.kind}.updated`))

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
      class="mx-auto w-full max-w-3xl px-6 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24"
    >
      <header class="flex flex-col gap-3 mb-10 md:mb-14">
        <p class="eyebrow">{{ t(`legal.${kind}.eyebrow`) }}</p>
        <h1
          class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md"
        >
          {{ t(`legal.${kind}.title`) }}
        </h1>
        <p v-if="lastUpdated" class="text-[12px] text-muted">{{ lastUpdated }}</p>
      </header>

      <article class="flex flex-col gap-10">
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="flex flex-col gap-3"
        >
          <h2
            class="font-display text-xl md:text-2xl font-normal text-brand leading-tight"
          >
            {{ section.heading }}
          </h2>
          <p class="text-[15px] leading-relaxed text-ink whitespace-pre-line">
            {{ section.body }}
          </p>
        </section>
      </article>
    </div>
  </main>

  <Footer />

  <div
    aria-hidden="true"
    class="md:hidden"
    style="height: calc(64px + env(safe-area-inset-bottom));"
  />

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
