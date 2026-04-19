<script setup>
import { ref } from 'vue'
import SectionShell from './SectionShell.vue'
import Input from '@/design-system/components/Input.vue'
import Card from '@/design-system/components/Card.vue'

const email = ref('')
const password = ref('')
const required = ref('')
</script>

<template>
  <SectionShell
    eyebrow="Components"
    title="Inputs"
    description="Paper surface with a thin green-tinted border. Uppercase eyebrow labels. Focus deepens the border to brand green."
  >
    <section>
      <h2 class="eyebrow mb-5">Default</h2>
      <Card tone="paper">
        <div class="grid md:grid-cols-2 gap-6 max-w-3xl">
          <Input
            v-model="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            hint="We never share this."
          />
          <Input
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
        </div>
      </Card>
    </section>

    <section>
      <h2 class="eyebrow mb-5">States</h2>
      <Card tone="paper">
        <div class="grid md:grid-cols-2 gap-6 max-w-3xl">
          <Input
            v-model="required"
            label="Required field"
            required
            error="This field is required"
          />
          <Input
            label="Disabled"
            placeholder="Can't type here"
            disabled
          />
        </div>
      </Card>
    </section>
  </SectionShell>
</template>
