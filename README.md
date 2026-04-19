# Kaiser Natron

Ecommerce frontend. Vue 3 + Vite + Tailwind v4. Backend (Python/MySQL) is plugged in at the `src/api/` boundary.

## Setup

```
npm ci
npm run dev
```

## Design system

Everything visual lives in `src/design-system/`:

- `tokens/` — color, typography, spacing, radius (CSS custom properties consumed by Tailwind v4's `@theme`)
- `primitives/` — atomic components (Button, Input, Badge, Stack)
- `patterns/` — composed components (ProductCard, etc.)

Browse the full system at `/design` when running `npm run dev`. This is the single source of truth — new UI composes these, never one-off styling.

## API boundary

`src/api/` exposes a typed surface the backend dev fills in. Until then, fixtures in `src/api/fixtures/` drive the UI so frontend work is unblocked.

## Supply chain

All dep versions are pinned exactly (no `^`/`~`). Use `npm ci` (not `npm install`) in CI and before builds. Run `npm audit` before adding any new dep.
