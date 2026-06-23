# Kaiser Natron — Restyle Change Log (Developer Handoff)

> **⚠️ ALWAYS KEEP THIS DOCUMENT UPDATED.** Any time a styling change is made,
> update this file in the same change. Record only the **latest final state**
> of each item (succinctly — not the iterations it took to get there): the
> file, what it is now, and the token/class. If a new value supersedes an old
> one, **edit the existing entry** instead of appending a duplicate.
>
> **Also update [STYLE-CHANGES-simple.md](STYLE-CHANGES-simple.md)** — the
> plain-language version for non-technical reviewers — in the same change.

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

## 13. Brand-hero intro artwork → official brand assets

**Files:** `src/design-system/components/BrandHero.vue`,
`src/components/heroFigures.js`, `src/assets/brand/{hebe,waterfall}.svg`

The home-page intro animation (the in-flow figure entrance — the full-screen
`SplashIntro` overlay was already retired) previously used hand-traced
approximations of the woman + waterfall. It now uses the **official Kaiser-Natron
brand vectors**: the Ikone ("Hebe") and the Waterfall (2021 Druckdaten-Final),
converted from EPS to SVG.

- **Source SVGs** live in `src/assets/brand/` for provenance; the extracted path
  data lives in `src/components/heroFigures.js` (`ladyMint`, `ladyWhite`,
  `waterfall`).
- **Dark outline removed** — the brand icon's `#006648` outline tone is dropped;
  the figures render as flat mint silhouettes, matching the established splash
  aesthetic. Mint tones: lady `#72c1ad`, waterfall `#6eceb2`; natron handful
  `#ffffff`.
- **Composition** — shared `0 0 2760 3624` viewBox: the lady at the origin
  (native 1828×3624), the waterfall **half-scale** (`scale(0.5)`) to her right
  and **vertically centred** against her (`translate(1793,1310)`).
- **Animation unchanged** — same choreography/timing: lady slides in from the
  left (`left-m`), waterfall from the right (`right-m`), the white natron fades
  in once she's landed (`mound-m`), tagline + SINCE 1881 last; same edge-feather
  mask and reduced-motion handling.

> Side effect: the home-page chunk shrank ~214 KB → ~70 KB because the new
> `heroFigures.js` (~57 KB) replaces the much larger traced `splashPaths.js`
> import. `splashPaths.js` / `SplashIntro.vue` remain only as unused legacy.

---

## 14. Product image — 250 g Großpackung box recoloured

**Files:** `public/products/kaiser-natron-pulver-250-g-grosspackung.webp`
(source of truth) and the build copy `dist/products/…` (same filename).

The 250 g box product shot had a muted, grey/pine green that didn't match the
brighter brand green of the other Kaiser-Natron powder packs (e.g. the 50 g
sachet `public/products/kaiser-natron-pulver-50-g-beutel.webp`). It was replaced
with an updated box render carrying the correct vivid brand green (the dark-green
3-D side panels and the red bottom band are intact).

- **Where product images live:** `public/products/*.webp` (served as static
  assets; the build mirrors them to `dist/products/*.webp`). Convention:
  **transparent RGBA, ~1200 px tall**.
- The replacement was supplied as a 939×1200 transparent PNG and saved straight
  to WebP (`quality 92`, no scaling needed — already matching the original
  dimensions), so edges/text stay crisp.

---

## 15. Design-system docs page

**File:** `src/pages/design/ColorsSection.vue`

The new `accent-fill`, `accent-fill-hover`, `accent-fill-ink` tokens were added
to the colour-swatch reference so the in-app design-system page stays accurate.

---

## 16. Brand name — ® trademark + hyphenation pass

**Files:** `src/i18n/messages.js` (de + en), `src/api/products.js`,
`src/design-system/components/Logo.vue`, `src/design-system/components/Navbar.vue`

The brand name is now written **`Kaiser-Natron®`** consistently — hyphenated,
with the ® mark — on every visible mention. Two problems were fixed:

- **Missing ®** — display headlines, CTAs, the bundle line-item lists and the
  product `brand` field carried no trademark mark. (The long Kaiserhacks recipe
  copy and the product `title` fields already had `Kaiser-Natron®` and were left
  as-is.)
- **Spelling drift** — the English locale (and one German headline) used the
  un-hyphenated `Kaiser Natron`. All standardised to the hyphenated form.

