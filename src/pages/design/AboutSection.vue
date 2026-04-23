<script setup>
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const src = '/design/preview/about'
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.about.title')"
    :description="t('ds.about.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="820" />
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;About
  :eyebrow="t('about.eyebrow')"
  :headline="t('about.headline')"
  :sub="t('about.sub')"
  :milestones="[1, 2, 3].map((i) =&gt; ({
    year: t(`about.milestone.${i}.year`),
    title: t(`about.milestone.${i}.title`),
    text: t(`about.milestone.${i}.text`),
  }))"
/&gt;</pre>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">Tone sequence</h2>
      <p class="text-sm text-muted max-w-2xl">
        The three milestone cards cycle the Card primitive's tones left-to-right:
        <code class="font-mono text-[12px]">paper</code> →
        <code class="font-mono text-[12px]">cream</code> →
        <code class="font-mono text-[12px]">brand</code>. The sequence is part of
        the component's visual contract and is not configurable — see
        <code class="font-mono text-[12px]">CARD_TONES</code> in
        <code class="font-mono text-[12px]">About.vue</code>.
      </p>
    </section>
  </SectionShell>
</template>
