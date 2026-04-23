// Cart state — Pinia store. Persists to localStorage so the basket
// survives page reloads until the PHP / MySQL backend takes over.
//
// Nothing outside this file should import the store directly — the rest
// of the app goes through `src/api/cart.js`, which is the swap-point
// when real endpoints land.

import { defineStore } from 'pinia'
import { products as catalog } from '@/api/products.js'

const STORAGE_KEY = 'kn-cart-v1'

function loadInitial() {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === 'string' &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0,
    )
  } catch {
    return []
  }
}

function persist(lines) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* quota or private mode — dropping the write is fine */
  }
}

// Line rows in the store carry just { productId, quantity }. The UI wants
// the product snapshot alongside — resolve it here against the catalogue
// so getters return a ready-to-render shape.
function enrich(line) {
  const product = catalog.find((p) => p.id === line.productId)
  if (!product) return null
  return {
    productId: line.productId,
    quantity: line.quantity,
    unitPrice: product.price,
    lineTotal: +(product.price * line.quantity).toFixed(2),
    product: {
      id: product.id,
      title: product.title,
      brand: product.brand,
      size: product.size,
      image: product.image,
      href: product.href,
    },
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: loadInitial(),
  }),
  getters: {
    items: (state) => state.lines.map(enrich).filter(Boolean),
    count: (state) => state.lines.reduce((n, l) => n + l.quantity, 0),
    subtotal() {
      return +this.items.reduce((sum, i) => sum + i.lineTotal, 0).toFixed(2)
    },
    isEmpty: (state) => state.lines.length === 0,
  },
  actions: {
    add(productId, quantity = 1) {
      const existing = this.lines.find((l) => l.productId === productId)
      if (existing) existing.quantity += quantity
      else this.lines.push({ productId, quantity })
      persist(this.lines)
    },
    update(productId, quantity) {
      if (!Number.isInteger(quantity)) return
      if (quantity <= 0) {
        this.lines = this.lines.filter((l) => l.productId !== productId)
      } else {
        const existing = this.lines.find((l) => l.productId === productId)
        if (existing) existing.quantity = quantity
      }
      persist(this.lines)
    },
    remove(productId) {
      this.lines = this.lines.filter((l) => l.productId !== productId)
      persist(this.lines)
    },
    clear() {
      this.lines = []
      persist(this.lines)
    },
  },
})
