<script setup>
// Product detail page. One template, driven by data — every product
// in src/api/products.js can render here as long as the slug matches.
// Long-form copy is looked up per locale in src/i18n/products/, never
// inlined alongside the product fixture.

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Button from '@/design-system/components/Button.vue'
import Badge from '@/design-system/components/Badge.vue'
import Icon from '@/design-system/components/Icon.vue'
import QuantityStepper from '@/design-system/components/QuantityStepper.vue'
import ProductCard from '@/design-system/components/ProductCard.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import WaveDivider from '@/design-system/components/WaveDivider.vue'
import {
  products,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
// Navbar's API mirrors HomePage / ShopPage exactly so the chrome is
// indistinguishable across routes — same prop names, same events.
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'
import { useProductCopy } from '@/i18n/products/index.js'

const { t } = useI18n()
const cart = useCartStore()
const route = useRoute()
const router = useRouter()

const cartOpen = ref(false)
const qty = ref(1)

// Slug comes from the dynamic route segment; reactive so locale and
// route changes both re-resolve product + copy without remounting.
const slug = computed(() => String(route.params.slug || ''))
const product = computed(() => products.find((p) => p.id === slug.value) || null)
const copy = useProductCopy(slug)

// Reset qty + scroll to top whenever the user navigates between
// products via the related-products grid.
watch(slug, () => {
  qty.value = 1
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' })
})

// Dynamic back button. On mount we read `window.history.state.back`,
// which Vue Router populates with the path of the previous SPA entry
// (or null when this page was opened by a direct deep-link). The link
// label and target are then derived from that — pointing back to the
// shop list, the home page, or just calling router.back() so the
// router's scrollBehavior + savedPosition can land the user where
// they were on the previous page.
const referrerPath = ref(null)
onMounted(() => {
  const back = typeof window !== 'undefined' ? window.history.state?.back : null
  referrerPath.value = typeof back === 'string' ? back : null
})

const backLabelKey = computed(() => {
  const p = referrerPath.value
  if (!p) return 'product.back'
  if (p === '/' || p.startsWith('/#')) return 'product.backHome'
  if (p === '/shop' || p.startsWith('/shop?') || p.startsWith('/shop#')) return 'product.back'
  return 'product.backGeneric'
})

function goBack() {
  if (referrerPath.value) router.back()
  else router.push('/shop')
}

// Site-wide nav, mirrored from HomePage / ShopPage so the chrome reads
// as one piece across routes.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.kaiserhacks', href: '/kaiserhacks' },
]
const navSecondaryItems = []

const priceLabel = computed(() => {
  const p = product.value
  if (!p) return ''
  return `€ ${p.price.toFixed(2).replace('.', ',')}`
})

const properties = computed(() => product.value?.properties || [])

// Up to three sibling products from the same category, excluding self.
const related = computed(() => {
  const p = product.value
  if (!p) return []
  return products
    .filter((x) => x.id !== p.id && x.category === p.category)
    .slice(0, 3)
})

