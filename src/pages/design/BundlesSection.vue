<script setup>
import { computed, ref } from 'vue'
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

// The Bundles component is full-width and responsive with a carousel from
// md up — iframe it through DevicePreview so we can demo mobile / tablet /
// desktop breakpoints side by side rather than squeezing into the docs
// column at a single width.
//
// Layout variant travels to the preview route via `?layout=` so the
// iframe can re-render in the selected shape. Index-based labelling
// ('Option 1', 'Option 2', …) keeps the UI generic so the same
// switcher pattern works for any future component variant set.
const variants = [
  { id: 'sidebar', label: 'Option 1' },
  { id: 'stacked', label: 'Option 2' },
]
const variant = ref('sidebar')
const src = computed(() => `/design/preview/bundles?layout=${variant.value}`)
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.bundles.title')"
    :description="t('ds.bundles.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="1080">
        <template #controls>
          <!-- Variant switcher. Same pill treatment as the device
               switcher on the right, aligned left so the two sit at
               opposite ends of the preview's control bar. -->
          <div
            role="tablist"
            aria-label="Layout variant"
            class="inline-flex items-center p-1 gap-0.5 rounded-pill border border-line bg-paper"
          >
            <button
              v-for="v in variants"
              :key="v.id"
              type="button"
              role="tab"
              :aria-selected="variant === v.id"
              :class="[
                'inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold tracking-label rounded-pill transition-colors duration-base',
                variant === v.id ? 'bg-brand text-accent' : 'text-muted hover:text-brand',
              ]"
              @click="variant = v.id"
            >{{ v.label }}</button>
          </div>
        </template>
      </DevicePreview>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;Bundles
  :bundles="bundles"
  :headline="t('bundles.headline.a')"
  :headline-em="t('bundles.headline.em')"
  :sub="t('bundles.sub')"
  :benefits="[
    t('bundles.benefit.1.title'),
    t('bundles.benefit.2.title'),
    t('bundles.benefit.3.title'),
  ]"
  :join-cta="t('bundles.joinCta')"
  @add="addBundle(bundleId)"
  @join="openSignup()"
/&gt;</pre>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Props</h2>
      <div class="rounded-md border border-line bg-paper overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-surface border-b border-line">
            <tr>
              <th class="px-5 py-3 font-semibold tracking-label text-muted uppercase text-[11px]">Prop</th>
              <th class="px-5 py-3 font-semibold tracking-label text-muted uppercase text-[11px]">Type</th>
              <th class="px-5 py-3 font-semibold tracking-label text-muted uppercase text-[11px]">Purpose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr>
              <td class="px-5 py-3 font-mono text-[12px]">bundles</td>
              <td class="px-5 py-3 text-muted">Array</td>
              <td class="px-5 py-3">Required. Array of bundle records rendered by BundleCard.</td>
            </tr>
            <tr>
              <td class="px-5 py-3 font-mono text-[12px]">headline / headlineEm / sub</td>
              <td class="px-5 py-3 text-muted">String</td>
              <td class="px-5 py-3">Sidebar copy; <code class="font-mono text-[12px]">headlineEm</code> is the italicised highlight.</td>
            </tr>
            <tr>
              <td class="px-5 py-3 font-mono text-[12px]">benefits</td>
              <td class="px-5 py-3 text-muted">String[]</td>
              <td class="px-5 py-3">Sidebar benefit bullets. First three are shown.</td>
            </tr>
            <tr>
              <td class="px-5 py-3 font-mono text-[12px]">joinCta</td>
              <td class="px-5 py-3 text-muted">String</td>
              <td class="px-5 py-3">Label for the sidebar's primary button. Emits <code class="font-mono text-[12px]">join</code>.</td>
            </tr>
            <tr>
              <td class="px-5 py-3 font-mono text-[12px]">carousel*Label</td>
              <td class="px-5 py-3 text-muted">String</td>
              <td class="px-5 py-3">Override the default carousel a11y labels (prev / next / goToSlide / region label).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </SectionShell>
</template>
