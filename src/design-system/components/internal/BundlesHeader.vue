<script setup>
/**
 * BundlesHeader — shared headline + sub block rendered by both
 * Bundles layouts (sidebar and stacked). Kept local to
 * `design-system/components/internal/` so the top-level index stays
 * focused on publicly-composed primitives (Bundles, BundleCard, etc.)
 * and this stays plainly "an implementation detail of Bundles".
 */
defineProps({
  headline: { type: String, default: '' },
  headlineEm: { type: String, default: '' },
  sub: { type: String, default: '' },
  /** Tailwind max-width utility applied to the sub paragraph. Callers
   *  pass whichever fits their column rhythm — `max-w-md` for the
   *  narrow sidebar, `max-w-2xl` for a full-width banner, etc. Kept
   *  as a string rather than an enum so we don't have to maintain an
   *  allow-list in two places. */
  subMaxWidth: { type: String, default: 'max-w-md' },
})
</script>

<template>
  <div v-if="headline || headlineEm || sub" class="flex flex-col gap-4">
    <h2
      v-if="headline || headlineEm"
      class="font-display font-normal leading-[1.05] tracking-tight text-ink text-headline-md"
    >
      {{ headline }}
      <em
        v-if="headlineEm"
        class="italic font-light text-brand"
      >{{ headlineEm }}</em>
    </h2>
    <p
      v-if="sub"
      :class="['text-base leading-relaxed text-muted', subMaxWidth]"
    >{{ sub }}</p>
  </div>
</template>
