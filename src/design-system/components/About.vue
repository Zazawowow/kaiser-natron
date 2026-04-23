<script setup>
import Badge from './Badge.vue'

/**
 * About — a centered intro + three-up milestone gallery.
 *
 * Content is supplied entirely via props. Milestones are expected as an
 * array of `{ year, title, text }` entries; extras past the third are
 * ignored to keep the "max three things" rhythm.
 *
 * The three cards cycle the Card primitive's tones left-to-right —
 * paper / cream / brand — so the row echoes the design system's three
 * canonical surfaces rather than repeating a single tone.
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
    year: 'text-muted',
    title: 'text-ink',
    body: 'text-muted',
  },
  {
    card: 'bg-paper border-line',
    year: 'text-muted',
    title: 'text-ink',
    body: 'text-muted',
  },
  {
    card: 'bg-brand border-transparent',
    year: 'text-accent',
    title: 'text-cream',
    body: 'text-cream/80',
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

      <!-- Three timeline milestones. Stacks on mobile; three columns from
           md up, each rendered as a paper card so the cream section reads
           as a gallery rather than a flat list. -->
      <ol
        v-if="milestones.length"
        class="mt-10 md:mt-16 grid gap-5 md:grid-cols-3 md:gap-6"
      >
        <li
          v-for="(milestone, i) in milestones.slice(0, 3)"
          :key="milestone.year + milestone.title"
          :class="[
            'flex flex-col gap-3 rounded-md border p-6 md:p-7',
            CARD_TONES[i].card,
          ]"
        >
          <span :class="['text-xs tracking-label uppercase', CARD_TONES[i].year]">
            {{ milestone.year }}
          </span>
          <h3
            :class="[
              'font-display text-2xl font-normal leading-tight',
              CARD_TONES[i].title,
            ]"
          >{{ milestone.title }}</h3>
          <p :class="['text-sm leading-relaxed', CARD_TONES[i].body]">
            {{ milestone.text }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
