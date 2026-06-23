<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Hero from '@/design-system/components/Hero.vue'
import BrandHero from '@/design-system/components/BrandHero.vue'
import ProductTeaser from '@/design-system/components/ProductTeaser.vue'
import Bundles from '@/design-system/components/Bundles.vue'
import Revitalization from '@/design-system/components/Revitalization.vue'
import About from '@/design-system/components/About.vue'
import Footer from '@/design-system/components/Footer.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import {
  products,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { bundles } from '@/api/bundles.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()
const route = useRoute()
const cartOpen = ref(false)

// Smooth-scroll to the target section when the URL hash changes.
// Belt-and-suspenders for Vue Router's scrollBehavior — same-route
// hash navigations sometimes don't trigger it (or run before the
// section is mounted), so we re-fire scrollIntoView here. `immediate`
// covers the case where the user lands on /#bundles directly.
watch(
  () => route.hash,
  async (hash) => {
    if (!hash) return
    await nextTick()
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },
  { immediate: true },
)

// Cart drawer's "checkout" event closes the drawer and navigates to
// the checkout page. Kept centralised here (and on ShopPage) so the
// drawer stays purely presentational — it emits intent, the page
// decides where the user goes next.
function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

const imgPulver250 =
  '/products/kaiser-natron-pulver-250-g-grosspackung.webp'

const heroProductId = 'kaiser-natron-pulver-250-g-grosspackung'

// Second-fold banner — cream tone, image-left split. The headline is
// "Ein Pulver, hundert Anwendungen" (one powder, a hundred uses), so the
// banner shows POWDER — the 3.490 g bulk bucket, distinct from the 250 g
// Großpackung used in the first-fold hero (L7: was the Bad 500 g image,
// which contradicted the powder message).
const imgBanner = '/products/kaiser-natron-pulver-3.490-g-eimer.webp'
const bannerProductId = 'kaiser-natron-pulver-3490-g-eimer'

// Brand-hero → product-hero teaser: one SKU per use-case (Cook /
// Clean / Care). Avoids duplicating the Pulver 250 g (primary hero)
// and the Pulver Eimer (cream banner) so the row reads as new surface
// area rather than a repeat of what's already on screen.
const teaserIds = [
  'kaiser-natron-tabletten-100-g-dose',     // cook
  'kaiser-natron-allzweck-spray-500-ml',    // clean
  'kaiser-natron-fussbad-500-g',            // care
]
const teaserProducts = computed(() =>
  teaserIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({
      id: p.id,
      name: p.title,
      size: p.size,
      price: p.price,
      image: p.image,
      imageAlt: p.title,
      href: p.href,
    })),
)

// Homepage top-level nav items — overrides the Navbar default so the
// homepage reads as the shop entry point (Shop / Bundles / Revitalisierung
// / Über uns) instead of the generic catalogue chrome.
// Single top-left nav list — Shop + the supporting pages all sit
// together on the left of the Navbar. The category shortcuts
// (Cook / Clean / Care) are reachable from the Shop page itself
// rather than the global nav, keeping the chrome focused on
// top-level destinations.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.kaiserhacks', href: '/kaiserhacks' },
]
const navSecondaryItems = []

// Mobile-only category shortcuts rendered under the hero image. Three
// pills that point at the shop's top-level use-cases. Labels are
// translated through the page i18n so the German/English splits stay
// in sync with the rest of the site copy.

// Bundles sidebar copy resolves through the page's own i18n namespace so
// component internals stay decoupled from any particular key tree.
const bundlesCopy = computed(() => ({
  headline: t('bundles.headline.a'),
  headlineEm: t('bundles.headline.em'),
  sub: t('bundles.sub'),
  // "Become a member" CTA removed (U2 — no membership programme exists).
  benefits: [
    t('bundles.benefit.1.title'),
    t('bundles.benefit.2.title'),
    t('bundles.benefit.3.title'),
  ],
}))

const revitCopy = computed(() => ({
  eyebrow: t('revit.eyebrow'),
  headline: t('revit.headline.a'),
  headlineEm: t('revit.headline.em'),
  sub: t('revit.sub'),
  // Feature/animation row AND the "early access" CTA removed at the brand
  // owner's request (L10) → Revitalization renders eyebrow + headline + sub.
}))

const aboutCopy = computed(() => ({
  eyebrow: t('about.eyebrow'),
  headline: t('about.headline'),
  sub: t('about.sub'),
  milestones: [1, 2, 3].map((i) => ({
    year: t(`about.milestone.${i}.year`),
    title: t(`about.milestone.${i}.title`),
    text: t(`about.milestone.${i}.text`),
  })),
}))

