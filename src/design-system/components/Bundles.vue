<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Button from './Button.vue'
import Icon from './Icon.vue'
import IconButton from './IconButton.vue'
import BundleCard from './BundleCard.vue'
import { useI18n } from '@/i18n/index.js'

/**
 * Bundles — a mixed sidebar + carousel compound section.
 *
 * Content is supplied entirely via props so the component is decoupled
 * from any single i18n namespace. Carousel chrome (prev / next / dot
 * labels) is resolved internally against `ds.bundles.carousel.*` and
 * can be overridden per-instance via the *Label / *A11y props.
 */
const props = defineProps({
  // Section headline. `headline` renders in the display serif; `headlineEm`
  // is the italicised highlight, styled consistently with Hero.
  headline: { type: String, default: '' },
  headlineEm: { type: String, default: '' },
  sub: { type: String, default: '' },

  // Three benefit strings. Anything beyond the third index is ignored —
  // the "max three things" rule is enforced structurally here because a
  // longer list visibly undermines the sidebar's balance with the cards.
  benefits: {
    type: Array,
    default: () => [],
    validator: (arr) => arr.every((v) => typeof v === 'string'),
  },

  joinCta: { type: String, default: '' },

  // { id, name, items[], price, memberPrice?, usage?, image, imageAlt?,
  //   badge?, badgeVariant? } per bundle.
  bundles: { type: Array, required: true },

  // Optional ARIA / label overrides — default to DS chrome strings.
  carouselLabel: { type: String, default: '' },
  carouselPrevLabel: { type: String, default: '' },
  carouselNextLabel: { type: String, default: '' },
  carouselGoToPrefix: { type: String, default: '' },
})

defineEmits(['add', 'join'])

const { t } = useI18n()

const carouselLabel = () => props.carouselLabel || t('ds.bundles.carousel.label')
const carouselPrev = () => props.carouselPrevLabel || t('ds.bundles.carousel.prev')
const carouselNext = () => props.carouselNextLabel || t('ds.bundles.carousel.next')
const goToPrefix = () => props.carouselGoToPrefix || t('ds.bundles.carousel.goToSlide')

// Carousel — only active from md up. Mobile uses a plain stacked grid.
const track = ref(null)
const activeIndex = ref(0)

function slideCount() {
  return track.value ? track.value.children.length : 0
}

function goTo(i, behavior = 'smooth') {
  const el = track.value
  if (!el) return
  const last = el.children.length - 1
  const target = Math.max(0, Math.min(i, last))
  el.scrollTo({ left: target * el.clientWidth, behavior })
}

// Looping navigation — next on the last slide wraps to the first, prev
// on the first wraps to the last. It's a visible jump (not a seamless
// infinite scroll), matching the "3 > 1 and 1 < 3" wrap the user asked
// for without the complexity of duplicated slides.
function prev() {
  const last = slideCount() - 1
  if (last < 0) return
  goTo(activeIndex.value === 0 ? last : activeIndex.value - 1)
}

function next() {
  const last = slideCount() - 1
  if (last < 0) return
  goTo(activeIndex.value === last ? 0 : activeIndex.value + 1)
}

// Math.round against scrollLeft / clientWidth resolves to the nearest
// full slide — snap-mandatory keeps it honest but the handler is robust
// to subpixel drift while a scroll animation is in flight.
function onScroll() {
  const el = track.value
  if (!el) return
  const i = Math.round(el.scrollLeft / el.clientWidth)
  if (i !== activeIndex.value) activeIndex.value = i
}

