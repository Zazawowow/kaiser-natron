<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Kaiserhacks from '@/design-system/components/Kaiserhacks.vue'
import Footer from '@/design-system/components/Footer.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import IconButton from '@/design-system/components/IconButton.vue'
import {
  products,
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '@/api/index.js'
import { kaiserhacksPage, localizeKaiserhacks } from '@/api/kaiserhacks.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()
const cartOpen = ref(false)
const selectedHack = ref(null)
const navRef = ref(null)

const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.kaiserhacks', href: '/kaiserhacks' },
]
const navSecondaryItems = []
const page = computed(() => localizeKaiserhacks(kaiserhacksPage, t))
const labels = computed(() => ({
  categories: t('kaiserhacks.labels.categories'),
  categoryNav: t('kaiserhacks.labels.categoryNav'),
  openVideo: t('kaiserhacks.labels.openVideo'),
  openImage: t('kaiserhacks.labels.openImage'),
  community: t('kaiserhacks.labels.community'),
  handoffNote: t('kaiserhacks.labels.handoffNote'),
}))

let navResizeObserver = null
function syncNavHeight() {
  const el = navRef.value
  const node = el && (el.$el || el)
  if (!node || typeof window === 'undefined') return
  const h = Math.round(node.getBoundingClientRect().height)
  document.documentElement.style.setProperty('--nav-h', `${h}px`)
}

function goCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

async function onSearchSelect(product) {
  await addToCart(product.id, 1)
  cartOpen.value = true
}

function onHackSelect(hack) {
  if (!hack?.video?.src && !hack?.video?.poster) return
  selectedHack.value = hack
}

async function onQty({ productId, quantity }) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
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

  <Kaiserhacks
    :eyebrow="page.eyebrow"
    :headline="page.headline"
    :sub="page.sub"
    :categories="page.categories"
    :instagram-href="page.instagramHref"
    :labels="labels"
    @select="onHackSelect"
  />

  <Footer />

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-slow ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-base ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedHack"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/70 p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="selectedHack.title"
        @click.self="selectedHack = null"
      >
        <div class="relative my-auto flex max-h-[calc(100svh-2rem)] w-full max-w-[min(430px,calc(100vw-2rem))] flex-col overflow-hidden rounded-md bg-paper shadow-lg sm:max-h-[calc(100svh-3rem)] sm:max-w-[min(430px,calc(100vw-3rem))]">
          <div class="absolute right-3 top-3 z-10">
            <IconButton
              icon="close"
              variant="float"
              size="sm"
              :aria-label="t('menu.close')"
              @click="selectedHack = null"
            />
          </div>

          <div
            :class="[
              'relative min-h-0 w-full shrink overflow-hidden bg-ink',
              selectedHack.video?.src
                ? 'aspect-[9/16] h-[min(62svh,640px)] max-h-[calc(100svh-14rem)]'
                : 'aspect-[11/9] max-h-[min(54svh,450px)]',
            ]"
          >
            <video
              v-if="selectedHack.video?.src"
              :key="selectedHack.id"
              class="absolute inset-0 h-full w-full bg-ink object-contain"
              :poster="selectedHack.video?.poster"
              controls
              autoplay
              playsinline
            >
              <source :src="selectedHack.video.src" type="video/mp4" />
            </video>
            <img
              v-else
              :src="selectedHack.video?.poster"
              :alt="selectedHack.video?.alt || selectedHack.title"
              class="absolute inset-0 h-full w-full bg-paper object-contain"
            />
          </div>

          <div class="min-h-0 overflow-y-auto p-5">
            <p class="eyebrow mb-2">{{ t('nav.kaiserhacks') }}</p>
            <h2 class="font-display text-2xl font-normal leading-tight text-ink">
              {{ selectedHack.title }}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              {{ selectedHack.detailDescription || selectedHack.description }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <div
    aria-hidden="true"
    class="min-[1100px]:hidden bg-cream"
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
