# syntax=docker/dockerfile:1.7
# Multi-stage build: Node builds the Vite SPA, Nginx serves the static output.
# Pinned tags only — no :latest, no floating minors.

# ── 1. Build ───────────────────────────────────────────────────────────────
# Debian slim (glibc) for the build stage. Alpine/musl works in theory with
# libc6-compat, but Tailwind v4 oxide + lightningcss + rolldown prebuilt
# .node bindings keep finding new ways to fail there. Debian slim is the
# known-good path and the build stage is thrown away after COPY --from.
FROM node:24.15.0-bookworm-slim AS build
WORKDIR /app

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
