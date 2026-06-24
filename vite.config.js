import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Static handoff docs live as flat files in public/ (dev-doc.html etc.).
// In production nginx rewrites the extensionless path to <name>.html
// (try_files $uri $uri.html …). This dev-only middleware mirrors that so
// the same clean URLs (/dev-doc, /simple-doc, /review-doc) work under
// `vite dev` instead of being swallowed by the SPA history fallback.
const DOC_SLUGS = ['dev-doc', 'simple-doc', 'review-doc']
function cleanDocUrls() {
  return {
    name: 'clean-doc-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url || '').split('?')[0].replace(/\/+$/, '')
        const slug = path.replace(/^\/+/, '')
        if (DOC_SLUGS.includes(slug)) req.url = `/${slug}.html`
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [cleanDocUrls(), vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
