<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import Logo from './Logo.vue'
import Icon from './Icon.vue'
import IconButton from './IconButton.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import Search from './Search.vue'
import { products as defaultProducts } from '@/api/index.js'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  variant: {
    type: String,
    default: 'paper',
    validator: (v) => ['brand', 'cream', 'paper'].includes(v),
  },
  /**
   * Layout:
   *  - 'standard': edge-to-edge bar with bottom border (static at top of page)
   *  - 'floating': sticky rounded card that detaches from page edges with a shadow
   */
  layout: {
    type: String,
    default: 'standard',
    validator: (v) => ['standard', 'floating'].includes(v),
  },
  items: {
    type: Array,
    default: () => [
      { key: 'nav.shop', href: '#' },
      { key: 'nav.applications', href: '#' },
      { key: 'nav.about', href: '#' },
      { key: 'nav.contact', href: '#' },
    ],
  },
  cartCount: { type: Number, default: 0 },
  floatOnMobile: { type: Boolean, default: true },
  /**
   * Catalogue the search overlay queries. Defaults to the frontend fixture
   * so the navbar is usable on its own; callers pass in their own list once
   * the product data is backend-driven.
   */
  products: { type: Array, default: () => defaultProducts },
})

defineEmits(['cart', 'nav', 'select'])

const { t } = useI18n()
const menuOpen = ref(false)
const searchOpen = ref(false)

// Cart is always warm yellow — one consistent affordance on mobile and desktop,
// regardless of bar tone.
const CART_CLASS = 'bg-accent text-brand hover:bg-accent-soft'

const tones = {
  brand: {
    bar: 'bg-brand text-cream border-cream-line',
    link: 'text-cream hover:text-accent',
    logo: 'text-cream',
    searchTrigger: 'border border-cream-line bg-cream-wash text-cream/80 hover:text-accent',
  },
  cream: {
    bar: 'bg-cream text-brand border-line',
    link: 'text-brand hover:text-brand-hover',
    logo: 'text-brand',
    searchTrigger: 'border border-line-strong bg-paper text-muted hover:text-brand',
  },
  paper: {
    bar: 'bg-paper text-ink border-line',
    link: 'text-ink hover:text-brand',
    logo: 'text-brand',
    searchTrigger: 'border border-line bg-paper text-muted hover:text-brand',
  },
}

const tone = computed(() => tones[props.variant])

// Both layouts stay pinned at the top of the scroll container while the user
// scrolls. `sticky` keeps it in normal document flow until it hits the top edge,
// which avoids the layout-shift that `position: fixed` would introduce.
const layoutClasses = computed(() =>
  props.layout === 'floating'
    ? 'sticky top-4 md:top-6 z-30 mx-4 md:mx-6 rounded-lg border shadow-md'
    : 'sticky top-0 z-30 border-b',
)

// Edge-to-edge: the bar's contents span the full bar width. Logo sits at the
// far left, language + cart cluster at the far right. No centered max-width
// container — matches the live kaiser-natron.at layout.
const innerPadding = computed(() =>
  props.layout === 'floating'
    ? 'px-6 md:pl-4 md:pr-8 py-3 md:py-3.5'
    : 'px-6 md:px-8 lg:px-10 py-5',
)

const logoClasses = computed(() =>
  props.layout === 'floating'
    ? 'w-9 md:w-16 h-auto'
    : 'w-12 md:w-24 h-auto',
)

function itemLabel(item) {
  return item.key ? t(item.key) : item.label
}

watch(menuOpen, (open) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.documentElement.style.overflow = ''
})
</script>

