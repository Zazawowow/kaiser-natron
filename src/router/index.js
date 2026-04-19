import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  {
    path: '/design',
    component: () => import('@/pages/design/DesignLayout.vue'),
    meta: { layout: 'none' },
    children: [
      { path: '', redirect: '/design/colors' },
      { path: 'colors', name: 'ds-colors', component: () => import('@/pages/design/ColorsSection.vue') },
      { path: 'typography', name: 'ds-typography', component: () => import('@/pages/design/TypographySection.vue') },
      { path: 'radii', name: 'ds-radii', component: () => import('@/pages/design/RadiiSection.vue') },
      { path: 'shadows', name: 'ds-shadows', component: () => import('@/pages/design/ShadowsSection.vue') },
      { path: 'buttons', name: 'ds-buttons', component: () => import('@/pages/design/ButtonsSection.vue') },
      { path: 'badges', name: 'ds-badges', component: () => import('@/pages/design/BadgesSection.vue') },
      { path: 'inputs', name: 'ds-inputs', component: () => import('@/pages/design/InputsSection.vue') },
      { path: 'cards', name: 'ds-cards', component: () => import('@/pages/design/CardsSection.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
