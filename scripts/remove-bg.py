#!/usr/bin/env python3
"""
Remove white studio backgrounds from product images.

Strategy (hybrid):
  1. Run rembg (birefnet-general) to get a coarse foreground mask.
  2. Dilate that mask to form a "protected zone" — everything inside
     stays opaque, regardless of how white it is. This saves interior
     white text / highlights / powder from being eaten by flood-fill.
  3. OUTSIDE the protected zone, flood-fill from the image borders
     through near-white pixels. This gives precise anti-aliased edges
     without touching anything near the product.
  4. Fill any orphaned-white holes inside the final foreground mask.
  5. Decontaminate RGB at the feather band (alpha bleeding) so the
     cutout composites cleanly on any background colour.

Usage:
  .venv/bin/python remove-bg.py
  .venv/bin/python remove-bg.py --force
  .venv/bin/python remove-bg.py --only NAME
  .venv/bin/python remove-bg.py --protect 14 --threshold 22 --feather 1.2

Tuning:
  --protect    Dilation (px) around the ML mask to form the protected
               zone. Higher = safer (more interior detail survives),
               lower = tighter cutouts. Default 18.
  --threshold  Max L-inf distance from white to count as hard
               background. Only applies OUTSIDE the protected zone.
               Default 20.
  --soft-band  Width (px) of the soft-alpha transition at the product
               edge. Default 12.
  --feather    Gaussian blur radius on the alpha edge, in pixels.
               Default 1.0.
  --model      rembg model for the coarse mask. Default birefnet-general.
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy.ndimage import (
    binary_dilation,
    binary_fill_holes,
    distance_transform_edt,
)

ROOT = Path(__file__).resolve().parent.parent
INPUT_DIR = ROOT / "public" / "products"
OUTPUT_DIR = INPUT_DIR / "cutouts"
INPUT_EXTS = (".webp", ".jpg", ".jpeg", ".png")


def coarse_mask(img: Image.Image, session) -> np.ndarray:
    cut = remove(img, session=session, only_mask=True, post_process_mask=True)
    m = np.array(cut)
    if m.ndim == 3:
        m = m[:, :, 0]
    return m >= 64


def strip_background(
    src: Path,
    dst: Path,
    session,
    protect: int,
    threshold: int,
    soft_band: int,
    feather: float,
) -> None:
    img = Image.open(src).convert("RGBA")
    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.int16)
    dist_white = np.max(np.abs(rgb - 255), axis=2)

    fg_ml = coarse_mask(img, session)
    protected = binary_dilation(fg_ml, iterations=max(protect, 1))

    near_white = dist_white <= threshold
    bg_seed = near_white & ~protected

    border_zone = np.zeros_like(bg_seed)
    border_zone[0, :] = border_zone[-1, :] = True
    border_zone[:, 0] = border_zone[:, -1] = True
    border_near_white = near_white & border_zone

    from scipy.ndimage import label
    combined = bg_seed | border_near_white
    labeled, _ = label(combined)
    border_labels = np.unique(
        np.concatenate([labeled[0], labeled[-1], labeled[:, 0], labeled[:, -1]])
    )
    border_labels = border_labels[border_labels != 0]
    bg = np.isin(labeled, border_labels) & ~protected

    fg = ~bg
    fg = binary_fill_holes(fg)
    bg = ~fg

    alpha = np.where(bg, 0.0, 1.0).astype(np.float32)
    soft_edge = binary_dilation(bg, iterations=max(soft_band, 1)) & fg
    if soft_band > 0:
        soft_alpha = np.clip(
            dist_white.astype(np.float32) / max(soft_band, 1), 0.0, 1.0
        )
        alpha = np.where(soft_edge, soft_alpha, alpha)

    alpha = (alpha * 255).astype(np.uint8)
    arr[:, :, 3] = alpha

    if feather > 0:
        a = Image.fromarray(arr[:, :, 3], "L").filter(
            ImageFilter.GaussianBlur(radius=feather)
        )
        arr[:, :, 3] = np.array(a)

    opaque = arr[:, :, 3] >= 250
    if opaque.any():
        _, (iy, ix) = distance_transform_edt(~opaque, return_indices=True)
        bleed = arr[:, :, 3] < 250
        arr[bleed, 0] = arr[iy[bleed], ix[bleed], 0]
        arr[bleed, 1] = arr[iy[bleed], ix[bleed], 1]
        arr[bleed, 2] = arr[iy[bleed], ix[bleed], 2]

    Image.fromarray(arr, "RGBA").save(dst, format="PNG", optimize=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--only", help="stem of a single file to process")
    parser.add_argument("--model", default="birefnet-general")
    parser.add_argument("--protect", type=int, default=18)
    parser.add_argument("--threshold", type=int, default=20)
    parser.add_argument("--soft-band", type=int, default=12)
    parser.add_argument("--feather", type=float, default=1.0)
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(
        p for p in INPUT_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in INPUT_EXTS
    )
    if args.only:
        sources = [s for s in sources if s.stem == args.only]
        if not sources:
            print(f"no match for --only {args.only!r}")
            return 1

    print(
        f"hybrid: model={args.model} protect={args.protect} "
        f"threshold={args.threshold} soft-band={args.soft_band} "
        f"feather={args.feather}"
    )
    session = new_session(args.model)

    for src in sources:
        dst = OUTPUT_DIR / (src.stem + ".png")
        if dst.exists() and not args.force:
            print(f"skip  {src.name}")
            continue
        print(f"strip {src.name}")
        strip_background(
            src, dst, session,
            protect=args.protect,
            threshold=args.threshold,
            soft_band=args.soft_band,
            feather=args.feather,
        )

    print(f"done. cutouts at {OUTPUT_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
