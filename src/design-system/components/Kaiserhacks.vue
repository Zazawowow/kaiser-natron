<script setup>
import Icon from './Icon.vue'
import Badge from './Badge.vue'

defineProps({
  eyebrow: { type: String, default: '#kaiserhacks' },
  headline: { type: String, default: '' },
  sub: { type: String, default: '' },
  categories: { type: Array, default: () => [] },
  instagramHref: { type: String, default: '' },
  labels: {
    type: Object,
    default: () => ({
      categories: '',
      categoryNav: '',
      openVideo: '',
      openImage: '',
      community: '',
      handoffNote: '',
    }),
  },
})

defineEmits(['select'])

function scrollToCategory(event, id) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.pushState(null, '', `#${id}`)
}
</script>

<template>
  <section class="bg-surface text-ink">
    <header class="bg-brand text-cream">
      <div class="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-14 text-center sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16">
        <p class="eyebrow mb-4 text-accent">{{ eyebrow }}</p>
        <h1 class="font-display text-headline-lg font-normal leading-[1.05] text-cream">
          {{ headline }}
        </h1>
        <p v-if="sub" class="mt-5 max-w-3xl text-base leading-relaxed text-cream/80 md:text-lg">
          {{ sub }}
        </p>

        <nav
          v-if="categories.length"
          class="mt-8 flex flex-wrap justify-center gap-2"
          :aria-label="labels.categoryNav"
        >
          <a
            v-for="category in categories"
            :key="category.id"
            :href="`#${category.id}`"
            class="inline-flex items-center gap-2 rounded-pill border border-cream-line bg-cream-wash px-4 py-2 text-[13px] font-semibold tracking-label text-cream transition-colors hover:bg-cream-wash-strong hover:text-accent"
            @click="scrollToCategory($event, category.id)"
          >
            {{ category.title }}
            <Icon name="arrow-right" :size="15" />
          </a>
        </nav>
      </div>
    </header>

    <div class="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16">
      <div class="space-y-14">
        <section
          v-for="category in categories"
          :id="category.id"
          :key="category.id"
          class="scroll-mt-[calc(var(--nav-h)+1.5rem)]"
        >
          <div class="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div class="max-w-2xl">
              <p class="eyebrow mb-3 text-brand">{{ labels.categories }}</p>
              <h2 class="font-display text-3xl font-normal leading-tight text-ink md:text-4xl">
                {{ category.title }}
              </h2>
              <p class="mt-3 text-[15px] leading-relaxed text-muted md:text-base">
                {{ category.summary }}
              </p>
            </div>
            <a
              :href="category.href"
              class="inline-flex items-center gap-2 text-[14px] font-semibold tracking-label text-brand transition-colors hover:text-brand-hover"
            >
              {{ category.ctaLabel }}
              <Icon name="arrow-right" :size="17" />
            </a>
          </div>

          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="hack in category.hacks" :key="hack.id">
              <article
                class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-md border border-line bg-paper transition-all duration-base hover:-translate-y-1 hover:border-brand-soft hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                role="button"
                tabindex="0"
                :aria-label="`${hack.video?.src ? labels.openVideo : labels.openImage}: ${hack.title}`"
                @click="$emit('select', hack)"
                @keydown.enter.prevent="$emit('select', hack)"
                @keydown.space.prevent="$emit('select', hack)"
              >
                <div
                  class="relative aspect-[4/3] w-full overflow-hidden bg-cream text-left"
                  :data-video-src="hack.video?.src"
                >
                  <img
                    v-if="hack.video?.poster"
                    :src="hack.video.poster"
                    :alt="hack.video.alt || hack.title"
                    loading="lazy"
                    decoding="async"
                    class="absolute inset-0 h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
                  />
                  <span
                    v-if="hack.video?.src"
                    class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-brand/90 px-4 py-3 text-cream"
                  >
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-accent text-brand shadow-sm">
                      <Icon name="play" :size="18" />
                    </span>
                    <span class="text-[12px] font-bold tracking-label">{{ hack.duration }}</span>
                  </span>
                </div>

                <div class="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div class="mb-3 flex flex-wrap gap-2">
                      <Badge
                        v-for="tag in hack.tags"
                        :key="tag"
                        variant="subtle"
                      >
                        {{ tag }}
                      </Badge>
                    </div>
                    <h3 class="font-display text-xl font-normal leading-tight text-ink">
                      {{ hack.title }}
                    </h3>
                    <p class="mt-2 overflow-hidden text-[14px] leading-relaxed text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {{ hack.description }}
                    </p>
                  </div>

                </div>
              </article>
            </li>
          </ul>
        </section>
      </div>

      <footer v-if="instagramHref" class="mt-14 rounded-md border border-line bg-cream p-6 md:mt-16 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p class="eyebrow mb-2">{{ labels.community }}</p>
          <p class="max-w-2xl text-[15px] leading-relaxed text-muted">
            {{ labels.handoffNote }}
          </p>
        </div>
        <a
          :href="instagramHref"
          target="_blank"
          rel="noreferrer"
          class="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold tracking-label text-brand transition-colors hover:text-brand-hover md:mt-0"
        >
          #kaiserhacks
          <Icon name="external-link" :size="16" />
        </a>
      </footer>
    </div>
  </section>
</template>
