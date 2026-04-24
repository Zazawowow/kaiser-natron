<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Navbar from '@/design-system/components/Navbar.vue'
import ProductCard from '@/design-system/components/ProductCard.vue'
import WaveDivider from '@/design-system/components/WaveDivider.vue'
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
const cartOpen = ref(false)

// Site-wide nav split mirrors HomePage so the header reads as one
// piece of chrome across both routes. On /shop the category links
// point at in-page anchors (`#cook`, `#clean`, `#care`) so they
// scroll within the page rather than re-route.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.cook', href: '#cook' },
  { key: 'nav.clean', href: '#clean' },
  { key: 'nav.care', href: '#care' },
]
const navSecondaryItems = [
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]

// Group products by use-case once; iterate a stable config below.
// The featured tiles in the top banner each pick the FIRST product
// in their group — a representative face for that band. The
// sections themselves display every product in the group.
const grouped = computed(() => productsByUseCase(products))
const featuredTiles = computed(() =>
  USE_CASES.map((id) => ({
    id,
    label: t(`shop.feature.${id}`),
    cta: t(`shop.feature.cta.${id}`),
    product: grouped.value[id][0],
  })),
)
const sections = computed(() =>
  USE_CASES.map((id, i) => ({
    id,
    headline: t(`shop.section.${id}.headline`),
    headlineEm: t(`shop.section.${id}.headline.em`),
    sub: t(`shop.section.${id}.sub`),
    products: grouped.value[id],
    // Alternate tones so neighbouring sections read as distinct
    // surfaces without a hard rule. Cook/Care land on cream;
    // Clean sits on surface between them for contrast.
    tone: i % 2 === 0 ? 'cream' : 'surface',
  })),
)

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

  <!-- First-fold green banner — full viewport height, pulled up under
       the sticky nav so the hero content centers at the TRUE viewport
       midpoint (matches the home page's first fold). The content is a
       page-title band + three featured product tiles, one per use-case
       section, with anchor links into the sections below. -->
  <div
    class="flex flex-col bg-brand text-cream md:min-h-[calc(100svh-var(--nav-h))] md:justify-center"
  >
    <div class="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <!-- Title band. Mixed-font banner treatment (Hero-style): normal
           display weight + italic light for the emphasis phrase. -->
      <div class="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-cream text-headline-lg">
          {{ t('shop.headline') }}
          <em class="italic font-light text-accent-soft">{{ t('shop.headline.em') }}</em>
        </h1>
        <p class="text-base md:text-lg leading-relaxed text-cream/80 max-w-2xl">
          {{ t('shop.sub') }}
        </p>
      </div>

      <!-- Three featured tiles — rule of 3. One representative product
           per use-case, each tile is an anchor into its section. Uses
           the cream-wash-on-brand container pattern from the
           LanguageSwitcher's `brand` tone so tiles read as lifted off
           the green ground without another heavy surface.
           Image uses aspect-[4/3] (not aspect-square) with a svh-
           relative height cap so the whole fold — title + sub + three
           tiles + padding — stays inside 100svh at desktop heights
           from ~720px up. Mobile stacks the tiles; the fold can
           overflow below there because phones scroll naturally. -->
      <ul class="mt-8 md:mt-10 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <li v-for="tile in featuredTiles" :key="tile.id">
          <a
            :href="`#${tile.id}`"
            class="group flex h-full flex-col items-center gap-4 p-4 md:p-5 rounded-md border border-cream-line bg-cream-wash hover:bg-cream-wash-strong transition-colors duration-base"
          >
            <div class="w-full aspect-[4/3] max-h-[30svh] md:max-h-[26svh] lg:max-h-[28svh] rounded-md bg-paper overflow-hidden flex items-center justify-center">
              <img
                :src="tile.product.image"
                :alt="tile.product.title"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-contain p-4 md:p-5"
              />
            </div>
            <div class="flex flex-col items-center text-center gap-1">
              <p class="eyebrow text-accent">{{ tile.label }}</p>
              <h3 class="font-display text-lg md:text-xl font-normal leading-tight text-cream">
                {{ tile.product.title }}
              </h3>
            </div>
            <span
              class="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold tracking-label text-cream/80 group-hover:text-accent transition-colors duration-base"
            >
              {{ tile.cta }}
              <span aria-hidden="true" class="transition-transform duration-base group-hover:translate-x-1">→</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Three use-case sections. Each has its own banner-style mixed-font
       heading (no eyebrow pill), a 3-up product grid capped at the
       rule of 3 per row, and wave dividers on either side so the
       page reads with the same rhythm as the home page. -->
  <template v-for="(section, i) in sections" :key="section.id">
    <!-- Wave into the section. Previous surface is `brand` for the
         first divider (coming out of the green fold), then alternates
         between cream/surface to match the previous section's tone. -->
    <WaveDivider :from="i === 0 ? 'brand' : sections[i - 1].tone" :to="section.tone" />

    <section
      :id="section.id"
      :class="[
        '-mt-px scroll-mt-[calc(var(--nav-h)+1rem)]',
        section.tone === 'cream' ? 'bg-cream text-ink' : 'bg-surface text-ink',
      ]"
    >
      <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
        <div class="flex flex-col gap-4 max-w-3xl">
          <h2 class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-lg">
            {{ section.headline }}
            <em class="italic font-light text-brand">{{ section.headlineEm }}</em>
          </h2>
          <p class="text-lg leading-relaxed text-muted max-w-2xl">
            {{ section.sub }}
          </p>
        </div>

        <div
          v-if="section.products.length"
          class="mt-12 md:mt-14 grid gap-5 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <!-- Add-to-cart variant alternates by section index so
               the three bands read as a pattern: green → yellow →
               green. Only the middle band uses the accent (yellow)
               variant; first and last stay on primary (brand green).
               `i % 2 === 1` keeps this rhythm working if more
               sections are ever appended. -->
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
            :cta-variant="i % 2 === 1 ? 'accent' : 'primary'"
            @add="onAdd(product)"
          />
        </div>
      </div>
    </section>
  </template>

  <!-- Bottom clearance for the mobile floating cluster (search / cart /
       menu), same pattern as HomePage so both pages align visually. -->
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
