<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'

const route = useRoute()
const variant = computed(() => {
  const v = route.query.variant
  return ['paper', 'cream', 'brand'].includes(v) ? v : 'paper'
})
const layout = computed(() => (route.query.layout === 'floating' ? 'floating' : 'standard'))
</script>

<template>
  <div class="min-h-screen bg-surface">
    <Navbar :variant="variant" :layout="layout" :cart-count="2" />
    <!-- Enough scroll content to demonstrate the sticky-on-scroll behavior. -->
    <div class="max-w-5xl mx-auto px-6 py-16 space-y-6">
      <div v-for="h in [40, 28, 40, 32, 40, 28, 36, 40]" :key="h"
        class="rounded-md border border-line bg-paper"
        :style="{ height: h * 4 + 'px' }"
      />
    </div>
  </div>
</template>
