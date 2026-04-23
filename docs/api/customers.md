# Customers

Customer-facing auth and profile endpoints. The shop supports guest
checkout — a customer account is optional but unlocks order history,
saved addresses, and faster checkout.

The seam on the frontend side is `src/api/customers.js` (to be added).

## Session model

- Same httpOnly session cookie as the cart API. The cookie identifies
  the session whether the caller is a guest or a logged-in customer.
- Logging in **upgrades** the current session: the cart and any
  just-placed orders attached to it stay attached to the now-logged-in
  customer. No merge dance required on the frontend.
- Logging out rotates the session and clears the cart.

## Endpoints

| Method | Path                               | Body                     | Returns    |
| ------ | ---------------------------------- | ------------------------ | ---------- |
| POST   | `/api/customers/register`          | `RegisterRequest`        | `Customer` |
| POST   | `/api/customers/login`             | `{ email, password }`    | `Customer` |
| POST   | `/api/customers/logout`            | —                        | `200 OK`   |
| GET    | `/api/customers/me`                | —                        | `Customer` \| `null` |
| PATCH  | `/api/customers/me`                | `Partial<Customer>`      | `Customer` |
| GET    | `/api/customers/me/addresses`      | —                        | `Address[]` |
| POST   | `/api/customers/me/addresses`      | `Address`                | `Address[]` |
| PATCH  | `/api/customers/me/addresses/:id`  | `Partial<Address>`       | `Address[]` |
| DELETE | `/api/customers/me/addresses/:id`  | —                        | `Address[]` |
| POST   | `/api/customers/password/reset`    | `{ email }`              | `200 OK`   |
| POST   | `/api/customers/password/confirm`  | `{ token, password }`    | `200 OK`   |

`GET /api/customers/me` returns `null` (HTTP `200`) for guest sessions
so the frontend can branch on presence without a 401 round-trip.

## Types

```ts
interface RegisterRequest {
  email:            string
  password:         string
  name:             string
  acceptsMarketing: boolean
}

interface Customer {
  id:               string
  email:            string
  name:             string
  defaultAddressId?: string
  acceptsMarketing: boolean
  createdAt:        string
}
```

`Address` is defined in `checkout.md`. Addresses carry a server-issued
`id` when persisted against a customer.

## Validation & security

- Passwords: minimum 10 characters. Backend hashes with argon2id.
- Login and `password/reset` endpoints are rate-limited (5 req / min /
  IP is a reasonable starting point — tighten as needed).
- Generic error message for bad credentials — do not distinguish
  "unknown email" from "wrong password".
- Password reset tokens are single-use, expire in 30 minutes, and are
  never logged.

## Errors

| Code                         | When                                             |
| ---------------------------- | ------------------------------------------------ |
| `auth.invalidCredentials`    | Login failed (generic — do not leak which part). |
| `auth.emailTaken`            | Registration email already has an account.       |
| `auth.passwordWeak`          | Password fails the complexity rule.              |
| `auth.rateLimited`           | Too many attempts — back off.                    |
| `auth.tokenInvalid`          | Reset token missing, expired, or used.           |

HTTP: `400` for validation, `401` for `invalidCredentials`, `409` for
`emailTaken`, `429` for `rateLimited`.
