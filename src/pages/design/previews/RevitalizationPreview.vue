<script setup>
import { computed } from 'vue'
import Revitalization from '@/design-system/components/Revitalization.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const features = computed(() => [
  { title: t('revit.feature.1.title'), icon: '⚗️' },
  { title: t('revit.feature.2.title'), icon: '💊' },
  { title: t('revit.feature.3.title'), icon: '🌿' },
])
</script>

<template>
  <div class="min-h-screen bg-brand">
    <Revitalization
      :eyebrow="t('revit.eyebrow')"
      :headline="t('revit.headline.a')"
      :headline-em="t('revit.headline.em')"
      :sub="t('revit.sub')"
      :features="features"
      :notify-cta="t('revit.notifyCta')"
    />
  </div>
</template>
