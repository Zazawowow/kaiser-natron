<script setup>
import SectionShell from './SectionShell.vue'
import Logo from '@/design-system/components/Logo.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.brand')"
    :title="t('ds.logo.title')"
    :description="t('ds.logo.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.onDifferentSurfaces') }}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="rounded-md border border-line bg-paper p-10 flex flex-col items-center gap-4">
          <Logo class="w-40 h-auto text-brand" />
          <code class="font-mono text-[11px] text-muted">{{ t('ds.cards.paper') }}</code>
        </div>
        <div class="rounded-md border border-line bg-cream p-10 flex flex-col items-center gap-4">
          <Logo class="w-40 h-auto text-brand" />
          <code class="font-mono text-[11px] text-muted">{{ t('ds.cards.cream') }}</code>
        </div>
        <div class="rounded-md bg-brand p-10 flex flex-col items-center gap-4">
          <Logo class="w-40 h-auto text-paper" />
          <code class="font-mono text-[11px] text-cream opacity-70">{{ t('ds.cards.brand') }}</code>
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.sizes') }}</h2>
      <div class="rounded-md border border-line bg-paper p-10 flex items-end gap-10 flex-wrap">
        <div class="flex flex-col items-center gap-3">
          <Logo class="w-16 h-auto text-brand" />
          <code class="font-mono text-[11px] text-muted">w-16</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Logo class="w-32 h-auto text-brand" />
          <code class="font-mono text-[11px] text-muted">w-32</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Logo class="w-60 h-auto text-brand" />
          <code class="font-mono text-[11px] text-muted">w-60</code>
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
        <p class="mb-2 text-muted">{{ t('ds.logo.usageIntro') }}</p>
        <pre class="whitespace-pre-wrap">&lt;Logo class="w-60 h-auto text-brand" /&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
