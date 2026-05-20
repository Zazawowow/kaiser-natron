<script setup>
import SectionShell from './SectionShell.vue'
import DevicePreview from '@/design-system/components/DevicePreview.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const src = '/design/preview/kaiserhacks'
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.kaiserhacks.title')"
    :description="t('ds.kaiserhacks.description')"
    wide
  >
    <section>
      <DevicePreview :src="src" initial="desktop" :height="900" />
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;Kaiserhacks
  :eyebrow="page.eyebrow"
  :headline="page.headline"
  :sub="page.sub"
  :categories="page.categories"
  :instagram-href="page.instagramHref"
  @select="openVideo"
/&gt;</pre>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.kaiserhacks.contract.title') }}</h2>
      <p class="max-w-2xl text-sm leading-relaxed text-muted">
        {{ t('ds.kaiserhacks.contract.body') }}
      </p>
    </section>
  </SectionShell>
</template>
