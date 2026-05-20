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
export {
  createCheckoutIntent,
  createExpressIntent,
  confirmCheckout,
} from './checkout.js'
export {
  getCurrentUser,
  signIn,
  register,
  signOut,
  requestPasswordReset,
} from './auth.js'
export {
  kaiserhacksPage,
  fetchKaiserhacks,
  localizeKaiserhacks,
} from './kaiserhacks.js'
