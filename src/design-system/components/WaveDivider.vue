<script setup>
/**
 * WaveDivider — the home page's signature soft-wave transition
 * between two full-bleed coloured sections. Extracted from
 * HomePage.vue so the shop page (and any future sections page) can
 * reuse the same visual grammar instead of duplicating the SVG.
 *
 * The SVG is fully opaque by design: a `to` rect fills the whole
 * viewBox so the bottom row is solid destination colour (matches
 * the section below → no seam), and a `from` path paints the wavy
 * top portion (matches the section above → no seam). Leaving the
 * top half transparent caused browsers to anti-alias the path's
 * top/bottom edges against the parent and produce hairline
 * artefacts.
 *
 * Tone names (`brand`, `cream`, `surface`, `paper`) mirror the
 * surface tokens used across Hero / About / Bundles etc. so calls
 * read as "from X to Y" without the caller knowing the underlying
 * CSS-variable names.
 */
import { computed } from 'vue'

const props = defineProps({
  /** Colour of the section above the wave — painted on the wavy top. */
  from: {
    type: String,
    default: 'brand',
    validator: (v) => ['brand', 'cream', 'surface', 'paper'].includes(v),
  },
  /** Colour of the section below the wave — fills the solid bottom. */
  to: {
    type: String,
    default: 'cream',
    validator: (v) => ['brand', 'cream', 'surface', 'paper'].includes(v),
  },
})

const toneVar = {
  brand: 'var(--color-brand)',
  cream: 'var(--color-cream)',
  surface: 'var(--color-surface)',
  paper: 'var(--color-paper)',
}
const toneBg = {
  brand: 'bg-brand',
  cream: 'bg-cream',
  surface: 'bg-surface',
  paper: 'bg-paper',
}

// The wrapping bg-* class paints any 1-device-pixel gap that could
// otherwise show up between the SVG's bottom and the next section
// during subpixel rounding — matches the `from` tone so the wave
// rests flush on the section above.
const wrapperClass = computed(() => toneBg[props.from])
const fromFill = computed(() => toneVar[props.from])
const toFill = computed(() => toneVar[props.to])
</script>

<template>
  <svg
    aria-hidden="true"
    :class="['block w-full h-12 md:h-16 shrink-0 -mb-px', wrapperClass]"
    viewBox="0 0 1440 64"
    preserveAspectRatio="none"
  >
    <rect width="1440" height="64" :fill="toFill" />
    <path
      d="M0,0 L0,40 C320,4 520,60 720,32 C920,4 1120,60 1440,24 L1440,0 Z"
      :fill="fromFill"
    />
  </svg>
</template>
