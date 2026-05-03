<script setup>
/**
 * Step 1 — Cart review. Full-page version of the cart drawer:
 * line items with quantity steppers, a remove control, and a
 * compact totals strip. Express checkout (Apple Pay / Google Pay)
 * lives in the layout's right column on this step. The Continue
 * CTA sits in a fixed action footer at the bottom of the viewport.
 */
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Button from '@/design-system/components/Button.vue'
import QuantityStepper from '@/design-system/components/QuantityStepper.vue'
import Icon from '@/design-system/components/Icon.vue'
import {
  updateCartItem,
  removeFromCart,
  formatPrice,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()

const empty = computed(() => cart.isEmpty)

const SHIPPING_FLAT_EUR = 4.9

const subtotal = computed(() => cart.subtotal)
const shipping = computed(() => (cart.items.length ? SHIPPING_FLAT_EUR : 0))
const total = computed(() => +(subtotal.value + shipping.value).toFixed(2))

async function onQty(productId, quantity) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
}
function continueToAccount() {
  router.push('/checkout/account')
}

function exitToHome() {
  router.push('/')
}
</script>

<template>
  <div
    v-if="empty"
    class="min-h-[55svh] flex items-center justify-center"
  >
    <div
      class="flex flex-col gap-4 items-center text-center rounded-md border border-line bg-paper p-10 max-w-md w-full"
    >
      <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cream text-brand">
        <Icon name="cart" :size="24" :stroke-width="2" />
      </span>
      <p class="font-display text-xl text-brand">{{ t('cart.empty.title') }}</p>
      <p class="text-[14px] text-muted max-w-sm">{{ t('cart.empty.subtitle') }}</p>
      <RouterLink to="/shop" class="inline-flex">
        <Button variant="primary" size="md">{{ t('checkout.cart.cta.shop') }}</Button>
      </RouterLink>
    </div>
  </div>

  <section v-else class="flex flex-col gap-6">
    <ul class="flex flex-col rounded-md border border-line bg-paper divide-y divide-line">
      <li
        v-for="line in cart.items"
        :key="line.productId"
        class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 px-5 py-5 sm:px-6"
      >
        <div class="shrink-0 w-20 h-20 rounded-sm bg-cream overflow-hidden flex items-center justify-center">
          <img
            v-if="line.product?.image"
            :src="line.product.image"
            :alt="line.product?.title || ''"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-contain p-2"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-display text-base text-ink leading-tight">{{ line.product?.title }}</p>
          <p v-if="line.product?.size" class="text-[12px] text-muted">{{ line.product.size }}</p>
          <p class="mt-2 text-[13px] text-muted">
            {{ formatPrice(line.unitPrice) }} {{ t('checkout.cart.perItem') }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <QuantityStepper
            :model-value="line.quantity"
            :min="1"
            @update:model-value="onQty(line.productId, $event)"
          />
          <span class="text-[14px] font-semibold text-ink tabular-nums w-20 text-right">
            {{ formatPrice(line.lineTotal) }}
          </span>
          <button
            type="button"
            class="text-muted hover:text-danger transition-colors duration-base"
            :aria-label="t('cart.remove')"
            @click="onRemove(line.productId)"
          >
            <Icon name="trash" :size="18" :stroke-width="2" />
          </button>
        </div>
      </li>
    </ul>

    <dl class="rounded-md border border-line bg-paper px-6 py-5 flex flex-col gap-2">
      <div class="flex items-baseline justify-between text-[14px]">
        <dt class="text-muted">{{ t('cart.subtotal') }}</dt>
        <dd class="text-ink tabular-nums">{{ formatPrice(subtotal) }}</dd>
      </div>
      <div class="flex items-baseline justify-between text-[14px]">
        <dt class="text-muted">{{ t('checkout.cart.shipping') }}</dt>
        <dd class="text-ink tabular-nums">{{ formatPrice(shipping) }}</dd>
      </div>
      <div class="mt-1 pt-3 border-t border-line flex items-baseline justify-between">
        <dt class="eyebrow">{{ t('checkout.cart.total') }}</dt>
        <dd class="font-display text-2xl text-brand tabular-nums">
          {{ formatPrice(total) }}
        </dd>
      </div>
    </dl>

  </section>

  <footer
    v-if="!empty"
    class="fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-line"
    role="contentinfo"
  >
    <div
      class="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 flex gap-3 sm:justify-between"
      :style="{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }"
    >
      <div class="flex-1 sm:flex-initial">
        <Button
          variant="primary"
          size="lg"
          block
          type="button"
          @click="exitToHome"
        >{{ t('checkout.exit') }}</Button>
      </div>
      <div class="flex-1 sm:flex-initial">
        <Button
          variant="accent"
          size="lg"
          block
          @click="continueToAccount"
        >{{ t('checkout.cart.cta.continue') }}</Button>
      </div>
    </div>
  </footer>
</template>
