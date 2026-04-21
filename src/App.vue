<script setup>
import { computed, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import SplashIntro from './components/SplashIntro.vue'

const route = useRoute()
const useDefaultLayout = computed(() => route.meta.layout !== 'none')
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
  <DefaultLayout v-if="useDefaultLayout">
    <router-view />
  </DefaultLayout>
  <router-view v-else />
  <A11yToolbar v-if="isDev && isDesignRoute && !isPreview && !inIframe" />
</template>
