"""Emit src/i18n/products/de.js + property-code helpers from scraped JSON.

Runs after scrape_kaiser_natron.py. Property labels (German UI text)
get converted into stable slug-style codes that messages.js translates
back to display strings — so DE and EN stay parallel without inline
translation in the data fixture.
"""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRAPED = ROOT / "scripts" / "output" / "products-content.json"
OUT_DE = ROOT / "src" / "i18n" / "products" / "de.js"
OUT_HELP = ROOT / "scripts" / "output" / "manual-merge.md"

# Maps the German property phrase from the source site to a stable
# code we'll use in src/api/products.js + messages.js. New entries
# get added here when the source surface a new label.
PROP_CODES: dict[str, str] = {
    "Enthärtet":                                       "enthaertet",
    "Frei von Mikroplastik":                           "frei-von-mikroplastik",
    "Frei von tierischen Substanzen":                  "frei-von-tierischen-substanzen",
    "Für Böden und Oberflächen":                       "fuer-boeden-und-oberflaechen",
    "Für Küche und Haushalt":                          "fuer-kueche-und-haushalt",
    "Glutenfrei":                                      "glutenfrei",
    "Hautverträglich – dermatologisch bestätigt":      "hautvertraeglich-dermatologisch-bestaetigt",
    "Hygienische Sauberkeit":                          "hygienische-sauberkeit",
    "Laktosefrei":                                     "laktosefrei",
    "Mild-alkalisch":                                  "mild-alkalisch",
    "Mit Pampelmusenduft":                             "mit-pampelmusenduft",
    "Mit dem Duft der Latschenkiefer":                 "mit-dem-duft-der-latschenkiefer",
    "Mit entspannendem Apfelsinenduft":                "mit-entspannendem-apfelsinenduft",
    "Mit natürlicher Seife":                           "mit-natuerlicher-seife",
    "Mit pflegendem Lanolin":                          "mit-pflegendem-lanolin",
    "Nachhaltig durch Tenside nachwachsenden Ursprungs": "nachhaltig-durch-tenside-nachwachsenden-ursprungs",
    "Neutralisiert Säuren":                            "neutralisiert-saeuren",
    "Ohne Konservierungsstoffe":                       "ohne-konservierungsstoffe",
    "Ohne Mineralöl":                                  "ohne-mineraloel",
    "Vegan":                                           "vegan",
    "Wohltuend und erfrischend":                       "wohltuend-und-erfrischend",
    # Carry-overs from messages.js v1 (not yet seen in source).
    "In Österreich abgefüllt":                         "made-in-austria",
    "Bio":                                             "bio",
}

# English labels — translations land here (a single source of truth so
# we don't drift between locales).
EN_LABELS: dict[str, str] = {
    "enthaertet":                                "Softens water",
    "frei-von-mikroplastik":                     "Microplastic-free",
    "frei-von-tierischen-substanzen":            "No animal substances",
    "fuer-boeden-und-oberflaechen":              "For floors & surfaces",
    "fuer-kueche-und-haushalt":                  "For kitchen & home",
    "glutenfrei":                                "Gluten-free",
    "hautvertraeglich-dermatologisch-bestaetigt": "Skin-friendly — dermatologically tested",
    "hygienische-sauberkeit":                    "Hygienic clean",
    "laktosefrei":                               "Lactose-free",
    "mild-alkalisch":                            "Mildly alkaline",
    "mit-pampelmusenduft":                       "Pomelo scent",
    "mit-dem-duft-der-latschenkiefer":           "Mountain pine scent",
    "mit-entspannendem-apfelsinenduft":          "Sweet orange scent",
    "mit-natuerlicher-seife":                    "With natural soap",
    "mit-pflegendem-lanolin":                    "With nourishing lanolin",
    "nachhaltig-durch-tenside-nachwachsenden-ursprungs": "Sustainable plant-based surfactants",
    "neutralisiert-saeuren":                     "Neutralises acids",
    "ohne-konservierungsstoffe":                 "Preservative-free",
    "ohne-mineraloel":                           "Mineral-oil-free",
    "vegan":                                     "Vegan",
    "wohltuend-und-erfrischend":                 "Soothing & refreshing",
    "made-in-austria":                           "Bottled in Austria",
    "bio":                                       "Organic",
}


def js_str(s: str) -> str:
    """Single-line JS string with safe escaping (handles backticks/$)."""
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
    return f"'{s}'"


