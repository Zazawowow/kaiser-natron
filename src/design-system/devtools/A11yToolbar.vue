<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const open = ref(false)
const tab = ref('vision')

const filters = [
  { id: 'none', label: 'Normal vision' },
  { id: 'protanopia', label: 'Protanopia (red-blind)' },
  { id: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
  { id: 'tritanopia', label: 'Tritanopia (blue-blind)' },
  { id: 'achromatopsia', label: 'Achromatopsia (mono)' },
]
const activeFilter = ref('none')

watch(activeFilter, (val) => {
  const root = document.documentElement
  if (val === 'none') root.style.filter = ''
  else root.style.filter = `url(#a11y-${val})`
})

onBeforeUnmount(() => {
  document.documentElement.style.filter = ''
})

const fg = ref('#1c3a28')
const bg = ref('#fafafa')

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim()
  if (h.length !== 3 && h.length !== 6) return null
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  if (Number.isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function relLuminance([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

const contrast = computed(() => {
  const a = hexToRgb(fg.value)
  const b = hexToRgb(bg.value)
  if (!a || !b) return null
  const la = relLuminance(a)
  const lb = relLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
})

const contrastLabel = computed(() => {
  if (contrast.value == null) return '—'
  return contrast.value.toFixed(2) + ':1'
})

const wcag = computed(() => {
  const c = contrast.value
  if (c == null) return null
  return {
    aaNormal: c >= 4.5,
    aaLarge: c >= 3,
    aaaNormal: c >= 7,
    aaaLarge: c >= 4.5,
  }
})

const audit = ref({ status: 'idle', violations: [], error: null })

async function runAudit() {
  audit.value = { status: 'running', violations: [], error: null }
  try {
    const axe = (await import('axe-core')).default
    const results = await axe.run(document, {
      resultTypes: ['violations'],
    })
    audit.value = {
      status: 'done',
      violations: results.violations,
      error: null,
    }
    if (results.violations.length) {
      console.group('%c[a11y] axe violations', 'color:#b84a3b;font-weight:bold')
      results.violations.forEach((v) => {
        console.log(`${v.impact?.toUpperCase() ?? 'INFO'} — ${v.id}: ${v.help}`)
        console.log('  →', v.helpUrl)
        v.nodes.forEach((n) => console.log('  ', n.target.join(' '), n.failureSummary))
      })
      console.groupEnd()
    } else {
      console.log('%c[a11y] no violations found', 'color:#1c3a28;font-weight:bold')
    }
  } catch (e) {
    audit.value = { status: 'error', violations: [], error: e.message }
  }
}
</script>

<template>
  <svg aria-hidden="true" width="0" height="0" style="position:absolute">
    <defs>
      <filter id="a11y-protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
      </filter>
      <filter id="a11y-deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
      </filter>
      <filter id="a11y-tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
      </filter>
      <filter id="a11y-achromatopsia">
        <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  </svg>

  <div class="a11y-root" :class="{ 'is-open': open }">
    <button
      class="a11y-fab"
      type="button"
      :aria-expanded="open"
      aria-label="Accessibility dev tools"
      @click="open = !open"
    >
      <span aria-hidden="true">a11y</span>
      <span v-if="activeFilter !== 'none'" class="a11y-dot" aria-hidden="true" />
    </button>

    <div v-if="open" class="a11y-panel" role="dialog" aria-label="Accessibility tools">
      <div class="a11y-tabs">
        <button
          v-for="t in [
            { id: 'vision', label: 'Vision' },
            { id: 'contrast', label: 'Contrast' },
            { id: 'audit', label: 'Audit' },
          ]"
          :key="t.id"
          type="button"
          class="a11y-tab"
          :class="{ 'is-active': tab === t.id }"
          @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="tab === 'vision'" class="a11y-body">
        <p class="a11y-hint">Simulate colour vision deficiencies across the whole page.</p>
        <label v-for="f in filters" :key="f.id" class="a11y-radio">
          <input
            type="radio"
            name="a11y-filter"
            :value="f.id"
            v-model="activeFilter"
          />
          <span>{{ f.label }}</span>
        </label>
      </div>

      <div v-if="tab === 'contrast'" class="a11y-body">
        <p class="a11y-hint">WCAG 2.1 contrast ratio.</p>
        <div class="a11y-row">
          <label>Foreground
            <input type="color" v-model="fg" />
            <input type="text" v-model="fg" maxlength="7" />
          </label>
        </div>
        <div class="a11y-row">
          <label>Background
            <input type="color" v-model="bg" />
            <input type="text" v-model="bg" maxlength="7" />
          </label>
        </div>
        <div class="a11y-swatch" :style="{ background: bg, color: fg }">Sample text</div>
        <div class="a11y-ratio">{{ contrastLabel }}</div>
        <div v-if="wcag" class="a11y-grades">
          <span :class="{ pass: wcag.aaNormal, fail: !wcag.aaNormal }">AA normal</span>
          <span :class="{ pass: wcag.aaLarge, fail: !wcag.aaLarge }">AA large</span>
          <span :class="{ pass: wcag.aaaNormal, fail: !wcag.aaaNormal }">AAA normal</span>
          <span :class="{ pass: wcag.aaaLarge, fail: !wcag.aaaLarge }">AAA large</span>
        </div>
      </div>

      <div v-if="tab === 'audit'" class="a11y-body">
        <p class="a11y-hint">Run axe-core against the current page. Details logged to console.</p>
        <button type="button" class="a11y-btn" @click="runAudit" :disabled="audit.status === 'running'">
          {{ audit.status === 'running' ? 'Running…' : 'Run audit' }}
        </button>
        <div v-if="audit.status === 'done'" class="a11y-audit-result">
          <strong>{{ audit.violations.length }}</strong>
          violation{{ audit.violations.length === 1 ? '' : 's' }}
          <ul v-if="audit.violations.length">
            <li v-for="v in audit.violations" :key="v.id">
              <span class="a11y-impact" :data-impact="v.impact">{{ v.impact }}</span>
              {{ v.id }} — {{ v.help }}
            </li>
          </ul>
        </div>
        <div v-else-if="audit.status === 'error'" class="a11y-error">{{ audit.error }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a11y-root {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  font-family: var(--font-sans, system-ui, sans-serif);
  font-size: 13px;
  color: #1c3a28;
}
.a11y-fab {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #1c3a28;
  color: #f0c75e;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(28, 58, 40, 0.25);
  position: relative;
  transition: transform 0.15s ease;
}
.a11y-fab:hover { transform: translateY(-1px); }
.a11y-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f0c75e;
  box-shadow: 0 0 0 2px #1c3a28;
}
.a11y-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 320px;
  max-height: 72vh;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8df;
  border-radius: 14px;
  box-shadow: 0 16px 44px rgba(28, 58, 40, 0.18);
  padding: 14px;
}
.a11y-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e2e8df;
  margin-bottom: 12px;
}
.a11y-tab {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7a71;
}
.a11y-tab.is-active {
  color: #1c3a28;
  border-bottom-color: #1c3a28;
}
.a11y-body { display: flex; flex-direction: column; gap: 10px; }
.a11y-hint { margin: 0; color: #6b7a71; font-size: 12px; }
.a11y-radio { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.a11y-row label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7a71;
}
.a11y-row input[type="color"] {
  width: 32px; height: 32px; border: 1px solid #e2e8df; border-radius: 6px; padding: 0; background: none; cursor: pointer;
}
.a11y-row input[type="text"] {
  flex: 1; font-family: ui-monospace, monospace; font-size: 12px;
  border: 1px solid #e2e8df; border-radius: 6px; padding: 6px 8px;
}
.a11y-swatch {
  padding: 14px; border-radius: 8px; text-align: center; font-weight: 500;
  border: 1px solid #e2e8df;
}
.a11y-ratio {
  text-align: center; font-family: ui-monospace, monospace; font-size: 18px; font-weight: 600;
}
.a11y-grades {
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
  font-size: 11px; font-family: ui-monospace, monospace;
}
.a11y-grades .pass { color: #1c3a28; }
.a11y-grades .pass::before { content: '✓ '; }
.a11y-grades .fail { color: #b84a3b; opacity: 0.6; }
.a11y-grades .fail::before { content: '✗ '; }
.a11y-btn {
  background: #1c3a28; color: #f0c75e; border: none;
  padding: 10px 16px; border-radius: 999px; cursor: pointer; font-weight: 600;
}
.a11y-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.a11y-audit-result ul {
  margin: 8px 0 0; padding-left: 16px; max-height: 240px; overflow-y: auto;
  font-size: 12px;
}
.a11y-audit-result li { margin-bottom: 6px; }
.a11y-impact {
  display: inline-block; padding: 1px 6px; border-radius: 4px;
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
  background: #e2e8df; margin-right: 4px;
}
.a11y-impact[data-impact="critical"] { background: #b84a3b; color: #fff; }
.a11y-impact[data-impact="serious"] { background: #d47e3a; color: #fff; }
.a11y-impact[data-impact="moderate"] { background: #f0c75e; color: #1c3a28; }
.a11y-error { color: #b84a3b; font-size: 12px; }
</style>
