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

`src/api/` exposes a typed surface the backend dev fills in. Until then, fixtures in `src/api/` drive the UI so frontend work is unblocked.

Endpoint specs for backend integration live under `docs/api/`:

- [`docs/api/cart.md`](docs/api/cart.md) — cart endpoints, types, error codes, and how to swap the local implementation for HTTP.

## Supply chain

All dep versions are pinned exactly (no `^`/`~`). Use `npm ci` (not `npm install`) in CI and before builds. Run `npm audit` before adding any new dep.

## Deployment (Portainer dev-showcase stack)

This is the showcase path, not real production — the dev machine is the source of truth for the built output. The container has **no** build step: it just copies a prebuilt `dist/` into nginx.

Release flow:

```
npm run build          # produces /dist
git add dist && git commit -m "build: <what changed>"
git push
```

Then in Portainer → **Stacks** → **Pull and redeploy**. The site comes up on host port **5555** (`/health` returns `200 ok`).

Base image: `nginx:1.27.3-alpine` (pinned). When this graduates to real production, reintroduce the multi-stage Node build + the hardening (`read_only`, `security_opt`, resource caps) that lived in earlier revisions of this file.