def normalise(text: str | None) -> str | None:
    if not text:
        return None
    text = text.replace("1/2 Tl", "½ TL").replace("1/2 TL", "½ TL")
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


def emit() -> None:
    data = json.loads(SCRAPED.read_text(encoding="utf-8"))
    populated: dict[str, dict] = {}
    skipped: list[str] = []
    unknown_props: set[str] = set()

    for slug, p in data.items():
        tagline = normalise(p.get("tagline"))
        lead = normalise(p.get("lead"))
        long_desc = normalise(p.get("descriptionLong"))
        apps = []
        for a in p.get("applications") or []:
            t = normalise(a.get("title"))
            b = normalise(a.get("body"))
            if t or b:
                apps.append({"title": t, "body": b})

        has_content = any([tagline, lead, long_desc, apps])
        if not has_content:
            skipped.append(slug)
            continue
        populated[slug] = {
            "tagline": tagline,
            "lead": lead,
            "descriptionLong": long_desc,
            "applications": apps,
        }

    # Build js content
    lines = [
        "// German product long-form copy. Source of truth for all product pages.",
        "// Keyed by product id (matches src/api/products.js). UI chrome strings",
        "// live in src/i18n/messages.js — only product-specific narrative belongs here.",
        "//",
        "// Generated from scripts/output/products-content.json by",
        "// scripts/emit_de_locale.py — re-run after scraping to refresh.",
        "",
        "export default {",
    ]
    for slug, c in populated.items():
        lines.append(f"  {js_str(slug)}: {{")
        if c["tagline"]:
            lines.append(f"    tagline: {js_str(c['tagline'])},")
        if c["lead"]:
            lines.append(f"    lead: {js_str(c['lead'])},")
        if c["descriptionLong"]:
            lines.append(f"    descriptionLong: {js_str(c['descriptionLong'])},")
        if c["applications"]:
            lines.append("    applications: [")
            for a in c["applications"]:
                lines.append("      {")
                if a["title"]:
                    lines.append(f"        title: {js_str(a['title'])},")
                if a["body"]:
                    lines.append(f"        body: {js_str(a['body'])},")
                lines.append("      },")
            lines.append("    ],")
        lines.append("  },")
    lines.append("}")
    lines.append("")
    OUT_DE.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT_DE.relative_to(ROOT)} ({len(populated)} entries)")
    if skipped:
        print(f"skipped (no source content): {len(skipped)}")
        for s in skipped:
            print(f"  - {s}")

    # Manual-merge helper — code arrays per product + i18n keys to splice into
    # src/api/products.js and src/i18n/messages.js.
    helper_lines: list[str] = ["# Manual merge — copy these into the right files\n"]

    # 1. Property arrays per slug
    # The source page sometimes serves NFD-normalised umlauts and the
    # PROP_CODES dict is hand-typed in NFC — normalise both before lookup
    # so Python's `==` doesn't trip over decomposed combining marks.
    nfc_codes = {unicodedata.normalize("NFC", k): v for k, v in PROP_CODES.items()}

    helper_lines.append("## src/api/products.js — properties\n")
    for slug, p in data.items():
        codes = []
        for label in p.get("properties", []):
            code = nfc_codes.get(unicodedata.normalize("NFC", label))
            if code is None:
                unknown_props.add(label)
                continue
            codes.append(code)
        if codes:
            helper_lines.append(f"- `{slug}` → `properties: {json.dumps(codes)}`")
    helper_lines.append("")

    # 2. messages.js DE + EN keys
    helper_lines.append("## src/i18n/messages.js — DE block\n```js")
    for label, code in PROP_CODES.items():
        helper_lines.append(f"  'product.prop.{code}': '{label}',")
    helper_lines.append("```\n")
    helper_lines.append("## src/i18n/messages.js — EN block\n```js")
    for code, en in EN_LABELS.items():
        helper_lines.append(f"  'product.prop.{code}': '{en}',")
    helper_lines.append("```\n")

    if unknown_props:
        helper_lines.append("## Unknown labels (add to PROP_CODES in emit_de_locale.py)\n")
        for p in sorted(unknown_props):
            helper_lines.append(f"- {p!r}")

    OUT_HELP.write_text("\n".join(helper_lines), encoding="utf-8")
    print(f"wrote {OUT_HELP.relative_to(ROOT)}")


if __name__ == "__main__":
    emit()
