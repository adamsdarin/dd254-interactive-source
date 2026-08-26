#!/usr/bin/env python3
"""Syntax-check every <script> block in every build.

A syntax error inside one <script> block does not fail loudly in a browser.
The block is discarded, the rest of the page runs, and the tool half-works --
which is worse than not working, because it looks fine. An unterminated
comment has silently killed an entire block in this project before.

The regression suite does not catch this on its own: jsdom drops the broken
block just as a browser does, and the assertions that happen to live in the
surviving blocks still pass.

Exit status 0 if every block parses.
"""
import os, re, sys, glob, tempfile, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOOL = os.path.join(ROOT, "01_TOOL")

# Both the shipped build and the demo. The demo is a separate file that users
# are pointed at first; a broken block in it is a broken first impression.
BUILDS = sorted(glob.glob(os.path.join(TOOL, "DD254_Interactive_v*.HTM")))

BLOCK = re.compile(r'<script\b([^>]*)>(.*?)</script>', re.S | re.I)

failures = 0
if not BUILDS:
    print("no builds found in %s" % TOOL, file=sys.stderr)
    sys.exit(2)

for build in BUILDS:
    src = open(build, encoding="utf-8").read()
    blocks = BLOCK.findall(src)
    name = os.path.basename(build)
    checked = 0
    for i, (attrs, body) in enumerate(blocks, 1):
        # A block with src= has no inline body to check.
        if re.search(r'\bsrc\s*=', attrs, re.I):
            continue
        # Non-JS payloads (templates, JSON) are not JavaScript and must not be
        # fed to the parser.
        m = re.search(r'\btype\s*=\s*["\']?([^"\'\s>]+)', attrs, re.I)
        stype = (m.group(1).lower() if m else "text/javascript")
        if stype not in ("", "text/javascript", "application/javascript", "module"):
            continue
        if not body.strip():
            continue
        ext = ".mjs" if stype == "module" else ".js"
        with tempfile.NamedTemporaryFile("w", suffix=ext, delete=False,
                                         encoding="utf-8") as fh:
            fh.write(body)
            path = fh.name
        try:
            r = subprocess.run(["node", "--check", path],
                               capture_output=True, text=True)
            checked += 1
            if r.returncode != 0:
                failures += 1
                print("FAIL %s block %d (%s)" % (name, i, stype))
                print(r.stderr.strip()[:2000])
        finally:
            os.unlink(path)
    print("%-44s %2d block(s) checked" % (name, checked))

print("")
print("RESULT: %s" % ("all blocks parse" if failures == 0
                      else "%d block(s) failed to parse" % failures))
sys.exit(1 if failures else 0)
