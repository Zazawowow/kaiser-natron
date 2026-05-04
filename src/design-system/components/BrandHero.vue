<!--
  BrandHero.vue
  -------------------------------------------------------------------
  Home-page brand hero. Replaces the previous full-screen SplashIntro
  overlay: the same figure-entrance animation now plays in flow on
  the page itself, so the user lands on usable chrome (nav + hero)
  instead of waiting through a 2.8s overlay.

  Layout:
    · Desktop (≥1218 px): the SVG sits as a centred figure inside
      the LEFT half of the first fold; the tagline column sits in
      the RIGHT half, also centred within its half — the two halves
      balance one another instead of leaving a wide trough between.
    · Below 1218 px: stacked — illustration above, tagline below.

  Animation choreography (mirrors the old splash exactly, minus the
  wordmark which has no destination on the final page):
    1. left-m  (woman)    slides in from the left
    2. right-m (landscape) slides in from the right
    3. mound-m (white handful of natron) fades in
    4. tagline + SINCE 1881 fade in LAST

  Path data is imported from `splashPaths.js`.
-->
<template>
  <section
    class="brand-hero relative isolate overflow-hidden bg-brand text-cream md:min-h-[calc(100svh-var(--nav-h))]"
    :class="{ 'is-portrait': isPortrait, go: started }"
  >
    <!-- =========================================================
         DESKTOP — single horizontally-centred max-width container
         with figure + tagline as a 2-col flex row. Removes the
         absolute-positioning trough by anchoring both halves to a
         shared centred container; the figure scales with column
         width so it stays balanced against the tagline at every
         viewport size.
         ========================================================= -->
    <template v-if="!isPortrait">
      <div class="mx-auto flex min-h-[calc(100svh-var(--nav-h))] w-full max-w-7xl items-center px-6 md:px-10 lg:px-12">
        <!-- Figure column. Width-fills its half of the container,
             height auto-derives from the cropped portrait viewBox.
             `max-h-[80svh]` keeps the figure from overshooting the
             fold on tall ultrawide displays. -->
        <div class="brand-hero__media flex w-1/2 items-center justify-center">
          <svg
            aria-hidden="true"
            class="brand-hero__svg--bg block w-full h-auto max-h-[80svh]"
            viewBox="0 380 1024 1156"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Mound paints BEHIND the woman so her fingers read mint
                 where they wrap the natron handful. With the mound
                 on top (the splash entrance order) one finger bled
                 white because the mound's bounds extend slightly
                 past the grip outline. -->
            <path class="layer right-m" fill-rule="evenodd" :d="dPortRight" />
            <path class="layer mound-m" fill-rule="evenodd" :d="dPortMound" />
            <path class="layer left-m"  fill-rule="nonzero" :d="dPortLeft"  />
          </svg>
        </div>

        <!-- Tagline column. Same width as the figure column so the
             composition is symmetrically centred; inner copy block
             is left-aligned and width-clamped so headline wrapping
             stays predictable across breakpoints. -->
        <div class="brand-hero__copy flex w-1/2 items-center justify-start pl-4 md:pl-6 lg:pl-8">
          <div class="w-full max-w-md xl:max-w-lg 2xl:max-w-xl text-left">
            <p class="mb-4 md:mb-5 text-sm md:text-base tracking-label uppercase text-cream/75">{{ t('home.brand.since') }}</p>
            <h1 class="font-display font-normal leading-[1.06] tracking-tight text-cream text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem] 2xl:text-[3.25rem]">
              {{ t('home.brand.headline.a') }}
              <em class="italic font-light text-accent-soft">{{ t('home.brand.headline.em') }}</em>
              {{ t('home.brand.headline.b') }}
            </h1>
            <RouterLink to="/shop" class="mt-7 md:mt-8 inline-flex">
              <Button variant="accent" size="lg">{{ t('nav.shop') }}</Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </template>

    <!-- =========================================================
         PORTRAIT / MOBILE — stacked, illustration above tagline
         ========================================================= -->
    <div
      v-else
      class="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 pt-2 pb-10 sm:gap-8 sm:px-6 sm:pt-4"
    >
      <div class="brand-hero__media">
        <svg
          class="brand-hero__svg brand-hero__svg--portrait"
          viewBox="0 380 1024 1156"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path class="layer right-m" fill-rule="evenodd" :d="dPortRight" />
          <path class="layer mound-m" fill-rule="evenodd" :d="dPortMound" />
          <path class="layer left-m"  fill-rule="nonzero" :d="dPortLeft"  />
        </svg>
      </div>

      <div class="brand-hero__copy flex flex-col items-center text-center">
        <h1 class="max-w-3xl font-display font-normal leading-[1.08] tracking-tight text-cream text-[1.5rem] sm:text-[2rem]">
          {{ t('home.brand.headline.a') }}
          <em class="italic font-light text-accent-soft">{{ t('home.brand.headline.em') }}</em>
          {{ t('home.brand.headline.b') }}
        </h1>
        <p class="mt-4 text-[0.95rem] tracking-label uppercase text-cream/75">{{ t('home.brand.since') }}</p>
        <RouterLink to="/shop" class="mt-6 inline-flex">
          <Button variant="accent" size="lg">{{ t('nav.shop') }}</Button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  dPortLeft,
  dPortRight,
  dPortMound,
} from '@/components/splashPaths.js'
import Button from './Button.vue'
import { useI18n } from '@/i18n/index.js'

