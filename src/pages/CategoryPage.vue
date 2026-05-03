<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import ProductCard from '@/design-system/components/ProductCard.vue'
import WaveDivider from '@/design-system/components/WaveDivider.vue'
import Footer from '@/design-system/components/Footer.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import Button from '@/design-system/components/Button.vue'
import {
  products,
  productsByUseCase,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  /** Slug used for i18n keys and as the page identifier. */
  slug: {
    type: String,
    required: true,
    validator: (v) => ['pflege', 'haushalt'].includes(v),
  },
  /** Maps to the existing use-case grouping (clean / care). */
  useCase: {
    type: String,
    required: true,
    validator: (v) => ['clean', 'care'].includes(v),
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

const categoryProducts = computed(() => productsByUseCase(products)[props.useCase] || [])

const benefits = computed(() => [1, 2, 3].map((i) => ({
  title: t(`category.${props.slug}.benefit.${i}.title`),
  text: t(`category.${props.slug}.benefit.${i}.text`),
})))

async function onAdd(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
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
    variant="brand"
    layout="standard"
    :items="navItems"
    :cart-count="cart.count"
    :products="products"
    @cart="cartOpen = true"
    @search="onSearchSelect"
  />

  <section
    class="bg-brand text-cream md:min-h-[calc(70svh-var(--nav-h))] md:flex md:items-center"
  >
    <div
      class="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 text-center flex flex-col gap-5"
    >
      <p class="eyebrow text-accent">{{ t(`category.${slug}.eyebrow`) }}</p>
      <h1
        class="font-display font-normal leading-[1.05] tracking-tight text-cream text-headline-lg"
      >
        {{ t(`category.${slug}.title.a`) }}
        <em class="italic font-light text-accent-soft">{{ t(`category.${slug}.title.em`) }}</em>
      </h1>
      <p class="text-base md:text-lg leading-relaxed text-cream/80 max-w-2xl mx-auto">
        {{ t(`category.${slug}.sub`) }}
      </p>
    </div>
  </section>

  <WaveDivider from="brand" to="cream" />

  <section class="-mt-px bg-cream text-ink">
    <div
      class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16"
    >
      <div class="flex flex-col gap-4 max-w-3xl">
        <h2
          class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md"
        >
          {{ t(`category.${slug}.products.headline`) }}
          <em class="italic font-light text-brand">{{ t(`category.${slug}.products.headline.em`) }}</em>
        </h2>
        <p class="text-lg leading-relaxed text-muted max-w-2xl">
          {{ t(`category.${slug}.products.sub`) }}
        </p>
      </div>

      <div
        v-if="categoryProducts.length"
        class="mt-12 md:mt-14 grid gap-5 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        <ProductCard
          v-for="product in categoryProducts"
          :key="product.id"
          :title="product.title"
          :size="product.size"
          :price="product.price"
          :image="product.image"
          :image-alt="product.title"
          :href="product.href"
          tone="cream"
          :in-stock="product.inStock"
          @add="onAdd(product)"
        />
      </div>
    </div>
  </section>

  <WaveDivider from="cream" to="surface" />

  <section class="-mt-px bg-surface text-ink">
    <div
      class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16"
    >
      <div class="flex flex-col gap-4 max-w-3xl">
        <p class="eyebrow">{{ t(`category.${slug}.benefits.eyebrow`) }}</p>
        <h2
          class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md"
        >
          {{ t(`category.${slug}.benefits.headline`) }}
          <em class="italic font-light text-brand">{{ t(`category.${slug}.benefits.headline.em`) }}</em>
        </h2>
      </div>

      <ul class="mt-12 md:mt-14 grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-3">
        <li
          v-for="(benefit, i) in benefits"
          :key="i"
          class="flex flex-col gap-3 rounded-md border border-line bg-paper p-6 md:p-8"
        >
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand text-accent font-display text-base"
          >{{ i + 1 }}</span>
          <h3 class="font-display text-xl font-normal text-brand leading-tight">
            {{ benefit.title }}
          </h3>
          <p class="text-[15px] leading-relaxed text-ink">{{ benefit.text }}</p>
        </li>
      </ul>
    </div>
  </section>

  <WaveDivider from="surface" to="brand" />

  <section class="-mt-px bg-brand text-cream">
    <div
      class="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 text-center flex flex-col items-center gap-5"
    >
      <h2
        class="font-display font-normal leading-[1.05] tracking-tight text-cream text-headline-md"
      >
        {{ t(`category.${slug}.cta.headline`) }}
        <em class="italic font-light text-accent-soft">{{ t(`category.${slug}.cta.headline.em`) }}</em>
      </h2>
      <p class="text-base md:text-lg leading-relaxed text-cream/80 max-w-xl">
        {{ t(`category.${slug}.cta.sub`) }}
      </p>
      <RouterLink to="/shop" class="inline-flex">
        <Button variant="accent" size="lg">{{ t(`category.${slug}.cta.button`) }}</Button>
      </RouterLink>
    </div>
  </section>

  <Footer variant="cream" />

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
    @checkout="goCheckout"
  />
</template>
