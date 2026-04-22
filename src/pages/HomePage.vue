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

async function onHeroAdd() {
  await addToCart(heroProductId, 1)
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
  <!-- First-fold layout: wrapper is exactly viewport height (svh keeps mobile
       browser chrome from pushing content off-screen). The centering row
       below the navbar takes the remaining space and vertically centers the
       hero, so the hero sits in the middle of (viewport - navbar). -->
  <div class="h-svh flex flex-col bg-brand overflow-hidden">
    <Navbar
      variant="brand"
      layout="standard"
      :cart-count="cart.count"
      :products="products"
      @cart="cartOpen = true"
      @search="onSearchSelect"
    />

    <div class="flex-1 flex items-center">
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
  </div>

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
