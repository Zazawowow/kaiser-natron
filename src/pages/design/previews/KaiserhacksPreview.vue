<script setup>
import { computed } from 'vue'
import Kaiserhacks from '@/design-system/components/Kaiserhacks.vue'
import { kaiserhacksPage, localizeKaiserhacks } from '@/api/kaiserhacks.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const page = computed(() => localizeKaiserhacks(kaiserhacksPage, t))
const labels = computed(() => ({
  categories: t('kaiserhacks.labels.categories'),
  categoryNav: t('kaiserhacks.labels.categoryNav'),
  openVideo: t('kaiserhacks.labels.openVideo'),
  mockPlayer: t('kaiserhacks.labels.mockPlayer'),
  community: t('kaiserhacks.labels.community'),
  handoffNote: t('kaiserhacks.labels.handoffNote'),
}))
</script>

<template>
  <div class="min-h-screen bg-surface">
    <Kaiserhacks
      :eyebrow="page.eyebrow"
      :headline="page.headline"
      :sub="page.sub"
      :categories="page.categories"
      :instagram-href="page.instagramHref"
      :labels="labels"
    />
  </div>
</template>
