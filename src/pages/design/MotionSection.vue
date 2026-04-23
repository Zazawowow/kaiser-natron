<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const principles = [
  t('ds.motion.principle.purpose'),
  t('ds.motion.principle.cadence'),
  t('ds.motion.principle.scenic'),
  t('ds.motion.principle.reduced'),
]

const durations = [
  { name: 'fast', value: '120ms', note: t('ds.motion.duration.fast.note') },
  { name: 'base', value: '200ms', note: t('ds.motion.duration.base.note') },
  { name: 'slow', value: '320ms', note: t('ds.motion.duration.slow.note') },
  { name: 'scene', value: '480ms', note: t('ds.motion.duration.scene.note') },
  { name: 'orbit', value: '16s', note: t('ds.motion.duration.orbit.note') },
]

const easings = [
  { name: 'out', curve: 'cubic-bezier(0.16, 1, 0.3, 1)', note: t('ds.motion.ease.out.note') },
  { name: 'in-out', curve: 'cubic-bezier(0.65, 0, 0.35, 1)', note: t('ds.motion.ease.inOut.note') },
  { name: 'linear', curve: 'linear', note: t('ds.motion.ease.linear.note') },
]

const animations = [
  { name: 'orbit', token: '--animate-orbit', note: t('ds.motion.animate.orbit.note') },
  { name: 'fade-in-up', token: '--animate-fade-in-up', note: t('ds.motion.animate.fadeInUp.note') },
  { name: 'pulse-soft', token: '--animate-pulse-soft', note: t('ds.motion.animate.pulseSoft.note') },
]

// Easing demo — replays whenever the user clicks any easing tile so all
// three previews fire together for direct comparison.
const easeRunKey = ref(0)
function replayEasings() {
  easeRunKey.value += 1
}

// Fade-in-up demo replays the same way.
const fadeKey = ref(0)
function replayFade() {
  fadeKey.value += 1
}
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.tokens')"
    :title="t('ds.motion.title')"
    :description="t('ds.motion.description')"
  >
    <!-- Philosophy -->
    <section>
      <h2 class="font-display text-2xl font-normal text-ink mb-4">
        {{ t('ds.motion.philosophy.title') }}
      </h2>
      <ul class="space-y-3 text-[15px] text-muted leading-relaxed max-w-2xl">
        <li
          v-for="(p, i) in principles"
          :key="i"
          class="flex gap-3"
        >
          <span class="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
          <span>{{ p }}</span>
        </li>
      </ul>
    </section>

    <!-- Durations -->
    <section>
      <h2 class="font-display text-2xl font-normal text-ink mb-4">
        {{ t('ds.motion.durations.title') }}
      </h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="d in durations"
          :key="d.name"
          class="rounded-md border border-line bg-paper p-5"
        >
          <code class="font-mono text-[12px] text-ink block">--duration-{{ d.name }}</code>
          <div class="mt-3 mb-3 text-[13px] text-muted">{{ d.value }}</div>
          <p class="text-[13px] text-muted leading-relaxed">{{ d.note }}</p>
        </div>
      </div>
    </section>

    <!-- Easings -->
    <section>
      <header class="mb-4 flex items-end justify-between gap-4 flex-wrap">
        <h2 class="font-display text-2xl font-normal text-ink">
          {{ t('ds.motion.easings.title') }}
        </h2>
        <button
          type="button"
          class="text-[12px] font-semibold uppercase tracking-label text-brand hover:underline"
          @click="replayEasings"
        >
          {{ t('ds.motion.replay') }}
        </button>
      </header>
      <div class="grid sm:grid-cols-3 gap-5">
        <div
          v-for="e in easings"
          :key="e.name"
          class="rounded-md border border-line bg-paper p-5"
        >
          <code class="font-mono text-[12px] text-ink block">--ease-{{ e.name }}</code>
          <div
            :key="`${e.name}-${easeRunKey}`"
            class="relative mt-4 h-12 rounded-sm bg-cream overflow-hidden cursor-pointer"
            @click="replayEasings"
          >
            <span
              class="absolute top-1/2 left-1 h-6 w-6 -mt-3 rounded-sm bg-brand"
              :style="{
                animation: `ds-ease-demo 1200ms ${e.curve} forwards`,
              }"
            />
          </div>
          <p class="mt-3 text-[12px] text-muted leading-relaxed">{{ e.note }}</p>
        </div>
      </div>
    </section>

    <!-- Named animations -->
    <section>
      <h2 class="font-display text-2xl font-normal text-ink mb-4">
        {{ t('ds.motion.animations.title') }}
      </h2>
      <div class="grid sm:grid-cols-3 gap-5">
        <!-- Orbit -->
        <div class="rounded-md border border-line bg-paper p-5">
          <code class="font-mono text-[12px] text-ink block">--animate-orbit</code>
          <div class="mt-4 flex h-32 items-center justify-center">
            <span class="ds-orbit-demo">
              <span class="ds-orbit-demo-ring">
                <span class="ds-orbit-demo-dot" />
              </span>
            </span>
          </div>
          <p class="mt-3 text-[12px] text-muted leading-relaxed">
            {{ animations[0].note }}
          </p>
        </div>

        <!-- Fade in up -->
        <div class="rounded-md border border-line bg-paper p-5">
          <header class="flex items-center justify-between gap-2">
            <code class="font-mono text-[12px] text-ink">--animate-fade-in-up</code>
            <button
              type="button"
              class="text-[11px] font-semibold uppercase tracking-label text-brand hover:underline"
              @click="replayFade"
            >
              {{ t('ds.motion.replay') }}
            </button>
          </header>
          <div class="mt-4 flex h-32 items-center justify-center">
            <span
              :key="fadeKey"
              class="rounded-sm bg-brand text-cream text-[12px] font-semibold tracking-label uppercase px-4 py-2"
              :style="{ animation: 'var(--animate-fade-in-up)' }"
            >{{ t('ds.motion.fadePreview') }}</span>
          </div>
          <p class="mt-3 text-[12px] text-muted leading-relaxed">
            {{ animations[1].note }}
          </p>
        </div>

        <!-- Pulse soft -->
        <div class="rounded-md border border-line bg-paper p-5">
          <code class="font-mono text-[12px] text-ink block">--animate-pulse-soft</code>
          <div class="mt-4 flex h-32 items-center justify-center">
            <span
              class="inline-block h-3 w-3 rounded-full bg-accent"
              :style="{ animation: 'var(--animate-pulse-soft)' }"
            />
          </div>
          <p class="mt-3 text-[12px] text-muted leading-relaxed">
            {{ animations[2].note }}
          </p>
        </div>
      </div>
    </section>

    <!-- Reduced motion -->
    <section>
      <h2 class="font-display text-2xl font-normal text-ink mb-4">
        {{ t('ds.motion.reduced.title') }}
      </h2>
      <p class="text-[15px] text-muted leading-relaxed max-w-2xl">
        {{ t('ds.motion.reduced.body') }}
      </p>
    </section>
  </SectionShell>
</template>

<style scoped>
@keyframes ds-ease-demo {
  from { transform: translateX(0); }
  to { transform: translateX(calc(100% + 0.25rem)); }
}

/* Orbit demo — same primitives the live Revitalization uses. */
.ds-orbit-demo {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
}
.ds-orbit-demo-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-accent) 60%, transparent);
  background: color-mix(in oklab, var(--color-accent) 6%, transparent);
  animation: var(--animate-orbit);
}
.ds-orbit-demo-dot {
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
</style>
