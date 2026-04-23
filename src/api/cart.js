// Cart API — the boundary between the Vue frontend and the PHP / MySQL
// backend. Keep the shapes here stable: everything above this file
// (components, pages, store consumers) calls these functions and never
// talks to an endpoint directly.
//
// Today the bodies delegate to a client-side Pinia store so the UI is
// fully functional without a server. When the backend is ready, replace
// each body with a fetch() call against the documented endpoint — the
// signatures and return shapes stay the same.
//
// ─── Endpoints (backend to implement) ──────────────────────────────────
//   GET    /api/cart                     → Cart
//   POST   /api/cart/items               { productId, quantity } → Cart
//   PATCH  /api/cart/items/:productId    { quantity }            → Cart
//   DELETE /api/cart/items/:productId                            → Cart
//   DELETE /api/cart                                             → Cart
//
// All mutations return the full updated Cart — the client does not need
// to merge patches. Session identity is carried via an httpOnly cookie
// set by the backend on the first POST; the frontend sends
// `credentials: 'include'` on every request.
//
// Full contract (request/response examples, error codes, auth model)
// lives in docs/api/cart.md.

import { useCartStore } from '@/stores/cart.js'

function snapshot(store) {
  return {
    items: store.items,
    count: store.count,
    subtotal: store.subtotal,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Fetch the current cart.
 * Backend: `GET /api/cart`.
 * @returns {Promise<Cart>}
 */
export async function fetchCart() {
  const store = useCartStore()
  return snapshot(store)
}

/**
 * Add a product to the cart, or bump the quantity if it is already there.
 * Backend: `POST /api/cart/items` with `{ productId, quantity }`.
 * @param {string} productId
 * @param {number} [quantity=1]
 * @returns {Promise<Cart>}
 */
export async function addToCart(productId, quantity = 1) {
  if (typeof productId !== 'string' || !productId) {
    throw new Error('cart.productIdRequired')
  }
  const q = Number.isInteger(quantity) ? quantity : 1
  if (q < 1) throw new Error('cart.quantityInvalid')
  const store = useCartStore()
  store.add(productId, q)
  return snapshot(store)
}

/**
 * Set the absolute quantity of a line. Passing `0` removes it.
 * Backend: `PATCH /api/cart/items/:productId` with `{ quantity }`.
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 */
export async function updateCartItem(productId, quantity) {
  const store = useCartStore()
  store.update(productId, Number.isInteger(quantity) ? quantity : 0)
  return snapshot(store)
}

/**
 * Remove a line from the cart.
 * Backend: `DELETE /api/cart/items/:productId`.
 * @param {string} productId
 * @returns {Promise<Cart>}
 */
export async function removeFromCart(productId) {
  const store = useCartStore()
  store.remove(productId)
  return snapshot(store)
}

/**
 * Empty the entire cart.
 * Backend: `DELETE /api/cart`.
 * @returns {Promise<Cart>}
 */
export async function clearCart() {
  const store = useCartStore()
  store.clear()
  return snapshot(store)
}
