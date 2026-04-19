<script setup>
import { ref } from 'vue'
import Button from '@/design-system/components/Button.vue'
import Input from '@/design-system/components/Input.vue'
import Badge from '@/design-system/components/Badge.vue'
import Card from '@/design-system/components/Card.vue'

const colorTokens = [
  { group: 'Brand', names: ['brand', 'brand-hover', 'brand-soft'] },
  { group: 'Accent', names: ['accent', 'accent-soft', 'accent-ink'] },
  { group: 'Surface', names: ['surface', 'paper', 'cream'] },
  { group: 'Ink', names: ['ink', 'muted'] },
  { group: 'Line', names: ['line', 'line-strong'] },
  { group: 'Semantic', names: ['success', 'warning', 'danger'] },
]

const radii = [
  { name: 'xs', value: '6px' },
  { name: 'sm', value: '10px' },
  { name: 'md', value: '16px' },
  { name: 'lg', value: '20px' },
  { name: 'xl', value: '28px' },
  { name: 'pill', value: '100px' },
]

const shadows = [
  { name: 'sm', label: 'var(--shadow-sm)' },
  { name: 'md', label: 'var(--shadow-md)' },
  { name: 'lg', label: 'var(--shadow-lg)' },
]

const inputEmail = ref('')
const inputErr = ref('')
</script>

