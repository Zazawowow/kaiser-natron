// Checkout & payments boundary. Mirrors `cart.js` / `products.js`:
// the rest of the app calls these functions and never talks to the
// backend or Stripe directly. Today the bodies are stubs that
// resolve with synthetic data so the UI is fully exercisable
// without a server. When the backend lands, replace each body with
// a real fetch() call against the documented endpoint — the
// signatures and return shapes stay the same.
//
// The full contract (request/response examples, error codes, Stripe
// flow, webhook handling) lives in `docs/api/checkout.md`. The
// summary below is the developer-facing TL;DR.
//
// ─── Flow ──────────────────────────────────────────────────────────
//   1. UI:  createCheckoutIntent({ email, shippingAddress, ... })
//      → backend creates a pending Order row + Stripe PaymentIntent,
//        returns { orderId, clientSecret, publishableKey, amount }.
//   2. UI:  loads `@stripe/stripe-js`, mounts a Payment Element with
//           `clientSecret`, lets the user enter card / SEPA / Apple
//           Pay details. On submit, calls
//           `stripe.confirmPayment({ elements, confirmParams: {
//             return_url: `${origin}/checkout/processing?order=${id}`
//           } })`.
//           Stripe redirects on success.
//   3. UI:  the return_url page polls `confirmCheckout({ orderId })`
//           until the order's `status` flips to "paid" (the webhook
//           is the authoritative source; this just bridges the UI).
//
// ─── Express (Apple Pay / Google Pay one-click) ─────────────────────
//   1. UI:  user taps an Apple Pay / Google Pay button on the cart
//           or checkout. Calls `createExpressIntent({ wallet })` —
//           backend creates a pending Order + PaymentIntent scoped
//           to wallet rails (no address required up front; the
//           wallet sheet collects email + shipping itself).
//   2. UI:  Stripe's Express Checkout Element handles the wallet
//           sheet end-to-end and reports a `confirm` event back;
//           the page calls `stripe.confirmPayment(...)` with the
//           returned clientSecret.
//   3. UI:  same return-url / `confirmCheckout` polling as the
//           full-form flow.
//
// ─── Endpoints (backend to implement) ────────────────────────────────
//   POST /api/checkout/intent          { CheckoutRequest } → CheckoutIntent
//   POST /api/checkout/express-intent  { wallet }          → CheckoutIntent
//   POST /api/checkout/confirm         { orderId }         → Order
//   POST /api/webhooks/stripe          (Stripe event)      → 200 OK
//
// ─── Types (mirroring docs/api/checkout.md) ──────────────────────────
//   Address          { name, company?, street, postalCode, city,
//                      country (ISO-2), phone? }
//   CheckoutRequest  { email, shippingAddress, billingAddress?,
//                      acceptsMarketing }
//   CheckoutIntent   { orderId, clientSecret, publishableKey,
//                      amount, currency: 'eur' }
//   Order            { id, status, items, subtotal, shipping, tax,
//                      total, currency, customer, shippingAddress,
//                      billingAddress, createdAt, paidAt? }

import { useCartStore } from '@/stores/cart.js'

// Test publishable key — overridden by the real backend response in
// production. Stripe expects a key prefixed `pk_test_` or `pk_live_`;
// this dummy value is non-functional and exists only so the stub's
// shape matches a real response for component testing.
const STUB_PUBLISHABLE_KEY = 'pk_test_stub_replace_with_real'

// Flat-rate shipping + simple VAT for the stub. The backend will
// compute these server-side and return them on the `Order`; the UI
// reads from the response, never recomputes.
const SHIPPING_FLAT_EUR = 4.9
const VAT_RATE = 0.19

/**
 * Round to 2 decimals without floating-point drift on common cases.
 * `+(n).toFixed(2)` rounds 1.005 → 1.00 in some browsers; multiply
 * + Math.round avoids that for currency math at our scale.
 */
function money(n) {
  return Math.round(n * 100) / 100
}

/**
 * Create a checkout intent: the backend will (eventually) create a
 * pending Order row, create a Stripe PaymentIntent, and return its
 * client_secret. The stub fakes both — it returns a synthetic
 * orderId + a recognisable fake clientSecret so the UI can render
 * the post-intent state for design review without a Stripe key.
 *
 * Backend contract: `POST /api/checkout/intent`.
 *
 * @param {object} request
 * @param {string} request.email
 * @param {Address} request.shippingAddress
 * @param {Address} [request.billingAddress]
 * @param {boolean} [request.acceptsMarketing]
 * @returns {Promise<CheckoutIntent>}
 */
