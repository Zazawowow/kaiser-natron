<!--
  BundlePage.vue
  -------------------------------------------------------------------
  Detail page for a single bundle (route /bundles/<slug>). Reads the
  bundle record from src/api/bundles.js so HomePage's bundle grid and
  this page render the same source of truth.

  Layout — split hero on a brand-green stage:
    · LEFT (lg+): the bundle artwork, edge-to-edge inside its column.
    · RIGHT (lg+): bundle name, items list, pricing, qty stepper,
      Add to cart CTA. Below lg the columns stack — image first.

  Add-to-cart drops the bundle's `anchorProductId` into the cart so
  the user gets visible feedback (cart count + drawer pop) until the
  backend exposes a real bundle SKU endpoint.
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Button from '@/design-system/components/Button.vue'
import Badge from '@/design-system/components/Badge.vue'
import Icon from '@/design-system/components/Icon.vue'
import QuantityStepper from '@/design-system/components/QuantityStepper.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import Footer from '@/design-system/components/Footer.vue'
import {
  products,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { findBundle } from '@/api/bundles.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const route = useRoute()
const router = useRouter()

const cartOpen = ref(false)
const qty = ref(1)

const slug = computed(() => String(route.params.slug || ''))
const bundle = computed(() => findBundle(slug.value))

// Same dynamic back-button pattern as ProductPage — restore the user
// to wherever they came from when possible, otherwise fall through
// to the home page since bundles are surfaced from /#bundles.
const referrerPath = ref(null)
onMounted(() => {
  fetchCart()
  const back = typeof window !== 'undefined' ? window.history.state?.back : null
  referrerPath.value = typeof back === 'string' ? back : null
})

const backLabelKey = computed(() => {
  const p = referrerPath.value
  if (!p) return 'product.backHome'
  if (p === '/' || p.startsWith('/#')) return 'product.backHome'
  return 'product.backGeneric'
})

function goBack() {
  if (referrerPath.value) router.back()
  else router.push('/')
}

// Site-wide nav (mirrors HomePage / ShopPage / ProductPage).
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]
const navSecondaryItems = []

const priceLabel = computed(() => {
  const b = bundle.value
  if (!b) return ''
  return `€ ${b.price.toFixed(2).replace('.', ',')}`
})

const memberPriceLabel = computed(() => {
  const b = bundle.value
  if (!b?.memberPrice) return ''
  return `€ ${b.memberPrice.toFixed(2).replace('.', ',')}`
})

// Resolve each item label against the products catalogue when we
// can — gives the items list links and rich data. Falls back to the
// bundle's static string item label when no product match exists.
const resolvedItems = computed(() => {
  const b = bundle.value
  if (!b) return []
  return b.items.map((label) => ({
    label,
    // Match by case-insensitive substring of the product title; loose
    // on purpose so "1× Kaiser-Natron Pulver 250 g" matches the
    // Pulver 250 g SKU even with the count prefix.
    product: products.find((p) =>
      label.toLowerCase().includes(p.title.toLowerCase().replace(/®/g, '').trim()),
    ),
  }))
})

async function onAdd() {
  const b = bundle.value
  if (!b?.anchorProductId) return
  await addToCart(b.anchorProductId, qty.value)
  cartOpen.value = true
}

async function onQty({ productId, quantity }) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
}

function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

async function onSearchSelect(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
}

// Sync nav height for the brand-green fold (same trick as HomePage).
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
  if (typeof window !== 'undefined') window.addEventListener('resize', syncNavHeight)
})
onBeforeUnmount(() => {
  if (navResizeObserver) navResizeObserver.disconnect()
  if (typeof window !== 'undefined') window.removeEventListener('resize', syncNavHeight)
})
</script>

