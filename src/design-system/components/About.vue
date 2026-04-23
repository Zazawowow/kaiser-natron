<script setup>
import Badge from './Badge.vue'

/**
 * About — a centered intro + milestone timeline.
 *
 * Content is supplied entirely via props. Milestones are expected as an
 * array of `{ year, title, text }` entries; extras past the third are
 * ignored to keep the "max three things" rhythm.
 *
 * The three cards cycle the Card primitive's tones left-to-right —
 * paper / cream / brand — so the row echoes the design system's three
 * canonical surfaces rather than repeating a single tone.
 *
 * Timeline shape: pill-line-pill-line-pill. Horizontal above the cards
 * on md+ (each pill centered above its card, connected by a hairline),
 * vertical between pills on mobile (short line segments above every
 * non-first pill so the column reads as one continuous track).
 */
defineProps({
  eyebrow: { type: String, default: '' },
  headline: { type: String, default: '' },
  sub: { type: String, default: '' },
  milestones: {
    type: Array,
    default: () => [],
    validator: (arr) =>
      arr.every(
        (m) =>
          m &&
          typeof m === 'object' &&
          typeof m.year === 'string' &&
          typeof m.title === 'string' &&
          typeof m.text === 'string',
      ),
  },
})

// Per-index tone map mirrors the Card primitive's three tones so the
// surface colors always match what `ds-cards` documents. Keeping it as
// a const (not a prop) because the sequence is part of the section's
// visual contract — a caller reordering it would break the intent.
const CARD_TONES = [
  {
    card: 'bg-cream border-line',
    title: 'text-ink',
    body: 'text-muted',
    // Milestone-1 pill: cream card is the section's baseline tone, so
    // the pill uses the paper surface + brand ink to punch against it.
    pill: 'pill-paper',
  },
  {
    card: 'bg-paper border-line',
    title: 'text-ink',
    body: 'text-muted',
    // Milestone-2 pill: paper card is bright, so the pill inverts to
    // the brand-soft wash with brand ink for a calmer contrast.
    pill: 'pill-brand-soft',
  },
  {
    card: 'bg-brand border-transparent',
    title: 'text-cream',
    body: 'text-cream/80',
    // Milestone-3 pill: brand card is dark green, so the pill lifts
    // to accent (warm yellow) on brand ink — the strongest stop on
    // the timeline, matching the climactic "Heute" milestone.
    pill: 'pill-accent',
  },
]
</script>

