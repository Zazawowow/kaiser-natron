<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import Input from '@/design-system/components/Input.vue'
import Card from '@/design-system/components/Card.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const required = ref('')
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.inputs.title')"
    :description="t('ds.inputs.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.default') }}</h2>
      <Card tone="paper">
        <div class="grid md:grid-cols-2 gap-6 max-w-3xl">
          <Input
            v-model="email"
            :label="t('ds.inputs.email')"
            type="email"
            placeholder="you@example.com"
            :hint="t('ds.inputs.emailHint')"
          />
          <Input
            v-model="password"
            :label="t('ds.inputs.password')"
            type="password"
            placeholder="••••••••"
          />
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <Card tone="paper">
        <div class="grid md:grid-cols-2 gap-6 max-w-3xl">
          <Input
            v-model="required"
            :label="t('ds.inputs.required')"
            required
            :error="t('ds.inputs.requiredError')"
          />
          <Input
            :label="t('ds.inputs.disabled')"
            :placeholder="t('ds.inputs.disabledPlaceholder')"
            disabled
          />
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
