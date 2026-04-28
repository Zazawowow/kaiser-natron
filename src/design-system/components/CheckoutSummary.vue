<script setup>
/**
 * CheckoutSummary — the order-summary panel rendered alongside the
 * checkout form. Shows each line item, the running totals, and an
 * optional primary CTA (Place order). Stays purely presentational:
 * all values come in via props so the page (or future backend
 * response) is the single source of truth for prices.
 *
 * Surface tone defaults to `paper` so the panel reads as a card on
 * a cream/surface page ground. Per the DS rule, media (line-item
 * thumbnails) sits on a tonal sibling colour (`bg-cream`) so the
 * product silhouettes don't merge with the panel surface.
 */
import Button from './Button.vue'

defineProps({
  items: {
    type: Array,
    required: true,
    // Each item: { productId, quantity, unitPrice, lineTotal,
    //              product: { title, size, image, ... } }
    validator: (arr) =>
      arr.every(
        (l) =>
          l && typeof l.productId === 'string' && Number.isInteger(l.quantity),
      ),
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: '€' },
  /** Place-order button label. Empty hides the CTA — useful when the
   *  page renders its own submit elsewhere (e.g. a sticky bottom bar
   *  on mobile). */
  ctaLabel: { type: String, default: '' },
  ctaLoading: { type: Boolean, default: false },
  ctaDisabled: { type: Boolean, default: false },
  /** Shown above the totals; helps the user double-check they're
   *  paying for the right cart. */
  heading: { type: String, default: '' },
})

defineEmits(['submit'])

function priceLabel(amount, currency) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return ''
  return `${currency} ${amount.toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <aside
    class="rounded-md border border-line bg-paper text-ink flex flex-col"
    aria-label="Order summary"
  >
    <header
      v-if="heading"
      class="px-6 pt-6 pb-3 border-b border-line"
    >
      <h2 class="font-display text-xl font-normal text-brand leading-none">
        {{ heading }}
      </h2>
    </header>

    <!-- Line items. Compact rows: image · title/size · qty · total.
         Image stays on `bg-cream` so transparent PNGs read against a
         tonal sibling rather than disappearing into the panel. -->
    <ul v-if="items.length" class="flex flex-col divide-y divide-line">
      <li
        v-for="line in items"
        :key="line.productId"
        class="flex items-center gap-4 px-6 py-4"
      >
        <div class="relative shrink-0 w-14 h-14 rounded-sm bg-cream overflow-hidden flex items-center justify-center">
          <img
            v-if="line.product?.image"
            :src="line.product.image"
            :alt="line.product?.title || ''"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-contain p-2"
          />
          <span
            v-if="line.quantity > 1"
            class="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-brand text-accent text-[11px] font-bold flex items-center justify-center"
            aria-hidden="true"
          >{{ line.quantity }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-display text-[15px] leading-tight truncate text-ink">
            {{ line.product?.title }}
          </p>
          <p v-if="line.product?.size" class="text-[12px] text-muted truncate">
            {{ line.product.size }}
          </p>
        </div>
        <span class="shrink-0 text-[14px] font-semibold text-ink tabular-nums">
          {{ priceLabel(line.lineTotal ?? line.unitPrice * line.quantity, currency) }}
        </span>
      </li>
    </ul>

    <!-- Totals. Subtotal / shipping / tax stack as muted rows;
         the grand total uses display serif + brand colour so the
         user's eye lands on it last. `tabular-nums` keeps right
         edges aligned across rows. -->
    <dl class="px-6 py-5 flex flex-col gap-2 border-t border-line">
      <div class="flex items-baseline justify-between text-[14px]">
        <dt class="text-muted">Subtotal</dt>
        <dd class="text-ink tabular-nums">{{ priceLabel(subtotal, currency) }}</dd>
      </div>
      <div class="flex items-baseline justify-between text-[14px]">
        <dt class="text-muted">Versand</dt>
        <dd class="text-ink tabular-nums">{{ priceLabel(shipping, currency) }}</dd>
      </div>
      <div v-if="tax > 0" class="flex items-baseline justify-between text-[14px]">
        <dt class="text-muted">MwSt. (19 %, inkl.)</dt>
        <dd class="text-ink tabular-nums">{{ priceLabel(tax, currency) }}</dd>
      </div>
      <div class="mt-2 pt-3 border-t border-line flex items-baseline justify-between">
        <dt class="eyebrow">Gesamt</dt>
        <dd class="font-display text-2xl text-brand tabular-nums">
          {{ priceLabel(total, currency) }}
        </dd>
      </div>
    </dl>

    <div v-if="ctaLabel" class="px-6 pb-6">
      <Button
        variant="primary"
        size="lg"
        block
        :loading="ctaLoading"
        :disabled="ctaDisabled"
        @click="$emit('submit')"
      >{{ ctaLabel }}</Button>
    </div>
  </aside>
</template>
