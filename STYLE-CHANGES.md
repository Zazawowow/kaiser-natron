# Kaiser Natron — Restyle Change Log (Developer Handoff)

> **⚠️ ALWAYS KEEP THIS DOCUMENT UPDATED.** Any time a styling change is made,
> update this file in the same change. Record only the **latest final state**
> of each item (succinctly — not the iterations it took to get there): the
> file, what it is now, and the token/class. If a new value supersedes an old
> one, **edit the existing entry** instead of appending a duplicate.

A plain-language summary of every visual change made in this restyle pass,
with the **exact file**, **what changed**, and the **CSS / Tailwind classes**
involved. It's organised by theme so you can review one concern at a time.

The design system is **token-driven**: colours, fonts, and sizes live as CSS
custom properties in `src/design-system/tokens.css` (consumed by Tailwind v4
via `@theme`). Most colour changes happen there once and cascade everywhere.

---

## 1. New brand colours (design tokens)

**File:** `src/design-system/tokens.css`

Two new colours were introduced and two existing ones repurposed.

| Token | Value | Meaning |
|-------|-------|---------|
| `--color-accent-fill` | `#cc0230` | Crimson — the new fill for all solid CTA buttons, pills and chips |
| `--color-accent-fill-hover` | `oklch(accent-fill − 12% black)` | Darker crimson for hover |
| `--color-accent-fill-ink` | `#ffffff` | White — the text/icon colour that sits on crimson |
| `--color-highlight` | `#6eceb2` | Mint — hover/active state for nav tabs and footer links |
| `--color-accent` | `#e9c84b` (unchanged) | Old warm yellow — now only used as the token behind a few non-button accents |

```css
/* tokens.css — added */
--color-accent-fill: #cc0230;
--color-accent-fill-hover: color-mix(in oklch, var(--color-accent-fill), black 12%);
--color-accent-fill-ink: #ffffff;

--color-highlight: #6eceb2;
```

Because these are registered in `@theme`, Tailwind auto-generates the utility
classes `bg-accent-fill`, `text-accent-fill-ink`, `border-accent-fill`,
`hover:bg-accent-fill-hover`, and `text-highlight` / `hover:text-highlight`.

---

## 2. Pages are pure white

**File:** `src/design-system/tokens.css` (+ `index.html`)

The two off-white page surfaces were set to pure white. Everything that paints
a page background (`bg-cream`, `bg-surface`) and the cream-coloured logo
(`text-cream`) followed automatically.

```css
/* before → after */
--color-cream:   #f4efe4;  →  #ffffff;
--color-surface: #faf7f1;  →  #ffffff;
```

`index.html` — the browser theme colour was matched to white:

```html
<meta name="theme-color" content="#ffffff" />   <!-- was #faf7f1 -->
```

---

## 3. Typeface → Zeitung (self-hosted)

**Files:** `src/design-system/tokens.css`, `src/assets/styles.css`,
`src/assets/fonts/`, `index.html`

All text now uses **Zeitung**, self-hosted (no external font CDN). The licensed
`.woff2` files were mirrored from the production site into
`src/assets/fonts/` (Regular 400 + Bold 700 — the only two weights that exist;
the browser synthesises intermediate weights and there are no italics).

```css
/* tokens.css */
--font-serif: 'Zeitung', ui-sans-serif, system-ui, -apple-system, Arial, sans-serif;
--font-sans:  'Zeitung', ui-sans-serif, system-ui, -apple-system, Arial, sans-serif;
```

```css
/* styles.css — added @font-face */
@font-face { font-family:'Zeitung'; font-weight:400; font-display:swap;
  src:url('./fonts/Zeitung-Regular.woff2') format('woff2'); }
@font-face { font-family:'Zeitung'; font-weight:700; font-display:swap;
  src:url('./fonts/Zeitung-Bold.woff2') format('woff2'); }
```

`index.html` — the Google Fonts `<link>` (Fraunces + DM Sans) and its
`preconnect` hints were **removed**.

---

## 4. Buttons

**File:** `src/design-system/components/Button.vue` — the single source of truth
for buttons. Variants are picked with `<Button variant="…">`.

### 4a. Text style — uppercase, 14px

```js
// base string — added `uppercase`
'... font-sans font-semibold uppercase ...'

// sizes — text set to 14px across the board
sm: 'text-[14px] px-[18px] py-[9px] tracking-label',
md: 'text-[14px] px-[26px] py-[13px] tracking-label',
lg: 'text-[14px] px-[34px] py-[17px] tracking-label',
```

### 4b. Variant colours

| Variant | Before | After |
|---------|--------|-------|
| `primary` (green button) | green fill, **yellow** text | green fill, **white** text — `bg-brand text-white border-brand` |
| `accent` (main CTA) | yellow fill, green text | **crimson** fill, white text — `bg-accent-fill text-accent-fill-ink border-accent-fill` |
| `secondary` | outline | **crimson** fill, white text (same as accent) |
| `ghost` / `danger` | unchanged | unchanged |

> Note: `secondary` and `accent` are currently identical (both crimson). The
> Hero's "Learn more" secondary CTA (rendered inline, see §5) was matched to
> the same crimson fill.

---

## 5. Hero call-to-action buttons

**File:** `src/design-system/components/Hero.vue`

The Hero renders its **secondary** CTA inline (not via `<Button>`), so it has to
be styled directly. On brand-green heroes it is now crimson fill + white text,
uppercase, 14px:

```html
class="… rounded-pill border border-accent-fill bg-accent-fill px-[34px] py-[17px]
       text-[14px] font-semibold uppercase tracking-label text-accent-fill-ink
       transition-colors duration-base hover:bg-accent-fill-hover"
```

