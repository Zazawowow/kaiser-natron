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
  /** Compact hero: smaller image cap + narrower media column from `lg` up.
   *  Used for secondary/supporting heroes (e.g. the cream "hundert
   *  Anwendungen" second-fold banner) so they read as companion content
   *  to the primary first-fold hero rather than a second centre-stage
   *  block. Mobile sizing is unchanged. */
  compact: { type: Boolean, default: false },
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
      mediaSize: 'w-full max-w-[287px] sm:max-w-[354px] md:max-w-[442px] lg:max-w-[530px]',
    }
  }
  // Split: image on top on mobile/tablet, text-left/image-right on desktop.
  // `order-*` flips the stacking order below lg without changing DOM order.
  // On lg, let the grid stretch items to the row height and then `justify-center`
  // the copy column so its headline/CTA block sits at the image's vertical midpoint.
  // `reverse` swaps the desktop columns so the image sits on the left.
  return {
    // `grid-cols-1` is load-bearing at mobile. Without it, the grid
    // has no column template below `lg`, so `grid-auto-columns: auto`
    // sizes the implicit column to max-content of its widest child —
    // which is the image column's declared width. That max-content
    // column then forces the copy column to the same width, overflowing
    // narrow viewports and clipping the headline against the section
    // edge. `grid-cols-1` emits `minmax(0, 1fr)`, constraining the
    // column to available width and letting children actually shrink.
    root: props.reverse
      ? 'grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-[1fr_1.05fr]'
      : 'grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-[1.05fr_1fr]',
    copy: [
      'order-2 max-w-xl mx-auto lg:mx-0 items-center text-center lg:justify-center',
      props.reverse ? 'lg:order-2 lg:items-start lg:text-left' : 'lg:order-1 lg:items-start lg:text-left',
    ].join(' '),
    actions: 'justify-center lg:justify-start',
    media: props.reverse ? 'order-1 lg:order-1' : 'order-1 lg:order-2',
    // Media cell: use max-width rather than fixed width below `lg` so
    // the column can shrink below the image's preferred size on narrow
    // phones. A fixed `w-[373px]` forced the single-column mobile grid
    // to 373px, which overflowed a 375px viewport minus section padding
    // and pushed the headline text past the section edge (clipped).
    // Compact heroes cap the desktop media width tighter so the image
    // doesn't dominate; mobile/tablet sizing is identical.
    mediaSize: props.compact
      ? 'w-full max-w-[373px] sm:max-w-[489px] md:max-w-[603px] lg:max-w-[460px] mx-auto'
      : 'w-full max-w-[373px] sm:max-w-[489px] md:max-w-[603px] lg:max-w-[748px] mx-auto',
  }
})

// Max image height per viewport step. Compact drops the desktop cap
// from 78svh → 48svh so the secondary hero reads as a companion,
// not a second main stage. Mobile/tablet caps are shared because
// phone screens shouldn't scale content down below its legible size.
// Image max-height steps. At lg the default cap is intentionally
// bounded (52svh) so the Hero's total height (section py-20 of
// 170px + image) stays below the first-fold wrapper's content-box
// of `100svh - var(--nav-h)` across typical desktop viewports
// (svh 800–1080). Anything larger makes Hero overflow the wrapper,
// which then grows to fit — destroying `justify-center`'s
// vertical centering and pinning Hero to the top of the fold.
// Compact shrinks it further for the secondary banner.
const imageHeightClass = computed(() =>
  props.compact
    ? 'max-h-[44svh] md:max-h-[61svh] lg:max-h-[48svh]'
    : 'max-h-[44svh] md:max-h-[61svh] lg:max-h-[52svh]',
)
</script>

<template>
  <!-- overflow-clip (not overflow-hidden) contains the media halo/disc
       decor WITHOUT establishing a new scrollport — so the headline's
       italic-overhang can't be clipped against the section edge at
       narrow widths. Historically this was `overflow-hidden`, which
       made the section a scrolling ancestor and sheared the last
       italic letter off the hero h1 at phone-sim widths.
       The `hero-section` scoped class carries the overflow-clip-margin
       value — up to 1rem of content (including italic overhang) is
       allowed past the section edge before clipping kicks in. -->
  <section
    :class="[
      'hero-section relative overflow-clip',
      'px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20',
      tone.surface,
      tone.text,
    ]"
  >
    <div :class="['relative mx-auto w-full max-w-6xl', layout.root]">
      <!-- Copy.
           `min-w-0` is load-bearing: the copy column is a flex/grid
           child whose default `min-width: auto` resolves to its
           longest word's intrinsic width, which lets the headline
           push the column wider than the viewport. Overriding to 0
           lets the headline actually respect its own max width so
           the font-size clamp and wrapping can take effect. -->
      <div :class="['relative z-[1] flex flex-col gap-6 min-w-0', layout.copy]">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>

        <!-- Headline sizing uses responsive Tailwind arbitrary values
             so each breakpoint compiles to a plain media-query
             `font-size` rule — no scoped-CSS hash, no HMR edge
             cases. Italic Fraunces at ≥2.25rem overhangs the
             line-box at ≤400px and gets clipped by the section's
             `overflow-hidden` (needed for the halo/disc decor);
             capping at 1.625rem on phones keeps the whole phrase
             inside the content width. `break-words` + the inline
             `overflow-wrap` is belt-and-braces for any long word
             (e.g. German compounds) that still can't fit. -->
        <h1
          class="hero-headline font-display font-normal leading-[1.04] tracking-tight hyphens-auto break-words text-[1.625rem] sm:text-[2.25rem] lg:text-[3rem] xl:text-[3.75rem] 2xl:text-[4.5rem]"
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
              :class="[
                'relative mx-auto w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(28,58,40,0.18)]',
                imageHeightClass,
              ]"
            />
          </slot>
          <!-- Page-level extension point for mobile category shortcuts
               etc. Sits under the image within the media column so it
               tracks the hero's vertical rhythm. Empty by default. -->
          <slot name="afterMedia" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* overflow-clip (vs overflow-hidden) contains the decorative halo and
   disc behind the product image WITHOUT establishing a new scrollport.
   The margin lets up to 1rem of content — including Fraunces italic
   overhang — extend past the section edge before being clipped. No
   Tailwind utility covers this pair, so it lives here rather than as
   inline CSS on every call site. */
.hero-section {
  overflow-clip-margin: 1rem;
}

/* Headline wrap rules. `overflow-wrap: anywhere` is stronger than
   `break-words` — the latter only breaks between words, the former
   will break inside a word if it can't otherwise fit the line-box.
   Paired with `word-break: normal` so regular CJK / soft-hyphen
   behaviour isn't altered. Together these guarantee a long German
   compound can never overflow the column. */
.hero-headline {
  overflow-wrap: anywhere;
  word-break: normal;
}
</style>