// Bundle catalogue lives in @/api/bundles.js (structural data only —
// price, image, anchorProductId, href). The localized labels live in
// the i18n catalogue keyed `bundle.<id>.<field>`; we resolve them
// here through `t()` so the Bundles design-system component can stay
// agnostic of the i18n module and the locale switcher updates every
// label reactively.
const localizedBundles = computed(() =>
  bundles.map((b) => ({
    id: b.id,
    name: t(b.nameKey),
    usage: b.usageKey ? t(b.usageKey) : '',
    items: b.itemKeys.map((k) => t(k)),
    image: b.image,
    imageAlt: b.imageAltKey ? t(b.imageAltKey) : '',
    badge: b.badgeKey ? t(b.badgeKey) : '',
    badgeVariant: b.badgeVariant,
    price: b.price,
    href: b.href,
    aiEdited: b.aiEdited || false,
  })),
)

async function onHeroAdd() {
  await addToCart(heroProductId, 1)
  cartOpen.value = true
}

async function onBannerAdd() {
  await addToCart(bannerProductId, 1)
  cartOpen.value = true
}


// Bundles share a single "add" handler. Until the backend exposes a
// real bundle SKU endpoint, the UI stand-in adds the bundle's anchor
// product to the cart so the user gets visible feedback. The mapping
// is defined on each bundle (`anchorProductId`) so HomePage and the
// dedicated /bundles/<slug> pages stay in lock-step.
async function onBundleAdd(bundleId) {
  const bundle = bundles.find((b) => b.id === bundleId)
  if (!bundle?.anchorProductId) return
  await addToCart(bundle.anchorProductId, 1)
  cartOpen.value = true
}