// Viewport resize changes clientWidth, leaving a stale scrollLeft
// stopped between two cards. Re-anchor on the next frame (after layout
// has settled) using `auto` behavior — the slide stays visually put,
// we're only re-aligning the offset.
let resizeFrame = 0
function onResize() {
  if (resizeFrame) cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(() => {
    const el = track.value
    if (!el) return
    el.scrollLeft = activeIndex.value * el.clientWidth
    resizeFrame = 0
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (resizeFrame) cancelAnimationFrame(resizeFrame)
})
</script>

<template>
  <section id="bundles" class="bg-surface text-ink">
    <!-- Matches the Hero banner container — same max-w-6xl so the section
         aligns with the banner above rather than breaking full-bleed. -->
    <div
      class="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-20 lg:px-16 lg:py-24"
    >
      <div class="grid gap-10 md:gap-12 lg:gap-16 lg:grid-cols-[340px_1fr] lg:items-center">
        <!-- Sidebar: heading + sub + up-to-3 benefits + CTA. -->
        <aside class="flex flex-col gap-8">
          <div v-if="headline || sub" class="flex flex-col gap-4">
            <h2
              v-if="headline || headlineEm"
              class="font-display font-normal leading-[1.05] tracking-tight text-ink"
              style="font-size: clamp(2rem, 4vw, 3rem);"
            >
              {{ headline }}
              <em
                v-if="headlineEm"
                class="italic font-light text-brand"
              >{{ headlineEm }}</em>
            </h2>
            <p v-if="sub" class="text-base leading-relaxed text-muted max-w-md">
              {{ sub }}
            </p>
          </div>

          <ul v-if="benefits.length" class="flex flex-col gap-4">
            <li
              v-for="benefit in benefits.slice(0, 3)"
              :key="benefit"
              class="flex items-start gap-3"
            >
              <span
                aria-hidden="true"
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-wash text-brand"
              >
                <Icon name="check" :size="14" :stroke-width="2.2" />
              </span>
              <span class="font-sans text-sm font-semibold text-ink leading-snug">
                {{ benefit }}
              </span>
            </li>
          </ul>

          <Button
            v-if="joinCta"
            variant="primary"
            size="md"
            @click="$emit('join')"
          >{{ joinCta }}</Button>
        </aside>

        <!-- Bundles. `min-w-0` is load-bearing: a grid `1fr` column
             defaults to `min-width: auto`, letting its children's
             intrinsic width push the column past its allocation.
             Without this, the carousel's fixed-width slides drag the
             right column past the section's max-width during resizes. -->
        <div class="min-w-0">
          <!-- Mobile: vertical stack. -->
          <div class="md:hidden grid gap-5">
            <BundleCard
              v-for="bundle in bundles"
              :key="bundle.id"
              layout="vertical"
              :name="bundle.name"
              :items="bundle.items"
              :price="bundle.price"
              :member-price="bundle.memberPrice"
              :usage="bundle.usage"
              :image="bundle.image"
              :image-alt="bundle.imageAlt"
              :badge="bundle.badge"
              :badge-variant="bundle.badgeVariant || 'accent'"
              tone="paper"
              @add="$emit('add', bundle.id)"
            />
          </div>

          <!-- md+ : one-at-a-time scroll-snap carousel with horizontal cards.
               Swipe, keyboard arrow keys, and the prev/next buttons all
               drive the same scrollLeft — no animation state needed. -->
          <div class="hidden md:flex md:flex-col md:gap-6 relative">
            <!-- Padding + matching negative margins reserve room inside the
                 scroll container for the hover lift and shadow-md without
                 expanding the visible slot. overflow-x-auto forces
                 overflow-y to behave in most engines, so any vertical
                 overflow would otherwise clip. -->
            <div
              ref="track"
              class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar pt-2 pb-16 -mt-2 -mb-16"
              role="region"
              aria-roledescription="carousel"
              :aria-label="carouselLabel()"
              @scroll="onScroll"
            >
              <div
                v-for="(bundle, i) in bundles"
                :key="bundle.id"
                class="snap-start shrink-0 w-full"
                role="group"
                aria-roledescription="slide"
                :aria-label="`${i + 1} / ${bundles.length}`"
              >
                <BundleCard
                  layout="horizontal"
                  :name="bundle.name"
                  :items="bundle.items"
                  :price="bundle.price"
                  :member-price="bundle.memberPrice"
                  :usage="bundle.usage"
                  :image="bundle.image"
                  :image-alt="bundle.imageAlt"
                  :badge="bundle.badge"
                  :badge-variant="bundle.badgeVariant || 'accent'"
                  tone="paper"
                  @add="$emit('add', bundle.id)"
                />
              </div>
            </div>

            <!-- Controls: dot indicators on the left, prev/next on the right. -->
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <button
                  v-for="(_, i) in bundles"
                  :key="i"
                  type="button"
                  :class="[
                    'h-2 rounded-full transition-all duration-base',
                    activeIndex === i
                      ? 'w-8 bg-brand'
                      : 'w-2 bg-brand/30 hover:bg-brand/50',
                  ]"
                  :aria-label="`${goToPrefix()} ${i + 1}`"
                  :aria-current="activeIndex === i ? 'true' : undefined"
                  @click="goTo(i)"
                />
              </div>

              <div class="flex items-center gap-2">
                <IconButton
                  icon="chevron-left"
                  variant="brand-wash"
                  size="md"
                  :aria-label="carouselPrev()"
                  @click="prev"
                />
                <IconButton
                  icon="chevron-right"
                  variant="brand-wash"
                  size="md"
                  :aria-label="carouselNext()"
                  @click="next"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Keep the native scrollbar out of the carousel chrome — the dots + arrows
   already convey position and range, and a visible bar competes with the
   pill indicators. */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