<template>
  <Navbar
    ref="navRef"
    variant="brand"
    layout="standard"
    :items="navItems"
    :secondary-items="navSecondaryItems"
    :cart-count="cart.count"
    :products="products"
    @cart="cartOpen = true"
    @search="onSearchSelect"
  />

  <!-- Bundle not found — minimal fallback so the page never blanks
       silently. Real catalogue surfaces the bundles via internal
       links so a missing slug means stale link or typo. -->
  <main v-if="!bundle" class="bg-cream min-h-[60svh] flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <h1 class="font-display text-3xl text-ink mb-4">{{ t('product.notFound.title') }}</h1>
      <p class="text-muted mb-6">{{ t('product.notFound.body') }}</p>
      <RouterLink to="/" class="inline-flex">
        <Button variant="primary" size="lg">{{ t('product.backHome') }}</Button>
      </RouterLink>
    </div>
  </main>

  <main v-else class="bg-brand text-cream">
    <!-- Back button row — sits above the hero, mirrors ProductPage's
         affordance so the chrome rhymes across detail pages. -->
    <div class="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16 pt-6">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-sm tracking-label uppercase text-cream/75 hover:text-cream transition-colors"
        @click="goBack"
      >
        <Icon name="arrow-left" :size="16" />
        {{ t(backLabelKey) }}
      </button>
    </div>

    <!-- Wide banner image — fills the full container width on every
         viewport so the landscape source art (≈ 16:9) gets to breathe
         instead of being cropped to a square. Mobile uses the image's
         natural aspect (no clamp), desktop caps the height so the
         banner doesn't dominate the fold past the image's intent.
         `object-cover` keeps the framing consistent if a future
         bundle image lands at a slightly different aspect. -->
    <section class="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16 pt-6 md:pt-8">
      <div class="relative overflow-hidden rounded-lg bg-cream/10">
        <Badge
          v-if="bundle.badge"
          :variant="bundle.badgeVariant || 'accent'"
          class="absolute top-4 left-4 z-[1] shadow-sm"
        >{{ bundle.badge }}</Badge>
        <img
          :src="bundle.image"
          :alt="bundle.imageAlt || bundle.name"
          loading="eager"
          decoding="async"
          class="block w-full h-auto object-cover lg:max-h-[55svh]"
        />
      </div>
    </section>

    <!-- Copy + purchase block. Stacked on mobile (description above
         the items / price / CTA cluster); on desktop the description
         sits on the left and the items + price + qty + CTA cluster
         on the right, so the buy actions stay aligned to the eye's
         primary scan column. -->
    <section class="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16 py-10 md:py-14 lg:py-16">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <!-- Description column. -->
        <div class="flex flex-col gap-5 min-w-0">
          <p v-if="bundle.usage" class="text-xs tracking-label uppercase text-cream/70">{{ bundle.usage }}</p>
          <h1 class="font-display font-normal leading-[1.06] tracking-tight text-cream text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
            {{ bundle.name }}
          </h1>
          <p v-if="bundle.description" class="text-base md:text-lg leading-relaxed text-cream/85 max-w-2xl">
            {{ bundle.description }}
          </p>
        </div>

        <!-- Purchase column. -->
        <div class="flex flex-col gap-6 min-w-0">
          <div class="flex flex-col gap-2">
            <p class="text-xs tracking-label uppercase text-cream/70">{{ t('bundle.items') }}</p>
            <ul class="flex flex-col gap-1.5">
              <li
                v-for="(item, i) in resolvedItems"
                :key="i"
                class="flex items-start gap-2 text-base text-cream/95 leading-relaxed"
              >
                <Icon name="check" :size="18" class="mt-0.5 shrink-0 text-accent" />
                <RouterLink
                  v-if="item.product"
                  :to="item.product.href"
                  class="hover:text-accent transition-colors"
                >{{ item.label }}</RouterLink>
                <span v-else>{{ item.label }}</span>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-1">
            <span class="font-display text-3xl md:text-4xl text-cream">{{ priceLabel }}</span>
            <span v-if="memberPriceLabel" class="text-sm text-cream/70">
              {{ t('bundle.memberPrice') }}
              <span class="text-accent font-medium">{{ memberPriceLabel }}</span>
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-4 mt-2">
            <QuantityStepper v-model="qty" :min="1" :max="10" />
            <Button variant="accent" size="lg" @click="onAdd">
              <template #before><Icon name="plus" :size="16" /></template>
              {{ t('ds.buttons.addToCart') }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Bottom clearance for the mobile floating cluster — same pattern
       and threshold as HomePage / ShopPage. -->
  <div
    aria-hidden="true"
    class="min-[1100px]:hidden bg-brand"
    style="height: calc(100px + env(safe-area-inset-bottom));"
  />

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
