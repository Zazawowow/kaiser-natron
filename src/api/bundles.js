// Bundle catalogue. Mirrors `products.js` shape so the home grid,
// the dedicated /bundles/<slug> pages, and any future cart wire-up
// all read from a single source of truth.
//
// Localized copy (name, usage, description, items, image alt, badge
// label) lives in src/i18n/messages.js under `bundle.<id>.<field>`
// keys — the consumers (HomePage / BundlePage / Bundles) compose
// the localized record at render time so the locale switcher updates
// every label reactively.
//
// `anchorProductId` is the SKU we drop into the cart when the user
// hits "Add to cart" — until the backend exposes a real bundle SKU
// endpoint, the anchor product gives the user visible feedback (cart
// count + drawer pop) without diverging from the fixture-driven
// cart shape.

export const bundles = [
  {
    id: 'haushalt',
    nameKey: 'bundle.haushalt.name',
    usageKey: 'bundle.haushalt.usage',
    descriptionKey: 'bundle.haushalt.description',
    imageAltKey: 'bundle.haushalt.imageAlt',
    itemKeys: [
      'bundle.haushalt.items.0',
      'bundle.haushalt.items.1',
      'bundle.haushalt.items.2',
    ],
    badgeKey: 'bundle.haushalt.badge',
    badgeVariant: 'accent',
    price: 24.9,
    memberPrice: 21.17,
    image: '/bundles/background/haushalt-bundle.webp',
    anchorProductId: 'kaiser-natron-pulver-250-g-grosspackung',
    href: '/bundles/haushalt',
  },
  {
    id: 'waesche',
    nameKey: 'bundle.waesche.name',
    usageKey: 'bundle.waesche.usage',
    descriptionKey: 'bundle.waesche.description',
    imageAltKey: 'bundle.waesche.imageAlt',
    itemKeys: [
      'bundle.waesche.items.0',
      'bundle.waesche.items.1',
      'bundle.waesche.items.2',
    ],
    badgeKey: '',
    badgeVariant: 'accent',
    price: 22.9,
    memberPrice: 19.47,
    image: '/bundles/background/waesche-pflege-bundle.webp',
    anchorProductId: 'holste-wasch-soda-500-g-beutel',
    href: '/bundles/waesche',
  },
  {
    id: 'wohlfuehl',
    nameKey: 'bundle.wohlfuehl.name',
    usageKey: 'bundle.wohlfuehl.usage',
    descriptionKey: 'bundle.wohlfuehl.description',
    imageAltKey: 'bundle.wohlfuehl.imageAlt',
    itemKeys: [
      'bundle.wohlfuehl.items.0',
      'bundle.wohlfuehl.items.1',
      'bundle.wohlfuehl.items.2',
    ],
    badgeKey: '',
    badgeVariant: 'accent',
    price: 29.9,
    memberPrice: 25.42,
    image: '/bundles/background/wohlfuehl-bundle.webp',
    anchorProductId: 'kaiser-natron-bad-500-g',
    href: '/bundles/wohlfuehl',
  },
]

export function findBundle(id) {
  return bundles.find((b) => b.id === id) || null
}