| File | What changed |
|------|--------------|
| `src/i18n/messages.js` | `shop.headline`, `ds.hero.headline.a`, `home.banner.sub`, `home.brand.headline.a`, `home.teaser.cta`, and the `bundle.*.items.*` lists — de **and** en — now read `Kaiser-Natron®` |
| `src/api/products.js` | `brand: 'Kaiser-Natron'` → `'Kaiser-Natron®'` (all 11 products; shown in search results via `Search.vue`) |
| `src/design-system/components/Logo.vue` | default accessible `title` prop `'Kaiser Natron'` → `'Kaiser-Natron®'` |
| `src/design-system/components/Navbar.vue` | logo link `aria-label` `'Kaiser Natron home'` → `'Kaiser-Natron home'` |

> Not touched: generic ingredient references ("Natron", "Natronwasser",
> "Natron-basierte …") — those mean the substance, not the brand, so they take
> no ®. Image `alt` text keeps the plain hyphenated name (not on-screen).

---

## 17. Hero headline copy — versatility, not "shine"

**File:** `src/i18n/messages.js` (`ds.hero.headline.*`, de + en)

The product-hero headline was reworded from a generic cleaning-shine line to the
brand's own versatility voice (drawn from kaiser-natron.de — *"Die
Verwendungsmöglichkeiten … sind beinah grenzenlos"*). The three-part split
(`a` / emphasised `em` / `b`) is unchanged; only the words changed.

```
DE  "Kaiser-Natron®  für alles  was glänzen soll."
 →  "Kaiser-Natron®  für fast  alles im Alltag."

EN  "Kaiser-Natron®  for everything  that should shine."
 →  "Kaiser-Natron®  for almost  anything at home."
```

---

## 18. Bundle artwork — "AI Edited" disclosure (L5 + L6)

**Files:** `src/api/bundles.js`, `src/design-system/components/BundleCard.vue`,
`src/design-system/components/Bundles.vue`, `src/pages/HomePage.vue`,
`src/pages/BundlePage.vue`

The bundle images are AI-composed. Rather than replace them, each is now marked
with a small, faint **"AI Edited"** caption in the bottom-right of the image, so
the AI origin is disclosed. It's data-driven, so it disappears automatically once
real photography replaces a given image.

- `bundles.js` — each bundle record gains `aiEdited: true`.
- `BundleCard.vue` — new `aiEdited` Boolean prop; when true, renders the overlay
  span inside the media area (both the card-link and plain-media branches).
- `Bundles.vue` — passes `:ai-edited="bundle.aiEdited"` to all four BundleCard
  instances (mobile + grid + sidebar + carousel).
- `HomePage.vue` / `BundlePage.vue` — carry `aiEdited` through to the rendered
  records; BundlePage renders the same overlay on its large hero image (desktop
  + mobile).

```html
<span class="pointer-events-none absolute bottom-0 right-0 z-[1] px-2 py-0.5
  text-[10px] font-medium uppercase tracking-label text-white/55
  drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">AI Edited</span>
```

> Set a bundle's `aiEdited: false` (or drop it) in `bundles.js` to remove the
> badge once its image is a real photo.

---

## 19. Revitalization section — animation row + CTA removed (L10)

**File:** `src/pages/HomePage.vue` (`revitCopy`, Revitalization usage)

The Revitalization section was stripped back. Removed entirely:

- the **three-pillar feature row** with the spinning orbit animations (the
  emoji icons ⚗️💊🌿 were off-brand; the brand owner wanted the whole row gone), and
- the **"early access" CTA** button (`revit.notifyCta` — "Get early access" /
  "Early Access sichern").

This is done at the **usage** site, not the component: `revitCopy` no longer
passes `features` or `notifyCta`, and the `:features` / `:notify-cta` / `@notify`
bindings (and the orphaned `onRevitNotify` handler) were removed. The section now
renders **eyebrow + headline + sub only**.

`Revitalization.vue` is unchanged and still reusable — its `v-if="features.length"`
and `v-if="notifyCta"` guards simply render nothing when those props are absent.
The unused `revit.feature.*` / `revit.notifyCta` i18n keys are left in place
(harmless) in case the section is restored.

---

## 20. Shop page category banners + colours + Küche page (L8/U4)

**Files:** `src/design-system/tokens.css`, `src/design-system/components/Hero.vue`,
`src/pages/ShopPage.vue`, `src/router/index.js`, `src/pages/CategoryPage.vue`,
`src/i18n/messages.js`

