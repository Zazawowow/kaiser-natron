<script setup>
/**
 * Step 2 — Account. Three-tab fork: guest checkout (default), sign
 * in (returning customer), or create account. Email is the shared
 * primary field; the other fields swap depending on the active tab.
 *
 * Sign in / register call into `src/api/auth.js`. The guest path
 * just stores the email on the checkout form and continues. Either
 * way, the user proceeds to /checkout/shipping next.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/design-system/components/Input.vue'
import Button from '@/design-system/components/Button.vue'
import { signIn, register, getCurrentUser } from '@/api/index.js'
import { useCheckoutStore } from '@/stores/checkout.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const checkout = useCheckoutStore()
const router = useRouter()

const submitting = ref(false)
const submitError = ref('')

const tabs = [
  { key: 'guest', label: 'checkout.account.tab.guest' },
  { key: 'signin', label: 'checkout.account.tab.signin' },
  { key: 'register', label: 'checkout.account.tab.register' },
]

function setTab(key) {
  submitError.value = ''
  checkout.setAccountMode(key)
}

const isGuest = computed(() => checkout.accountMode === 'guest')
const isSignIn = computed(() => checkout.accountMode === 'signin')
const isRegister = computed(() => checkout.accountMode === 'register')

const passwordsMatch = computed(
  () => !isRegister.value || checkout.password === checkout.passwordConfirm,
)

const submitDisabled = computed(() => {
  if (!checkout.email) return true
  if (isGuest.value) return false
  if (!checkout.password || checkout.password.length < 8) return true
  if (isRegister.value && !passwordsMatch.value) return true
  return false
})

async function onSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    if (isSignIn.value) {
      await signIn({ email: checkout.email, password: checkout.password })
    } else if (isRegister.value) {
      await register({
        email: checkout.email,
        password: checkout.password,
        firstName: checkout.firstName,
        lastName: checkout.lastName,
        acceptsMarketing: checkout.acceptsMarketing,
      })
    }
    checkout.persist()
    router.push('/checkout/shipping')
  } catch (err) {
    submitError.value = err?.message || t('checkout.error.generic')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // If the user is already signed in (returning visitor), prefill the
  // email and skip ahead to shipping. Don't auto-skip if they
  // explicitly chose "guest" earlier in this checkout session.
  const session = await getCurrentUser()
  if (session?.user?.email && !checkout.email) {
    checkout.update({ email: session.user.email })
  }
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <div
      role="tablist"
      :aria-label="t('checkout.account.tabsLabel')"
      class="flex w-full rounded-pill border border-line bg-paper p-1"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        type="button"
        :aria-selected="checkout.accountMode === tab.key"
        :class="[
          'flex-1 px-4 py-2 rounded-pill text-[13px] font-semibold tracking-label transition-colors duration-base text-center',
          checkout.accountMode === tab.key
            ? 'bg-brand text-cream'
            : 'text-brand hover:bg-cream',
        ]"
        @click="setTab(tab.key)"
      >{{ t(tab.label) }}</button>
    </div>

    <form
      class="flex flex-col gap-5 md:min-h-[28rem]"
      novalidate
      @submit.prevent="onSubmit"
    >
      <Input
        :model-value="checkout.email"
        :label="t('checkout.field.email')"
        type="email"
        required
        :placeholder="t('checkout.placeholder.email')"
        :hint="isGuest ? t('checkout.hint.email') : ''"
        @update:model-value="checkout.update({ email: $event })"
      />

      <template v-if="isRegister">
        <div class="grid gap-5 md:grid-cols-2">
          <Input
            :model-value="checkout.firstName"
            :label="t('checkout.field.firstName')"
            @update:model-value="checkout.update({ firstName: $event })"
          />
          <Input
            :model-value="checkout.lastName"
            :label="t('checkout.field.lastName')"
            @update:model-value="checkout.update({ lastName: $event })"
          />
        </div>
      </template>

      <template v-if="isSignIn || isRegister">
        <Input
          :model-value="checkout.password"
          :label="t('checkout.field.password')"
          type="password"
          required
          :hint="isRegister ? t('checkout.hint.password') : ''"
          @update:model-value="checkout.update({ password: $event })"
        />
      </template>

      <template v-if="isRegister">
        <Input
          :model-value="checkout.passwordConfirm"
          :label="t('checkout.field.passwordConfirm')"
          type="password"
          required
          :error="!passwordsMatch ? t('checkout.error.passwordMismatch') : ''"
          @update:model-value="checkout.update({ passwordConfirm: $event })"
        />
      </template>

      <label
        v-if="isGuest || isRegister"
        class="inline-flex items-center gap-3 cursor-pointer select-none"
      >
        <input
          :checked="checkout.acceptsMarketing"
          type="checkbox"
          class="w-5 h-5 rounded-xs border border-line accent-brand"
          @change="checkout.update({ acceptsMarketing: $event.target.checked })"
        />
        <span class="text-sm text-ink">{{ t('checkout.field.marketing') }}</span>
      </label>

      <p
        v-if="submitError"
        class="text-sm text-danger"
        role="alert"
        aria-live="polite"
      >{{ submitError }}</p>

      <p v-if="isSignIn" class="text-[13px] text-muted">
        <a href="/account/reset-password" class="text-brand hover:underline">
          {{ t('checkout.account.forgot') }}
        </a>
      </p>

    </form>
  </section>

  <footer
    class="fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-line"
    role="contentinfo"
  >
    <div
      class="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 flex gap-3 sm:justify-between"
      :style="{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }"
    >
      <RouterLink to="/checkout/cart" class="flex-1 sm:flex-initial">
        <Button variant="primary" size="lg" block type="button">
          {{ t('checkout.back') }}
        </Button>
      </RouterLink>
      <div class="flex-1 sm:flex-initial">
        <Button
          variant="accent"
          size="lg"
          block
          :loading="submitting"
          :disabled="submitDisabled"
          @click="onSubmit"
        >{{ t('checkout.account.cta.continue') }}</Button>
      </div>
    </div>
  </footer>
</template>
