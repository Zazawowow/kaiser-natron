<script setup>
import { computed } from 'vue'
import Button from './Button.vue'
import Badge from './Badge.vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  headline: { type: String, default: '' },
  subheadline: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeVariant: {
    type: String,
    default: 'accent',
    validator: (v) =>
      ['neutral', 'brand', 'accent', 'subtle', 'success', 'warning', 'danger'].includes(v),
  },
  ctaLabel: { type: String, default: '' },
  ctaHref: { type: String, default: '' },
  secondaryLabel: { type: String, default: '' },
  secondaryHref: { type: String, default: '' },
  variant: {
    type: String,
    default: 'split',
    validator: (v) => ['split', 'centered'].includes(v),
  },
  tone: {
    type: String,
    default: 'cream',
    validator: (t) => ['cream', 'paper', 'brand'].includes(t),
  },
  /** Only affects the split variant. When true, the image sits on the left
   *  and copy on the right from `lg` up. Mobile order is unchanged (image
   *  on top, copy below) to preserve reading order. */
  reverse: { type: Boolean, default: false },
})

defineEmits(['cta', 'secondary'])

const tones = {
  cream: {
    surface: 'bg-cream',
    text: 'text-ink',
    sub: 'text-muted',
    disc: 'bg-accent-soft/60',
    glow: 'bg-accent/8',
  },
  paper: {
    surface: 'bg-paper',
    text: 'text-ink',
    sub: 'text-muted',
    disc: 'bg-cream',
    glow: 'bg-brand-soft-wash',
  },
  brand: {
    surface: 'bg-brand',
    text: 'text-cream',
    sub: 'text-cream/80',
    disc: 'bg-brand-soft/30',
    glow: 'bg-accent/5',
  },
}

const tone = computed(() => tones[props.tone])
const isBrandTone = computed(() => props.tone === 'brand')
const primaryVariant = computed(() => (isBrandTone.value ? 'accent' : 'primary'))

const layout = computed(() => {
  if (props.variant === 'centered') {
    return {
      root: 'flex flex-col items-center text-center gap-10 md:gap-12',
      copy: 'max-w-2xl mx-auto items-center text-center',
      actions: 'justify-center',
      media: 'mt-4 md:mt-6',
      mediaSize: 'w-[287px] sm:w-[354px] md:w-[442px] lg:w-[530px]',
    }
  }
  // Split: image on top on mobile/tablet, text-left/image-right on desktop.
  // `order-*` flips the stacking order below lg without changing DOM order.
  // On lg, let the grid stretch items to the row height and then `justify-center`
  // the copy column so its headline/CTA block sits at the image's vertical midpoint.
  // `reverse` swaps the desktop columns so the image sits on the left.
  return {
    root: props.reverse
      ? 'grid gap-10 md:gap-14 lg:grid-cols-[1fr_1.05fr]'
      : 'grid gap-10 md:gap-14 lg:grid-cols-[1.05fr_1fr]',
    copy: [
      'order-2 max-w-xl mx-auto lg:mx-0 items-center text-center lg:justify-center',
      props.reverse ? 'lg:order-2 lg:items-start lg:text-left' : 'lg:order-1 lg:items-start lg:text-left',
    ].join(' '),
    actions: 'justify-center lg:justify-start',
    media: props.reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2',
    mediaSize: 'w-[373px] sm:w-[489px] md:w-[603px] lg:w-full lg:max-w-[748px]',
  }
})
</script>

<template>
  <section
    :class="[
      'relative overflow-hidden',
      'px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20',
      tone.surface,
      tone.text,
    ]"
  >
    <div :class="['relative mx-auto w-full max-w-6xl', layout.root]">
      <!-- Copy -->
      <div :class="['relative z-[1] flex flex-col gap-6', layout.copy]">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>

        <h1
          class="font-display font-normal leading-[1.04] tracking-tight"
          style="font-size: clamp(2.5rem, 6vw, 4.5rem);"
        >
          <slot name="headline">{{ headline }}</slot>
        </h1>

        <p
          v-if="subheadline || $slots.subheadline"
          :class="['text-lg leading-relaxed max-w-xl', tone.sub]"
        >
          <slot name="subheadline">{{ subheadline }}</slot>
        </p>

        <div
          v-if="ctaLabel || secondaryLabel || $slots.actions"
          :class="['mt-2 flex flex-wrap items-center gap-3', layout.actions]"
        >
          <slot name="actions">
            <a v-if="ctaLabel && ctaHref" :href="ctaHref" class="inline-flex">
              <Button :variant="primaryVariant" size="lg">
                <slot name="cta">{{ ctaLabel }}</slot>
              </Button>
            </a>
            <Button
              v-else-if="ctaLabel"
              :variant="primaryVariant"
              size="lg"
              @click="$emit('cta')"
            >
              <slot name="cta">{{ ctaLabel }}</slot>
            </Button>

            <template v-if="secondaryLabel">
              <!-- Brand tone needs a cream-outlined pill; Button's ghost/secondary
                   render dark-on-dark on the brand green. -->
              <component
                :is="secondaryHref ? 'a' : 'button'"
                v-if="isBrandTone"
                :type="secondaryHref ? undefined : 'button'"
                :href="secondaryHref || undefined"
                class="inline-flex items-center justify-center rounded-pill border border-cream/50 px-[34px] py-[17px] text-[16px] font-semibold tracking-label text-cream transition-colors duration-base hover:border-cream hover:bg-cream-wash-strong"
                @click="secondaryHref ? null : $emit('secondary')"
              >{{ secondaryLabel }}</component>
              <a v-else-if="secondaryHref" :href="secondaryHref" class="inline-flex">
                <Button variant="secondary" size="lg">{{ secondaryLabel }}</Button>
              </a>
              <Button
                v-else
                variant="secondary"
                size="lg"
                @click="$emit('secondary')"
              >{{ secondaryLabel }}</Button>
            </template>
          </slot>
        </div>
      </div>

      <!-- Media -->
      <div
        v-if="image || $slots.media"
        :class="['relative flex items-center justify-center', layout.media]"
      >
        <!-- Soft halo behind the disc. Kept low-opacity + blur-xl (not
             blur-2xl) so the gradient is shallow enough that it doesn't
             quantize into visible rings on 6-bit panels. Tuning: halve
             the alpha or drop to blur-lg if banding returns on a specific
             surface. -->
        <div
          aria-hidden="true"
          :class="[
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[80%] aspect-square rounded-full blur-xl',
            tone.glow,
          ]"
        />
        <!-- Decorative disc — solid fill, no blur. -->
        <div
          aria-hidden="true"
          :class="[
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[70%] aspect-square rounded-full',
            tone.disc,
          ]"
        />
        <div :class="['relative', layout.mediaSize]">
          <Badge
            v-if="badge"
            :variant="badgeVariant"
            class="absolute -top-3 -left-3 z-[1] shadow-sm"
          >{{ badge }}</Badge>
          <slot name="media">
            <img
              :src="image"
              :alt="imageAlt || headline"
              loading="eager"
              decoding="async"
              class="relative mx-auto w-auto max-w-full max-h-[44svh] md:max-h-[61svh] lg:max-h-[78svh] object-contain drop-shadow-[0_20px_40px_rgba(28,58,40,0.18)]"
            />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
