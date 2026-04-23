# Cart API

The frontend talks to the cart through a small, stable surface exported
from `src/api/cart.js`. That file is the only seam that changes when the
PHP / MySQL backend comes online — everything above it (the Pinia
store, the `CartDrawer` component, pages that add to cart) keeps
importing the same functions with the same signatures.

Today the function bodies delegate to an in-browser Pinia store with
`localStorage` persistence so the UI is fully functional without a
server. Replacing the bodies with `fetch()` calls against the endpoints
below is a drop-in swap.

## Base URL and session

- All endpoints are served under `/api`.
- Requests carry the session via an httpOnly cookie. The backend sets it
  on first `POST`, and the frontend sends `credentials: 'include'` on
  every call.
- Requests and responses are `application/json; charset=utf-8`.

## Endpoints

| Method | Path                              | Body                       | Returns |
| ------ | --------------------------------- | -------------------------- | ------- |
| GET    | `/api/cart`                       | —                          | `Cart`  |
| POST   | `/api/cart/items`                 | `{ productId, quantity }`  | `Cart`  |
| PATCH  | `/api/cart/items/:productId`      | `{ quantity }`             | `Cart`  |
| DELETE | `/api/cart/items/:productId`      | —                          | `Cart`  |
| DELETE | `/api/cart`                       | —                          | `Cart`  |

Every mutation returns the full, updated `Cart`. The client never has
to merge partial responses.

## Types

```ts
type Money     = number   // EUR, two decimals, always > 0
type ProductId = string   // /^[a-z0-9-]+$/, max 80 chars

interface ProductSummary {
  id:    ProductId
  title: string
  brand: string
  size:  string
  image: string   // absolute path, served from the frontend public/ dir
  href:  string   // PDP URL
}

interface CartLine {
  productId: ProductId
  quantity:  number        // integer >= 1
  unitPrice: Money
  lineTotal: Money         // unitPrice * quantity, rounded to 2dp
  product:   ProductSummary
}

interface Cart {
  items:     CartLine[]
  count:     number        // integer, sum of all quantities
  subtotal:  Money         // sum of all lineTotal values
  updatedAt: string        // ISO-8601 UTC
}
```

Product IDs match the `id` field of the catalogue exported from
`src/api/products.js`. The backend is the source of truth for
`unitPrice` and `lineTotal`; the client only displays what it receives.

## Example exchange

Request:

```http
POST /api/cart/items HTTP/1.1
Content-Type: application/json

{ "productId": "kaiser-natron-pulver-250-g-grosspackung", "quantity": 2 }
```

Response:

```json
{
  "items": [
    {
      "productId": "kaiser-natron-pulver-250-g-grosspackung",
      "quantity": 2,
      "unitPrice": 4.49,
      "lineTotal": 8.98,
      "product": {
        "id":    "kaiser-natron-pulver-250-g-grosspackung",
        "title": "Kaiser-Natron® Pulver",
        "brand": "Kaiser-Natron",
        "size":  "250 g Großpackung",
        "image": "/products/kaiser-natron-pulver-250-g-gro%C3%9Fpackung.jpg",
        "href":  "/shop/kaiser-natron-pulver-250-g-grosspackung"
      }
    }
  ],
  "count":     2,
  "subtotal":  8.98,
  "updatedAt": "2026-04-22T14:05:21.004Z"
}
```

## Errors

```json
{ "error": { "code": "product.notFound", "message": "Unknown productId." } }
```

Known codes:

| Code                      | When                                                        |
| ------------------------- | ----------------------------------------------------------- |
| `product.notFound`        | `productId` is not in the catalogue.                        |
| `cart.quantityInvalid`    | `quantity` is missing, non-integer, or `< 1` on POST/PATCH. |
| `cart.itemLimit`          | The cart exceeds its per-line or per-cart quantity cap.     |

HTTP status codes:

- `200 OK` on success (including `DELETE`, which returns the updated cart).
- `400 Bad Request` for validation errors (`cart.quantityInvalid`).
- `404 Not Found` for `product.notFound` and for `PATCH`/`DELETE` on a
  `productId` that is not in the cart.
- `409 Conflict` for `cart.itemLimit`.
- `5xx` for server failures — the frontend surfaces these as a generic
  retry message.

## Swapping the local implementation for HTTP

Replace each body in `src/api/cart.js` with a fetch. Example for
`addToCart`:

```js
export async function addToCart(productId, quantity = 1) {
  const res = await fetch('/api/cart/items', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) throw await res.json().catch(() => ({ error: { code: 'network' } }))
  return res.json()
}
```

The Pinia store in `src/stores/cart.js` is the frontend-side cache;
once the API is remote, hydrate it from `fetchCart()` on app start and
after each mutation. The `CartDrawer` component is state-agnostic and
keeps working either way.
