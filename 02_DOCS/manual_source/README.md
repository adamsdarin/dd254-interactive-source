# User manual source

The manual is generated, not hand-edited. To change it:

1. Edit `content.py` — a list of `(kind, value)` pairs.
   Kinds: `h1` `h2` `h3` (headings), `p` (paragraph), `n` (numbered item),
   `b` (bullet), `warn` (red callout), `note` (amber callout),
   `tbl` (list of rows; first row is the header, 2 or 3 columns).
   Inline markup: `<b>`, `<i>`, `<br/>`, `<font face='Courier'>`.
2. Rebuild:

       pip install reportlab
       python3 build.py

   It writes `DD254_User_Manual.pdf` beside the scripts. Copy that file unchanged to
   `../DD254_Interactive_User_Manual.pdf`, then run
   `python .github/scripts/check_documentation.py` from the repository root.
   Render and visually review the pages before releasing.

## Rules that matter

- **Every release that changes the HTML updates this source and rebuilds both
  published PDF copies.** The manual version must match the official build;
  never postpone the update to a later documents pass.
- **No characters outside WinAnsi.** Helvetica has no glyph for arrows, so
  `→` renders as a black box. Write "Templates, then Full Backup" instead.
  After building, check: any character above U+2122 in the extracted text is
  a problem.
- Numbered lists restart at each `h1`.
- Sections flow continuously; a thin rule separates them. Headings carry
  `keepWithNext` so they cannot strand at the foot of a page.

## Verify before shipping

Grep the tool for every control the manual names. The last pass checked 48
named controls, confirmed no stale assertions remained, and confirmed the new
material was present. A manual that describes a button which does not exist is
worse than no manual — that happened once already with "Save this facility".
