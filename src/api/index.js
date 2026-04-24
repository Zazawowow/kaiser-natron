// Barrel for the API boundary. Swap these imports for real backend calls
// when the PHP / MySQL side lands — callers keep the same import path.

export {
  products,
  searchProducts,
  formatPrice,
  USE_CASES,
  useCaseFor,
  productsByUseCase,
} from './products.js'
export {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart.js'
