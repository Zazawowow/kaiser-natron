<!--
  UmbrellaStrip — the ENERGEIA house bar, shown only on umbrella
  deployments (VITE_UMBRELLA=1, see App.vue). One slim, fully-clickable
  strip above the page chrome that dives back out to the umbrella site
  at the origin root. Static in flow: the brand navbar (sticky) slides
  over it on scroll, so the brand owns the viewport once the user is in.
  Styled in ENERGEIA's monochrome language, not the brand palette —
  it reads as the house, not as part of this shop.
-->
<template>
  <a class="umbrella-strip" href="/" :aria-label="t('umbrella.backAria')">
    <span class="umbrella-brand">
      <span class="umbrella-mark" aria-hidden="true" v-html="markSvg"></span>
      <span class="umbrella-word">ENERGEIA</span>
      <span class="umbrella-tag">{{ t('umbrella.partOf') }}</span>
    </span>
    <span class="umbrella-back">
      <span class="umbrella-back-arrow" aria-hidden="true">←</span>
      {{ t('umbrella.back') }}
    </span>
  </a>
</template>

<script setup>
import markSvg from '@/assets/energeia-mark.svg?raw'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<style scoped>
.umbrella-strip {
  /* Sticky WITH the brand navbar: the strip pins at the very top and
     the navbar pins right below it (Navbar shifts its sticky top by
     the strip's 30px in umbrella builds) — the house stays visible
     wherever the user scrolls. */
  position: sticky;
  top: 0;
  z-index: 40; /* above the navbar's z-30 */
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.25rem;
  background: #faf9f7; /* ENERGEIA paper */
  color: #231f20; /* ENERGEIA ink */
  border-bottom: 1px solid rgb(35 31 32 / 0.12);
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  font-size: 0.72rem;
  text-decoration: none;
}
.umbrella-strip:hover .umbrella-back {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.umbrella-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}
.umbrella-mark {
  display: block;
  width: 20px;
  aspect-ratio: 215.2887 / 190.51906;
  flex: none;
}
.umbrella-mark :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
.umbrella-word {
  font-family: 'Georgia', 'Iowan Old Style', 'Times New Roman', serif;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
}
.umbrella-tag {
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 480px) {
  .umbrella-tag {
    display: none;
  }
}

.umbrella-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
.umbrella-back-arrow {
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.umbrella-strip:hover .umbrella-back-arrow {
  transform: translateX(-2px);
}
</style>
