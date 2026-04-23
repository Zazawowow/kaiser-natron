# Orders API

Orders are created as `pending` by the checkout intent endpoint (see
`checkout.md`) and transition to `paid` / `failed` / `refunded` based on
Stripe webhooks. The frontend reads orders to render the confirmation
page, the account order history, and the order detail view.

The frontend consumes this surface through a future `src/api/orders.js`
module following the same pattern as `cart.js`.

## Base URL and session

- All endpoints are served under `/api`.
- Authorisation: the session cookie identifies the buyer. Guest orders
  are scoped to the session cookie that created them; once a guest logs
  in or registers, the backend MAY attach prior guest orders to the
  customer record.
- Requests and responses are `application/json; charset=utf-8`.

## Endpoints

| Method | Path                  | Body | Returns        |
| ------ | --------------------- | ---- | -------------- |
| GET    | `/api/orders`         | —    | `OrderList`    |
| GET    | `/api/orders/:id`     | —    | `Order`        |

`GET /api/orders` returns only orders visible to the current session —
the logged-in customer's orders, or guest orders created during this
session.

## Types

```ts
type Money    = number    // EUR, 2dp
type OrderId  = string
type ISO8601  = string

type OrderStatus        = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
type PaymentStatus      = 'pending' | 'paid' | 'failed' | 'refunded'
type FulfilmentStatus   = 'unfulfilled' | 'processing' | 'shipped' | 'delivered'

interface OrderLine {
  productId: string
  title:     string       // snapshot at order time — safe to display as-is
  size:      string
  quantity:  number
  unitPrice: Money
  lineTotal: Money
}

interface Order {
  id:               OrderId
  number:           string          // human-readable, e.g. "KN-2026-0001"
  status:           OrderStatus
  paymentStatus:    PaymentStatus
  fulfilmentStatus: FulfilmentStatus
  createdAt:        ISO8601
  paidAt?:          ISO8601
  items:            OrderLine[]
  subtotal:         Money
  shipping:         Money
  tax:              Money
  total:            Money
  currency:         string          // ISO 4217
  shippingAddress:  Address         // shape defined in checkout.md
  billingAddress:   Address
  email:            string
  trackingUrl?:     string          // set once the fulfilmentStatus is "shipped"
}

interface OrderList {
  items: Order[]       // newest first
  count: number
}
```

Line snapshots (`title`, `size`, `unitPrice`) are frozen at order
creation. If the catalogue changes later, existing orders keep
rendering the values the customer actually bought.

## Example exchange

Request:

```http
GET /api/orders/ord_01HSX9Z0K3R7 HTTP/1.1
```

Response:

```json
{
  "id":               "ord_01HSX9Z0K3R7",
  "number":           "KN-2026-0142",
  "status":           "paid",
  "paymentStatus":    "paid",
  "fulfilmentStatus": "processing",
  "createdAt":        "2026-04-23T09:14:02.000Z",
  "paidAt":           "2026-04-23T09:14:47.000Z",
  "items": [
    {
      "productId": "kaiser-natron-pulver-250-g-grosspackung",
      "title":     "Kaiser-Natron® Pulver",
      "size":      "250 g Großpackung",
      "quantity":  2,
      "unitPrice": 4.49,
      "lineTotal": 8.98
    }
  ],
  "subtotal":  8.98,
  "shipping":  4.90,
  "tax":       1.70,
  "total":     15.58,
  "currency":  "EUR",
  "shippingAddress": { "...": "see checkout.md Address" },
  "billingAddress":  { "...": "see checkout.md Address" },
  "email":     "ada@example.com"
}
```

## Errors

```json
{ "error": { "code": "order.notFound", "message": "Unknown orderId." } }
```

Known codes:

| Code               | When                                                               |
| ------------------ | ------------------------------------------------------------------ |
| `order.notFound`   | The order ID does not exist or is not visible to the session.      |
| `order.forbidden`  | The order exists but belongs to a different customer.              |

HTTP status codes:

- `200 OK` on success.
- `401 Unauthorized` if authentication is required and absent.
- `403 Forbidden` for `order.forbidden`.
- `404 Not Found` for `order.notFound`. The backend MAY return `404` for
  `order.forbidden` as well to avoid leaking order IDs.

## Polling after checkout

After Stripe redirects back to `/checkout/return?order=<orderId>`, the
frontend polls `GET /api/orders/:id` with modest backoff (e.g. 1 s / 2 s
/ 4 s, stopping at 15 s) until `paymentStatus !== 'pending'`. If the
webhook is slow, the page shows a "payment processing" state and keeps
polling; it does not mark the order failed on its own.
