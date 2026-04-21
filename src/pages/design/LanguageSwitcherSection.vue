<script setup>
import SectionShell from './SectionShell.vue'
import Card from '@/design-system/components/Card.vue'
import LanguageSwitcher from '@/design-system/components/LanguageSwitcher.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.language.title')"
    :description="t('ds.language.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.onDifferentSurfaces') }}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <Card tone="paper">
          <p class="eyebrow mb-4">{{ t('ds.cards.paper') }}</p>
          <LanguageSwitcher tone="paper" />
          <p class="text-[13px] text-muted mt-4 leading-relaxed">
            {{ t('ds.language.paperNote') }}
          </p>
        </Card>
        <Card tone="cream">
          <p class="eyebrow mb-4">{{ t('ds.cards.cream') }}</p>
          <LanguageSwitcher tone="cream" />
          <p class="text-[13px] text-muted mt-4 leading-relaxed">
            {{ t('ds.language.creamNote') }}
          </p>
        </Card>
        <Card tone="brand">
          <p class="eyebrow mb-4">{{ t('ds.cards.brand') }}</p>
          <LanguageSwitcher tone="brand" />
          <p class="text-[13px] opacity-80 mt-4 leading-relaxed">
            {{ t('ds.language.brandNote') }}
          </p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.language.floating') }}</h2>
      <Card tone="paper">
        <p class="text-[13px] text-muted max-w-2xl leading-relaxed">
          {{ t('ds.language.floatingNote') }}
        </p>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
        <pre class="whitespace-pre-wrap">&lt;LanguageSwitcher /&gt;
&lt;LanguageSwitcher tone="brand" /&gt;
&lt;LanguageSwitcher floating /&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
