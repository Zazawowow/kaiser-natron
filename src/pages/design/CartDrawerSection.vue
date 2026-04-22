<script setup>
import { ref, onMounted } from 'vue'
import SectionShell from './SectionShell.vue'
import CartDrawer from '@/design-system/components/CartDrawer.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  fetchCart,
} from '@/api/index.js'
import { useCartStore } from '@/stores/cart.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const cart = useCartStore()
const open = ref(false)

async function seedAndOpen() {
  await clearCart()
  await addToCart('kaiser-natron-pulver-250-g-grosspackung', 2)
  await addToCart('kaiser-natron-bad-500-g', 1)
  open.value = true
}

async function onQty({ productId, quantity }) {
  await updateCartItem(productId, quantity)
}
async function onRemove(productId) {
  await removeFromCart(productId)
}

onMounted(() => {
  fetchCart()
})
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.cartDrawer.title')"
    :description="t('ds.cartDrawer.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.default') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="primary" @click="seedAndOpen">
          <template #before>
            <Icon name="cart" :size="18" />
          </template>
          {{ t('ds.cartDrawer.demoLabel') }}
        </Button>
        <p class="text-[13px] text-muted">{{ t('ds.cartDrawer.demoHint') }}</p>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.cartDrawer.integrationTitle') }}</h2>
      <p class="text-[15px] text-muted leading-relaxed mb-4 max-w-2xl">
        {{ t('ds.cartDrawer.integrationBody') }}
      </p>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '@/api/index.js'

await addToCart('kaiser-natron-pulver-250-g-grosspackung', 1)
await updateCartItem('kaiser-natron-bad-500-g', 3)
await removeFromCart('kaiser-natron-bad-500-g')
const cart = await fetchCart()</pre>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;CartDrawer
  v-model="open"
  :items="cart.items"
  :subtotal="cart.subtotal"
  :count="cart.count"
  @update-quantity="onQty"
  @remove="onRemove"
  @checkout="goToCheckout"
/&gt;</pre>
      </div>
    </section>

    <CartDrawer
      v-model="open"
      :items="cart.items"
      :subtotal="cart.subtotal"
      :count="cart.count"
      @update-quantity="onQty"
      @remove="onRemove"
      @checkout="open = false"
    />
  </SectionShell>
</template>
