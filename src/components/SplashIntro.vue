<!--
  SplashIntro.vue  (v3)
  -------------------------------------------------------------------
  Desktop (wide 1536x672):
      · dark backdrop fades in
      · woman slides in from the LEFT
      · waterfall slides in from the RIGHT
      · natron droplets draw on, white wordmark fades in as the climax
  Mobile (portrait 1024x1536):
      · dark backdrop fades in
      · woman slides in from the LEFT
      · landscape slides in from the RIGHT
      · white wordmark slides in from the TOP
      · handful of natron in her hands fades in white, timed with the wordmark
  Edge-to-edge, auto-dismisses, emits `finished`.
  Usage:   <SplashIntro @finished="showApp = true" />
-->
<template>
  <Transition name="splash-fade" @after-leave="onAfterLeave">
    <div
      v-if="visible"
      class="splash-root"
      :class="{ go: started, exit: exiting, 'is-portrait': isPortrait }"
      role="dialog"
      aria-label="Loading"
      @click="handleTap"
      @keydown.esc="handleTap"
    >
      <!-- WIDE / DESKTOP MARK -->
      <svg
        v-if="!isPortrait"
        class="splash-svg splash-wide"
        viewBox="0 0 1536 672"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path class="layer bg"       fill-rule="evenodd" :d="dWideDark"  />
        <path class="layer left"     fill-rule="evenodd" :d="dWideLeft"  />
        <path class="layer right"    fill-rule="evenodd" :d="dWideRight" />
        <path class="layer middle stroke-draw mint-ink" pathLength="1"
              fill-rule="evenodd" :d="dWideMiddle" />
        <path class="layer wordmark" fill-rule="evenodd" :d="dWideWhite" />
      </svg>

      <!-- PORTRAIT / MOBILE MARK -->
      <svg
        v-else
        class="splash-svg splash-portrait"
        viewBox="0 0 1024 1536"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path class="layer bg-m"     fill-rule="evenodd" :d="dPortDark"  />
        <path class="layer left-m"   fill-rule="evenodd" :d="dPortLeft"  />
        <path class="layer right-m"  fill-rule="evenodd" :d="dPortRight" />
        <path class="layer top-m"    fill-rule="evenodd" :d="dPortTop"   />
        <path class="layer mound-m"  fill-rule="evenodd" :d="dPortMound" />
      </svg>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  dWideDark,
  dWideWhite,
  dWideLeft,
  dWideMiddle,
  dWideRight,
  dPortDark,
  dPortLeft,
  dPortRight,
  dPortTop,
  dPortMound,
} from './splashPaths.js'


const props = defineProps({
  // Time until the wordmark exit phase begins. Desktop entrance runs
  // ~2.70s (stroke draw 2.30s, fill 2.70s); 2.80s gives a 100ms breath
  // before the wordmark fades out and the splash dismisses.
  duration:             { type: Number,  default: 2800 },
  // Portrait entrance runs ~1.0s; 1.15s gives a ~150ms breath past
  // the climax before the wordmark exit phase begins.
  durationPortrait:     { type: Number,  default: 1150 },
  // Wordmark exit duration — the wordmark fades out before the whole
  // splash dismisses, so the BrandHero (which doesn't render the
  // wordmark) can take over without a doubled-then-vanishing logo.
  wordmarkExitMs:       { type: Number,  default: 500 },
  dismissOnTap:         { type: Boolean, default: true },
  respectReducedMotion: { type: Boolean, default: true },
  // Bumped from 768/900 px to 1218 px so the splash flips to its
  // portrait artwork at the same viewport width that BrandHero flips
  // to its stacked layout. Without the alignment, mid-width tablets
  // (~1024 px) would see the splash play the wide composition then
  // hand off to the portrait BrandHero — visible jump on landing.
  portraitQuery:        { type: String,  default: '(max-width: 1218px)' }
})
const emit = defineEmits(['finished'])

const visible    = ref(true)
const started    = ref(false)
const exiting    = ref(false)
const isPortrait = ref(false)
let entranceTimer = null
let dismissTimer = null
let mql = null
let onChange = null

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia(props.portraitQuery)
    isPortrait.value = mql.matches
    onChange = (e) => { isPortrait.value = e.matches }
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange)
  }
  requestAnimationFrame(() => { started.value = true })

  const reduced =
    props.respectReducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const entranceMs = reduced
    ? 1200
    : (isPortrait.value ? props.durationPortrait : props.duration)
  // Two-phase exit: wordmark fades first, then the whole splash leaves.
  // Reduced-motion users get an immediate dismiss to honour the
  // preference (no extra animation beat).
  const exitMs = reduced ? 0 : props.wordmarkExitMs
  entranceTimer = window.setTimeout(() => {
    exiting.value = true
    dismissTimer = window.setTimeout(() => { visible.value = false }, exitMs)
  }, entranceMs)
})
onBeforeUnmount(() => {
  if (entranceTimer) clearTimeout(entranceTimer)
  if (dismissTimer) clearTimeout(dismissTimer)
  if (mql && onChange) {
    mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange)
  }
})

// Tap-to-dismiss skips the wordmark exit beat — if the user is
// actively dismissing, they don't want extra animation.
function handleTap () { if (props.dismissOnTap) visible.value = false }
function onAfterLeave () { emit('finished') }

/* Path data lives in splashPaths.js — shared with BrandHero so the
   in-page brand hero can render the same illustration without
   duplicating ~500KB of SVG path strings. Regenerate via
   `node scripts/extract-splash-paths.cjs` after retracing. */
</script>