// Bumped from the original 768/900 px split to 1218 px because at
// the desktop split layout's narrower widths the tagline column
// collides with the figure on the left.
const portraitQuery = '(max-width: 1218px)'
const isPortrait = ref(false)
// `started` flips true one RAF after mount so the layers transition
// from their initial offset/hidden state into their final position —
// the splash entrance animation, in flow on the page itself.
const started = ref(false)
let mql = null
let onChange = null

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia(portraitQuery)
    isPortrait.value = mql.matches
    onChange = (e) => { isPortrait.value = e.matches }
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange)
  }
  // Defer the `go` flip a frame so the browser commits the initial
  // (offset / hidden) state before we transition out of it. Without
  // the rAF the layers paint in their final position and skip the
  // transition entirely.
  requestAnimationFrame(() => { started.value = true })
})

onBeforeUnmount(() => {
  if (mql && onChange) {
    mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange)
  }
})

// `t` is invoked inline in the template (not cached as setup
// constants) so the headline / SINCE 1881 / Shop button update
// reactively when the user switches locale via the navbar — calls
// resolved at setup time freeze the value at first paint.
const { t } = useI18n()
</script>

<style scoped>
/* Desktop SVG.
   `display: block` removes the inline-svg baseline gap.
   `mask-image` softens the LEFT and RIGHT edges of the artwork into
   the brand-green ground while the entrance is in progress so the
   mint silhouette feels less sheer at the edges. Once the entrance
   has settled the feather animates back to 0 % so the figure stands
   fully opaque at rest — the soft edges are an entrance effect, not
   a permanent sticker frame.
   The feather amount is held in `--hero-feather`; @property is what
   makes the percentage interpolate (custom properties don't animate
   without an explicit type registration). Browsers without
   @property support snap from 12 % → 0 % at the end of the delay,
   which is an acceptable graceful degradation. */
@property --hero-feather {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 12%;
}

.brand-hero__svg--bg {
  display: block;
  --hero-feather: 12%;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000 var(--hero-feather),
    #000 calc(100% - var(--hero-feather)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000 var(--hero-feather),
    #000 calc(100% - var(--hero-feather)),
    transparent 100%
  );
  /* Synced with the tagline fade-in below (700ms ease 1150ms) so
     the side feathers dissolve in the same beat as the copy
     resolves — one smooth landing instead of two staggered ones. */
  transition: --hero-feather 700ms ease 1150ms;
}

.brand-hero.go .brand-hero__svg--bg {
  --hero-feather: 0%;
}

.brand-hero__svg--portrait {
  display: block;
  width: 100%;
  height: auto;
  max-height: 56svh;
  margin: 0 auto;
}

/* Layer fills (matches the splash's resolved palette). */
.left-m  { fill: #b5d8b6; }
.right-m { fill: #b5d8b6; }
.mound-m { fill: #ffffff; }

/* ---------- Entrance animation (replaces SplashIntro) ----------
   Initial state: figures translated off to their respective sides
   and hidden, mound and copy hidden. Adding `.go` to the section
   transitions every layer to its resting position. Delays cascade
   so the figures land first, the mound fades in once they've
   landed, and the copy is the last beat — the eye reaches the
   tagline only after the artwork has settled. */
.layer.left-m {
  opacity: 0;
  transform: translateX(-14%);
  transition: transform 800ms cubic-bezier(.22, .61, .36, 1) 150ms,
              opacity   600ms ease 150ms;
}
.layer.right-m {
  opacity: 0;
  transform: translateX(14%);
  transition: transform 800ms cubic-bezier(.22, .61, .36, 1) 150ms,
              opacity   600ms ease 150ms;
}
.layer.mound-m {
  opacity: 0;
  transition: opacity 550ms ease 700ms;
}
.brand-hero__copy {
  opacity: 0;
  transition: opacity 700ms ease 1150ms;
}

.brand-hero.go .layer.left-m,
.brand-hero.go .layer.right-m {
  opacity: 1;
  transform: none;
}
.brand-hero.go .layer.mound-m {
  opacity: 1;
}
.brand-hero.go .brand-hero__copy {
  opacity: 1;
}

/* Reduced-motion users get the final state immediately — no slide,
   no fade. The hero is purely decorative animation, so honouring
   the preference doesn't cost any communicated information. */
@media (prefers-reduced-motion: reduce) {
  .layer.left-m,
  .layer.right-m,
  .layer.mound-m,
  .brand-hero__copy {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
