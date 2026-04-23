<script setup>
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

// The Bundles component is full-width and responsive with a carousel from
// md up — iframe it through DevicePreview so we can demo mobile / tablet /
// desktop breakpoints side by side rather than squeezing into the docs
// column at a single width.
const src = '/design/preview/bundles'
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.bundles.title')"
    :description="t('ds.bundles.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="1080" />
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
