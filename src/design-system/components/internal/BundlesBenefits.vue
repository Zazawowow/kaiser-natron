<script setup>
/**
 * BundlesBenefits — the checklist rendered alongside both Bundles
 * layouts. Accepts a positioning hint so the caller can align the
 * list flush-left in a grid cell (stacked layout) without the
 * subcomponent needing to know anything about grid context.
 */
import Icon from '../Icon.vue'

defineProps({
  benefits: {
    type: Array,
    required: true,
    validator: (arr) => arr.every((v) => typeof v === 'string'),
  },
  /** Applied to the root `<ul>`. Stacked layout uses
   *  `lg:justify-self-start lg:max-w-sm` so the list sits at the
   *  left of its grid column; sidebar layout passes nothing. */
  listClass: { type: String, default: '' },
})
</script>

<template>
  <ul
    v-if="benefits.length"
    :class="['flex flex-col gap-4', listClass]"
  >
    <li
      v-for="benefit in benefits.slice(0, 3)"
      :key="benefit"
      class="flex items-start gap-3"
    >
      <span
        aria-hidden="true"
        class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-wash text-brand"
      >
        <Icon name="check" :size="14" :stroke-width="2.2" />
      </span>
      <span class="font-sans text-sm font-semibold text-ink leading-snug">
        {{ benefit }}
      </span>
    </li>
  </ul>
</template>
