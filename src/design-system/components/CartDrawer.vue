<script setup>
import { computed, watch, onBeforeUnmount, ref, nextTick } from 'vue'
import Icon from './Icon.vue'
import IconButton from './IconButton.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'
import QuantityStepper from './QuantityStepper.vue'
import { useI18n } from '@/i18n/index.js'
import { formatPrice } from '@/api/index.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  subtotal: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue', 'update-quantity', 'remove', 'checkout'])

const { t } = useI18n()

const panelRef = ref(null)

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

// Scroll-lock the page while the drawer is open, same pattern as the Search
// overlay. Focus moves into the panel on open so the ESC handler catches
// keystrokes immediately.
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) nextTick(() => panelRef.value?.focus())
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.documentElement.style.overflow = ''
})

const hasItems = computed(() => props.items.length > 0)

function onQuantity(line, quantity) {
  emit('update-quantity', { productId: line.productId, quantity })
}
function onRemove(line) {
  emit('remove', line.productId)
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop — click to dismiss. Separate Transition from the panel so
         opacity and slide animate independently. -->
    <Transition
      enter-active-class="transition duration-base ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-base ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[55] bg-ink/40"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-slow ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-base ease-out"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="modelValue"
        ref="panelRef"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="t('cart.label')"
        class="fixed inset-y-0 right-0 z-[60] w-full md:max-w-[440px] bg-cream text-ink flex flex-col shadow-lg md:border-l md:border-line font-sans outline-none"
        @keydown="onKeydown"
      >
        <!-- Header -->
        <header
          class="shrink-0 flex items-center justify-between px-6 py-5 border-b border-line"
          style="padding-top: calc(env(safe-area-inset-top) + 1.25rem);"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Icon name="cart" :size="22" class="text-brand shrink-0" />
            <h2 class="font-display text-2xl font-normal text-brand leading-none truncate">
              {{ t('cart.label') }}
            </h2>
            <Badge v-if="count > 0" variant="subtle" class="shrink-0">{{ count }}</Badge>
          </div>
          <!-- Desktop close — inline in the header for standard
               drawer UX. Hidden on mobile, where the close lives in
               the floating cluster position (see below) so it sits
               exactly where the menu-open button is on the page. -->
          <IconButton
            icon="close"
            variant="ghost"
            size="sm"
            :icon-size="20"
            :aria-label="t('menu.close')"
            class="hidden md:inline-flex"
            @click="close"
          />
        </header>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
          <!-- Empty state -->
          <div
            v-if="!hasItems"
            class="h-full flex flex-col items-center justify-center gap-4 px-8 py-16 text-center"
          >
            <div class="w-16 h-16 rounded-full bg-brand-wash flex items-center justify-center text-brand">
              <Icon name="cart" :size="28" />
            </div>
            <p class="font-display text-xl text-brand">{{ t('cart.empty.title') }}</p>
            <p class="text-sm text-muted max-w-xs">{{ t('cart.empty.subtitle') }}</p>
            <Button variant="secondary" size="md" class="mt-2" @click="close">
              {{ t('ds.buttons.continueShopping') }}
            </Button>
          </div>

          <!-- Items -->
          <ul v-else class="divide-y divide-line">
            <li
              v-for="line in items"
              :key="line.productId"
              class="flex gap-4 px-6 py-5"
            >
              <a
                :href="line.product?.href || '#'"
                class="shrink-0 w-20 h-20 rounded-sm overflow-hidden bg-paper flex items-center justify-center"
              >
                <img
                  v-if="line.product?.image"
                  :src="line.product.image"
                  :alt="line.product.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-contain p-2"
                />
              </a>
              <div class="flex-1 min-w-0 flex flex-col gap-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[15px] font-semibold text-ink leading-tight truncate">
                      {{ line.product?.title }}
                    </p>
                    <p v-if="line.product?.size" class="text-[13px] text-muted mt-0.5 truncate">
                      {{ line.product.size }}
                    </p>
                  </div>
                  <IconButton
                    icon="trash"
                    variant="ghost"
                    size="xs"
                    :icon-size="18"
                    :aria-label="t('cart.remove')"
                    class="shrink-0"
                    @click="onRemove(line)"
                  />
                </div>

                <div class="flex items-center justify-between gap-3">
                  <QuantityStepper
                    :model-value="line.quantity"
                    :min="0"
                    :decrease-label="t('cart.qty.decrease')"
                    :increase-label="t('cart.qty.increase')"
                    @update:model-value="(q) => onQuantity(line, q)"
                  />
                  <span class="font-display text-lg text-brand tabular-nums">
                    {{ formatPrice(line.lineTotal) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer — mirrors the mobile menu overlay: primary action takes
             the width, close icon sits to its right so the thumb has both
             controls in the bottom cluster. -->
        <!-- Footer padding reserves room for the mobile floating
             close button (bottom-5 right-5 + size-lg ≈ 76 px tall
             hit-box). Right-padding shifts the checkout CTA left
             on mobile so the close never overlaps the button. On
             md+ the floating close is hidden, so the extra right
             padding collapses. -->
        <footer
          v-if="hasItems"
          class="shrink-0 border-t border-line px-6 py-5 flex flex-col gap-4 pr-24 md:pr-6"
          style="padding-bottom: calc(env(safe-area-inset-bottom) + 1.25rem);"
        >
          <div class="flex items-baseline justify-between">
            <span class="eyebrow">{{ t('cart.subtotal') }}</span>
            <span class="font-display text-2xl text-brand tabular-nums">
              {{ formatPrice(subtotal) }}
            </span>
          </div>
          <!-- Checkout takes the full width. The mobile close button
               is rendered outside the drawer as a floating IconButton
               at the exact `bottom-5 right-5` position that the
               page's menu-open button uses, so opening/closing feels
               like the same control. -->
          <Button
            variant="primary"
            size="lg"
            block
            @click="$emit('checkout')"
          >
            <template #after><Icon name="arrow-right" :size="18" /></template>
            {{ t('cart.checkout') }}
          </Button>
        </footer>
      </aside>

    </Transition>

    <!-- Mobile floating close — lives OUTSIDE the drawer Transition
         (which requires a single root child) so it can fade
         independently with its own transition. Sits at
         `bottom-5 right-5` to overlay the page's menu-open
         IconButton exactly, matching the menu overlay's close
         position for muscle-memory consistency across the two
         mobile overlays. -->
    <Transition
      enter-active-class="transition-opacity duration-base ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-base ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="md:hidden fixed bottom-5 right-5 z-[70]"
        style="padding-bottom: env(safe-area-inset-bottom);"
      >
        <IconButton
          icon="close"
          variant="float"
          size="lg"
          :icon-size="24"
          :icon-stroke-width="2"
          :aria-label="t('menu.close')"
          @click="close"
        />
      </div>
    </Transition>
  </Teleport>
</template>
