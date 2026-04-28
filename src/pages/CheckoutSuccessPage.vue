<script setup>
/**
 * CheckoutSuccessPage — landed via `?order=<id>` after a
 * successful Stripe redirect or after the mock confirm flow.
 *
 * Calls `confirmCheckout({ orderId })` once on mount to fetch the
 * canonical Order shape (status, amounts, addresses). The webhook
 * is the authoritative "paid" signal on the backend; this page is
 * the polite UI bridge for the user. Until the backend is wired,
 * the stub returns a synthetic `paid` order so the page renders
 * end-to-end.
 *
 * Two visual states: pending (loading skeleton while we resolve
 * the order) and confirmed (thank-you headline + summary).
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Navbar from '@/design-system/components/Navbar.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import { products, confirmCheckout } from '@/api/index.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const route = useRoute()

const navItems = [
  { key: 'nav.shop', href: '/shop' },
  { key: 'nav.bundles', href: '/#bundles' },
  { key: 'nav.revitalization', href: '/#revitalize' },
  { key: 'nav.about', href: '/#about' },
]
const navSecondaryItems = []

const order = ref(null)
const loadError = ref('')
const loading = ref(true)

const orderId = computed(() => String(route.query.order || ''))

onMounted(async () => {
  if (!orderId.value) {
    loadError.value = t('checkout.success.missing')
    loading.value = false
    return
  }
  try {
    order.value = await confirmCheckout({ orderId: orderId.value })
  } catch (err) {
    loadError.value = err?.message || t('checkout.error.generic')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Navbar
    variant="paper"
    layout="standard"
    :items="navItems"
    :secondary-items="navSecondaryItems"
    :products="products"
  />

  <main class="bg-cream text-ink min-h-svh">
    <div class="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
      <!-- Confirmation card. Centered on the page so it reads as
           the moment-of-truth screen — no competing layout, just
           the thank-you, order id, and a clear path back to
           shopping. -->
      <article class="rounded-md border border-line bg-paper p-8 md:p-10 flex flex-col gap-6 items-center text-center">
        <!-- Success badge — large brand-wash circle with a check
             so the user sees an unambiguous positive signal as the
             page lands. Pulse animation on the ring uses the DS's
             `--animate-pulse-soft` so it feels alive without being
             distracting. -->
        <div class="relative w-20 h-20">
          <span
            aria-hidden="true"
            class="absolute inset-0 rounded-full bg-brand-wash"
            style="animation: var(--animate-pulse-soft);"
          />
          <span
            class="absolute inset-0 rounded-full bg-brand text-accent flex items-center justify-center"
          >
            <Icon name="check" :size="36" :stroke-width="2.4" />
          </span>
        </div>

        <p class="eyebrow">{{ t('checkout.success.eyebrow') }}</p>
        <h1 class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md">
          {{ t('checkout.success.headline') }}
          <em class="italic font-light text-brand">{{ t('checkout.success.headline.em') }}</em>
        </h1>
        <p class="text-base leading-relaxed text-muted max-w-md">
          {{ t('checkout.success.sub') }}
        </p>

        <div
          v-if="orderId"
          class="mt-2 inline-flex items-center gap-2 rounded-pill border border-cream-dark bg-cream px-4 py-2 text-[13px] text-ink"
        >
          <span class="eyebrow text-muted">{{ t('checkout.success.orderId') }}</span>
          <span class="font-mono text-[12px] text-brand">{{ orderId }}</span>
        </div>

        <p
          v-if="loadError"
          class="text-[13px] text-danger mt-2"
          role="alert"
          aria-live="polite"
        >{{ loadError }}</p>

        <div class="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <RouterLink to="/shop" class="inline-flex">
            <Button variant="primary" size="lg">{{ t('checkout.success.cta.shop') }}</Button>
          </RouterLink>
          <RouterLink to="/" class="inline-flex">
            <Button variant="secondary" size="lg">{{ t('checkout.success.cta.home') }}</Button>
          </RouterLink>
        </div>

        <p v-if="!loading && order" class="text-[12px] text-muted mt-2">
          {{ t('checkout.success.email') }}
        </p>
      </article>
    </div>
  </main>
</template>
