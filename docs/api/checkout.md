# Checkout & Payments

Checkout is a thin orchestration layer on top of the cart. The frontend
hands off to Stripe for card capture, the backend creates and confirms
the order, and a webhook is the authoritative "paid" signal.

The seam on the frontend side lives in `src/api/checkout.js` (to be
added alongside `cart.js` and `products.js`). Until the backend is
online, that module can stub the calls locally.

## Flow at a glance

```
 Browser (Vue)                Backend (PHP)                Stripe
 ─────────────                ─────────────                ──────
  1. POST /api/checkout/intent  ─────────────►  create PaymentIntent
                                ◄───────────── clientSecret
  2. stripe.confirmCardPayment(clientSecret)  ───────────►  charge
                                                ◄──────── status
  3. Stripe webhook  ─────────►  payment_intent.succeeded
                                 → mark order paid, decrement stock
  4. GET /api/orders/:id   ────────────►
                                ◄──────── Order (status: "paid")
```

The browser never sees raw card data — it posts directly to Stripe
using the `clientSecret`. The backend relies on the webhook, not the
browser, to decide whether an order is paid.

## Endpoints

| Method | Path                       | Body                  | Returns                |
| ------ | -------------------------- | --------------------- | ---------------------- |
| POST   | `/api/checkout/intent`     | `CheckoutRequest`     | `CheckoutIntent`       |
| POST   | `/api/checkout/confirm`    | `{ orderId }`         | `Order`                |
| POST   | `/api/webhooks/stripe`     | Stripe event (signed) | `200 OK` (server-only) |

- `/api/checkout/intent` takes the cart plus customer + shipping info,
  creates a pending `Order` row, creates a Stripe PaymentIntent, and
  returns the `clientSecret` for the browser to confirm.
- `/api/checkout/confirm` is optional: it lets the frontend poll once
  after Stripe's client-side confirmation to get the final `Order`
  shape, without waiting for the webhook.
- `/api/webhooks/stripe` is called by Stripe, not the browser. It
  verifies the signature and is the only source of truth for
  `status: "paid"`.

## Types

```ts
interface Address {
  name:       string
  company?:   string
  street:     string
  postalCode: string
  city:       string
  country:    string    // ISO 3166-1 alpha-2
  phone?:     string
}

interface CheckoutRequest {
  email:            string
  shippingAddress:  Address
  billingAddress?:  Address   // defaults to shippingAddress
  acceptsMarketing: boolean
}

interface CheckoutIntent {
  orderId:       string      // the Order row, status: "pending"
  clientSecret:  string      // passed to stripe.confirmCardPayment
  publishableKey: string     // Stripe publishable key (pk_live_… / pk_test_…)
  amount:        number      // EUR, informational — Stripe is authoritative
  currency:      "eur"
}

interface Order {
  id:         string
  status:     "pending" | "paid" | "failed" | "refunded" | "cancelled"
  items:      CartLine[]     // snapshot at checkout, not live cart
  subtotal:   number
  shipping:   number
  tax:        number
  total:      number
  currency:   "eur"
  customer:   { email: string; customerId?: string }
  shippingAddress: Address
  billingAddress:  Address
  createdAt:  string         // ISO-8601 UTC
  paidAt?:    string
}
```

## Stripe integration notes

- Use the **Payment Element** (not the deprecated Card Element). It
  supports SEPA + Apple/Google Pay with no extra frontend work.
- Publishable key is returned per-request so staging and production
  can use separate Stripe accounts without a frontend rebuild.
- The webhook endpoint must verify `Stripe-Signature` against the
  endpoint secret. Reject unsigned or stale events.
- Idempotency: the backend must treat the webhook as idempotent — the
  same `payment_intent.succeeded` can arrive more than once.

## Errors

```json
{ "error": { "code": "checkout.cartEmpty", "message": "Cart is empty." } }
```

| Code                       | When                                               |
| -------------------------- | -------------------------------------------------- |
| `checkout.cartEmpty`       | No items in the session cart at intent creation.   |
| `checkout.addressInvalid`  | Shipping or billing address fails validation.      |
| `checkout.stockChanged`    | A line is out of stock since the cart was built.   |
| `checkout.priceChanged`    | Catalog price drifted from the cart snapshot.      |
| `payment.declined`         | Stripe reported a final decline.                   |
| `payment.authRequired`     | 3-D Secure / SCA step pending — retry confirm.     |

HTTP status:

- `200 OK` on success.
- `400 Bad Request` for validation errors.
- `409 Conflict` for `stockChanged` / `priceChanged` — the client
  refreshes the cart and retries.
- `402 Payment Required` for `payment.declined`.
