#!/usr/bin/env python3
"""Record every post image's dimensions and a tiny blurred preview.

Writes assets/images/manifest.json, read by the post renderer so each image
reserves its exact aspect ratio (no layout shift) and shows a blur-up
placeholder while the full file loads. Rerun after adding or replacing
images in posts/.

    python3 tools/build_image_manifest.py
"""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/images/manifest.json"
IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)\s\"]+)")

refs = set()
for md in (ROOT / "posts").rglob("*.md"):
    refs.update(IMG_RE.findall(md.read_text(encoding="utf-8")))

manifest = {}
for rel in sorted(refs):
    path = ROOT / rel
    if not path.is_file():
        print(f"missing: {rel}", file=sys.stderr)
        continue
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)  # phone photos carry rotation in EXIF
        w, h = im.size
        thumb = im.convert("RGB")
        thumb.thumbnail((24, 24))
        buf = io.BytesIO()
        thumb.save(buf, "JPEG", quality=40, optimize=True)
    manifest[rel] = {
        "w": w,
        "h": h,
        "lqip": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii"),
    }

OUT.write_text(json.dumps(manifest, separators=(",", ":")), encoding="utf-8")
print(f"{len(manifest)} images -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
