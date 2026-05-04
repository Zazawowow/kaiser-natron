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

    <!-- =========================================================
         DESKTOP (lg+) — bundle image as a full-bleed hero background;
         all copy + purchase actions overlay on the right side. The
         landscape source art (≈ 16:9) drives the fold; a left → right
         brand-green gradient softens the right edge so the cream copy
         stays legible regardless of what the image carries underneath.
         ========================================================= -->
    <section
      class="hidden lg:block relative overflow-hidden min-h-[calc(100svh-var(--nav-h)-3rem)]"
    >
      <img
        :src="bundle.image"
        :alt="bundle.imageAlt || bundle.name"
        loading="eager"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Legibility gradient — fades the brand-green back in over
           the right ~50 % of the image so cream text stays readable
           without painting an opaque sidebar over the artwork. -->
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-gradient-to-r from-brand/0 via-brand/55 to-brand"
      />

      <Badge
        v-if="bundle.badge"
        :variant="bundle.badgeVariant || 'accent'"
        class="absolute top-6 left-6 z-[1] shadow-sm"
      >{{ bundle.badge }}</Badge>

      <!-- Foreground copy + purchase cluster, pinned to the right
           half of the section and vertically centred in the fold. -->
      <div class="relative z-10 mx-auto w-full max-w-7xl h-full px-10 lg:px-16">
        <div class="flex h-full min-h-[calc(100svh-var(--nav-h)-3rem)] items-center justify-end">
          <div class="w-full max-w-md xl:max-w-lg flex flex-col gap-6 text-cream">
            <p v-if="bundle.usage" class="text-xs tracking-label uppercase text-cream/80">{{ bundle.usage }}</p>
            <h1 class="font-display font-normal leading-[1.05] tracking-tight text-cream text-[2.5rem] xl:text-[3rem] 2xl:text-[3.5rem]">
              {{ bundle.name }}
            </h1>
            <p v-if="bundle.description" class="text-base xl:text-lg leading-relaxed text-cream/90">
              {{ bundle.description }}
            </p>

            <div class="flex flex-col gap-2">
              <p class="text-xs tracking-label uppercase text-cream/80">{{ t('bundle.items') }}</p>
              <ul class="flex flex-col gap-1.5">
                <li
                  v-for="(item, i) in resolvedItems"
                  :key="i"
                  class="flex items-start gap-2 text-base text-cream leading-relaxed"
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
              <span class="font-display text-3xl xl:text-4xl text-cream">{{ priceLabel }}</span>
              <span v-if="memberPriceLabel" class="text-sm text-cream/80">
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
      </div>
    </section>

    <!-- =========================================================
         MOBILE / TABLET (< lg) — full-width banner at the image's
         natural aspect, then description + items + purchase cluster
         stacked underneath. Keeps the buy actions reachable in a
         single thumb-scroll on phone widths.
         ========================================================= -->
    <div class="lg:hidden">
      <section class="mx-auto w-full max-w-7xl px-6 md:px-10 pt-6 md:pt-8">
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
            class="block w-full h-auto"
          />
        </div>
      </section>

      <section class="mx-auto w-full max-w-7xl px-6 md:px-10 py-10 md:py-14">
        <div class="flex flex-col gap-6">
          <p v-if="bundle.usage" class="text-xs tracking-label uppercase text-cream/70">{{ bundle.usage }}</p>
          <h1 class="font-display font-normal leading-[1.06] tracking-tight text-cream text-[2rem] md:text-[2.5rem]">
            {{ bundle.name }}
          </h1>
          <p v-if="bundle.description" class="text-base md:text-lg leading-relaxed text-cream/85">
            {{ bundle.description }}
          </p>

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
      </section>
    </div>
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