export async function createCheckoutIntent(request) {
  const cart = useCartStore()
  if (!cart.items.length) {
    const err = new Error('Cart is empty.')
    err.code = 'checkout.cartEmpty'
    throw err
  }

  // Lightweight client-side validation so the UI fails fast for the
  // obvious cases. The backend re-validates everything — never trust
  // a client-side guard.
  validateAddress(request.shippingAddress, 'shipping')
  if (request.billingAddress) {
    validateAddress(request.billingAddress, 'billing')
  }

  const subtotal = money(cart.subtotal)
  const shipping = money(SHIPPING_FLAT_EUR)
  const tax = money((subtotal + shipping) * VAT_RATE)
  const total = money(subtotal + shipping + tax)

  // Synthesise a plausible orderId so multiple stub orders don't
  // collide during development. Format mirrors what backends commonly
  // emit (timestamp + random suffix).
  const orderId = `ord_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`

  return {
    orderId,
    clientSecret: `pi_stub_${orderId}_secret_stub`,
    publishableKey: STUB_PUBLISHABLE_KEY,
    amount: total,
    currency: 'eur',
    // Echo the totals so the UI can render the order summary without
    // recomputing. The real backend will return the same shape on
    // the eventual `confirm` response too.
    breakdown: { subtotal, shipping, tax, total },
  }
}

/**
 * Create an *express* checkout intent for one-click wallet flows
 * (Apple Pay / Google Pay). Same return shape as
 * `createCheckoutIntent` so the rest of the UI stays uniform — the
 * difference is on the backend: no address is required up front
 * because the wallet sheet collects email + shipping itself, and
 * the Stripe PaymentIntent is created with `automatic_payment_methods`
 * scoped to wallet rails. The `wallet` hint lets the backend tag
 * the order for analytics; Stripe still resolves the actual rail
 * client-side from what the device supports.
 *
 * Backend contract: `POST /api/checkout/express-intent`.
 *
 * @param {object} request
 * @param {'apple' | 'google'} request.wallet
 * @returns {Promise<CheckoutIntent>}
 */
export async function createExpressIntent({ wallet }) {
  const cart = useCartStore()
  if (!cart.items.length) {
    const err = new Error('Cart is empty.')
    err.code = 'checkout.cartEmpty'
    throw err
  }
  if (wallet !== 'apple' && wallet !== 'google') {
    const err = new Error('Unsupported wallet.')
    err.code = 'checkout.invalidRequest'
    throw err
  }

  const subtotal = money(cart.subtotal)
  const shipping = money(SHIPPING_FLAT_EUR)
  const tax = money((subtotal + shipping) * VAT_RATE)
  const total = money(subtotal + shipping + tax)

  const orderId = `ord_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`

  return {
    orderId,
    clientSecret: `pi_stub_express_${orderId}_secret_stub`,
    publishableKey: STUB_PUBLISHABLE_KEY,
    amount: total,
    currency: 'eur',
    wallet,
    breakdown: { subtotal, shipping, tax, total },
  }
}

/**
 * Confirm the order after Stripe's client-side `confirmPayment`
 * resolved with `succeeded`. The webhook is the source of truth for
 * `paid` status; this endpoint exists so the UI can show a
 * confirmation page without polling Stripe directly.
 *
 * Backend contract: `POST /api/checkout/confirm`.
 *
 * @param {{ orderId: string }} input
 * @returns {Promise<Order>}
 */
export async function confirmCheckout({ orderId }) {
  if (!orderId) {
    const err = new Error('Missing orderId.')
    err.code = 'checkout.invalidRequest'
    throw err
  }
  // Stub returns a `paid` order so the success screen has data to
  // render. Replace with `fetch('/api/checkout/confirm', …)`.
  return {
    id: orderId,
    status: 'paid',
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    currency: 'eur',
    customer: { email: '' },
    shippingAddress: null,
    billingAddress: null,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  }
}

function validateAddress(addr, label) {
  if (!addr) throw addressErr(label, 'missing')
  const required = ['name', 'street', 'postalCode', 'city', 'country']
  for (const key of required) {
    if (!addr[key] || !String(addr[key]).trim()) {
      throw addressErr(label, `${key} is required`)
    }
  }
  if (!/^[A-Z]{2}$/.test(addr.country)) {
    throw addressErr(label, 'country must be ISO-3166 alpha-2')
  }
}

function addressErr(label, detail) {
  const err = new Error(`${label} address invalid: ${detail}`)
  err.code = 'checkout.addressInvalid'
  return err
}
