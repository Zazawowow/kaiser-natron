<!--
  BrandHero.vue
  -------------------------------------------------------------------
  Home-page brand hero. Plays the figure-entrance intro in flow on the
  page itself (it replaced the old full-screen SplashIntro overlay), so
  the user lands on usable chrome (nav + hero) immediately.

  Artwork is the official brand illustration (source SVGs in
  `@/assets/brand/`, path data in `@/components/heroFigures.js`):
    · the woman (KaiserNatron_Ikone "Hebe") — flat mint silhouette, the
      dark print outline dropped so the brand-green ground reads through
      the negative space; the natron handful in her hands stays white.
    · the waterfall (KaiserNatron_Waterfall) — mint, half-scale, sitting
      to her right and vertically centred against her.

  Layout:
    · Desktop (≥1218 px): illustration centred in the LEFT half, tagline
      column centred in the RIGHT half — the two halves balance.
    · Below 1218 px: stacked — illustration above, tagline below.

  Choreography:
    1. left-m  (woman)     slides in from the left
    2. right-m (waterfall) slides in from the right
    3. mound-m (white natron handful) fades in
    4. tagline + SINCE 1881 fade in LAST
-->
<template>
  <section
    class="brand-hero relative isolate overflow-hidden bg-brand text-cream md:min-h-[calc(100svh-var(--nav-h))]"
    :class="{ 'is-portrait': isPortrait, go: started }"
  >
    <!-- =========================================================
         DESKTOP — figure + tagline as a centred 2-col flex row.
         ========================================================= -->
    <template v-if="!isPortrait">
      <div class="mx-auto flex min-h-[calc(100svh-var(--nav-h))] w-full max-w-7xl items-center px-6 md:px-10 lg:px-12">
        <div class="brand-hero__media flex w-1/2 items-center justify-center">
          <svg
            aria-hidden="true"
            class="brand-hero__svg--bg block w-full h-auto max-h-[80svh]"
            :viewBox="VIEWBOX"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Waterfall paints first so the woman (drawn after) reads
                 as the foreground. -->
            <g class="layer right-m">
              <g :transform="waterfallTransform">
                <path v-for="(d, i) in waterfall" :key="`w${i}`" :d="d" fill-rule="nonzero" />
              </g>
            </g>
            <g class="layer left-m">
              <path v-for="(d, i) in ladyMint" :key="`l${i}`" :d="d" fill-rule="nonzero" />
            </g>
            <!-- Natron handful, painted last so it sits in her cupped
                 hands, fading in once she's landed. -->
            <g class="layer mound-m">
              <path v-for="(d, i) in ladyWhite" :key="`n${i}`" :d="d" fill-rule="nonzero" />
            </g>
          </svg>
        </div>

        <div class="brand-hero__copy flex w-1/2 items-center justify-start pl-4 md:pl-6 lg:pl-8">
          <div class="w-full max-w-md xl:max-w-lg 2xl:max-w-xl text-left">
            <p class="mb-4 md:mb-5 text-sm md:text-base tracking-label uppercase text-cream/75">{{ t('home.brand.since') }}</p>
            <h1 class="font-display font-normal leading-[1.06] tracking-tight text-cream text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem] 2xl:text-[3.25rem]">
              {{ t('home.brand.headline.a') }}
              <em class="italic font-light text-cream">{{ t('home.brand.headline.em') }}</em>
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
          :viewBox="VIEWBOX"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g class="layer right-m">
            <g :transform="waterfallTransform">
              <path v-for="(d, i) in waterfall" :key="`w${i}`" :d="d" fill-rule="nonzero" />
            </g>
          </g>
          <g class="layer left-m">
            <path v-for="(d, i) in ladyMint" :key="`l${i}`" :d="d" fill-rule="nonzero" />
          </g>
          <g class="layer mound-m">
            <path v-for="(d, i) in ladyWhite" :key="`n${i}`" :d="d" fill-rule="nonzero" />
          </g>
        </svg>
      </div>

      <div class="brand-hero__copy flex flex-col items-center text-center">
        <h1 class="max-w-3xl font-display font-normal leading-[1.08] tracking-tight text-cream text-[1.5rem] sm:text-[2rem]">
          {{ t('home.brand.headline.a') }}
          <em class="italic font-light text-cream">{{ t('home.brand.headline.em') }}</em>
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
import { ladyMint, ladyWhite, waterfall } from '@/components/heroFigures.js'
import Button from './Button.vue'
import { useI18n } from '@/i18n/index.js'

// Combined stage. The woman is authored at the origin in her native
// 1828×3624 space (content ≈ y[96,3524]); the waterfall (native
// 1828×2018) sits half-scale to her right, vertically centred against
// her (lady mid-height ≈ 1810). The viewBox leaves room to the right
// so the waterfall has somewhere to slide in from.
const VIEWBOX = '0 0 2760 3624'
const waterfallTransform = 'translate(1793,1310) scale(0.5)'

// Bumped from the original 768/900 px split to 1218 px because at the
// desktop split layout's narrower widths the tagline column collides
// with the figure on the left.
const portraitQuery = '(max-width: 1218px)'
const isPortrait = ref(false)
// `started` flips true one RAF after mount so the layers transition
// from their initial offset/hidden state into their final position —
// the intro entrance, in flow on the page itself.
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
  // (offset / hidden) state before we transition out of it.
  requestAnimationFrame(() => { started.value = true })
})

onBeforeUnmount(() => {
  if (mql && onChange) {
    mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange)
  }
})

// `t` is invoked inline in the template (not cached as setup
// constants) so the headline / SINCE 1881 / Shop button update
// reactively when the user switches locale via the navbar.
const { t } = useI18n()
</script>

<style scoped>
/* Desktop SVG.
   `mask-image` softens the LEFT and RIGHT edges of the artwork into
   the brand-green ground while the entrance is in progress, then
   feathers back to 0 % so the figure stands fully opaque at rest. */
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
  /* Synced with the tagline fade-in (700ms ease 1150ms) so the side
     feathers dissolve in the same beat as the copy resolves. */
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

/* Layer fills (authentic brand mints). `fill` inherits, so setting it
   on the group cascades to every path inside. */
.left-m  { fill: #7bd1ad; }
.right-m { fill: #6eceb2; }
.mound-m { fill: #ffffff; }

/* ---------- Entrance animation ----------
   Initial state: figures translated off to their respective sides and
   hidden, natron and copy hidden. Adding `.go` to the section
   transitions every layer to its resting position. Delays cascade so
   the figures land first, the natron fades in once they've landed,
   and the copy is the last beat. */
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

/* Reduced-motion users get the final state immediately. */
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
