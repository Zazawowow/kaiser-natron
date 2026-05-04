#!/usr/bin/env node
// Rewrite SplashIntro.vue to import the dWide*/dPort* path constants
// from splashPaths.js instead of declaring them inline.

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'components', 'SplashIntro.vue')
// File-order list, used to walk the source linearly. The import
// statement uses the same set so the order stays stable.
const NAMES_IN_FILE_ORDER = [
  'dWideDark',
  'dWideWhite',
  'dWideLeft',
  'dWideMiddle',
  'dWideRight',
  'dPortDark',
  'dPortLeft',
  'dPortRight',
  'dPortTop',
  'dPortMound',
]
const NAMES = NAMES_IN_FILE_ORDER

let src = fs.readFileSync(FILE, 'utf8')

// Remove each `const NAME = \`...\`` declaration (single long line per
// our writeup of the file). Tolerate trailing newline. The marker
// `/* ---- Path data ... ---- */` block comment becomes redundant once
// the constants leave; replace it with a short pointer to splashPaths.
const startMarker = '/* ---- Path data (extracted from trace-2.svg and trace.svg, then bucketed) ---- */'
const startIdx = src.indexOf(startMarker)
if (startIdx === -1) {
  console.error('Path-data marker not found — splash file may have been refactored.')
  process.exit(1)
}

// Strip from the marker to the end of the last constant declaration.
// Find the last constant's closing backtick + newline.
let cursor = startIdx
for (const name of NAMES) {
  const constStart = src.indexOf('const ' + name, cursor)
  if (constStart === -1) {
    console.error('Constant', name, 'not found — aborting.')
    process.exit(1)
  }
  cursor = constStart
}
// `cursor` is at the start of the last `const ...` line. Find the
// line's closing backtick, then the following newline.
const lastBacktickOpen = src.indexOf('`', cursor)
const lastBacktickClose = src.indexOf('`', lastBacktickOpen + 1)
const endOfLine = src.indexOf('\n', lastBacktickClose)
const removeEnd = endOfLine === -1 ? src.length : endOfLine + 1

const importStmt =
  "import {\n" +
  NAMES.map((n) => '  ' + n + ',').join('\n') +
  "\n} from './splashPaths.js'\n"

const replacement =
  '/* Path data lives in splashPaths.js — shared with BrandHero so the\n' +
  '   in-page brand hero can render the same illustration without\n' +
  '   duplicating ~500KB of SVG path strings. Regenerate via\n' +
  '   `node scripts/extract-splash-paths.cjs` after retracing. */\n'

src = src.slice(0, startIdx) + replacement + src.slice(removeEnd)

// Add the import at the top of the script-setup block, right after the
// existing `import { ref, ... } from 'vue'` line.
const vueImportLine = "import { ref, onMounted, onBeforeUnmount } from 'vue'"
const idx = src.indexOf(vueImportLine)
if (idx === -1) {
  console.error('Vue import line not found — aborting.')
  process.exit(1)
}
const insertAt = idx + vueImportLine.length
src = src.slice(0, insertAt) + '\n' + importStmt + src.slice(insertAt)

fs.writeFileSync(FILE, src)
const bytes = fs.statSync(FILE).size
console.log('Updated', FILE)
console.log('Size:', (bytes / 1024).toFixed(1), 'KB')