<style scoped>
/* ---------- Edge-to-edge container ---------- */
.splash-root {
  position: fixed; inset: 0; z-index: 9999;
  margin: 0; padding: 0;
  display: grid; place-items: stretch;
  background: #26724a;
  cursor: pointer; user-select: none; overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
.splash-root.is-portrait { background: #12815b; }

.splash-svg {
  display: block; width: 100%; height: 100%;
  opacity: 0; transform: scale(1.01);
  transition: transform 900ms cubic-bezier(.22,.61,.36,1) 60ms,
              opacity   600ms ease 60ms;
}
.splash-root.go .splash-svg { opacity: 1; transform: none; }

/* ---------- Layers ---------- */
.layer { transition: transform 900ms cubic-bezier(.22,.61,.36,1),
                     opacity 700ms ease; }

/* Backdrops */
.bg    { fill: #26724a; opacity: 0; transition: opacity 600ms ease; }
.bg-m  { fill: #12815b; opacity: 0; transition: opacity 600ms ease; }
.splash-root.go .bg, .splash-root.go .bg-m { opacity: 1; }

/* Desktop slide-ins */
.left    { fill: #90cdb7; opacity: 0; transform: translateX(-12%);  transition-delay: 260ms; }
.right   { fill: #90cdb7; opacity: 0; transform: translateX( 12%);  transition-delay: 260ms; }
.splash-root.go .left,
.splash-root.go .right { opacity: 1; transform: none; }

/* Desktop wordmark — plain fade-in, no stroke draw */
.wordmark { fill: #ffffff; opacity: 0;
            transition: opacity 700ms ease;
            transition-delay: 1.30s; }
.splash-root.go .wordmark { opacity: 1; }

/* Mobile slide-ins — tightened to ~550ms so the whole portrait
   choreography lands in ~1.1s total (was ~1.6s). Uses the same
   cubic-bezier as the default .layer rule but overrides the
   duration/delay so the .layer 900ms/260ms transition doesn't
   slow things down. */
.left-m  { fill: #b5d8b6; opacity: 0; transform: translateX(-14%);
           transition: transform 550ms cubic-bezier(.22,.61,.36,1) 120ms,
                       opacity   450ms ease 120ms; }
.right-m { fill: #b5d8b6; opacity: 0; transform: translateX( 14%);
           transition: transform 550ms cubic-bezier(.22,.61,.36,1) 120ms,
                       opacity   450ms ease 120ms; }
.splash-root.go .left-m,
.splash-root.go .right-m { opacity: 1; transform: none; }

/* Mobile wordmark — slides from top + fades in (no stroke draw).
   Starts as the slides are landing (~500ms) and resolves by ~1.0s
   so the splash can auto-dismiss shortly after. */
.top-m { fill: #ffffff; opacity: 0; transform: translateY(-14%);
         transition-property: opacity, transform;
         transition-duration: 500ms;
         transition-timing-function: ease;
         transition-delay: 500ms; }
.splash-root.go .top-m { opacity: 1; transform: none; }

/* Mobile handful-of-natron — matches the wordmark fade timing */
.mound-m { fill: #ffffff; opacity: 0;
           transition: opacity 500ms ease;
           transition-delay: 500ms; }
.splash-root.go .mound-m { opacity: 1; }

/* Desktop climax: natron droplets */
.middle  { fill: #90cdb7; }

/* ---------- Draw-on (stroke) — only used by .middle ---------- */
.stroke-draw {
  fill-opacity: 0;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
}
.stroke-draw.mint-ink { stroke: #90cdb7; }

.splash-root.go .middle { animation: draw 1.1s cubic-bezier(.65,.05,.36,1) 1.20s forwards,
                                     fill 0.55s ease-out                   2.15s forwards; }

@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fill {
  0%   { fill-opacity: 0; stroke-opacity: 1; }
  100% { fill-opacity: 1; stroke-opacity: 0; }
}

/* ---------- Wordmark exit (pre-dismiss beat) ----------
   Once the entrance climax is done we fade the wordmark out before
   the whole splash leaves. The BrandHero that takes over in flow
   doesn't render a wordmark, so without this beat the user would see
   the logo blink off as the splash dissolves. The fade gives it a
   soft hand-off instead. Slight upward drift mirrors the portrait
   entrance (which slid the wordmark in from the top) so the exit
   doesn't read as a static fade. */
.splash-root.exit .wordmark {
  opacity: 0;
  transition: opacity 500ms ease;
}
.splash-root.exit .top-m {
  opacity: 0;
  transform: translateY(-6%);
  transition: opacity 400ms ease, transform 400ms ease;
}

/* ---------- Exit ----------
   Desktop fades quickly (400ms) — the wordmark exit beat already
   gave the user a soft hand-off, so the dismiss can snap.
   Portrait extends the dismiss fade by ~1s so the splash dissolves
   slowly on mobile, where the smaller stage benefits from a longer
   transition into the in-flow BrandHero. */
.splash-fade-leave-active { transition: opacity 400ms ease, filter 400ms ease; }
.splash-fade-leave-to     { opacity: 0; filter: blur(2px); }

.splash-root.is-portrait.splash-fade-leave-active {
  transition: opacity 1400ms ease, filter 1400ms ease;
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .splash-svg { opacity: 1; transform: none; transition: none; }
  .layer, .bg, .bg-m, .top-m, .left, .right, .left-m, .right-m, .mound-m, .wordmark {
    opacity: 1 !important; transform: none !important; transition: none !important;
  }
  .stroke-draw { fill-opacity: 1; stroke-opacity: 0; stroke-dashoffset: 0;
                 animation: none !important; }
}
</style>
