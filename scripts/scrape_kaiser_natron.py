"""Scrape kaiser-natron.at product pages → JSON.

stdlib-only by design (no requests/bs4) so the venv stays minimal. The
site's product pages all share the same HTML skeleton:

    <h1>{title}</h1>
    <h2>Produktinformation:</h2><p>...</p>
    <h2>Erhältlich in:</h2><p>...</p>
    <h2>Produkteigenschaften:</h2><ul><li>...</li></ul>
    <h2>Anwendung:</h2><p><strong>{useCaseTitle}: </strong>{body}</p>...

So a tiny regex pass is robust enough — no need for a DOM parser.

Output: scripts/output/products-content.json (one entry per slug).
Re-run the script any time the source site is updated.
"""

from __future__ import annotations

import html as html_lib
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent / "output" / "products-content.json"

UA = "kaiser-natron-shop-build/1.0 (+https://github.com/Zazawowow/kaiser-natron)"
BASE = "https://kaiser-natron.at/"

# (our slug used in src/api/products.js, their URL path).
PRODUCTS: list[tuple[str, str]] = [
    ("kaiser-natron-pulver-50-g-beutel",                 "kaiser-natron-pulver-50-g-beutel"),
    ("kaiser-natron-pulver-250-g-grosspackung",          "kaiser-natron-pulver-250-g-großpackung"),
    ("kaiser-natron-pulver-3490-g-eimer",                "kaiser-natron-pulver-3-490-g-eimer"),
    ("kaiser-natron-tabletten-100-g-dose",               "kaiser-natron-tabletten-100-g-dose"),
    ("kaiser-natron-bad-500-g",                          "kaiser-natron-bad-gelb-500-g-dose"),
    ("kaiser-natron-fussbad-500-g",                      "kaiser-natron-fußbad-500-g-dose"),
    ("kaiser-natron-daunenwasch-250-ml",                 "kaiser-natron-daunen-wasch-250-ml-flasche"),
    ("kaiser-natron-sport-profi-250-ml",                 "kaiser-natron-sport-profi-250-ml-flasche"),
    ("kaiser-natron-spuelmittel-500-ml",                 "kaiser-natron-spülmittel-500-ml-flasche"),
    ("kaiser-natron-allzweck-reiniger-750-ml",           "kaiser-natron-allzweckreiniger-750-ml-flasche"),
    ("kaiser-natron-allzweck-spray-500-ml",              "kaiser-natron-allzweck-spray-500-ml-flasche"),
    ("holste-wasch-soda-500-g-beutel",                   "holste-wasch-soda-500-g-beutel"),
    ("holste-handwaschpaste-500-ml",                     "holste-handwaschpaste-500-ml"),
    ("holste-kalk-und-urinsteinloeser-750-ml",           "holste-kalk-und-urinsteinlöser-750-ml"),
    ("holste-reisstaerke-250-g-faltschachtel",           "holste-reisstärke-250-g-faltschachtel"),
    ("holste-schmierseife-fluessig-1-l-flasche",         "holste-schmierseife-flüssig-1-l-flasche"),
    ("holste-zitronensaeure-entkalker-fluessig-500-ml",  "holste-zitronensäure-entkalker-flüssig-500-ml"),
    ("gazelle-waeschestaerke-1000-ml-flasche",           "gazelle-wäschestärke-1000-ml-flasche"),
    ("gruene-tante-mit-quarzmehl-500-ml-dose",           "grüne-tante-mit-quarzmehl-500-ml-dose"),
    ("linda-fleckenweg-200-ml-tube",                     "linda-fleckenweg-200-ml-tube"),
    ("linda-handreiniger-der-kraftvolle-200-g-tube",     "linda-handreiniger-der-kraftvolle-200-g-tube"),
    ("linda-neutral-375-ml-dose",                        "linda-neutral-375-ml-dose"),
]


def fetch(path: str) -> str:
    url = BASE + urllib.parse.quote(path, safe="-/")
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "de-AT,de;q=0.9"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode("utf-8")


# --- HTML helpers --------------------------------------------------------

TAG = re.compile(r"<[^>]+>")
WS = re.compile(r"\s+")


def strip_tags(s: str) -> str:
    return WS.sub(" ", html_lib.unescape(TAG.sub("", s))).strip()


