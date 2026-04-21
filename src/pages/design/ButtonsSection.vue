<script setup>
import SectionShell from './SectionShell.vue'
import Button from '@/design-system/components/Button.vue'
import Card from '@/design-system/components/Card.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.buttons.title')"
    :description="t('ds.buttons.description')"
  >
    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.variants') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3">
          <Button variant="primary">{{ t('ds.buttons.primary') }}</Button>
          <Button variant="accent">{{ t('ds.buttons.accent') }}</Button>
          <Button variant="secondary">{{ t('ds.buttons.secondary') }}</Button>
          <Button variant="ghost">{{ t('ds.buttons.ghost') }}</Button>
          <Button variant="danger">{{ t('ds.buttons.danger') }}</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.onDifferentSurfaces') }}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <Card tone="paper">
          <p class="eyebrow mb-4">{{ t('ds.cards.paper') }}</p>
          <div class="flex flex-wrap gap-3">
            <Button variant="primary">
              <template #before><Icon name="cart" :size="18" /></template>
              {{ t('ds.buttons.addToCart') }}
            </Button>
            <Button variant="ghost">{{ t('ds.buttons.learnMore') }}</Button>
          </div>
        </Card>
        <Card tone="cream">
          <p class="eyebrow mb-4">{{ t('ds.cards.cream') }}</p>
          <div class="flex flex-wrap gap-3">
            <Button variant="primary">
              <template #before><Icon name="cart" :size="18" /></template>
              {{ t('ds.buttons.addToCart') }}
            </Button>
            <Button variant="ghost">{{ t('ds.buttons.learnMore') }}</Button>
          </div>
        </Card>
        <Card tone="brand">
          <p class="eyebrow mb-4 !text-cream opacity-80">{{ t('ds.cards.brand') }}</p>
          <div class="flex flex-wrap gap-3">
            <Button variant="accent">
              <template #before><Icon name="cart" :size="18" /></template>
              {{ t('ds.buttons.addToCart') }}
            </Button>
            <Button variant="ghost" class="!text-cream hover:!bg-cream-wash">
              {{ t('ds.buttons.learnMore') }}
            </Button>
          </div>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.sizes') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap items-center gap-3">
          <Button size="sm">{{ t('ds.buttons.small') }}</Button>
          <Button size="md">{{ t('ds.buttons.medium') }}</Button>
          <Button size="lg">{{ t('ds.buttons.large') }}</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.withIcons') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <template #before><Icon name="cart" :size="18" /></template>
            {{ t('ds.buttons.addToCart') }}
          </Button>
          <Button variant="secondary">
            {{ t('ds.buttons.learnMore') }}
            <template #after><Icon name="arrow-right" :size="18" /></template>
          </Button>
          <Button variant="ghost">
            <template #before><Icon name="heart" :size="18" /></template>
            {{ t('ds.buttons.save') }}
          </Button>
          <Button variant="accent" size="sm">
            <template #before><Icon name="check" :size="16" /></template>
            {{ t('ds.buttons.confirm') }}
          </Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.states') }}</h2>
      <Card tone="paper">
        <div class="flex flex-wrap gap-3 items-center">
          <Button>{{ t('ds.heading.default') }}</Button>
          <Button disabled>{{ t('ds.buttons.disabled') }}</Button>
          <Button loading>{{ t('ds.buttons.loading') }}</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.block') }}</h2>
      <Card tone="paper">
        <div class="max-w-md space-y-3">
          <Button block variant="primary">
            <template #before><Icon name="cart" :size="18" /></template>
            {{ t('ds.buttons.addToCart') }}
          </Button>
          <Button block variant="secondary">{{ t('ds.buttons.continueShopping') }}</Button>
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
        <pre class="whitespace-pre-wrap">&lt;Button variant="primary" size="md"&gt;
  &lt;template #before&gt;&lt;Icon name="cart" :size="18" /&gt;&lt;/template&gt;
  {{ t('ds.buttons.addToCart') }}
&lt;/Button&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
