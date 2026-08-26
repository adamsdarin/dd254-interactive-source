from pathlib import Path

root = Path(__file__).parent / "01_TOOL"
official = root / "DD254_Interactive_v1.9.HTM"
previous_demo = root / "DD254_Interactive_v189_DEMO.HTM"
output = root / "DD254_Interactive_v1.9_DEMO.HTM"

official_bytes = official.read_bytes()
demo_bytes = previous_demo.read_bytes()
marker = "/* ── DEMONSTRATION BUILD ─".encode("utf-8")
marker_at = demo_bytes.index(marker)
suffix_at = demo_bytes.rfind(b"<script>", 0, marker_at)
if suffix_at < 0:
    raise SystemExit("demo training block not found")

output.write_bytes(official_bytes + demo_bytes[suffix_at:])
print(f"wrote {output.name}: {len(official_bytes):,} official bytes + {len(demo_bytes) - suffix_at:,} demo-only bytes")
