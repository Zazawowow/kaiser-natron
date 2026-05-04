#!/usr/bin/env node
// One-shot helper: pulls the dWide*/dPort* SVG path constants out of
// SplashIntro.vue and writes them to src/components/splashPaths.js so
// BrandHero (and any future surface) can render the same artwork
// without duplicating ~500KB of path data.
//
// Idempotent — safe to re-run if the source paths in SplashIntro.vue
// are ever updated (e.g. retracing the SVG).

const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'src', 'components', 'SplashIntro.vue')
const OUT = path.join(__dirname, '..', 'src', 'components', 'splashPaths.js')

const src = fs.readFileSync(SRC, 'utf8')
const scriptStart = src.indexOf('<script setup>')
const scriptEnd = src.indexOf('</script>')
const script = src.slice(scriptStart, scriptEnd)

const NAMES = [
  'dWideDark',
  'dWideLeft',
  'dWideRight',
  'dWideMiddle',
  'dWideWhite',
  'dPortDark',
  'dPortLeft',
  'dPortRight',
  'dPortTop',
  'dPortMound',
]

const out = []
out.push('// Splash artwork path data, extracted from SplashIntro.vue so the')
out.push('// splash overlay and the in-page BrandHero can render the same')
out.push("// illustration without duplicating ~500KB of SVG path strings.")
out.push('// Source of truth lives in trace-2.svg / trace.svg; regenerate via')
out.push('// `node scripts/extract-splash-paths.js` after retracing.')
out.push('')

for (const name of NAMES) {
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*`([\\s\\S]*?)`', 'm')
  const m = script.match(re)
  if (!m) {
    console.error('Could not find constant', name, 'in SplashIntro.vue')
    process.exit(1)
  }
  out.push('export const ' + name + ' = `' + m[1] + '`')
  out.push('')
}

fs.writeFileSync(OUT, out.join('\n'))
const bytes = fs.statSync(OUT).size
console.log('Wrote', OUT)
console.log('Size:', (bytes / 1024).toFixed(1), 'KB')
