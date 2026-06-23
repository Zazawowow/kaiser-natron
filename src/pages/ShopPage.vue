<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import ProductCard from '@/design-system/components/ProductCard.vue'
import Hero from '@/design-system/components/Hero.vue'
import Button from '@/design-system/components/Button.vue'
import WaveDivider from '@/design-system/components/WaveDivider.vue'
import Footer from '@/design-system/components/Footer.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import {
  products,
  productsByUseCase,
  USE_CASES,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()
const cartOpen = ref(false)

// Cart drawer's checkout event lands here so the drawer can stay
// presentational; this page decides to close the drawer and route
// the user to /checkout.
function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

// Site-wide nav split mirrors HomePage so the header reads as one
// piece of chrome across both routes. On /shop the category links
// point at in-page anchors (`#cook`, `#clean`, `#care`) so they
// scroll within the page rather than re-route.
// Same top-left list as HomePage — Shop + supporting pages.
// Category shortcuts (Cook / Clean / Care) live in the Shop hero
// banner's three-tile row, not the global nav, so the chrome stays
// stable across home and shop.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.kaiserhacks', href: '/kaiserhacks' },
]
const navSecondaryItems = []

// Group products by use-case once; iterate a stable config below.
const grouped = computed(() => productsByUseCase(products))

// Each use-case fronts a full-width category colour banner. The colour
// is the brand's own use-group palette (tokens.css --color-cat-*):
// cook=Küche=lime, clean=Haushalt=grapefruit, care=Pflege=orange. Each
// banner is headed by a representative product image for that group.
const CAT_TONE = { cook: 'kitchen', clean: 'clean', wash: 'wash', care: 'care' }
const CAT_HERO_ID = {
  cook: 'kaiser-natron-pulver-250-g-grosspackung',
  clean: 'kaiser-natron-allzweck-spray-500-ml',
  wash: 'kaiser-natron-daunenwasch-250-ml',
  care: 'kaiser-natron-bad-500-g',
}
const sections = computed(() =>
  USE_CASES.map((id) => {
    const heroProduct =
      products.find((p) => p.id === CAT_HERO_ID[id]) || grouped.value[id][0]
    return {
      id,
      cat: CAT_TONE[id],
      feature: t(`shop.feature.${id}`),
      headline: t(`shop.section.${id}.headline`),
      headlineEm: t(`shop.section.${id}.headline.em`),
      sub: t(`shop.section.${id}.sub`),
      productsTitle: t(`shop.section.${id}.products.title`),
      products: grouped.value[id],
      heroImage: heroProduct.image,
      heroAlt: heroProduct.title,
      heroId: heroProduct.id,
      heroHref: heroProduct.href,
    }
  }),
)

async function onAdd(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
}
// Banner "add to cart" — adds that section's representative hero product.
async function onHeroAdd(productId) {
  if (!productId) return
  await addToCart(productId, 1)
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

// `--nav-h` is defaulted in global styles; this ResizeObserver refines
// it so deep-link anchor targets (e.g. `/shop#care`) land just below
// the sticky nav via each section's `scroll-mt` offset.
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
    :secondary-items="navSecondaryItems"
    :cart-count="cart.count"
    :products="products"
    @cart="cartOpen = true"
    @search="onSearchSelect"
  />

  <!-- First-fold green banner — HALF viewport height (it only holds a
       compact title band, so a full fold left too much empty green).
       Pulled up under the sticky nav and vertically centred. -->
  <div
    class="flex flex-col bg-brand text-cream md:min-h-[calc(50svh-var(--nav-h))] md:justify-center"
  >
    <div class="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <!-- Title band. Mixed-font banner treatment (Hero-style): normal
           display weight + italic light for the emphasis phrase. -->
      <div class="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-cream text-headline-lg">
          {{ t('shop.headline') }}
          <em class="italic font-light text-cream">{{ t('shop.headline.em') }}</em>
        </h1>
        <p class="text-base md:text-lg leading-relaxed text-cream/80 max-w-2xl">
          {{ t('shop.sub') }}
        </p>
      </div>

      <!-- The three featured product tiles were removed; each use-case is
           now fronted by its own full-width colour banner below. The green
           fold keeps just the title band. -->
    </div>
  </div>

  <!-- Thin white separation between the green hero and the first colour
       banner: a diagonal out of the green, then a slim white band. Each
       section's own diagonal then carries cream → its colour. -->
  <WaveDivider from="brand" to="cream" />
  <div aria-hidden="true" class="-mt-px h-6 md:h-10 bg-cream"></div>

  <!-- Per use-case: a full-width category COLOUR banner (representative
       product + the section's mixed-font heading) heads each group, then
       the product grid sits on a neutral surface below. Diagonal wave
       dividers carry the colour in and back out, matching the home-page
       rhythm. Colours: cook=lime, clean=grapefruit, wash=plum, care=orange. -->
  <template v-for="section in sections" :key="section.id">
    <!-- Wave into the colour banner from the neutral surface above (the
         white band for the first section, the product grid for the rest). -->
    <WaveDivider from="cream" :to="section.cat" />

    <!-- Category colour banner. `id` + scroll-mt keep deep-links
         (/shop#care) landing just under the sticky nav. -->
    <div :id="section.id" class="-mt-px scroll-mt-[calc(var(--nav-h)+1rem)]">
      <Hero
        class="w-full"
        variant="split"
        :tone="section.cat"
        :eyebrow="section.feature"
        :image="section.heroImage"
        :image-alt="section.heroAlt"
      >
        <template #headline>
          {{ section.headline }}
          <em class="italic font-light">{{ section.headlineEm }}</em>
        </template>
        <template #subheadline>{{ section.sub }}</template>
        <!-- Banner CTAs: "add to cart" in the brand crimson, "learn more"
             as a white-outline ghost (adds / links the section's hero
             product). -->
        <template #actions>
          <Button variant="accent" size="lg" @click="onHeroAdd(section.heroId)">
            {{ t('ds.buttons.addToCart') }}
          </Button>
          <RouterLink
            :to="section.heroHref"
            class="inline-flex items-center justify-center rounded-pill border border-white/90 px-[34px] py-[17px] text-[14px] font-semibold uppercase tracking-label text-white transition-colors duration-base hover:bg-white/10"
          >{{ t('ds.buttons.learnMore') }}</RouterLink>
        </template>
      </Hero>
    </div>

    <!-- Wave back out of the colour into the neutral product grid. -->
    <WaveDivider :from="section.cat" to="cream" />

    <section class="-mt-px bg-cream text-ink">
      <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
        <h2
          class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md mb-10 md:mb-12"
        >{{ section.productsTitle }}</h2>
        <div
          v-if="section.products.length"
          class="grid gap-5 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <ProductCard
            v-for="product in section.products"
            :key="product.id"
            :title="product.title"
            :size="product.size"
            :price="product.price"
            :image="product.image"
            :image-alt="product.title"
            :href="product.href"
            tone="cream"
            :in-stock="product.inStock"
            cta-variant="accent"
            @add="onAdd(product)"
          />
        </div>
      </div>
    </section>
  </template>

  <Footer />

  <!-- Bottom clearance for the mobile floating cluster (search / cart /
       menu), same pattern as HomePage so both pages align visually.
       Tied to the navbar's 1100 px collapse threshold. -->
  <div
    aria-hidden="true"
    class="min-[1100px]:hidden"
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
