# Dev-showcase image for the Portainer stack. No container-side build —
# the `dist/` directory is built locally (`npm run build`) and committed,
# then copied straight into nginx. This sidesteps the Node/native-binding
# fights that kept breaking `npm ci` on the Portainer host.
#
# Not how the site should ship to real production, but fine for a showcase
# stack where the dev machine is the source of truth for the built output.

FROM nginx:1.27.3-alpine

# Our site config owns the default server block.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Prebuilt Vite output.
COPY dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O- http://127.0.0.1/health || exit 1