On the **shop page**, the catalogue is split into **four** use-group sections,
each fronted by a **full-width colour banner** in the brand's own use-group
colour (sourced from kaiser-natron.de), with diagonal dividers carrying the
colour in and back out to the neutral product grid below. (The home page was
left unchanged — it keeps its 3-card `ProductTeaser`.)

**Four sections + colours (design tokens).** `tokens.css` — the old "Haushalt"
lump was split into **Clean** (cleaning) and **Wash** (laundry):
| Token | Hex | Section | Products |
|-------|-----|---------|----------|
| `--color-cat-kitchen` | `#c6d47d` (lime) | Küche / cook | Pulver, Tabletten |
| `--color-cat-clean` | `#eb5a61` (grapefruit) | Reinigung / clean | cleaners, sprays, descalers |
| `--color-cat-wash` | `#c15a7e` (plum) | Wäsche / wash | wash-soda, starch, stain removers |
| `--color-cat-care` | `#f1864c` (orange) | Pflege / care | bath, foot-bath, sport |
Tailwind v4 auto-emits `bg-cat-kitchen` / `bg-cat-clean` / `bg-cat-wash` / `bg-cat-care`.

**Product grouping.** `src/api/products.js` — `USE_CASES` is now
`['cook','clean','wash','care']`; `Wäsche` maps to the new `wash` group (was
`clean`). `productsByUseCase` returns all four buckets.

**Hero tones.** `Hero.vue` has `kitchen` / `clean` / `wash` / `care` tones. Lime
keeps dark ink text; the other three take cream (white) text. Each sets an
`eyebrowColor` applied inline (overrides the global `.eyebrow { color: muted }`).
`WaveDivider.vue` gained matching `kitchen` / `clean` / `wash` / `care` tones.

**Shop page.** `ShopPage.vue` loops the four use-cases; each renders
`WaveDivider → <Hero :tone="section.cat"> (hero product + mixed-font heading +
CTAs) → WaveDivider → a section title + product grid`. `CAT_TONE` maps
cook→kitchen, clean→clean, wash→wash, care→care; `CAT_HERO_ID` picks the headline
product (Pulver / Allzweck-Spray / Daunenwasch / Bad). A per-section title
(`shop.section.<id>.products.title`) now sits above each grid.