def extract_block(html: str, heading: str) -> str | None:
    """Return the HTML between `<h2>{heading}:</h2>` and the next `<h2>` (or end of product-info div)."""
    m = re.search(rf"<h2>\s*{re.escape(heading)}\s*:?\s*</h2>(.*?)(?=<h2>|</div>)", html, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else None


def normalise_tagline(s: str) -> str:
    """Trim training colon, but keep terminal punctuation (`.`, `!`, `?`)
    that the brand voice uses to land each tagline."""
    s = s.strip().rstrip(":")
    if not s:
        return s
    if s[-1] not in ".!?":
        s = s + "."
    return s


def parse_product_info(block: str) -> tuple[str | None, str | None, str | None]:
    """Pulls (tagline, lead, descriptionLong).

    Source pattern is `<p><strong>{TAGLINE}</strong> {body}</p>` — we
    treat the bolded sentence as the tagline and the rest of the first
    paragraph as the lead. Subsequent paragraphs (rare on this site)
    become the long description."""
    if not block:
        return None, None, None

    # Pull the bold tagline straight out of the raw HTML before tags get
    # stripped; the *position* matters because lead = first paragraph
    # minus the tagline span.
    bold = re.search(r"<strong[^>]*>(.+?)</strong>", block, re.DOTALL)
    tagline = normalise_tagline(strip_tags(bold.group(1))) if bold else None

    paragraphs = [strip_tags(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", block, re.DOTALL)]
    paragraphs = [p for p in paragraphs if p]
    if not paragraphs:
        return tagline, None, None

    first = paragraphs[0]
    lead = first
    if tagline:
        # Tagline appears at start of paragraph; remove it plus any
        # joining punctuation (`:` / `.` / spaces) so the lead reads
        # cleanly without a leftover colon.
        bare = tagline.rstrip(".!?:")
        lead = re.sub(rf"^{re.escape(bare)}[\s\.:!?]*", "", first).strip()
    if not lead:
        lead = None

    rest = " ".join(paragraphs[1:]).strip() or None
    return tagline, lead, rest


def parse_properties(block: str | None) -> list[str]:
    if not block:
        return []
    return [strip_tags(li) for li in re.findall(r"<li[^>]*>(.*?)</li>", block, re.DOTALL) if strip_tags(li)]


def parse_applications(block: str | None) -> list[dict]:
    """Use cases come in two flavours on the source site:

      A) `<p><strong>Title: </strong>Body</p>`  — separate label + body
      B) `<p>{single instruction}</p>`           — body only, no label

    For (B) we leave `title` null so the page can render it as a plain
    instruction card without an h3 above. Anything else is dropped."""
    if not block:
        return []
    out = []
    for p_html in re.findall(r"<p[^>]*>(.*?)</p>", block, re.DOTALL):
        m = re.search(r"<strong[^>]*>(.+?)</strong>(.*)", p_html, re.DOTALL)
        if m:
            title = strip_tags(m.group(1)).rstrip(":.").strip() or None
            body = strip_tags(m.group(2)).lstrip(":").strip() or None
        else:
            body = strip_tags(p_html) or None
            title = None
        if title or body:
            out.append({"title": title, "body": body})
    return out


def parse_h1(html: str) -> str | None:
    m = re.search(r"<h1>(.*?)</h1>", html, re.DOTALL)
    return strip_tags(m.group(1)) if m else None


def scrape_one(slug: str, path: str) -> dict:
    html = fetch(path)
    info_block = extract_block(html, "Produktinformation")
    props_block = extract_block(html, "Produkteigenschaften")
    apps_block = extract_block(html, "Anwendung")
    avail_block = extract_block(html, "Erhältlich in")

    tagline, lead, long_desc = parse_product_info(info_block or "")
    props = parse_properties(props_block)
    apps = parse_applications(apps_block)

    available_in = []
    if avail_block:
        available_in = [strip_tags(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", avail_block, re.DOTALL) if strip_tags(p)]

    return {
        "slug": slug,
        "sourceUrl": BASE + urllib.parse.quote(path, safe="-/"),
        "sourceTitle": parse_h1(html),
        "tagline": tagline,
        "lead": lead,
        "descriptionLong": long_desc,
        "properties": props,
        "applications": apps,
        "availableIn": available_in,
    }


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    out: dict[str, dict] = {}
    for slug, path in PRODUCTS:
        try:
            data = scrape_one(slug, path)
        except Exception as exc:
            print(f"  FAIL  {slug}: {exc}")
            continue
        out[slug] = data
        n_apps = len(data["applications"])
        n_props = len(data["properties"])
        print(f"  ok    {slug}  ({n_props} props, {n_apps} apps)")
    OUTPUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUTPUT.relative_to(Path.cwd())} ({len(out)} products)")


if __name__ == "__main__":
    main()
