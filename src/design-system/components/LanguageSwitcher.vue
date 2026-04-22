<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  floating: { type: Boolean, default: false },
  /**
   * Tone — matches the three surface tones used elsewhere in the system:
   *  - 'paper': dark ink on a paper container (use on light/white surfaces)
   *  - 'cream': paper container with a stronger border (use on cream surfaces)
   *  - 'brand': cream ink on a translucent cream container (use on brand-green surfaces)
   */
  tone: {
    type: String,
    default: 'paper',
    validator: (t) => ['paper', 'cream', 'brand'].includes(t),
  },
})

const { locale, setLocale, availableLocales } = useI18n()

const tones = {
  paper: {
    container: 'border border-line bg-paper',
    active: 'bg-brand text-accent',
    inactive: 'text-muted hover:text-brand',
  },
  cream: {
    container: 'border border-line-strong bg-paper',
    active: 'bg-brand text-accent',
    inactive: 'text-muted hover:text-brand',
  },
  brand: {
    container: 'border border-cream-line bg-cream-wash',
    active: 'bg-accent text-brand',
    inactive: 'text-cream hover:text-accent',
  },
}

const t = computed(() => tones[props.tone])
</script>

<template>
  <div
    role="group"
    aria-label="Language"
    :class="[
      'inline-flex items-center h-10 px-2 gap-0.5 rounded-pill font-sans',
      t.container,
      floating ? 'fixed top-6 right-6 z-[60] shadow-sm' : '',
    ]"
  >
    <button
      v-for="l in availableLocales"
      :key="l.code"
      type="button"
      :aria-label="l.name"
      :aria-pressed="locale === l.code"
      :class="[
        'px-2.5 py-1 text-[11px] font-bold tracking-eyebrow rounded-pill transition-colors duration-base',
        locale === l.code ? t.active : t.inactive,
      ]"
      @click="setLocale(l.code)"
    >{{ l.label }}</button>
  </div>
</template>