**Banner CTAs.** Each banner carries two buttons (via the Hero `#actions` slot):
**"add to cart"** in the brand crimson (`Button variant="accent"`, adds the
section's hero product) and **"learn more"** as a white-outline ghost
(`border-white/90 text-white`, links to the product page).
> ⚠️ The white-outline "learn more" reads well on the saturated grapefruit / plum
> / orange banners but is low-contrast on the light lime (Kitchen) banner — may
> want a dark-outline variant there.

**Shop first fold — halved.** The green title fold was `min-h:calc(100svh − nav)`
but only holds a compact title band, leaving too much empty green. Reduced to
`calc(50svh − var(--nav-h))`. A diagonal then drops into a **thin white band**
(`h-6 md:h-10`) before the first colour banner, so the green hero and the lime
Kitchen banner don't butt directly together.

**Küche category page (new, separate from the shop sections).** Added for parity
with `/haushalt` + `/pflege`:
- `router/index.js` — new `/kueche` route → `CategoryPage` `{ slug: 'kueche', useCase: 'cook' }`.
- `CategoryPage.vue` — `slug` validator allows `kueche`; `useCase` allows `cook`.
- `messages.js` — full `category.kueche.*` copy (de + en), mirroring pflege/haushalt.

> ℹ️ **Resolved (see §21).** The three content-complete category pages
> (`/kueche`, `/haushalt`, `/pflege`) are now wired into the footer. `/waesche`
> (wash) is intentionally **deferred** pending brand copy — the shop's in-page
> `wash` section covers laundry in the meantime.

---

## 21. Category pages wired up + naming aligned to shop sections

**Files:** `src/design-system/components/Footer.vue`, `src/i18n/messages.js`

**Decision.** Of the four use-groups, the three with complete copy (`cook`/`clean`/
`care` → `/kueche`, `/haushalt`, `/pflege`) are kept as standalone landing pages
*alongside* the shop's in-page sections, and linked from the footer. The `wash`
group has no standalone page (`/waesche`) yet — **deferred** until brand copy is
supplied; the shop's `wash` section covers laundry meanwhile.

**Footer links.** `Footer.vue` `exploreLinks` now lists `Shop → Küche → Haushalt →
Pflege → Bundles → About` (the `/kueche` link was previously missing — page was
reachable only by direct URL). Order follows the shop's use-group order.

**Naming aligned to the shop.** The footer **link labels** and the category-page
**eyebrows** now use the shop's plain section names (`shop.feature.*`) instead of
the older descriptive variants, so a section and its landing page read identically:

| Page (route) | use-case | eyebrow + footer label — DE / EN | was |
|---|---|---|---|
| `/kueche` | cook | **Küche / Kitchen** | "Küche & Backen" / "Kitchen & baking" |
| `/haushalt` | clean | **Reinigung / Clean** | "Haushalt & Reinigung" / "Home & cleaning" |
| `/pflege` | care | **Pflege / Care** | "Pflege & Wohlbefinden" / "Personal care & wellbeing" |

Route slugs are unchanged (`/haushalt` still serves the `clean` group); only the
visible labels/eyebrows moved to the new names.

---

## 22. Membership removed — bundles are single-price (U2)

**Files:** `src/api/bundles.js`, `src/design-system/components/BundleCard.vue`,
`src/design-system/components/Bundles.vue`, `src/pages/BundlePage.vue`,
`src/pages/HomePage.vue`, `src/i18n/messages.js`, plus the design-system demos
(`BundleCardSection.vue`, `BundlesSection.vue`, `previews/BundlesPreview.vue`).

There is **no membership programme**, so every trace of one was removed (the
join button went earlier in §U2; this completes it). **Decision: single retail
price** — bundles now show only their regular price (e.g. €24,90); the old lower
`memberPrice` was dropped entirely (no discount remains).

- **Data.** `bundles.js` — `memberPrice` deleted from all three bundles.
- **`BundleCard.vue`** — removed the `memberPrice` prop, the `memberLabel`
  computed, and the "Mitglieder: €X" line under the price.
- **`Bundles.vue`** — removed all four `:member-price` bindings, the `joinCta`
  prop, the `join` emit, both "become a member" buttons (stacked + sidebar), and
  the now-unused `Button` import. Stale "why join" / "member pitch" comments
  reworded to "why bundle".
- **`BundlePage.vue`** — removed the `memberPriceLabel` computed and the member
  price line in both desktop and mobile hero blocks.
- **`HomePage.vue`** — dropped `memberPrice` from the localized-bundle mapping.
- **Copy (`messages.js`).** Deleted orphaned keys `bundle.memberPrice`,
  `bundles.joinCta`, `bundles.card.memberPrefix`. `bundles.card.priceLabel`
  → "Preis" / "Price" (was "Verkaufspreis" / "Retail price"). The section
  subtitle + three benefits were rewritten from membership perks to **bundle
  value** (no savings claim, since the price is now flat):
  - sub: "Kuratierte Sets … in einem Paket." / "Curated sets … in a single pack."
  - benefits: *Aufeinander abgestimmt · Alles für einen Bereich · In einer Lieferung*
    (EN: *Chosen to work together · Everything for one area · In a single delivery*).
  - `ds.bundleCard.description` / `ds.bundles.description` updated to drop the
    member-price / member-CTA mentions.

The `headline.em` stays "Vorteile / Benefits" — it now reads as the bundles'
advantages rather than membership perks.

---

## 23. Second-fold banner image — powder, not bath (L7)

**File:** `src/pages/HomePage.vue`

The cream second-fold banner reads *"Ein Pulver, hundert Anwendungen im
Haushalt"* / *"One powder, a hundred uses around the home"* but showed the **Bad
500 g (bath)** product — and its add-to-cart + "learn more" link pointed there
too, contradicting the powder message. Repointed the whole banner to **powder**:

- `imgBanner` → `/products/kaiser-natron-pulver-3.490-g-eimer.webp` (the bulk
  bucket — visually reinforces "a hundred uses"; deliberately *not* the 250 g
  Großpackung, which is already the first-fold hero).
- `bannerProductId` → `kaiser-natron-pulver-3490-g-eimer`, so the CTA adds the
  powder and "learn more" links to `/shop/kaiser-natron-pulver-3490-g-eimer`.
- `image-alt` → "Kaiser-Natron® Pulver 3.490 g Eimer".

No new asset needed — the bucket image already shipped in `public/products/`.

---

## Quick reference — the two new colours

```
Crimson  #cc0230   — all buttons / CTAs / solid pills (with #ffffff text)
Mint     #6eceb2   — nav tab + footer link hover/active highlight
White    #ffffff   — page backgrounds (cream + surface) and button text on green
```
