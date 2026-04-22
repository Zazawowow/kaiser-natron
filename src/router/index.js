import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
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
      { path: 'buttons', name: 'ds-buttons', component: () => import('@/pages/design/ButtonsSection.vue') },
      { path: 'badges', name: 'ds-badges', component: () => import('@/pages/design/BadgesSection.vue') },
      { path: 'inputs', name: 'ds-inputs', component: () => import('@/pages/design/InputsSection.vue') },
      { path: 'cards', name: 'ds-cards', component: () => import('@/pages/design/CardsSection.vue') },
      { path: 'products', name: 'ds-products', component: () => import('@/pages/design/ProductsSection.vue') },
      { path: 'hero', name: 'ds-hero', component: () => import('@/pages/design/HeroSection.vue') },
      { path: 'navbar', name: 'ds-navbar', component: () => import('@/pages/design/NavbarSection.vue') },
      { path: 'language', name: 'ds-language', component: () => import('@/pages/design/LanguageSwitcherSection.vue') },
      { path: 'icons', name: 'ds-icons', component: () => import('@/pages/design/IconsSection.vue') },
      { path: 'search', name: 'ds-search', component: () => import('@/pages/design/SearchSection.vue') },
      { path: 'cart-drawer', name: 'ds-cart-drawer', component: () => import('@/pages/design/CartDrawerSection.vue') },
      { path: 'quantity-stepper', name: 'ds-quantity-stepper', component: () => import('@/pages/design/QuantityStepperSection.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
