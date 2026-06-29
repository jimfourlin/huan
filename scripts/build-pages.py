from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ASSETS = ROOT / "lv_assets"
DIST_ASSETS = DIST / "lv_assets"

COPY_ROOT_FILES = [
    "index.html",
    "asset-utils.js",
    "huan-config.js",
    "huan-editor.js",
]

MAX_DIMENSION = 1800
JPEG_QUALITY = 82


def reset_dist() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()


def copy_root_files() -> None:
    for name in COPY_ROOT_FILES:
        shutil.copy2(ROOT / name, DIST / name)


def optimize_image(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.suffix.lower() == ".svg":
        shutil.copy2(source, target)
        return

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)

        if source.suffix.lower() in {".jpg", ".jpeg"}:
            image.convert("RGB").save(target, quality=JPEG_QUALITY, optimize=True, progressive=True)
            return

        image.save(target, optimize=True)


def build_assets() -> None:
    for source in ASSETS.rglob("*"):
        if not source.is_file():
            continue
        relative = source.relative_to(ASSETS)
        target = DIST_ASSETS / relative
        suffix = source.suffix.lower()

        if suffix == ".mp4":
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
            continue
        if suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
            optimize_image(source, target)


def write_pages_files() -> None:
    (DIST / ".nojekyll").write_text("", encoding="utf-8")
    (DIST / "404.html").write_text((DIST / "index.html").read_text(encoding="utf-8"), encoding="utf-8", newline="\n")


def dist_size_mb() -> float:
    total = sum(path.stat().st_size for path in DIST.rglob("*") if path.is_file())
    return total / 1024 / 1024


def main() -> None:
    reset_dist()
    copy_root_files()
    build_assets()
    write_pages_files()
    print(f"Built GitHub Pages site at {DIST}")
    print(f"Dist size: {dist_size_mb():.2f} MB")


if __name__ == "__main__":
    main()
