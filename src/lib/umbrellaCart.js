import { ref } from 'vue'

// Set by the umbrella ?add= deep-link handler (App.vue) after it puts a
// product in the cart on page load. The landing page consumes it once
// on mount and reveals its cart drawer, so the visitor arrives seeing
// what the umbrella card promised. The drawer state itself is
// page-local by design — this flag is only the handoff.
export const cartRevealPending = ref(false)
