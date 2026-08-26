#!/usr/bin/env python3
"""Verify that representative values reached a generated flattened DD-254."""

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
    missing = [value for value in sys.argv[2:] if value not in text]
    if missing:
        print("missing extracted PDF text: " + repr(missing), file=sys.stderr)
        return 1

    print(f"PDF content verified: {len(reader.pages)} pages, {len(sys.argv) - 2} values")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
