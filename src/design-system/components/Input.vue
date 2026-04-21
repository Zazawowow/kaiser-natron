<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const uid = useId()
const inputId = computed(() => `in-${uid}`)
const hintId = computed(() => (props.hint ? `hint-${uid}` : undefined))
const errorId = computed(() => (props.error ? `err-${uid}` : undefined))
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="inputId"
      class="text-[11px] font-bold uppercase tracking-eyebrow text-muted"
    >
      {{ label }}<span v-if="required" class="text-danger"> *</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
      class="w-full rounded-sm border bg-paper px-4 py-3 text-[15px] text-ink
             placeholder:text-ink-placeholder
             transition-colors duration-base
             focus:outline-none focus:border-brand
             disabled:opacity-50 disabled:cursor-not-allowed"
      :class="error ? 'border-danger' : 'border-line'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="hint && !error" :id="hintId" class="text-[13px] text-muted">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="text-[13px] text-danger">{{ error }}</p>
  </div>
</template>
