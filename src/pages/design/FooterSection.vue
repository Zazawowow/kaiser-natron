<script setup>
import SectionShell from './SectionShell.vue'
import Footer from '@/design-system/components/Footer.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.footer.title')"
    :description="t('ds.footer.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.footer.tone.cream') }}</h2>
      <div class="rounded-md overflow-hidden border border-line">
        <Footer variant="cream" />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.footer.tone.brand') }}</h2>
      <div class="rounded-md overflow-hidden border border-line">
        <Footer variant="brand" />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.footer.tone.paper') }}</h2>
      <div class="rounded-md overflow-hidden border border-line">
        <Footer variant="paper" />
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
<pre class="whitespace-pre-wrap">&lt;Footer variant="cream" /&gt;
&lt;Footer variant="brand" /&gt;
&lt;Footer variant="paper" /&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
