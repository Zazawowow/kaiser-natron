<script setup>
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const src = '/design/preview/revitalization'
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.revitalization.title')"
    :description="t('ds.revitalization.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="720" />
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;Revitalization
  :eyebrow="t('revit.eyebrow')"
  :headline="t('revit.headline.a')"
  :headline-em="t('revit.headline.em')"
  :sub="t('revit.sub')"
  :features="[
    t('revit.feature.1.title'),
    t('revit.feature.2.title'),
    t('revit.feature.3.title'),
  ]"
  :notify-cta="t('revit.notifyCta')"
  @notify="captureEmail()"
/&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
