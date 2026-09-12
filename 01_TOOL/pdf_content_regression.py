#!/usr/bin/env python3
"""Verify that representative values reached a generated flattened DD-254.

A value given as "Nx:VALUE" asserts an exact occurrence count instead of
presence, so a rule about NOT repeating something can be tested.
"""

from pathlib import Path
import sys

from pypdf import PdfReader


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: pdf_content_regression.py PDF EXPECTED [EXPECTED ...]", file=sys.stderr)
        return 2

    pdf_path = Path(sys.argv[1])
    # Byte production alone missed field-mapping failures; extraction checks the
    # artifact a recipient receives instead of trusting the in-memory data packet.
    reader = PdfReader(str(pdf_path))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    # A value may be written "Nx:VALUE" to assert an exact number of
    # occurrences rather than mere presence. Presence alone cannot express
    # "this address is printed once", which is the whole point of the Item 7 /
    # Item 8 duplicate rule: a bare containment check passes just as happily
    # when the address is printed twice.
    missing = []
    miscounted = []
    for value in sys.argv[2:]:
        head, sep, rest = value.partition(":")
        if sep and head.endswith("x") and head[:-1].isdigit():
            want = int(head[:-1])
            got = text.count(rest)
            if got != want:
                miscounted.append(f"{rest!r} expected {want}x, found {got}x")
        elif value not in text:
            missing.append(value)

    if missing or miscounted:
        if missing:
            print("missing extracted PDF text: " + repr(missing), file=sys.stderr)
        for problem in miscounted:
            print("wrong occurrence count: " + problem, file=sys.stderr)
        return 1

    print(f"PDF content verified: {len(reader.pages)} pages, {len(sys.argv) - 2} values")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
