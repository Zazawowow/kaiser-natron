// Bundle catalogue. Mirrors `products.js` shape so the home grid,
// the dedicated /bundles/<slug> pages, and any future cart wire-up
// all read from a single source of truth.
//
// `anchorProductId` is the SKU we drop into the cart when the user
// hits "Add to cart" on a bundle — until the backend exposes a real
// bundle SKU endpoint, the anchor product gives the user visible
// feedback (cart count + drawer pop) without diverging from the
// fixture-driven cart shape.

export const bundles = [
  {
    id: 'haushalt',
    name: 'Haushalts-Bundle',
    usage: '2–3× pro Quartal empfohlen',
    items: [
      '1× Kaiser-Natron Pulver 250 g',
      '1× Allzweck-Spray 500 ml',
      '1× Spülmittel 500 ml',
    ],
    price: 24.9,
    memberPrice: 21.17,
    image: '/bundles/background/haushalts-bundle.webp',
    imageAlt: 'Haushalts-Bundle mit Kaiser-Natron',
    badge: 'Bestseller',
    badgeVariant: 'accent',
    description:
      'Die drei Klassiker für die wöchentliche Haushaltsroutine — Pulver, Allzweck-Spray und Spülmittel. Spart gegenüber dem Einzelkauf und sorgt dafür, dass die Standards immer im Schrank sind.',
    anchorProductId: 'kaiser-natron-pulver-250-g-grosspackung',
    href: '/bundles/haushalt',
  },
  {
    id: 'waesche',
    name: 'Wäsche & Pflege',
    usage: '1–2× pro Quartal',
    items: [
      '1× Holste Wasch-Soda 500 g',
      '1× Gazelle Wäschestärke 1 l',
      '1× Linda Fleckenweg 200 ml',
    ],
    price: 22.9,
    memberPrice: 19.47,
    image: '/bundles/background/waesche-pflege-bundle.webp',
    imageAlt: 'Wäsche & Pflege Bundle',
    badge: '',
    badgeVariant: 'accent',
    description:
      'Wäschepflege auf traditioneller Basis — Wasch-Soda für die Vorwäsche, Wäschestärke für Form, Fleckenweg für die hartnäckigen Fälle. Drei Helfer, eine Routine.',
    anchorProductId: 'holste-wasch-soda-500-g-beutel',
    href: '/bundles/waesche',
  },
  {
    id: 'wohlfuehl',
    name: 'Wohlfühl-Bundle',
    usage: '1× pro Quartal',
    items: [
      '1× Kaiser-Natron Tabletten 100 g',
      '1× Kaiser-Natron Bad 500 g',
      '1× Kaiser-Natron Fußbad 500 g',
    ],
    price: 29.9,
    memberPrice: 25.42,
    image: '/bundles/background/wohlfuehl-bundle.webp',
    imageAlt: 'Wohlfühl-Bundle mit Kaiser-Natron Bad',
    badge: '',
    badgeVariant: 'accent',
    description:
      'Drei Anwendungen für den Körper — Tabletten zur Verdauung, Voll- und Fußbad zur Entspannung. Die ruhigste Routine im Sortiment.',
    anchorProductId: 'kaiser-natron-bad-500-g',
    href: '/bundles/wohlfuehl',
  },
]

export function findBundle(id) {
  return bundles.find((b) => b.id === id) || null
}
