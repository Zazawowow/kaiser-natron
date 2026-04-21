<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import Icon from './Icon.vue'
import { useI18n } from '@/i18n/index.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  products: { type: Array, default: () => [] },
  /**
   * Surface tone. Default is 'brand' so the overlay reads as the site's
   * primary affordance (pine green). Use 'paper' for light chrome, 'cream'
   * for a warm-neutral alternative.
   */
  tone: {
    type: String,
    default: 'brand',
    validator: (t) => ['brand', 'paper', 'cream'].includes(t),
  },
  // Cap result count — keeps the list glance-able on both mobile and desktop.
  limit: { type: Number, default: 12 },
  // Empty-query state: show top N products so the panel never looks dead.
  emptyPreview: { type: Number, default: 6 },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'select'])

const { t } = useI18n()

// Tone-driven class bundles. Keep every interactive element colored from
// one place so swapping tones is a one-word change at the call site.
const tones = {
  brand: {
    surface: 'bg-brand text-cream',
    border: 'border-cream-line',
    inputIcon: 'text-cream/70',
    input: 'text-cream placeholder:text-cream/50',
    closeBtn: 'text-cream/70 hover:text-cream hover:bg-cream-wash',
    hint: 'text-cream/60',
    kbd: 'bg-cream-wash text-cream border-cream-line',
    mediaBg: 'bg-cream',
    title: 'text-cream',
    meta: 'text-cream/70',
    price: 'text-accent',
    noResults: 'text-cream/70',
    rowActive: 'bg-cream-wash',
    rowHover: 'hover:bg-cream-wash/60',
    eyebrowCream: true,
  },
  paper: {
    surface: 'bg-paper text-ink',
    border: 'border-line',
    inputIcon: 'text-muted',
    input: 'text-ink placeholder:text-muted',
    closeBtn: 'text-muted hover:text-brand hover:bg-brand-wash',
    hint: 'text-muted',
    kbd: 'bg-cream text-ink border-line',
    mediaBg: 'bg-cream',
    title: 'text-ink',
    meta: 'text-muted',
    price: 'text-brand',
    noResults: 'text-muted',
    rowActive: 'bg-brand-soft-wash',
    rowHover: 'hover:bg-brand-wash',
    eyebrowCream: false,
  },
  cream: {
    surface: 'bg-cream text-brand',
    border: 'border-line',
    inputIcon: 'text-brand/70',
    input: 'text-ink placeholder:text-muted',
    closeBtn: 'text-muted hover:text-brand hover:bg-brand-wash',
    hint: 'text-muted',
    kbd: 'bg-paper text-ink border-line',
    mediaBg: 'bg-paper',
    title: 'text-ink',
    meta: 'text-muted',
    price: 'text-brand',
    noResults: 'text-muted',
    rowActive: 'bg-brand-soft-wash',
    rowHover: 'hover:bg-brand-wash',
    eyebrowCream: false,
  },
}
const toneClasses = computed(() => tones[props.tone])

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const listRef = ref(null)

// Normalize for search: lowercase, strip diacritics, expand ß so German
// users typing "grosspackung" still match "Großpackung". NFKD + combining-
// mark strip handles ü/ö/ä/é/ñ etc; ß isn't covered by NFKD so we do it
// by hand.
function normalize(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
}

// Token-based scoring across multiple weighted fields. Every token in the
// query has to land somewhere; prefix matches get a bonus so "nat" ranks
// "Natron" above a keyword hit.
function scoreProduct(p, tokens) {
  if (!tokens.length) return 0
  const fields = [
    { val: normalize(p.title), weight: 5 },
    { val: normalize(p.brand), weight: 3 },
    { val: normalize(p.size), weight: 2 },
    { val: normalize(p.category), weight: 2 },
    { val: (p.keywords || []).map(normalize).join(' '), weight: 3 },
    { val: normalize(p.id), weight: 1 },
  ]
  let score = 0
  for (const tok of tokens) {
    let hit = false
    for (const f of fields) {
      if (!f.val) continue
      if (f.val.includes(tok)) {
        hit = true
        score += f.weight
        if (f.val.startsWith(tok)) score += Math.ceil(f.weight / 2)
      }
    }
    if (!hit) return 0
  }
  return score
}

