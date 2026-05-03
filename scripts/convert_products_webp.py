"""Resize + convert PNGs to WebP (q=90, 1200px long edge)."""
from pathlib import Path
from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"
DIRS = [
    PUBLIC / "products",
    PUBLIC / "bundles" / "background",
    PUBLIC / "bundles" / "transparent",
]
MAX_EDGE = 1200
QUALITY = 90

grand_before = 0
grand_after = 0

for src in DIRS:
    if not src.is_dir():
        print(f"skip (missing): {src}")
        continue
    print(f"\n== {src.relative_to(PUBLIC)} ==")
    total_before = 0
    total_after = 0
    rows = []
    for png in sorted(src.glob("*.png")):
        out = png.with_suffix(".webp")
        before = png.stat().st_size
        with Image.open(png) as im:
            has_alpha = im.mode in ("P", "LA", "RGBA") or "transparency" in im.info
            im = im.convert("RGBA") if has_alpha else im.convert("RGB")
            w, h = im.size
            scale = min(1.0, MAX_EDGE / max(w, h))
            if scale < 1.0:
                im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
            im.save(out, "WEBP", quality=QUALITY, method=6)
        after = out.stat().st_size
        total_before += before
        total_after += after
        rows.append((png.name, before, after))

    for name, b, a in rows:
        print(f"  {a/1024:7.0f} KB  ({100*a/b:4.1f}%)  {name}")
    if total_before:
        print(f"  -> {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB ({100*total_after/total_before:.1f}%)")
    grand_before += total_before
    grand_after += total_after

print()
print(f"GRAND TOTAL: {grand_before/1024/1024:.2f} MB -> {grand_after/1024/1024:.2f} MB")
print(f"Saved      : {(grand_before-grand_after)/1024/1024:.2f} MB ({100*(grand_before-grand_after)/grand_before:.1f}%)")
