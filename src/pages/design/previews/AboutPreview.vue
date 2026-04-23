<script setup>
import { computed } from 'vue'
import About from '@/design-system/components/About.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const milestones = computed(() =>
  [1, 2, 3].map((i) => ({
    year: t(`about.milestone.${i}.year`),
    title: t(`about.milestone.${i}.title`),
    text: t(`about.milestone.${i}.text`),
  })),
)
</script>

<template>
  <div class="min-h-screen bg-cream">
    <About
      :eyebrow="t('about.eyebrow')"
      :headline="t('about.headline')"
      :sub="t('about.sub')"
      :milestones="milestones"
    />
  </div>
</template>