<template>
  <section id="about" class="bg-cream text-ink">
    <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
      <div class="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        <Badge v-if="eyebrow" variant="brand">{{ eyebrow }}</Badge>

        <h2
          v-if="headline"
          class="font-display font-normal leading-[1.05] tracking-tight text-ink"
          style="font-size: clamp(2.25rem, 5vw, 3.75rem);"
        >{{ headline }}</h2>

        <p v-if="sub" class="text-lg leading-relaxed text-muted max-w-2xl">
          {{ sub }}
        </p>
      </div>

      <!-- Desktop-only horizontal timeline track. Rendered as its own row
           above the cards (hidden on mobile), so the pill ↔ card vertical
           pairing stays clean and we don't have to juggle two layouts in
           one grid. Track line is a pseudo-element inset from both edges
           so it terminates at the outer pills. -->
      <div
        v-if="milestones.length"
        class="timeline-track hidden md:grid md:grid-cols-3 mt-16"
        aria-hidden="true"
      >
        <div
          v-for="(milestone, i) in milestones.slice(0, 3)"
          :key="'track-' + i"
          class="timeline-cell"
        >
          <span :class="['timeline-pill', CARD_TONES[i].pill]">{{ milestone.year }}</span>
        </div>
      </div>

      <!-- Three timeline milestones. On mobile each card is preceded by
           its own pill (with a short connecting line above every
           non-first pill) so the column reads as one continuous
           timeline. On md+ the pill is hidden here because the
           horizontal track above already covers it. -->
      <ol
        v-if="milestones.length"
        class="timeline-list mt-6 md:mt-8 grid gap-0 md:gap-6 md:grid-cols-3"
      >
        <li
          v-for="(milestone, i) in milestones.slice(0, 3)"
          :key="milestone.year + milestone.title"
          class="timeline-item flex flex-col"
        >
          <div class="timeline-mobile-marker">
            <span :class="['timeline-pill', CARD_TONES[i].pill]">{{ milestone.year }}</span>
          </div>
          <div
            :class="[
              'flex flex-col gap-3 rounded-md border p-6 md:p-7',
              CARD_TONES[i].card,
            ]"
          >
            <h3
              :class="[
                'font-display text-2xl font-normal leading-tight',
                CARD_TONES[i].title,
              ]"
            >{{ milestone.title }}</h3>
            <p :class="['text-sm leading-relaxed', CARD_TONES[i].body]">
              {{ milestone.text }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Shared pill — typography and shape are constant across viewports
   so the horizontal and vertical renders read as one component.
   Per-card tones below paint the surface, ink, and border so each
   pill complements its sibling card. `position: relative; z-index:1`
   lifts the pill above the connecting line so the pill's background
   visually punches a hole in the timeline. */
.timeline-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

/* Per-card pill tones. Background must be opaque so the pill masks
   the connecting line behind it. */
.pill-paper {
  background: var(--color-paper);
  color: var(--color-brand);
  border-color: var(--color-line-strong);
}
.pill-brand-soft {
  background: color-mix(in srgb, var(--color-brand) 14%, var(--color-cream));
  color: var(--color-brand);
  border-color: color-mix(in srgb, var(--color-brand) 28%, transparent);
}
.pill-accent {
  background: var(--color-accent);
  color: var(--color-brand);
  border-color: color-mix(in srgb, var(--color-accent) 70%, var(--color-brand));
}

/* ——— Desktop: horizontal pill-line-pill track ———————————— */
/* Layout (display: grid) lives on the Tailwind utilities (`hidden
   md:grid md:grid-cols-3`) so we never set `display` here — that
   would beat the responsive `hidden` utility on mobile. */
.timeline-track {
  position: relative;
  align-items: center;
  margin-bottom: 0.5rem;
}
/* Hairline that runs under the pills. Inset to the column centers
   so the line terminates at the outer pills rather than bleeding
   past the grid. Percentages assume three equal columns. */
.timeline-track::before {
  content: '';
  position: absolute;
  left: 16.6667%;
  right: 16.6667%;
  top: 50%;
  height: 1px;
  background: var(--color-line-strong);
  transform: translateY(-0.5px);
}
.timeline-cell {
  display: flex;
  justify-content: center;
}

/* ——— Mobile: vertical pill-line-pill with cards interleaved ———
   Wrapped in a max-width media query so the mobile marker is fully
   removed from the layout on md+. (Scoped-style specificity beats
   Tailwind utilities here, so a `md:hidden` class would not be
   enough on its own.) */
@media (max-width: 767px) {
  .timeline-mobile-marker {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.75rem 0;
    position: relative;
  }
  /* Line above pill — spans the full top padding so it visually
     meets the card above. Suppressed on the first marker (start
     of the track). */
  .timeline-mobile-marker::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 50%;
    left: 50%;
    width: 1px;
    transform: translateX(-0.5px);
    background: var(--color-line-strong);
  }
  /* Line below pill — spans the bottom padding down to the next
     card so the pill feels threaded onto a continuous track. */
  .timeline-mobile-marker::after {
    content: '';
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 50%;
    width: 1px;
    transform: translateX(-0.5px);
    background: var(--color-line-strong);
  }
  .timeline-item:first-child .timeline-mobile-marker::before {
    display: none;
  }
}
@media (min-width: 768px) {
  .timeline-mobile-marker {
    display: none;
  }
}
</style>
