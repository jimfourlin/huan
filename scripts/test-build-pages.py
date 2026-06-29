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
    assert_exists("lv_assets/kaiping-opening-poster.jpg")
    assert_not_exists("node/node.exe")

    html = (DIST / "index.html").read_text(encoding="utf-8")
    assert "<video" in html, "Pages build should keep homepage videos"
    assert "lv_assets/hero-carousel.mp4" in html
    assert "lv_assets/kaiping-opening.mp4" in html
    assert 'poster="lv_assets/kaiping-opening-poster.jpg"' in html

    for video in ["lv_assets/hero-carousel.mp4", "lv_assets/kaiping-opening.mp4"]:
        video_path = DIST / video
        size_mb = video_path.stat().st_size / 1024 / 1024
        assert 1 < size_mb < 100, f"{video} is not a deployable MP4 size: {size_mb:.2f} MB"
        data = video_path.read_bytes()
        header = data[:32]
        assert b"ftyp" in header, f"{video} is not an MP4 file"
        assert 0 <= data.find(b"moov") < data.find(b"mdat"), f"{video} is not faststart optimized"

    size_mb = sum(path.stat().st_size for path in DIST.rglob("*") if path.is_file()) / 1024 / 1024
    assert size_mb < 1000, f"Pages build exceeds GitHub Pages limit: {size_mb:.2f} MB"

    print("scripts/test-build-pages.py passed")


if __name__ == "__main__":
    main()