The Hero's **primary** CTA already uses the `accent` variant on green surfaces,
so it's crimson too.

---

## 6. "Add to cart" buttons are crimson

Every add-to-cart button is now the crimson `accent` variant.

| File | Change |
|------|--------|
| `src/design-system/components/ProductCard.vue` | `ctaVariant` prop default `'primary'` → `'accent'` |
| `src/design-system/components/BundleCard.vue` | add-to-cart `<Button>` `variant="primary"` → `"accent"` |
| `src/pages/ShopPage.vue` | product grid `:cta-variant="… 'accent' : 'primary'"` → `cta-variant="accent"` (no more alternating) |
| `src/pages/ProductPage.vue` | main add-to-cart already `accent` (unchanged) |
| `src/pages/BundlePage.vue` | add-to-cart already `accent` (unchanged) |

## 7. Cart checkout button is crimson

**File:** `src/design-system/components/CartDrawer.vue`

```html
<!-- checkout button -->
<Button variant="accent" …>   <!-- was variant="primary" -->
```

---

## 8. Other solid pills/chips → crimson + white

All previously-yellow solid fills now use the crimson token pair
`bg-accent-fill` + `text-accent-fill-ink`.

| File | Element |
|------|---------|
| `src/design-system/components/IconButton.vue` | `accent` variant (cart icon button) |
| `src/design-system/components/LanguageSwitcher.vue` | active language pill (all 3 tones) |
| `src/design-system/components/Navbar.vue` | mobile cart CTA pill |
| `src/design-system/components/Kaiserhacks.vue` | video play chip |
| `src/design-system/components/Badge.vue` | `accent` badge variant |
| `src/design-system/components/About.vue` | "HISTORY & SCIENCE" eyebrow (`Badge variant="brand"` → `"accent"`) and the "TODAY" timeline pill (`.pill-accent` CSS now crimson + white) |

```css
/* About.vue — .pill-accent (the "TODAY" pill) */
.pill-accent {
  background: var(--color-accent-fill);
  color: var(--color-accent-fill-ink);
  border-color: var(--color-accent-fill);
}
```

---

## 9. Mint highlight on nav tabs & footer links

**Files:** `src/design-system/components/Navbar.vue`,
`src/design-system/components/Footer.vue`

The hover/active highlight on the brand-green navbar (and the brand footer
links) changed from yellow to mint via the new `--color-highlight` token:

```
text-accent       →  text-highlight        (active nav tab)
hover:text-accent →  hover:text-highlight   (nav tab + footer link hover)
```

> Not changed: the mobile cart-count number badge (`Navbar.vue`, a green
> circle with a count) is still yellow — it's a count indicator, not a tab
> highlight. Easy to switch if wanted.

---

## 10. Yellow "highlight" removed from hero text & titles

The italic emphasis words inside hero/section headlines, and the small eyebrow
labels above them, were yellow. They now match the surrounding white hero text.

| File | Change |
|------|--------|
| `src/pages/HomePage.vue`, `CategoryPage.vue`, `ProductPage.vue`, `ShopPage.vue` | headline `<em>` emphasis: `text-accent-soft` → `text-cream` |
| `src/design-system/components/BrandHero.vue`, `Revitalization.vue` | same emphasis swap |
| `src/pages/CategoryPage.vue`, `ShopPage.vue`, `src/design-system/components/Kaiserhacks.vue` | hero eyebrows: `text-accent` → `text-cream/75` |

(`--color-cream` is now `#ffffff`, so these read as white on the green heroes.)

---

## 11. Section dividers: wave → diagonal

**Files:** `src/design-system/components/WaveDivider.vue`,
`src/pages/HomePage.vue` (6 inline dividers)

The soft S-curve between coloured sections became a **straight diagonal** that
sits **low on the left, high on the right**, and the divider band was **doubled
in height** so the slope is roughly twice as steep.

```
height:   h-12 md:h-16   →  h-24 md:h-32   (48/64px → 96/128px)
viewBox:  0 0 1440 64    →  0 0 1440 128
path:     (cubic-bézier wave)  →  M0,0 L0,116 L1440,12 L1440,0 Z
```

The seam-free construction is unchanged: a full-height `<rect>` paints the
*lower* section colour and the `<path>` paints the *upper* section colour.

The same diagonal divider also sits between the **Kaiserhacks** green header
and the white body below it:

**File:** `src/design-system/components/Kaiserhacks.vue` — imports `WaveDivider`
and renders `<WaveDivider from="brand" to="surface" />` between the `bg-brand`
header and the content `<div>` (which gains `-mt-px` to sit flush).

---

## 12. Search dropdown prices → white (on green)

**File:** `src/design-system/components/Search.vue`

In the search overlay, the price labels on the brand-green tone were yellow.
They are now white to match the rest of the green-surface text:

```js
// brand tone
price: 'text-accent'  →  'text-cream'   // (#ffffff on green)
```

The `paper` and `cream` tones keep `text-brand` (unchanged).

---

## 13. Design-system docs page

**File:** `src/pages/design/ColorsSection.vue`

The new `accent-fill`, `accent-fill-hover`, `accent-fill-ink` tokens were added
to the colour-swatch reference so the in-app design-system page stays accurate.

---

## Quick reference — the two new colours

```
Crimson  #cc0230   — all buttons / CTAs / solid pills (with #ffffff text)
Mint     #6eceb2   — nav tab + footer link hover/active highlight
White    #ffffff   — page backgrounds (cream + surface) and button text on green
```
