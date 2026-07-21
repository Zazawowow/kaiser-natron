<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isPreview = computed(() => route.meta.preview === true)
const isDesignRoute = computed(() => route.path.startsWith('/design'))
const inIframe = typeof window !== 'undefined' && window.self !== window.top

const isDev = import.meta.env.DEV
const A11yToolbar = isDev
  ? defineAsyncComponent(() => import('./design-system/devtools/A11yToolbar.vue'))
  : null

// ENERGEIA umbrella deployments (VITE_UMBRELLA=1 at build time) get the
// house strip above the page chrome; standalone kaiser-natron.at builds
// are untouched.
const isUmbrella = import.meta.env.VITE_UMBRELLA === '1'
const UmbrellaStrip = isUmbrella
  ? defineAsyncComponent(() => import('./design-system/components/UmbrellaStrip.vue'))
  : null

// Umbrella deep-link: ?add=<productId> pre-fills the cart (the umbrella
// page's product cards link here with it), then cleans the URL so a
// reload doesn't add twice. Goes through api/cart.js — the sanctioned
// surface — so it keeps working when the real backend lands.
if (isUmbrella && typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const addId = params.get('add')
  if (addId) {
    import('@/api/cart.js').then(({ addToCart }) => addToCart(addId))
    params.delete('add')
    const qs = params.toString()
    history.replaceState(
      null,
      '',
      window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash,
    )
  }
}
</script>

<template>
  <!-- Single router outlet. Each page (Home, Shop, /design/*) owns its
       own layout chrome — no app-level wrapper, so there's no frame
       where an intermediate layout can flash before the route
       resolves. The full-screen SplashIntro overlay was removed: the
       BrandHero on the home page now plays the figure entrance
       animation in flow, so the user lands on usable chrome (nav +
       hero) immediately rather than waiting through a 2.8s overlay. -->
  <UmbrellaStrip v-if="isUmbrella && !isPreview && !inIframe" />
  <router-view />
  <A11yToolbar v-if="isDev && isDesignRoute && !isPreview && !inIframe" />
</template>
