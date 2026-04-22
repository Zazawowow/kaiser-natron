<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/design-system/components/Navbar.vue'
import Hero from '@/design-system/components/Hero.vue'
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

const { t } = useI18n()
const cart = useCartStore()
const cartOpen = ref(false)

const imgPulver250 =
  '/products/cutouts/kaiser-natron-pulver-250-g-gro%C3%9Fpackung-removebg-preview-2.png'

const heroProductId = 'kaiser-natron-pulver-250-g-grosspackung'

// Second-fold banner — cream tone, image-left split, alternate cutout.
const imgBanner =
  '/products/cutouts/kaiser-natron-pulver-250-g-gro%C3%9Fpackung-removebg-preview%20%281%29.png'
const bannerProductId = 'kaiser-natron-pulver-250-g-grosspackung'

async function onHeroAdd() {
  await addToCart(heroProductId, 1)
  cartOpen.value = true
}

async function onBannerAdd() {
  await addToCart(bannerProductId, 1)
  cartOpen.value = true
}

async function onQty({ productId, quantity }) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
}

// Picking a product from the navbar search drops it into the cart and
// reveals the drawer so the user sees the update.
async function onSearchSelect(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
}

// Hydrate from the API on mount — today this reads the local store, later
// it will hit `GET /api/cart`. Either way the drawer has data to show.
onMounted(() => {
  fetchCart()
})
</script>

<template>
  <!-- First fold — on md+ the wrapper is exactly one viewport tall and the
       centering row below the navbar vertically centres the hero inside
       the remaining space. On mobile the Hero's stacked split layout
       (image + copy + CTAs) is taller than a phone viewport, so we drop
       the height cap and let the section flow at its natural height;
       otherwise `overflow-hidden` clips the CTAs, which is what the
       mobile screenshot showed. -->
  <div class="flex flex-col bg-brand md:h-svh md:overflow-hidden">
    <Navbar
      variant="brand"
      layout="standard"
      :cart-count="cart.count"
      :products="products"
      @cart="cartOpen = true"
      @search="onSearchSelect"
    />

    <div class="md:flex-1 md:flex md:items-center">
      <Hero
        class="w-full"
        variant="split"
        tone="brand"
        :eyebrow="t('ds.hero.eyebrow')"
        :subheadline="t('ds.hero.sub')"
        :image="imgPulver250"
        image-alt="Kaiser-Natron Pulver 250 g Großpackung"
        :cta-label="t('ds.buttons.addToCart')"
        :secondary-label="t('ds.buttons.learnMore')"
        secondary-href="/anwendungen"
        @cta="onHeroAdd"
      >
        <template #headline>
          {{ t('ds.hero.headline.a') }}
          <em class="italic font-light text-accent-soft">{{ t('ds.hero.headline.em') }}</em>
          {{ t('ds.hero.headline.b') }}
        </template>
      </Hero>
    </div>

    <!-- Wave divider from brand-green → cream. The SVG is fully opaque:
         a cream rect fills the whole viewBox so the SVG's bottom row is
         solid cream (matches the banner below → no seam), and a green
         path paints the top portion (matches the bg-brand parent above
         → no seam). The earlier version left the top half transparent,
         which caused browsers to anti-alias the path's top/bottom
         edges against the parent and produce hairline artifacts. -->
    <svg
      aria-hidden="true"
      class="block w-full h-12 md:h-16 shrink-0 -mb-px"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
    >
      <rect width="1440" height="64" fill="var(--color-cream)" />
      <path
        d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
        fill="var(--color-brand)"
      />
    </svg>
  </div>

  <!-- Second-fold product banner — same Hero component, cream surface,
       split layout reversed so the product sits on the left. The -mt-px
       pairs with the wave's -mb-px to overlap the two sections by 1 CSS
       pixel and hide any device-pixel seam. -->
  <Hero
    class="-mt-px"
    variant="split"
    tone="cream"
    reverse
    :eyebrow="t('home.banner.eyebrow')"
    :subheadline="t('home.banner.sub')"
    :image="imgBanner"
    image-alt="Kaiser-Natron Pulver 250 g Großpackung"
    :cta-label="t('ds.buttons.addToCart')"
    :secondary-label="t('ds.buttons.learnMore')"
    secondary-href="/anwendungen"
    @cta="onBannerAdd"
  >
    <template #headline>
      {{ t('home.banner.headline.a') }}
      <em class="italic font-light text-brand-soft">{{ t('home.banner.headline.em') }}</em>
      {{ t('home.banner.headline.b') }}
    </template>
  </Hero>

  <!-- Bottom clearance for the mobile floating cluster (search / cart / menu).
       Cluster sits at bottom-5 (20px) + safe-area, is 56px tall, and needs a
       24px breathing gap above it: 20 + 56 + 24 = 100px, plus the device's
       safe-area inset. Desktop hides the cluster, so no spacer there. -->
  <div
    aria-hidden="true"
    class="md:hidden"
    style="height: calc(100px + env(safe-area-inset-bottom));"
  />

  <CartDrawer
    v-model="cartOpen"
    :items="cart.items"
    :subtotal="cart.subtotal"
    :count="cart.count"
    @update-quantity="onQty"
    @remove="onRemove"
    @checkout="cartOpen = false"
  />
</template>
