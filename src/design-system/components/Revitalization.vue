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

  // Three feature pillars: `{ title, icon }`. Plain strings are still
  // accepted for back-compat and render without an orbit icon. Extra
  // entries are sliced off to keep the "max three things" invariant.
  features: {
    type: Array,
    default: () => [],
    validator: (arr) =>
      arr.every(
        (v) =>
          typeof v === 'string' ||
          (v && typeof v === 'object' && typeof v.title === 'string'),
      ),
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
          class="font-display font-normal leading-[1.04] tracking-tight text-headline-lg"
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
          v-for="(feature, i) in features.slice(0, 3)"
          :key="typeof feature === 'string' ? feature : feature.title"
          class="flex flex-col items-center gap-4 text-center"
        >
          <span aria-hidden="true" class="rv-orbit">
            <span
              class="rv-orbit-ring"
              :style="{ animationDelay: `${i * -5}s` }"
            >
              <span class="rv-orbit-dot" />
            </span>
            <span v-if="typeof feature === 'object' && feature.icon" class="rv-orbit-center">
              {{ feature.icon }}
            </span>
          </span>
          <span class="font-sans text-base font-semibold text-cream leading-snug">
            {{ typeof feature === 'string' ? feature : feature.title }}
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

<style scoped>
/* Mini orbit — port of the original Kaiser-Natron revitalisation
   visual, scaled down so each pillar gets its own. A ring spins
   around a centered emoji; a small dot rides the ring. */
.rv-orbit {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size-orbit);
  height: var(--size-orbit);
}
.rv-orbit-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-accent) 60%, transparent);
  background: color-mix(in oklab, var(--color-accent) 6%, transparent);
  animation: var(--animate-orbit);
}
.rv-orbit-dot {
  position: absolute;
  top: -3px;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  border-radius: 9999px;
  background: var(--color-accent);
  box-shadow: 0 0 8px color-mix(in oklab, var(--color-accent) 55%, transparent);
}
.rv-orbit-center {
  font-size: 22px;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
}
/* The `spin` keyframe and reduced-motion guard are shared in
   `src/design-system/motion.css`. */
</style>
