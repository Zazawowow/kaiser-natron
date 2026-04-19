<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const useDefaultLayout = computed(() => route.meta.layout !== 'none')

const isDev = import.meta.env.DEV
const A11yToolbar = isDev
  ? defineAsyncComponent(() => import('./design-system/devtools/A11yToolbar.vue'))
  : null
</script>

<template>
  <DefaultLayout v-if="useDefaultLayout">
    <router-view />
  </DefaultLayout>
  <router-view v-else />
  <A11yToolbar v-if="isDev" />
</template>
