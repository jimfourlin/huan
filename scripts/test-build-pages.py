from pathlib import Path
import shutil
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


def run_build() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build-pages.py")], check=True, cwd=ROOT)


def assert_exists(relative: str) -> None:
    assert (DIST / relative).exists(), f"Missing {relative}"


def assert_not_exists(relative: str) -> None:
    assert not (DIST / relative).exists(), f"Unexpected {relative}"


def main() -> None:
    run_build()

    assert_exists("index.html")
    assert_exists("404.html")
    assert_exists(".nojekyll")
    assert_exists("huan-config.js")
    assert_exists("lv_assets/hero.jpg")
    assert_exists("lv_assets/hero-carousel.mp4")
    assert_exists("lv_assets/kaiping-opening.mp4")
    assert_not_exists("node/node.exe")

    html = (DIST / "index.html").read_text(encoding="utf-8")
    assert "<video" in html, "Pages build should keep homepage videos"
    assert "lv_assets/hero-carousel.mp4" in html
    assert "lv_assets/kaiping-opening.mp4" in html

    for video in ["lv_assets/hero-carousel.mp4", "lv_assets/kaiping-opening.mp4"]:
        size_mb = (DIST / video).stat().st_size / 1024 / 1024
        assert size_mb < 80, f"{video} is too large for Pages: {size_mb:.2f} MB"

    size_mb = sum(path.stat().st_size for path in DIST.rglob("*") if path.is_file()) / 1024 / 1024
    assert size_mb < 1000, f"Pages build exceeds GitHub Pages limit: {size_mb:.2f} MB"

    print("scripts/test-build-pages.py passed")


if __name__ == "__main__":
    main()
