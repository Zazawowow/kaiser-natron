import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/pages/ShopPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/kaiserhacks',
    name: 'kaiserhacks',
    component: () => import('@/pages/KaiserhacksPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/shop/:slug',
    name: 'product',
    component: () => import('@/pages/ProductPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/bundles/:slug',
    name: 'bundle',
    component: () => import('@/pages/BundlePage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/checkout/success',
    name: 'checkout-success',
    component: () => import('@/pages/CheckoutSuccessPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/checkout',
    component: () => import('@/pages/CheckoutPage.vue'),
    meta: { layout: 'none' },
    children: [
      { path: '', redirect: '/checkout/cart' },
      {
        path: 'cart',
        name: 'checkout-cart',
        component: () => import('@/pages/checkout/CartStep.vue'),
      },
      {
        path: 'account',
        name: 'checkout-account',
        component: () => import('@/pages/checkout/AccountStep.vue'),
      },
      {
        path: 'shipping',
        name: 'checkout-shipping',
        component: () => import('@/pages/checkout/ShippingStep.vue'),
      },
      {
        path: 'payment',
        name: 'checkout-payment',
        component: () => import('@/pages/checkout/PaymentStep.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { layout: 'none' },
  },
  {
    path: '/pflege',
    name: 'pflege',
    component: () => import('@/pages/CategoryPage.vue'),
    props: { slug: 'pflege', useCase: 'care' },
    meta: { layout: 'none' },
  },
  {
    path: '/haushalt',
    name: 'haushalt',
    component: () => import('@/pages/CategoryPage.vue'),
    props: { slug: 'haushalt', useCase: 'clean' },
    meta: { layout: 'none' },
  },
  {
    path: '/kueche',
    name: 'kueche',
    component: () => import('@/pages/CategoryPage.vue'),
    props: { slug: 'kueche', useCase: 'cook' },
    meta: { layout: 'none' },
  },
  {
    path: '/impressum',
    name: 'impressum',
    component: () => import('@/pages/LegalPage.vue'),
    props: { kind: 'impressum' },
    meta: { layout: 'none' },
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: () => import('@/pages/LegalPage.vue'),
    props: { kind: 'datenschutz' },
    meta: { layout: 'none' },
  },
  {
    path: '/design/preview/navbar',
    name: 'ds-preview-navbar',
    component: () => import('@/pages/design/previews/NavbarPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design/preview/hero',
    name: 'ds-preview-hero',
    component: () => import('@/pages/design/previews/HeroPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design/preview/bundles',
    name: 'ds-preview-bundles',
    component: () => import('@/pages/design/previews/BundlesPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design/preview/revitalization',
    name: 'ds-preview-revitalization',
    component: () => import('@/pages/design/previews/RevitalizationPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design/preview/about',
    name: 'ds-preview-about',
    component: () => import('@/pages/design/previews/AboutPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design/preview/kaiserhacks',
    name: 'ds-preview-kaiserhacks',
    component: () => import('@/pages/design/previews/KaiserhacksPreview.vue'),
    meta: { layout: 'none', preview: true },
  },
  {
    path: '/design',
    component: () => import('@/pages/design/DesignLayout.vue'),
    meta: { layout: 'none' },
    children: [
      { path: '', redirect: '/design/logo' },
      { path: 'logo', name: 'ds-logo', component: () => import('@/pages/design/LogoSection.vue') },
      { path: 'colors', name: 'ds-colors', component: () => import('@/pages/design/ColorsSection.vue') },
      { path: 'typography', name: 'ds-typography', component: () => import('@/pages/design/TypographySection.vue') },
      { path: 'radii', name: 'ds-radii', component: () => import('@/pages/design/RadiiSection.vue') },
      { path: 'shadows', name: 'ds-shadows', component: () => import('@/pages/design/ShadowsSection.vue') },
      { path: 'motion', name: 'ds-motion', component: () => import('@/pages/design/MotionSection.vue') },
      { path: 'buttons', name: 'ds-buttons', component: () => import('@/pages/design/ButtonsSection.vue') },
      { path: 'badges', name: 'ds-badges', component: () => import('@/pages/design/BadgesSection.vue') },
      { path: 'inputs', name: 'ds-inputs', component: () => import('@/pages/design/InputsSection.vue') },
      { path: 'cards', name: 'ds-cards', component: () => import('@/pages/design/CardsSection.vue') },
      { path: 'products', name: 'ds-products', component: () => import('@/pages/design/ProductsSection.vue') },
      { path: 'bundle-card', name: 'ds-bundle-card', component: () => import('@/pages/design/BundleCardSection.vue') },
      { path: 'hero', name: 'ds-hero', component: () => import('@/pages/design/HeroSection.vue') },
      { path: 'navbar', name: 'ds-navbar', component: () => import('@/pages/design/NavbarSection.vue') },
      { path: 'language', name: 'ds-language', component: () => import('@/pages/design/LanguageSwitcherSection.vue') },
      { path: 'icons', name: 'ds-icons', component: () => import('@/pages/design/IconsSection.vue') },
      { path: 'search', name: 'ds-search', component: () => import('@/pages/design/SearchSection.vue') },
      { path: 'cart-drawer', name: 'ds-cart-drawer', component: () => import('@/pages/design/CartDrawerSection.vue') },
      { path: 'quantity-stepper', name: 'ds-quantity-stepper', component: () => import('@/pages/design/QuantityStepperSection.vue') },
      { path: 'bundles', name: 'ds-bundles', component: () => import('@/pages/design/BundlesSection.vue') },
      { path: 'kaiserhacks', name: 'ds-kaiserhacks', component: () => import('@/pages/design/KaiserhacksSection.vue') },
      { path: 'revitalization', name: 'ds-revitalization', component: () => import('@/pages/design/RevitalizationSection.vue') },
      { path: 'about', name: 'ds-about', component: () => import('@/pages/design/AboutSection.vue') },
      { path: 'footer', name: 'ds-footer', component: () => import('@/pages/design/FooterSection.vue') },
      { path: 'checkout-stepper', name: 'ds-checkout-stepper', component: () => import('@/pages/design/CheckoutStepperSection.vue') },
    ],
  },
]

const router = createRouter({
  // BASE_URL follows Vite's `base` — '/' standalone, '/kaiser-natron/'
  // when built for the ENERGEIA umbrella deployment.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll rules:
  //  • Browser back/forward → restore the previous scroll y so
  //    /shop ⇄ /shop/<slug> and / ⇄ /shop/<slug> round-trips land
  //    exactly where the user left off.
  //  • Same-route hash nav (e.g. clicking Bundles while on the
  //    home page) → smooth-scroll to the target.
  //  • Cross-route hash nav (e.g. /shop → /#bundles): the
  //    destination just mounted, so jump instantly.
  //  • Plain forward route nav → top of the page.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      const sameRoute = from && from.path === to.path
      return sameRoute
        ? { el: to.hash, behavior: 'smooth' }
        : { el: to.hash }
    }
    return { top: 0 }
  },
})

export default router
