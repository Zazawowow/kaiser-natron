<script setup>
import { computed, ref } from 'vue'
import SectionShell from './SectionShell.vue'
import Icon from '@/design-system/components/Icon.vue'
import { icons } from '@/design-system/components/icons.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()

const groups = computed(() => [
  { title: t('ds.icons.group.commerce'), names: ['cart', 'bag', 'heart', 'user', 'search'] },
  { title: t('ds.icons.group.navigation'), names: ['menu', 'close', 'chevron-left', 'chevron-right', 'chevron-down', 'chevron-up', 'arrow-left', 'arrow-right'] },
  { title: t('ds.icons.group.actions'), names: ['plus', 'minus', 'check'] },
  { title: t('ds.icons.group.contact'), names: ['mail', 'phone', 'map-pin', 'external-link'] },
  { title: t('ds.icons.group.feedback'), names: ['info', 'star'] },
  { title: t('ds.icons.group.devices'), names: ['mobile', 'tablet', 'desktop'] },
])

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value
    .map((g) => ({
      ...g,
      names: g.names.filter((n) => n.includes(q) || (icons[n]?.label || '').toLowerCase().includes(q)),
    }))
    .filter((g) => g.names.length > 0)
})

const copied = ref('')
async function copy(name) {
  const snippet = `<Icon name="${name}" />`
  try {
    await navigator.clipboard.writeText(snippet)
    copied.value = name
    setTimeout(() => {
      if (copied.value === name) copied.value = ''
    }, 1200)
  } catch {
    // clipboard blocked; ignore
  }
}
</script>

<template>
  <SectionShell
    :eyebrow="t('ds.eyebrow.components')"
    :title="t('ds.icons.title')"
    :description="t('ds.icons.description')"
  >
    <section>
      <div class="mb-5 flex items-center gap-3 flex-wrap">
        <label class="relative inline-flex items-center">
          <span class="absolute left-3 text-muted pointer-events-none">
            <Icon name="search" :size="16" />
          </span>
          <input
            v-model="query"
            type="search"
            :placeholder="t('ds.icons.search')"
            class="pl-9 pr-4 py-2 rounded-pill border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-brand w-[260px]"
          />
        </label>
        <span class="text-[12px] text-muted">{{ t('ds.icons.copyHint') }}</span>
      </div>

      <div v-if="filtered.length === 0" class="text-[14px] text-muted">
        {{ t('ds.icons.noMatch') }} "{{ query }}".
      </div>

      <div v-for="group in filtered" :key="group.title" class="mb-10 last:mb-0">
        <h2 class="eyebrow mb-4">{{ group.title }}</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          <button
            v-for="name in group.names"
            :key="name"
            type="button"
            class="group flex flex-col items-center justify-center gap-2 p-4 rounded-md border border-line bg-paper text-ink hover:border-brand-soft hover:-translate-y-0.5 hover:shadow-sm transition-all duration-base ease-out"
            @click="copy(name)"
          >
            <span class="w-10 h-10 rounded-sm bg-cream text-brand flex items-center justify-center">
              <Icon :name="name" :size="22" />
            </span>
            <span class="font-mono text-[11px] text-muted group-hover:text-brand transition-colors">
              {{ copied === name ? t('ds.icons.copied') : name }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.onDifferentSurfaces') }}</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="rounded-md border border-line bg-paper text-brand p-8 flex items-center justify-center gap-6">
          <Icon name="cart" :size="28" />
          <Icon name="heart" :size="28" />
          <Icon name="user" :size="28" />
        </div>
        <div class="rounded-md border border-line bg-cream text-brand p-8 flex items-center justify-center gap-6">
          <Icon name="cart" :size="28" />
          <Icon name="heart" :size="28" />
          <Icon name="user" :size="28" />
        </div>
        <div class="rounded-md bg-brand text-accent p-8 flex items-center justify-center gap-6">
          <Icon name="cart" :size="28" />
          <Icon name="heart" :size="28" />
          <Icon name="user" :size="28" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.sizes') }}</h2>
      <div class="rounded-md border border-line bg-paper p-8 flex items-end gap-8 text-brand">
        <div class="flex flex-col items-center gap-3">
          <Icon name="cart" :size="16" />
          <code class="font-mono text-[11px] text-muted">16</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Icon name="cart" :size="20" />
          <code class="font-mono text-[11px] text-muted">{{ t('ds.icons.sizeDefault') }}</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Icon name="cart" :size="24" />
          <code class="font-mono text-[11px] text-muted">24</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Icon name="cart" :size="32" />
          <code class="font-mono text-[11px] text-muted">32</code>
        </div>
        <div class="flex flex-col items-center gap-3">
          <Icon name="cart" :size="48" />
          <code class="font-mono text-[11px] text-muted">48</code>
        </div>
      </div>
    </section>

    <section>
      <h2 class="eyebrow mb-5">{{ t('ds.heading.usage') }}</h2>
      <div class="rounded-md border border-line bg-paper p-6 font-mono text-[12px] text-ink">
        <pre class="whitespace-pre-wrap">&lt;Icon name="cart" :size="20" /&gt;
&lt;Icon name="arrow-right" :size="16" label="Next slide" /&gt;</pre>
      </div>
    </section>
  </SectionShell>
</template>