async function onAdd() {
  const p = product.value
  if (!p || !p.inStock) return
  await addToCart(p.id, qty.value)
  cartOpen.value = true
}
async function onAddRelated(p) {
  await addToCart(p.id, 1)
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

// Sticky-nav offset sync (same pattern as ShopPage).
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
    @search="onAddRelated"
  />

  <!-- 404 — slug doesn't resolve to a product. -->
  <main v-if="!product" class="min-h-[60vh] bg-cream">
    <div class="mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-8 md:py-32">
      <p class="font-display text-4xl font-normal text-ink md:text-5xl">{{ t('product.notFound.title') }}</p>
      <p class="mt-4 text-base leading-relaxed text-muted">{{ t('product.notFound.sub') }}</p>
      <RouterLink to="/shop" class="mt-8 inline-flex">
        <Button variant="primary" size="md">
          <template #before><Icon name="arrow-left" :size="16" /></template>
          {{ t('product.notFound.cta') }}
        </Button>
      </RouterLink>
    </div>
  </main>

  <main v-else>
    <!-- Hero band: brand-green first fold, two-column split.
         Sits flush under the brand-tone Navbar so they read as one
         continuous green surface. The product image floats on the
         green directly (no paper media tile) — relies on the cutout
         WebPs having clean alpha. Drop-shadow grounds the silhouette
         on the surface without a hard rectangle. -->
    <!-- md+ pins the hero to one viewport fold (100svh minus the
         sticky-nav offset) AND height-bounds it to the same value, so
         taller text columns can never push the hero past the fold on
         standard laptops. The image cap is viewport-relative (svh)
         rather than a fixed px so it tracks the available height
         exactly: it shrinks on a 13" laptop, grows on a 27" display,
         and the buy-box always lands above the wave divider.
         Mobile stays min-content so a tall buy-box doesn't get
         clipped on phones where viewport height is small. -->
    <section
      class="bg-brand text-cream md:flex md:min-h-[calc(100svh-var(--nav-h))] md:max-h-[calc(100svh-var(--nav-h))] md:flex-col md:justify-center"
    >
      <!-- Wider container on lg+ (max-w-7xl ≈ 1280px) than the rest of
           the site's max-w-6xl. Each grid column gets ~110px more
           breathing room, which means the title fits on fewer lines
           and the lead wraps tighter — letting the whole hero fit in
           a single viewport fold without compressing the image. -->
      <div class="mx-auto w-full max-w-6xl lg:max-w-7xl px-6 pt-8 pb-12 sm:px-8 md:py-6 lg:px-16 lg:py-8">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm tracking-label text-cream/80 transition-colors hover:text-accent"
          @click="goBack"
        >
          <Icon name="arrow-left" :size="14" />
          {{ t(backLabelKey) }}
        </button>

        <div class="mt-6 grid items-center gap-8 md:mt-6 md:grid-cols-2 md:gap-12 lg:gap-20">
          <!-- Media — transparent product floats on the green ground.
               Cap is viewport-relative so the image scales with
               available height instead of fighting fixed px caps:
               on a 720px viewport it lands ~38svh (≈275px), on a
               1080px display ~52svh (≈562px). -->
          <div class="order-1 flex items-center justify-center md:order-none">
            <img
              :src="product.image"
              :alt="product.title"
              class="max-w-[72%] max-h-[44vh] md:max-h-[48svh] lg:max-h-[52svh] w-auto object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.28)]"
              loading="eager"
              decoding="async"
            />
          </div>

          <!-- Copy + buy box -->
          <div class="order-2 flex flex-col justify-center">
            <h1 class="font-display text-4xl font-normal leading-tight text-cream md:text-5xl">
              {{ product.title }}
              <span class="block text-2xl text-cream/70 md:text-3xl">{{ product.size }}</span>
            </h1>

            <p
              v-if="copy && copy.tagline"
              class="mt-5 font-display italic font-light text-xl text-cream md:text-2xl"
            >{{ copy.tagline }}</p>

            <p
              v-if="copy && copy.lead"
              class="mt-4 text-base leading-relaxed text-cream/85"
            >{{ copy.lead }}</p>

            <!-- Property badges. Cream-wash chip on green, matching the
                 hero feature-tile language used on ShopPage / HomePage. -->
            <ul v-if="properties.length" class="mt-6 flex flex-wrap gap-2">
              <li v-for="code in properties" :key="code">
                <span class="inline-flex items-center rounded-pill border border-cream-line bg-cream-wash px-3 py-1 text-[11px] font-bold uppercase tracking-eyebrow text-cream">
                  {{ t(`product.prop.${code}`) }}
                </span>
              </li>
            </ul>

            <!-- Buy box. Cream-wash card lifts off the green ground
                 like the hero tiles; QuantityStepper keeps its native
                 paper background so the increment buttons stay
                 readable on the lighter chip. -->
            <div class="mt-8 flex flex-col gap-4 rounded-md border border-cream-line bg-cream-wash p-5 sm:flex-row sm:items-center sm:gap-5">
              <span class="font-display text-3xl font-normal text-cream">{{ priceLabel }}</span>
              <div class="flex items-center gap-3 sm:ml-auto">
                <QuantityStepper
                  v-model="qty"
                  :min="1"
                  :max="99"
                  :decrease-label="t('cart.qty.decrease')"
                  :increase-label="t('cart.qty.increase')"
                />
                <Button
                  variant="accent"
                  size="md"
                  :disabled="!product.inStock"
                  @click="onAdd"
                >
                  <template #before><Icon name="plus" :size="16" /></template>
                  {{ product.inStock ? t('product.addToCart') : t('product.outOfStock') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Long description band: paper tone, generous typography. Only
         renders when copy actually has long-form text so smaller
         products don't get a hollow band. -->
    <template v-if="copy && copy.descriptionLong">
      <WaveDivider from="brand" to="paper" />
      <section class="bg-paper">
        <div class="mx-auto w-full max-w-3xl px-6 py-16 text-center md:py-24 lg:px-0">
          <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.about.title') }}</p>
          <p class="mt-5 font-display text-2xl leading-relaxed text-ink md:text-3xl">
            {{ copy.descriptionLong }}
          </p>
        </div>
      </section>
    </template>

    <!-- Applications grid -->
    <template v-if="copy && copy.applications && copy.applications.length">
      <WaveDivider :from="copy && copy.descriptionLong ? 'paper' : 'brand'" to="cream" />
      <section class="bg-cream">
        <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 md:py-24 lg:px-16">
          <div class="max-w-2xl">
            <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.applications.title') }}</p>
            <p class="mt-3 font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
              {{ t('product.applications.sub') }}
            </p>
          </div>

          <ul class="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
            <li
              v-for="(item, i) in copy.applications"
              :key="i"
              class="flex flex-col gap-3 rounded-md border border-line bg-paper p-6"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 font-display text-base text-brand"
              >{{ String(i + 1).padStart(2, '0') }}</span>
              <h3
                v-if="item.title"
                class="font-display text-xl font-normal leading-snug text-ink"
              >{{ item.title }}</h3>
              <p
                v-if="item.body"
                :class="[
                  'leading-relaxed text-ink/80',
                  item.title ? 'text-sm' : 'text-base',
                ]"
              >{{ item.body }}</p>
            </li>
          </ul>
        </div>
      </section>
    </template>

    <!-- Ingredients + Warnings, side by side. -->
    <template v-if="copy && (copy.ingredients || copy.warnings)">
      <WaveDivider from="cream" to="paper" />
      <section class="bg-paper">
        <div class="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 md:py-24 lg:px-12">
          <div class="grid gap-10 md:grid-cols-2 md:gap-14">
            <div v-if="copy.ingredients">
              <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.ingredients.title') }}</p>
              <p class="mt-3 font-display text-xl leading-relaxed text-ink md:text-2xl">{{ copy.ingredients }}</p>
            </div>
            <div v-if="copy.warnings">
              <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.warnings.title') }}</p>
              <p class="mt-3 text-base leading-relaxed text-ink/80">{{ copy.warnings }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- FAQ — native <details> for zero JS, keyboard support, and a11y. -->
    <template v-if="copy && copy.faq && copy.faq.length">
      <WaveDivider from="paper" to="cream" />
      <section class="bg-cream">
        <div class="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 md:py-24">
          <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.faq.title') }}</p>
          <ul class="mt-8 flex flex-col gap-3">
            <li v-for="(item, i) in copy.faq" :key="i">
              <details class="group rounded-md border border-line bg-paper p-5 transition-colors open:border-brand-soft">
                <summary
                  class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg leading-snug text-ink"
                >
                  <span>{{ item.q }}</span>
                  <Icon
                    name="chevron-down"
                    :size="18"
                    class="shrink-0 text-brand-soft transition-transform duration-base ease-out group-open:rotate-180"
                  />
                </summary>
                <p class="mt-3 text-sm leading-relaxed text-ink/80">{{ item.a }}</p>
              </details>
            </li>
          </ul>
        </div>
      </section>
    </template>

    <!-- Related products -->
    <template v-if="related.length">
      <WaveDivider :from="copy && copy.faq && copy.faq.length ? 'cream' : 'paper'" to="paper" />
      <section class="bg-paper">
        <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 md:py-24 lg:px-16">
          <div class="max-w-2xl">
            <p class="text-sm uppercase tracking-label text-brand-soft">{{ t('product.related.title') }}</p>
            <p class="mt-3 font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
              {{ t('product.related.sub') }}
            </p>
          </div>
          <ul class="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            <li v-for="p in related" :key="p.id">
              <ProductCard
                :title="p.title"
                :size="p.size"
                :price="p.price"
                :image="p.image"
                :image-alt="p.title"
                :in-stock="p.inStock"
                :href="p.href"
                tone="cream"
                @add="onAddRelated(p)"
              />
            </li>
          </ul>
        </div>
      </section>
    </template>
  </main>

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
