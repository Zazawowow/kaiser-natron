# syntax=docker/dockerfile:1.7
# Multi-stage build: Node builds the Vite SPA, Nginx serves the static output.
# Pinned tags only — no :latest, no floating minors.

# ── 1. Build ───────────────────────────────────────────────────────────────
FROM node:24.15.0-alpine3.23 AS build
WORKDIR /app

# libc6-compat: the prebuilt @tailwindcss/oxide and lightningcss .node bindings
# are linked against a glibc-compatible runtime and fail to load on bare Alpine
# musl otherwise — which kills `npm ci` during its postinstall probe.
RUN apk add --no-cache libc6-compat

# Copy lockfile first so `npm ci` layer caches when only source changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build


# ── 2. Serve ───────────────────────────────────────────────────────────────
FROM nginx:1.27.3-alpine AS serve

# Strip the default site; our config owns /etc/nginx/conf.d/default.conf.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop the built SPA into the document root.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Alpine ships busybox wget — avoids pulling curl just for healthchecks.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O- http://127.0.0.1/health || exit 1
