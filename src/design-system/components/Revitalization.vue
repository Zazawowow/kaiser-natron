<script setup>
import Badge from './Badge.vue'
import Button from './Button.vue'

/**
 * Revitalization — a brand-green feature-teaser section.
 *
 * Centered eyebrow + display headline + sub + up-to-3 feature pillars
 * with accent dots + one "notify me" CTA. Content is supplied entirely
 * via props so the component stays reusable for any coming-soon teaser.
 */
defineProps({
  eyebrow: { type: String, default: '' },

  // Renders in the display serif; `headlineEm` is the italicised
  // highlight styled to sit on the accent-soft cream tone.
  headline: { type: String, default: '' },
  headlineEm: { type: String, default: '' },
  sub: { type: String, default: '' },

  // Three feature strings. Extra entries are ignored by the slice to
  // protect the "max three things" invariant visually.
  features: {
    type: Array,
    default: () => [],
    validator: (arr) => arr.every((v) => typeof v === 'string'),
  },

  notifyCta: { type: String, default: '' },
})

defineEmits(['notify'])
</script>

<template>
  <section id="revitalize" class="bg-brand text-cream">
    <div class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
      <div class="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
        <Badge v-if="eyebrow" variant="accent">{{ eyebrow }}</Badge>

        <h2
          v-if="headline || headlineEm"
          class="font-display font-normal leading-[1.04] tracking-tight"
          style="font-size: clamp(2.25rem, 5vw, 3.75rem);"
        >
          {{ headline }}
          <em
            v-if="headlineEm"
            class="italic font-light text-accent-soft"
          >{{ headlineEm }}</em>
        </h2>

        <p v-if="sub" class="text-lg leading-relaxed text-cream/80 max-w-2xl">
          {{ sub }}
        </p>
      </div>

      <!-- Three pillars. Stacks on mobile; three-column row from sm up. -->
      <ul
        v-if="features.length"
        class="mt-10 md:mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8 max-w-4xl mx-auto"
      >
        <li
          v-for="feature in features.slice(0, 3)"
          :key="feature"
          class="flex flex-col items-center gap-3 text-center"
        >
          <span
            aria-hidden="true"
            class="inline-block h-2 w-2 rounded-full bg-accent"
          />
          <span class="font-sans text-base font-semibold text-cream leading-snug">
            {{ feature }}
          </span>
        </li>
      </ul>

      <div v-if="notifyCta" class="mt-10 md:mt-14 flex justify-center">
        <Button variant="accent" size="lg" @click="$emit('notify')">
          {{ notifyCta }}
        </Button>
      </div>
    </div>
  </section>
</template>
