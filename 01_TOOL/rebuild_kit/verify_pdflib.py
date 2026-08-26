#!/usr/bin/env python3
"""Prove the embedded pdf-lib block is the unmodified published release.

The single largest blob in the shipped file is a third-party library. A
reviewer's first question about it is not "does it work" but "is this really
pdf-lib, or is it pdf-lib plus something." A hash we publish about our own
copy cannot answer that: it establishes that the file was not altered after we
built it, which is a different claim and a much weaker one.

This script answers the real question, by reducing it to a comparison against
a file the reviewer fetches themselves from npm. The expected value below is
upstream's, not ours.

    npm pack pdf-lib@1.17.1 && tar xzf pdf-lib-1.17.1.tgz
    sha256sum package/dist/pdf-lib.min.js

Exit status is the result: 0 identical, 1 mismatch, 2 could not check.
"""
import io, os, re, sys, json, hashlib, tempfile, importlib.util

# Upstream pdf-lib@1.17.1, dist/pdf-lib.min.js, as published to npm.
#
# This is the one hard-coded hash in the project that is deliberately NOT
# derived from our own build -- deriving it from what we ship would make the
# check circular and worthless. It changes only when the library is upgraded,
# and upgrading without changing it is meant to fail loudly here.
UPSTREAM_SHA256 = "0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f"
UPSTREAM_BYTES = 525099
UPSTREAM_VERSION = "1.17.1"

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.dirname(HERE)


def _load_split():
    """Load split.py as a module rather than reimplementing its extraction.

    split.py owns the rule for which file is "the build" and the rule for
    cutting the library block out of it. A second copy of either rule here
    would be a second source of truth about the same bytes -- the defect shape
    that has produced every significant bug in this project, including a
    manifest that sat three versions stale while reporting a mismatch on the
    genuine file.

    Bytecode is suppressed because rebuild_kit/ is handed to security
    reviewers as a self-contained directory. It should hold only the files a
    reviewer is asked to read; generated artefacts sitting in it invite the
    question of what else is generated.
    """
    saved = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        spec = importlib.util.spec_from_file_location(
            "dd254_split", os.path.join(HERE, "split.py"))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return mod
    finally:
        sys.dont_write_bytecode = saved


def normalise(block):
    """Reduce the embedded block to what upstream published.

    Two differences separate the embedded copy from dist/pdf-lib.min.js, both
    introduced by this project and neither touching the library:

      1. A header comment carrying the MIT attribution. MIT requires the
         notice travel with the code, and the tool ships as one file with
         nowhere else to put it.
      2. Whitespace at the block's edges, from sitting inside a <script>
         element rather than being a file.

    Removing exactly those two and nothing else is what makes the comparison
    meaningful. The function deliberately does not strip anything else: if
    some third difference appears, the hash must fail rather than be massaged
    into passing.
    """
    m = re.match(r'\s*/\*.*?\*/', block, re.S)
    body = block[m.end():] if m else block
    return body.strip() + "\n"


def main(argv):
    split = _load_split()

    build = argv[1] if len(argv) > 1 else None
    if build is None:
        try:
            build = split.newest_build(TOOL)
        except SystemExit as exc:
            print("cannot locate a build: %s" % exc, file=sys.stderr)
            return 2
    if not os.path.exists(build):
        print("build not found: %s" % build, file=sys.stderr)
        return 2

    # Run the real splitter into a throwaway directory. Slower than a private
    # regex would be, and correct for the same reason it is slower: there is
    # only one extraction rule and this is it.
    with tempfile.TemporaryDirectory() as tmp:
        split.split(build, tmp)
        block = io.open(os.path.join(tmp, "01_pdflib.js"), encoding="utf-8").read()

    payload = normalise(block).encode("utf-8")
    got = hashlib.sha256(payload).hexdigest()
    ok = (got == UPSTREAM_SHA256)

    print("build            : %s" % os.path.basename(build))
    print("embedded block   : %d chars" % len(block))
    print("after normalising: %d bytes (upstream: %d)" % (len(payload), UPSTREAM_BYTES))
    print("sha256 embedded  : %s" % got)
    print("sha256 upstream  : %s" % UPSTREAM_SHA256)
    print("RESULT           : %s" % (
        "byte-identical to pdf-lib@%s dist/pdf-lib.min.js" % UPSTREAM_VERSION
        if ok else "MISMATCH"))

    if not ok:
        print("", file=sys.stderr)
        print("Before treating this as tampering, check the ordinary cause:", file=sys.stderr)
        print("the library was upgraded and UPSTREAM_SHA256 in this script was", file=sys.stderr)
        print("not updated with it. 01_TOOL/CHANGELOG.md will say. Confirm the", file=sys.stderr)
        print("expected value for yourself:", file=sys.stderr)
        print("  npm pack pdf-lib@%s && tar xzf pdf-lib-%s.tgz" % (UPSTREAM_VERSION, UPSTREAM_VERSION), file=sys.stderr)
        print("  sha256sum package/dist/pdf-lib.min.js", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
