// Checkout state — Pinia store. Single source of truth for the form
// values across the four checkout steps (cart, account, shipping,
// payment). Persists to sessionStorage so a refresh during the flow
// doesn't lose progress, but never to localStorage — the basket is
// the durable thing, not the half-filled checkout form.
//
// Step guards live here too: each step exposes a "completed" computed
// derived from the form state, and the route guards in router/index.js
// read from these to redirect users back to the first incomplete step
// if they deep-link past their progress.

import { defineStore } from 'pinia'

const STORAGE_KEY = 'kn-checkout-v1'

const ACCOUNT_MODES = ['guest', 'signin', 'register']

function emptyAddress() {
  return {
    name: '',
    company: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'AT',
    phone: '',
  }
}

function defaultState() {
  return {
    accountMode: 'guest',
    email: '',
    acceptsMarketing: false,
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    billingSame: true,
    shippingAddress: emptyAddress(),
    billingAddress: emptyAddress(),
  }
}

function loadInitial() {
  if (typeof sessionStorage === 'undefined') return defaultState()
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

function persist(state) {
  if (typeof sessionStorage === 'undefined') return
  try {
    const { password, passwordConfirm, ...safe } = state
    void password
    void passwordConfirm
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  } catch {
    /* quota or private mode — ignore */
  }
}

function addressComplete(addr) {
  if (!addr) return false
  return ['name', 'street', 'postalCode', 'city', 'country'].every(
    (k) => String(addr[k] || '').trim().length > 0,
  )
}

export const useCheckoutStore = defineStore('checkout', {
  state: () => loadInitial(),

  getters: {
    accountComplete(state) {
      if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) return false
      if (state.accountMode === 'signin') return state.password.length >= 8
      if (state.accountMode === 'register') {
        return (
          state.password.length >= 8 &&
          state.password === state.passwordConfirm
        )
      }
      return true
    },
    shippingComplete(state) {
      if (!addressComplete(state.shippingAddress)) return false
      if (state.billingSame) return true
      return addressComplete(state.billingAddress)
    },
  },

  actions: {
    setAccountMode(mode) {
      if (!ACCOUNT_MODES.includes(mode)) return
      this.accountMode = mode
      this.persist()
    },
    update(patch) {
      Object.assign(this, patch)
      this.persist()
    },
    updateShipping(patch) {
      this.shippingAddress = { ...this.shippingAddress, ...patch }
      this.persist()
    },
    updateBilling(patch) {
      this.billingAddress = { ...this.billingAddress, ...patch }
      this.persist()
    },
    persist() {
      persist(this.$state)
    },
    reset() {
      Object.assign(this, defaultState())
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})