<template>
  <header :class="['font-sans', layoutClasses, tone.bar]">
    <div :class="[innerPadding, 'flex items-center justify-between gap-6']">
      <!-- Left: logo + desktop nav -->
      <div class="flex items-center gap-10 min-w-0">
        <a
          href="/"
          :class="['block shrink-0 py-1', tone.logo]"
          aria-label="Kaiser Natron home"
        >
          <Logo :class="logoClasses" />
        </a>
        <nav class="hidden md:flex items-center gap-7">
          <a
            v-for="item in items"
            :key="item.key || item.label"
            :href="item.href || '#'"
            :class="[tone.link, 'text-[14px] font-medium tracking-label transition-colors duration-base']"
            @click="$emit('nav', item)"
          >{{ itemLabel(item) }}</a>
        </nav>
      </div>

      <!-- Right: search + language + cart (desktop only) -->
      <div class="hidden md:flex items-center gap-4">
        <button
          type="button"
          :class="[
            'inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-pill text-[13px] font-medium tracking-label transition-colors duration-base',
            tone.searchTrigger,
          ]"
          :aria-label="t('search.open')"
          @click="searchOpen = true"
        >
          <Icon name="search" :size="16" />
          <span>{{ t('search.placeholder') }}</span>
        </button>
        <LanguageSwitcher :tone="variant" />
        <button
          type="button"
          :class="[CART_CLASS, 'relative inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-base ease-out hover:-translate-y-0.5']"
          :aria-label="t('cart.open')"
          @click="$emit('cart')"
        >
          <Icon name="cart" :size="20" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center"
          >{{ cartCount }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile floating search (bottom-left). Matches the bottom-right
         cluster's safe-area handling so it clears the home indicator. -->
    <div
      v-if="floatOnMobile"
      class="md:hidden fixed bottom-5 left-5 z-40"
      style="padding-bottom: env(safe-area-inset-bottom);"
    >
      <IconButton
        icon="search"
        variant="float"
        size="lg"
        :icon-stroke-width="2"
        :aria-label="t('search.open')"
        @click="searchOpen = true"
      />
    </div>

    <!-- Mobile floating cluster (bottom-right) -->
    <div
      v-if="floatOnMobile"
      class="md:hidden fixed bottom-5 right-5 z-40 flex items-center gap-3"
      style="padding-bottom: env(safe-area-inset-bottom);"
    >
      <button
        type="button"
        :class="[CART_CLASS, 'relative w-14 h-14 rounded-full shadow-md flex items-center justify-center transition-transform duration-base ease-out hover:-translate-y-0.5 active:translate-y-0']"
        :aria-label="t('cart.open')"
        @click="$emit('cart')"
      >
        <Icon name="cart" :size="22" />
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center"
        >{{ cartCount }}</span>
      </button>
      <IconButton
        icon="menu"
        variant="float"
        size="lg"
        :icon-size="24"
        :icon-stroke-width="2"
        :aria-label="t('menu.open')"
        @click="menuOpen = true"
      />
    </div>

    <!-- Mobile overlay menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-slow ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-base ease-out"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="menuOpen"
          class="fixed inset-0 z-50 bg-brand text-cream flex flex-col font-sans"
        >
          <div
            class="flex items-center px-6 pt-6 pb-4"
            style="padding-top: calc(env(safe-area-inset-top) + 1.5rem);"
          >
            <Logo class="w-12 h-auto text-cream" />
          </div>

          <nav class="flex-1 flex flex-col justify-center px-8 gap-3 overflow-y-auto">
            <a
              v-for="item in items"
              :key="item.key || item.label"
              :href="item.href || '#'"
              class="font-serif font-normal text-[clamp(2.25rem,9vw,3.5rem)] tracking-tight leading-[1.05] text-cream hover:text-accent transition-colors duration-base"
              @click="menuOpen = false; $emit('nav', item)"
            >{{ itemLabel(item) }}</a>
          </nav>

          <!-- Language selector above the cart/close row, styled for brand green -->
          <div class="px-6 pb-6 flex justify-center">
            <LanguageSwitcher tone="brand" />
          </div>

          <div
            class="px-6 py-6 border-t border-cream-line flex items-center gap-3"
            style="padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem);"
          >
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-between px-6 py-4 rounded-pill bg-accent text-brand font-semibold tracking-label hover:bg-accent-soft transition-colors"
              @click="menuOpen = false; $emit('cart')"
            >
              <span class="inline-flex items-center gap-3">
                <Icon name="cart" :size="20" />
                {{ t('cart.label') }}
              </span>
              <span
                v-if="cartCount > 0"
                class="min-w-[22px] h-[22px] px-2 rounded-full bg-brand text-accent text-[12px] font-bold flex items-center justify-center"
              >{{ cartCount }}</span>
            </button>
            <IconButton
              icon="close"
              variant="cream-wash"
              size="lg"
              :icon-size="20"
              :aria-label="t('menu.close')"
              class="shrink-0"
              @click="menuOpen = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <Search
      v-model="searchOpen"
      :products="products"
      :tone="variant"
      @select="(p) => $emit('search', p)"
    />
  </header>
</template>
