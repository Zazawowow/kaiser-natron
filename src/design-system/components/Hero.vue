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
})

defineEmits(['cta', 'secondary'])

const tones = {
  cream: {
    surface: 'bg-cream',
    text: 'text-ink',
    sub: 'text-muted',
    disc: 'bg-accent-soft/60',
    glow: 'bg-accent/15',
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
    glow: 'bg-accent/10',
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
      mediaSize: 'w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px]',
    }
  }
  return {
    root: 'grid gap-10 md:gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center',
    copy: 'max-w-xl mx-auto lg:mx-0 items-center text-center lg:items-start lg:text-left',
    actions: 'justify-center lg:justify-start',
    media: '',
    mediaSize: 'w-[260px] sm:w-[340px] md:w-[420px] lg:w-full lg:max-w-[520px]',
  }
})
</script>

<template>
  <section
    :class="[
      'relative overflow-hidden',
      'px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28',
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
        <!-- Decorative disc behind product -->
        <div
          aria-hidden="true"
          :class="[
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[85%] aspect-square rounded-full blur-2xl',
            tone.glow,
          ]"
        />
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
              class="relative w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(28,58,40,0.18)]"
            />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