async function onTeaserAdd(productId) {
  if (!productId) return
  await addToCart(productId, 1)
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

// First-fold vertical centering. The sticky navbar takes flow space
// above the green wrapper; if the wrapper is a full 100svh tall, the
// hero centers inside that block (which starts BELOW the nav) and
// its visual center lands ~navH/2 below the viewport's true center.
//
// The wrapper's height is driven by CSS: `100svh - var(--nav-h)`,
// with `--nav-h` defaulted in global styles so first paint is correct.
// This ResizeObserver refines `--nav-h` at runtime so the wrapper
// tracks real Navbar height changes (logo swaps, language changes,
// responsive breakpoints) without a layout shift.
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
  <!-- First fold — the navbar lives OUTSIDE the fold wrapper so its
       `position: sticky` escapes the wrapper's containing block and
       sticks to the document scroll instead. Previously the wrapper
       had `md:overflow-hidden`, which made the browser treat the
       wrapper as sticky's scrollport — the navbar scrolled away with
       it. The wrapper is now `md:min-h-svh` (no overflow clip), so
       the hero still fills the viewport on md+ without trapping
       sticky. -->
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
  <!-- First-fold wrapper — full viewport height, pulled up under the
       sticky nav via a negative margin equal to `--nav-h`. The nav
       and the wrapper share the brand green so the overlap reads as
       one continuous surface. Hosts the BrandHero — same illustration
       the SplashIntro overlay leaves behind, so the splash dismiss
       fades into a matching in-page artwork with no visual seam. -->
  <div
    class="flex flex-col bg-brand md:min-h-[calc(100svh-var(--nav-h))] md:justify-center"
  >
    <BrandHero class="w-full" />
  </div>

  <!-- Wave brand → cream. Mirrors the existing pattern: rect = dest
       colour (cream), path = source colour (brand), parent painted in
       source so the seam disappears against the section above. -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-brand"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-cream)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-brand)"
    />
  </svg>

  <!-- Three-product teaser — one SKU per Cook/Clean/Care use-case,
       cream surface, "Shop Kaiser Natron" CTA underneath funnels
       into the full catalogue. -->
  <ProductTeaser
    class="-mt-px"
    :eyebrow="t('home.teaser.eyebrow')"
    :headline="t('home.teaser.headline')"
    :sub="t('home.teaser.sub')"
    :products="teaserProducts"
    :cta-label="t('home.teaser.cta')"
    cta-href="/shop"
    tone="cream"
    @add="onTeaserAdd"
  />

  <!-- Wave cream → brand — sets up the existing Pulver product hero,
       which keeps its brand-green ground. rect = brand (dest), path =
       cream (source), parent painted cream. -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-cream"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-brand)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-cream)"
    />
  </svg>

  <!-- Existing Pulver 250 g hero — moved out of the first-fold
       wrapper since BrandHero now owns the first fold. Sits on
       brand-green via `tone="brand"`. -->
  <Hero
    class="-mt-px w-full"
    variant="split"
    tone="brand"
    :subheadline="t('ds.hero.sub')"
    :image="imgPulver250"
    image-alt="Kaiser-Natron Pulver 250 g Großpackung"
    :cta-label="t('ds.buttons.addToCart')"
    :secondary-label="t('ds.buttons.learnMore')"
    :secondary-href="`/shop/${heroProductId}`"
    @cta="onHeroAdd"
  >
    <template #headline>
      {{ t('ds.hero.headline.a') }}
      <em class="italic font-light text-cream">{{ t('ds.hero.headline.em') }}</em>
      {{ t('ds.hero.headline.b') }}
    </template>
  </Hero>

  <!-- Wave brand → surface — sets up the Bundles section, which now
       sits directly under the Pulver hero (banner + bundles swapped). -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-brand"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-surface)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-brand)"
    />
  </svg>

  <!-- Bundles — surface (warm off-white). Three bundles, three items
       per bundle, three benefits. Mobile stacks the cards; md+ flips
       to a one-at-a-time scroll-snap carousel. -->
  <Bundles
    class="-mt-px"
    layout="stacked"
    :bundles="localizedBundles"
    :headline="bundlesCopy.headline"
    :headline-em="bundlesCopy.headlineEm"
    :sub="bundlesCopy.sub"
    :benefits="bundlesCopy.benefits"
    @add="onBundleAdd"
  />

  <!-- Wave surface → cream into the second-fold cream banner. -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-surface"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-cream)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-surface)"
    />
  </svg>

  <!-- Second-fold product banner — same Hero component, cream surface,
       split layout reversed so the product sits on the left. `compact`
       tightens the desktop media sizing so this section reads as a
       companion band, not a second full hero stage. -->
  <Hero
    class="-mt-px"
    variant="split"
    tone="cream"
    reverse
    compact
    :eyebrow="t('home.banner.eyebrow')"
    :subheadline="t('home.banner.sub')"
    :image="imgBanner"
    image-alt="Kaiser-Natron® Pulver 3.490 g Eimer"
    :cta-label="t('ds.buttons.addToCart')"
    :secondary-label="t('ds.buttons.learnMore')"
    :secondary-href="`/shop/${bannerProductId}`"
    @cta="onBannerAdd"
  >
    <template #headline>
      {{ t('home.banner.headline.a') }}
      <em class="italic font-light text-brand-soft">{{ t('home.banner.headline.em') }}</em>
      {{ t('home.banner.headline.b') }}
    </template>
  </Hero>

  <!-- Wave cream → brand into the Revitalization section. -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-cream"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-brand)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-cream)"
    />
  </svg>

  <!-- Revitalization Center — brand green "coming soon" section.
       Headline + sub + single CTA (feature/animation row removed). -->
  <Revitalization
    class="-mt-px"
    :eyebrow="revitCopy.eyebrow"
    :headline="revitCopy.headline"
    :headline-em="revitCopy.headlineEm"
    :sub="revitCopy.sub"
  />

  <!-- Brand → cream wave. Same construction as the first-fold wave, just
       between the revit section and the about section. -->
  <svg
    aria-hidden="true"
    class="block w-full h-24 md:h-32 shrink-0 -mb-px bg-brand"
    viewBox="0 0 1440 128"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="128" fill="var(--color-cream)" />
    <path
      d="M0,0 L0,116 L1440,12 L1440,0 Z"
      fill="var(--color-brand)"
    />
  </svg>

  <!-- About / History — cream section, three milestones (1881 / early
       1900s / today) rendered as paper cards on the cream surface. -->
  <About
    class="-mt-px"
    :eyebrow="aboutCopy.eyebrow"
    :headline="aboutCopy.headline"
    :sub="aboutCopy.sub"
    :milestones="aboutCopy.milestones"
  />

  <Footer />

  <!-- Bottom clearance for the mobile floating cluster (search / cart / menu).
       Cluster sits at bottom-5 (20px) + safe-area, is 56px tall, and needs a
       24px breathing gap above it: 20 + 56 + 24 = 100px, plus the device's
       safe-area inset. Visible whenever the floating cluster is — i.e.
       below the navbar's 1100 px collapse threshold. -->
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
