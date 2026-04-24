<script setup>
import { computed, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import SplashIntro from './components/SplashIntro.vue'

const route = useRoute()
const isPreview = computed(() => route.meta.preview === true)
const isDesignRoute = computed(() => route.path.startsWith('/design'))
const inIframe = typeof window !== 'undefined' && window.self !== window.top

// Show the splash once per session, and never inside the DS iframe previews —
// it would replay every time the preview reloads, which is not what we want.
const splashAlreadyShown =
  typeof window !== 'undefined' && window.sessionStorage?.getItem('splashed') === '1'
const showSplash = ref(!splashAlreadyShown && !inIframe && !isPreview.value)

function onSplashFinished() {
  showSplash.value = false
  try {
    window.sessionStorage?.setItem('splashed', '1')
  } catch {}
}

const isDev = import.meta.env.DEV
const A11yToolbar = isDev
  ? defineAsyncComponent(() => import('./design-system/devtools/A11yToolbar.vue'))
  : null
</script>

<template>
  <SplashIntro v-if="showSplash" @finished="onSplashFinished" />
  <!-- Single router outlet. Each page (Home, Shop, /design/*) owns its
       own layout chrome — no app-level wrapper, so there's no frame
       where an intermediate layout can flash before the route
       resolves. (Previously a conditional DefaultLayout was rendered
       whenever `route.meta.layout !== 'none'`, but during initial
       load `route.meta` is `{}`, so the condition was truthy and the
       dev sidebar showed under every page for one frame.) -->
  <router-view />
  <A11yToolbar v-if="isDev && isDesignRoute && !isPreview && !inIframe" />
</template>
