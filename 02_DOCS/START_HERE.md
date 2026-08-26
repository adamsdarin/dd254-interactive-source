# DD-254 documents — writing stream

Paste this into the project's custom instructions, or open it at the start of a
new conversation.

---

## What this project is for

Writing: the DD-254 handbook, the tool's user manual, the security documents,
the deck, and anything else written for a person to read.

**Not** for changing the tool. See "Where the two streams touch" at the bottom.

## What lives here

| Document | Audience | State |
|---|---|---|
| `DD254_Handbook_DRAFT.md` | FSOs — how DD-254s are meant to work | **Draft, actively being written** |
| `DD254_Interactive_User_Manual.pdf` | People using the tool | Current to v1.9, 24 pages |
| `DD254_Tool_Security_Fact_Sheet.md` | A security reviewer deciding whether to allow the tool in | Current to v154 |
| `rebuild_kit/REBUILD_GUIDE.md` *(in the tool project)* | Same reviewer, doing it themselves | Commands current to v1.9 |
| `DD254_Deck.pdf` / `.pptx` | Briefing an audience on the tool | 12 slides |
| `linkedin_post_dd254_tool.md` | Public post | Two drafts, unused |

The manual is **generated**, not hand-edited: `manual_source/content.py` holds
the content as a list of tuples, `build.py` renders the PDF. Edit the source and
rebuild; never edit the PDF.

## The handbook is the live piece of work

`DD254_Handbook_DRAFT.md` is a first cut assembled from decisions made while
building the tool. It is deliberately opinionated and carries a caveat that
where it differs from 32 CFR Part 117, the form instructions, or a GCA, those
win.

It has two kinds of marked gap:

- **`[THIN]`** — needs the author's material. Currently: the FGI/NATO
  relationship (3.4), and the difference between a box ticked because the
  contract requires it and one ticked because the last form had it (4.4).
- **`[VERIFY]`** — a claim believed but not confirmed against a primary source.
  Currently: valid reasons for a revision (2.3), and the approval-authority
  mapping (3.6). Cut them rather than publish them unchecked.

Six questions for the author sit at the end of the draft. The one that shapes
everything else is **who the reader is** — a new FSO, an experienced one at a
new company, and a contracts person working with FSOs want three different
documents.

## House style, derived from what has been written so far

- **Say the weaknesses yourself.** The security fact sheet has a "What is NOT
  being claimed" section, and it is the reason the rest of it is believed. The
  handbook does the same with its caveat and its marked gaps.
- **Pair every claim with how to check it.** "It makes no network requests" is
  worth little; "and here is the command that returns zero hits" is worth a lot.
- **Separate fact from opinion visibly.** The handbook uses *what the form asks*
  / *what goes wrong* / *Opinion*. Keep the seam obvious.
- **British-ish plain prose.** No exclamation marks, no marketing register, no
  "simply" or "just".
- **Concede the other side's point before making yours.** The deck's security
  section opens by agreeing that blocking a 1.9 MB HTML file is correct
  behaviour. That is what earns the next slide.

## PDF generation gotchas

The manual renders through reportlab with base fonts, which are WinAnsi only.

- **Characters outside Latin-1 render as solid black boxes.** `→` and `↺` have
  both slipped through. Write "then" and "Reset", not arrows and symbols.
- **Check the evaluated strings, not the source.** `content.py` stores `↺`
  as an escape, so grepping the file finds nothing. Import the module and scan
  the rendered strings.
- Rebuild and confirm: page count, no box glyphs, and that the new text is
  actually in the extracted PDF text.

## Where the two streams touch

When the tool changes, these documents go stale. Ask the tool project for the
new numbers rather than guessing:

| What changed | Update |
|---|---|
| User-visible behaviour | User manual (`manual_source/content.py`, then rebuild) |
| Version / size / SHA-256 | Security fact sheet, rebuild guide, rebuild manifest |
| Assertion count | Security fact sheet, rebuild guide |
| Component sizes or shares | Security fact sheet, rebuild guide |

The rebuild manifest is regenerated automatically by the tool project's
`make_build_facts.py`, using `split.py`'s logic. It is never hand-edited.

## Known distribution quirk

Files handed over from this environment sometimes lose the last character of
their extension on Windows — a `.pptx` arrived as `.ppt` and would not open.
Short filenames help; a PDF alongside any Office file is the reliable fallback.
