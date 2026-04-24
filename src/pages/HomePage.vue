<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Navbar from '@/design-system/components/Navbar.vue'
import Hero from '@/design-system/components/Hero.vue'
import Bundles from '@/design-system/components/Bundles.vue'
import Revitalization from '@/design-system/components/Revitalization.vue'
import About from '@/design-system/components/About.vue'
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
  '/products/ai/kaiser-natron-pulver-250-g-grosspackung.png'

const heroProductId = 'kaiser-natron-pulver-250-g-grosspackung'

// Second-fold banner — cream tone, image-left split, alternate cutout.
const imgBanner = '/products/ai/kaiser-natron-bad-500-g.png'
const bannerProductId = 'kaiser-natron-pulver-250-g-grosspackung'

// Homepage top-level nav items — overrides the Navbar default so the
// homepage reads as the shop entry point (Shop / Bundles / Revitalisierung
// / Über uns) instead of the generic catalogue chrome.
// Primary nav — the top-level shop destinations, rendered on the left
// of the Navbar. Cook / Clean / Care deep-link into the Shop page's
// use-case sections so users land on the right band immediately.
const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.cook', href: '/shop#cook' },
  { key: 'nav.clean', href: '/shop#clean' },
  { key: 'nav.care', href: '/shop#care' },
]

// Secondary nav — supporting pages. Rendered on the right, tucked to
// the left of the search trigger. Same visual treatment as primary so
// the split reads as "categories | pages" rather than two navs.
const navSecondaryItems = [
  { key: 'nav.bundles', href: '#bundles' },
  { key: 'nav.revitalization', href: '#revitalize' },
  { key: 'nav.about', href: '#about' },
]

// Mobile-only category shortcuts rendered under the hero image. Three
// pills that point at the shop's top-level use-cases. Labels are
// translated through the page i18n so the German/English splits stay
// in sync with the rest of the site copy.
// Mobile hero category pills — deep-link into the Shop page's
// matching use-case section (`/shop#cook`, `/shop#clean`,
// `/shop#care`). The router's `scrollBehavior` resolves the hash
// after navigation so the user lands directly on the section.
// Same targets the desktop top-nav uses, so the two entry points
// stay consistent.
const heroCategories = computed(() => [
  { label: t('home.categories.clean'), href: '/shop#clean' },
  { label: t('home.categories.cook'), href: '/shop#cook' },
  { label: t('home.categories.care'), href: '/shop#care' },
])

