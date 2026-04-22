// Barrel for the API boundary. Swap these imports for real backend calls
// when the Python/MySQL side lands — callers keep the same import path.

export { products, searchProducts, formatPrice } from './products.js'
export {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart.js'