<template>
  <div class="bg-[#fafafa] min-h-screen">
    <div class="mx-auto max-w-4xl px-10 lg:px-16 py-20">
      <!-- Header -->
      <header class="mb-24 max-w-3xl">
        <p class="eyebrow mb-4">Design system</p>
        <h1
          class="font-display font-normal tracking-[var(--tracking-tight)] leading-[1.05] text-[var(--color-ink)]"
          style="font-size: clamp(2.5rem, 4.5vw, 4rem);"
        >
          Kaiser Natron —
          <em class="italic font-light text-[var(--color-brand-soft)]">tokens & components</em>
        </h1>
        <p class="mt-6 text-[17px] text-[var(--color-muted)] leading-relaxed">
          The single source of truth for color, typography, and composition. Every page in the
          app is built by composing the primitives below — if it doesn't appear here, it doesn't
          belong in a page yet.
        </p>
      </header>

      <div class="space-y-32">
        <!-- Colors -->
        <section id="colors">
          <p class="eyebrow mb-3">Tokens</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Colors</h2>
          <div class="space-y-12">
            <div v-for="group in colorTokens" :key="group.group">
              <h3 class="text-sm font-semibold text-[var(--color-muted)] mb-5">{{ group.group }}</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div
                  v-for="name in group.names"
                  :key="name"
                  class="rounded-[var(--radius-md)] border border-[var(--color-line)] overflow-hidden bg-[var(--color-paper)]"
                >
                  <div
                    class="h-24 border-b border-[var(--color-line)]"
                    :style="{ background: `var(--color-${name})` }"
                  />
                  <div class="px-4 py-3">
                    <code class="font-mono text-[12px] text-[var(--color-ink)]">--color-{{ name }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Typography -->
        <section id="typography">
          <p class="eyebrow mb-3">Tokens</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Typography</h2>

          <div class="grid md:grid-cols-2 gap-6 mb-16">
            <Card tone="paper">
              <p class="eyebrow mb-3">Display</p>
              <p class="font-display text-5xl font-normal leading-[1.05] mb-3">Fraunces</p>
              <p class="text-sm text-[var(--color-muted)]">
                Serif with optical sizing. Use for hero, section titles, product names.
              </p>
            </Card>
            <Card tone="paper">
              <p class="eyebrow mb-3">Body</p>
              <p class="font-sans text-5xl font-medium leading-[1.05] mb-3">DM Sans</p>
              <p class="text-sm text-[var(--color-muted)]">
                Clean geometric sans. Use for body, UI, navigation, labels.
              </p>
            </Card>
          </div>

          <h3 class="eyebrow mb-5">Scale</h3>
          <div class="divide-y divide-[var(--color-line)]">
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-xs</code>
              <span class="text-xs">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-sm</code>
              <span class="text-sm">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-base</code>
              <span class="text-base">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-lg</code>
              <span class="text-lg">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-xl</code>
              <span class="text-xl">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-2xl</code>
              <span class="text-2xl">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-3xl</code>
              <span class="text-3xl">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-4xl</code>
              <span class="text-4xl">The quick brown fox</span>
            </div>
            <div class="flex items-baseline gap-8 py-4">
              <code class="font-mono text-[11px] text-[var(--color-muted)] w-24 shrink-0">text-5xl</code>
              <span class="text-5xl">The quick brown fox</span>
            </div>
          </div>
        </section>

        <!-- Radii -->
        <section id="radii">
          <p class="eyebrow mb-3">Tokens</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Radii</h2>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-6">
            <div v-for="r in radii" :key="r.name" class="text-center">
              <div
                class="h-20 w-full bg-[var(--color-paper)] border border-[var(--color-line)] mb-3"
                :style="{ borderRadius: `var(--radius-${r.name})` }"
              />
              <code class="font-mono text-[11px] text-[var(--color-ink)] block">--radius-{{ r.name }}</code>
              <span class="text-[11px] text-[var(--color-muted)]">{{ r.value }}</span>
            </div>
          </div>
        </section>

        <!-- Shadows -->
        <section id="shadows">
          <p class="eyebrow mb-3">Tokens</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Shadows</h2>
          <div class="grid sm:grid-cols-3 gap-6">
            <div v-for="s in shadows" :key="s.name">
              <div
                class="h-28 rounded-[var(--radius-md)] bg-[var(--color-paper)] mb-4"
                :style="{ boxShadow: s.label }"
              />
              <code class="font-mono text-[11px] text-[var(--color-ink)] block">--shadow-{{ s.name }}</code>
            </div>
          </div>
        </section>

        <!-- Buttons -->
        <section id="buttons">
          <p class="eyebrow mb-3">Components</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Buttons</h2>
          <div class="space-y-10">
            <div>
              <h3 class="eyebrow mb-5">Variants</h3>
              <div class="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div>
              <h3 class="eyebrow mb-5">Sizes</h3>
              <div class="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h3 class="eyebrow mb-5">States</h3>
              <div class="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button block class="max-w-sm">Block</Button>
              </div>
            </div>
          </div>
        </section>

        <!-- Badges -->
        <section id="badges">
          <p class="eyebrow mb-3">Components</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Badges</h2>
          <div class="flex flex-wrap gap-3">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="subtle">Subtle</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>

        <!-- Inputs -->
        <section id="inputs">
          <p class="eyebrow mb-3">Components</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Inputs</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <Input v-model="inputEmail" label="Email" placeholder="you@example.com" hint="We never share this." />
            <Input v-model="inputErr" label="Required field" required error="This field is required" />
            <Input label="Disabled" placeholder="Can't type here" disabled />
            <Input label="Password" type="password" placeholder="••••••••" />
          </div>
        </section>

        <!-- Cards -->
        <section id="cards">
          <p class="eyebrow mb-3">Components</p>
          <h2 class="font-display text-4xl font-normal tracking-[var(--tracking-tight)] mb-12">Cards</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <Card tone="paper">
              <h3 class="font-display text-2xl font-normal mb-2">Paper</h3>
              <p class="text-sm text-[var(--color-muted)]">Default surface for most content — neutral, high contrast.</p>
            </Card>
            <Card tone="cream" interactive>
              <h3 class="font-display text-2xl font-normal mb-2">Cream · interactive</h3>
              <p class="text-sm text-[var(--color-muted)]">Hover lifts and casts a green shadow.</p>
            </Card>
            <Card tone="brand">
              <h3 class="font-display text-2xl font-normal mb-2">Brand</h3>
              <p class="text-sm opacity-80">Feature panels and CTAs on dark green.</p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