// Bundles sidebar copy resolves through the page's own i18n namespace so
// component internals stay decoupled from any particular key tree.
const bundlesCopy = computed(() => ({
  headline: t('bundles.headline.a'),
  headlineEm: t('bundles.headline.em'),
  sub: t('bundles.sub'),
  joinCta: t('bundles.joinCta'),
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
  notifyCta: t('revit.notifyCta'),
  features: [
    { title: t('revit.feature.1.title'), icon: '⚗️' },
    { title: t('revit.feature.2.title'), icon: '💊' },
    { title: t('revit.feature.3.title'), icon: '🌿' },
  ],
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

// Three curated bundles. Each caps items at three to honour the
// "max three things" rule — Haushalts and Wäsche are trimmed to their
// most distinctive products; Wohlfühl is naturally three already.
const bundles = [
  {
    id: 'haushalt',
    name: 'Haushalts-Bundle',
    usage: '2–3× pro Quartal empfohlen',
    items: [
      '1× Kaiser-Natron Pulver 250 g',
      '1× Allzweck-Spray 500 ml',
      '1× Spülmittel 500 ml',
    ],
    price: 24.9,
    memberPrice: 21.17,
    image: '/products/ai/kaiser-natron-pulver-250-g-grosspackung.png',
    imageAlt: 'Haushalts-Bundle mit Kaiser-Natron',
    badge: 'Bestseller',
    badgeVariant: 'accent',
  },
  {
    id: 'waesche',
    name: 'Wäsche & Pflege',
    usage: '1–2× pro Quartal',
    items: ['1× Holste Wasch-Soda 500 g', '1× Gazelle Wäschestärke 1 l', '1× Linda Fleckenweg 200 ml'],
    price: 22.9,
    memberPrice: 19.47,
    image: '/products/ai/kaiser-natron-pulver-250-g-grosspackung.png',
    imageAlt: 'Wäsche & Pflege Bundle',
    badge: '',
    badgeVariant: 'accent',
  },
  {
    id: 'wohlfuehl',
    name: 'Wohlfühl-Bundle',
    usage: '1× pro Quartal',
    items: ['1× Kaiser-Natron Tabletten 100 g', '1× Kaiser-Natron Bad 500 g', '1× Kaiser-Natron Fußbad 500 g'],
    price: 29.9,
    memberPrice: 25.42,
    image: '/products/ai/kaiser-natron-bad-500-g.png',
    imageAlt: 'Wohlfühl-Bundle mit Kaiser-Natron Bad',
    badge: '',
    badgeVariant: 'accent',
  },
]

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
// lives here (not on the bundle object) to keep the bundle config
// decoupled from the fixture-driven cart.
const bundleAnchorProduct = {
  haushalt: 'kaiser-natron-pulver-250-g-grosspackung',
  waesche: 'holste-wasch-soda-500-g-beutel',
  wohlfuehl: 'kaiser-natron-bad-500-g',
}

async function onBundleAdd(bundleId) {
  const productId = bundleAnchorProduct[bundleId]
  if (!productId) return
  await addToCart(productId, 1)
  cartOpen.value = true
}

function onBundleJoin() {
  // Placeholder — member signup flow is a backend concern. For now,
  // clicking "Mitglied werden" simply scrolls to the bundles grid.
  const el = document.getElementById('bundles')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onRevitNotify() {
  // Placeholder — early-access capture goes to the backend once wired.
  // No-op for the demo.
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
       and the wrapper share the brand green, so the overlap reads as
       a single continuous surface, and the hero centers at the TRUE
       viewport vertical midpoint (50svh) rather than the midpoint of
       the nav-offset space below it. The wave divider sits OUTSIDE
       this wrapper so it never eats vertical space from the centering
       calculation. `--nav-h` is defaulted in global CSS so first
       paint is correct; a ResizeObserver refines it on mount. -->
  <div
    class="flex flex-col bg-brand md:min-h-[calc(100svh-var(--nav-h))] md:justify-center"
  >
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
      <!-- Mobile-only category shortcuts. Three pills sit directly
           under the hero jar so the phone user can jump straight to
           a use-case context without scrolling past the whole fold.
           Hidden on md+ because desktop already has full nav chrome. -->
      <template #afterMedia>
        <div class="md:hidden mt-6 flex items-center justify-center gap-2">
          <a
            v-for="cat in heroCategories"
            :key="cat.href"
            :href="cat.href"
            class="inline-flex items-center justify-center rounded-pill border border-cream/50 px-5 py-2.5 text-sm font-semibold tracking-label text-cream transition-colors duration-base hover:border-cream hover:bg-cream-wash-strong"
          >{{ cat.label }}</a>
        </div>
      </template>
    </Hero>
  </div>

  <!-- Wave divider from brand-green → cream. Sits OUTSIDE the fold
       wrapper so it doesn't steal vertical space from the hero's
       centering. The SVG is fully opaque: a cream rect fills the
       whole viewBox so the SVG's bottom row is solid cream (matches
       the banner below → no seam), and a green path paints the top
       portion (matches the bg-brand fold above → no seam). -->
  <svg
    aria-hidden="true"
    class="block w-full h-12 md:h-16 shrink-0 -mb-px bg-brand"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="64" fill="var(--color-cream)" />
    <path
      d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
      fill="var(--color-brand)"
    />
  </svg>

  <!-- Second-fold product banner — same Hero component, cream surface,
       split layout reversed so the product sits on the left. `compact`
       tightens the desktop media sizing so this section reads as a
       companion band, not a second full hero stage. The -mt-px pairs
       with the wave's -mb-px to overlap the two sections by 1 CSS
       pixel and hide any device-pixel seam. -->
  <Hero
    class="-mt-px"
    variant="split"
    tone="cream"
    reverse
    compact
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

  <!-- Cream → surface wave between the second banner and the bundles
       section. Same construction as the green→cream wave on the first
       fold: solid rect fills the destination color (surface), a path
       paints the wavy top in the source color (cream). `-mb-px` overlaps
       the bundles section by a device pixel to hide hairline seams. -->
  <svg
    aria-hidden="true"
    class="block w-full h-12 md:h-16 shrink-0 -mb-px bg-cream"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="64" fill="var(--color-surface)" />
    <path
      d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
      fill="var(--color-cream)"
    />
  </svg>

  <!-- Bundles — surface (warm off-white) so the cream banner above and the
       cream cards below both stand out as distinct layers. Three bundles,
       three items per bundle, three benefits. Mobile stacks the cards;
       md+ flips to a one-at-a-time scroll-snap carousel. -->
  <Bundles
    class="-mt-px"
    layout="stacked"
    :bundles="bundles"
    :headline="bundlesCopy.headline"
    :headline-em="bundlesCopy.headlineEm"
    :sub="bundlesCopy.sub"
    :benefits="bundlesCopy.benefits"
    :join-cta="bundlesCopy.joinCta"
    @add="onBundleAdd"
    @join="onBundleJoin"
  />

  <!-- Surface → brand wave. rect is the destination (brand), path is the
       source (surface) painted over the top of the wave. -->
  <svg
    aria-hidden="true"
    class="block w-full h-12 md:h-16 shrink-0 -mb-px bg-surface"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="64" fill="var(--color-brand)" />
    <path
      d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
      fill="var(--color-surface)"
    />
  </svg>

  <!-- Revitalization Center — brand green "coming soon" section. Three
       pillars (science / therapy / natural healing), single CTA. -->
  <Revitalization
    class="-mt-px"
    :eyebrow="revitCopy.eyebrow"
    :headline="revitCopy.headline"
    :headline-em="revitCopy.headlineEm"
    :sub="revitCopy.sub"
    :features="revitCopy.features"
    :notify-cta="revitCopy.notifyCta"
    @notify="onRevitNotify"
  />

  <!-- Brand → cream wave. Same construction as the first-fold wave, just
       between the revit section and the about section. -->
  <svg
    aria-hidden="true"
    class="block w-full h-12 md:h-16 shrink-0 -mb-px bg-brand"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="64" fill="var(--color-cream)" />
    <path
      d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
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