const results = computed(() => {
  const q = normalize(query.value).trim()
  if (!q) return props.products.slice(0, props.emptyPreview)
  const tokens = q.split(/\s+/).filter(Boolean)
  return props.products
    .map((p) => ({ p, score: scoreProduct(p, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, props.limit)
    .map(({ p }) => p)
})

watch(() => props.modelValue, async (open) => {
  if (open) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(results, () => {
  activeIndex.value = 0
})

// Scroll-lock the document while open so the overlay "feels" modal on mobile.
watch(() => props.modelValue, (open) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.documentElement.style.overflow = ''
})

function close() { emit('update:modelValue', false) }

function clearQuery() {
  query.value = ''
  nextTick(() => inputRef.value?.focus())
}

function selectAt(index) {
  const item = results.value[index]
  if (item) emit('select', item)
  close()
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (!results.value.length) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    scrollActiveIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value =
      (activeIndex.value - 1 + results.value.length) % results.value.length
    scrollActiveIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    selectAt(activeIndex.value)
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    const node = listRef.value?.querySelector('[data-active="true"]')
    node?.scrollIntoView({ block: 'nearest' })
  })
}

function priceLabel(p) {
  if (typeof p.price === 'number') {
    return `€ ${p.price.toFixed(2).replace('.', ',')}`
  }
  return p.price ? `€ ${p.price}` : ''
}

// Real anchors still navigate; prevent the '#' fallback from hash-jumping.
function onRowClick(i, item, e) {
  if (!item.href) e.preventDefault()
  selectAt(i)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-base ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-base ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[60] font-sans"
        role="dialog"
        aria-modal="true"
        :aria-label="t('search.label')"
        @keydown="onKeydown"
      >
        <!-- Backdrop (md+). Tap to dismiss. -->
        <div
          class="hidden md:block absolute inset-0 bg-ink/50"
          @click="close"
        />

        <!-- Panel: full-screen on mobile, centered modal on md+. -->
        <Transition
          enter-active-class="transition duration-slow ease-out"
          enter-from-class="md:opacity-0 md:-translate-y-2 translate-y-4"
          enter-to-class="md:opacity-100 md:translate-y-0 translate-y-0"
          leave-active-class="transition duration-base ease-out"
          leave-from-class="md:opacity-100 translate-y-0"
          leave-to-class="md:opacity-0 translate-y-4"
          appear
        >
          <div
            v-show="modelValue"
            :class="[
              'relative flex flex-col h-full w-full',
              'md:absolute md:left-1/2 md:top-[12vh] md:h-auto',
              'md:-translate-x-1/2 md:max-h-[76vh] md:w-[min(640px,92vw)]',
              'md:rounded-lg md:shadow-lg md:border',
              toneClasses.surface,
              toneClasses.border,
            ]"
          >
            <!-- Input row -->
            <div
              :class="[
                'shrink-0 flex items-center gap-3 px-5 md:px-4 pt-5 md:pt-3 pb-3 border-b',
                toneClasses.border,
              ]"
              style="padding-top: calc(env(safe-area-inset-top) + 1.25rem);"
            >
              <Icon name="search" :size="20" :class="['shrink-0', toneClasses.inputIcon]" />
              <input
                ref="inputRef"
                v-model="query"
                type="search"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="none"
                spellcheck="false"
                enterkeyhint="search"
                :placeholder="placeholder || t('search.placeholder')"
                :aria-label="t('search.label')"
                :class="[
                  'search-input flex-1 min-w-0 bg-transparent border-0 outline-none text-[17px] md:text-[15px]',
                  toneClasses.input,
                ]"
              />
              <button
                v-if="query"
                type="button"
                class="shrink-0 inline-flex items-center px-[11px] py-[5px] rounded-pill text-[11px] font-bold tracking-eyebrow uppercase bg-accent text-accent-ink hover:bg-accent-soft transition-colors"
                :aria-label="t('search.clear')"
                @click="clearQuery"
              >
                {{ t('search.clearShort') }}
              </button>
              <button
                type="button"
                :class="[
                  'shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-pill transition-colors',
                  toneClasses.closeBtn,
                ]"
                :aria-label="t('menu.close')"
                @click="close"
              >
                <Icon name="close" :size="20" />
              </button>
            </div>

            <!-- Results -->
            <div
              ref="listRef"
              class="flex-1 overflow-y-auto py-2"
              style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);"
              role="listbox"
              :aria-label="t('search.results')"
            >
              <p
                v-if="!query.trim() && results.length"
                :class="[
                  'eyebrow px-5 md:px-4 pt-2 pb-1',
                  toneClasses.eyebrowCream ? 'text-cream/70' : '',
                ]"
              >
                {{ t('search.suggested') }}
              </p>

              <p
                v-if="!results.length"
                :class="['px-5 md:px-4 py-10 text-center text-sm', toneClasses.noResults]"
              >
                {{ t('search.noResults') }}
              </p>

              <a
                v-for="(p, i) in results"
                :key="p.id"
                :href="p.href || '#'"
                role="option"
                :aria-selected="i === activeIndex"
                :data-active="i === activeIndex"
                :class="[
                  'flex items-center gap-4 px-5 md:px-4 py-3 transition-colors',
                  i === activeIndex ? toneClasses.rowActive : toneClasses.rowHover,
                ]"
                @mousemove="activeIndex = i"
                @click="onRowClick(i, p, $event)"
              >
                <div
                  :class="[
                    'shrink-0 w-14 h-14 rounded-sm overflow-hidden flex items-center justify-center',
                    toneClasses.mediaBg,
                  ]"
                >
                  <img
                    v-if="p.image"
                    :src="p.image"
                    :alt="p.title"
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-contain p-2"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p :class="['text-[15px] font-semibold leading-tight truncate', toneClasses.title]">
                    {{ p.title }}
                  </p>
                  <p v-if="p.size" :class="['text-[13px] truncate', toneClasses.meta]">
                    {{ p.size }}<span v-if="p.brand"> · {{ p.brand }}</span>
                  </p>
                </div>
                <span :class="['shrink-0 text-[14px] font-semibold', toneClasses.price]">{{ priceLabel(p) }}</span>
              </a>
            </div>

            <!-- Mobile floating close — mirrors the navbar's search-open
                 button position so users return their thumb to the same spot. -->
            <button
              type="button"
              class="md:hidden fixed bottom-5 left-5 z-[70] w-14 h-14 rounded-full bg-brand text-accent shadow-lg flex items-center justify-center transition-transform duration-base ease-out hover:-translate-y-0.5 active:translate-y-0"
              style="margin-bottom: env(safe-area-inset-bottom);"
              :aria-label="t('menu.close')"
              @click="close"
            >
              <Icon name="close" :size="22" :stroke-width="2" />
            </button>

            <!-- Keyboard hints — desktop only. -->
            <div
              :class="[
                'hidden md:flex shrink-0 items-center gap-4 px-4 py-2 border-t text-[11px]',
                toneClasses.border,
                toneClasses.hint,
              ]"
            >
              <span class="inline-flex items-center gap-1.5">
                <kbd :class="['px-1.5 py-0.5 rounded-sm border font-mono text-[11px]', toneClasses.kbd]">↑</kbd>
                <kbd :class="['px-1.5 py-0.5 rounded-sm border font-mono text-[11px]', toneClasses.kbd]">↓</kbd>
                {{ t('search.hint.navigate') }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <kbd :class="['px-1.5 py-0.5 rounded-sm border font-mono text-[11px]', toneClasses.kbd]">↵</kbd>
                {{ t('search.hint.select') }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <kbd :class="['px-1.5 py-0.5 rounded-sm border font-mono text-[11px]', toneClasses.kbd]">esc</kbd>
                {{ t('search.hint.close') }}
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-input::-webkit-search-cancel-button,
.search-input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}
</style>
