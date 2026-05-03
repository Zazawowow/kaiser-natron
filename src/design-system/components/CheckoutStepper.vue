<script setup>
/**
 * CheckoutStepper — minimal horizontal progress indicator. Each step
 * is a small circle (number for upcoming/active, check for completed)
 * with an inline label, joined by thin connector lines. The active
 * step's circle is filled brand; completed circles carry a check;
 * upcoming circles are outlined.
 *
 * On mobile, labels are hidden under sm to keep the bar compact —
 * only circles and connectors render. On md+ the labels return.
 *
 * Click-to-go-back: any earlier (completed) step is navigable.
 * Forward jumps are blocked unless the parent passed `completed:true`
 * for that step.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'

const props = defineProps({
  steps: { type: Array, required: true },
  activeKey: { type: String, required: true },
})

const router = useRouter()

const enriched = computed(() => {
  const activeIndex = props.steps.findIndex((s) => s.key === props.activeKey)
  return props.steps.map((step, i) => {
    const state =
      i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'upcoming'
    const navigable = state === 'completed' || (state === 'upcoming' && step.completed)
    return { ...step, index: i, state, navigable }
  })
})

function goTo(step) {
  if (!step.navigable || step.state === 'active') return
  router.push(step.to)
}
</script>

<template>
  <nav :aria-label="$attrs['aria-label'] || 'Checkout progress'">
    <ol class="flex items-center gap-2 sm:gap-3">
      <template v-for="(step, i) in enriched" :key="step.key">
        <li class="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            :disabled="!step.navigable && step.state !== 'active'"
            :aria-current="step.state === 'active' ? 'step' : undefined"
            :class="[
              'group inline-flex items-center gap-2 sm:gap-2.5 transition-colors duration-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand rounded-sm',
              step.navigable || step.state === 'active' ? 'cursor-pointer' : 'cursor-not-allowed',
            ]"
            @click="goTo(step)"
          >
            <span
              :class="[
                'inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold tabular-nums transition-colors duration-base',
                step.state === 'active' && 'bg-brand text-cream',
                step.state === 'completed' && 'bg-brand text-cream group-hover:bg-brand-hover',
                step.state === 'upcoming' && 'bg-transparent text-muted border border-line',
                step.state === 'upcoming' && step.navigable && 'group-hover:border-brand group-hover:text-brand',
              ]"
            >
              <Icon
                v-if="step.state === 'completed'"
                name="check"
                :size="13"
                :stroke-width="2.6"
              />
              <span v-else>{{ step.index + 1 }}</span>
            </span>
            <span
              :class="[
                'hidden md:inline whitespace-nowrap text-[13px] tracking-label transition-colors duration-base',
                step.state === 'active' && 'text-brand font-semibold',
                step.state === 'completed' && 'text-brand font-medium',
                step.state === 'upcoming' && 'text-muted font-medium',
                step.state === 'upcoming' && step.navigable && 'group-hover:text-brand',
              ]"
            >{{ step.label }}</span>
          </button>
        </li>
        <li
          v-if="i < enriched.length - 1"
          aria-hidden="true"
          :class="[
            'h-px w-6 sm:w-10 md:w-12 transition-colors duration-base shrink-0',
            i < enriched.findIndex((s) => s.key === activeKey) ? 'bg-brand' : 'bg-line',
          ]"
        />
      </template>
    </ol>
  </nav>
</template>
