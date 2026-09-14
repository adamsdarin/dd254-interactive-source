# Codex Astra v1.15.4 — revision summary in Item 13

14 September 2026. Internal Tool v2.132. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| What changed in a Revision | Only in the separate Compare report | A plain-language summary at the top of Item 13, kept current until edited by hand |
| Revision whose only change is POC information | No finding | Warning citing the DD Form 254 instructions |
| Revision raising Item 1a or 1b | Blocked by a subcontract flow-down error against its own Original | No flow-down finding between issuances of the same contract |

## Why

The DD Form 254 instructions for Item 3b say a revision is issued when classification
guidance, security requirements or the facility location change, and that it is
incorporated into the contract by modification. They set no format for describing
the change; Item 13 is where anything that might be unclear is explained. Items 16d,
16f, 17a and 17g say not to revise for POC information alone.

The owner chose a summary kept up to date until edited by hand, with short values
inline, and a warning for POC-only revisions. While building it, a spawned Revision
raising Item 1a was found to be blocked: the flow-down ceiling treated the
Revision's own Original as a prime contract. Every parent the dashboard creates is
an earlier issuance of the same contract, and the owner chose to fix it here.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. Run against the v1.15.3 build, every earlier test still passed there and all 23 new tests failed.

- A spawned Revision gets one summary on first open; field, box, long-text and
  Item 13 section changes produce the expected lines in form order; Item 3
  bookkeeping is not listed.
- Hand edits are kept; Redraft replaces them; Remove restores the rest of Item 13
  byte-for-byte, with and without a supported-effort line, and nothing re-adds it.
- Typing in Item 13 is not interrupted; read-only tabs never write; the summary
  survives save and reopen; the next Revision or a Final drops the old one.
- POC-only changes warn and clear when another change is made; Originals get no
  summary. A Revision raising Items 1a and 1b has no flow-down finding and no card
  chip, while a non-issuance parent still gets the ceiling error.

Limits: the summary is generated wording to review before issuing, not a legal
determination; recounts do not run it; values shown are those already on the form.
