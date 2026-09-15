# Codex Astra v2.0.1 — Item 3 on Revisions and Finals

15 September 2026. Internal Tool v2.138. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Item 3a on a Revision or Final PDF | Empty: the date printed only when 3a was marked | The Original's date prints in 3a, with the revision or final date |
| A missing or changed 3a on a Revision or Final | Not checked | Blocking error; must match the Original's date |
| Revision number | Free text, not required by validation | Required whole number, 1, 2, 3 |
| Two Revisions spawned from one Original | Both numbered 1 | The next unused number |
| Revisions of an award that followed a solicitation revision | Counted on from the solicitation's | Start at 1 |
| Original spawned from a Solicitation | Kept the solicitation's 3a date | 3a empty for the award's own date |

## Why

The owner reported that a Revision spawned from an Original or a Revision should
carry the original date in 3a and require 3b with sequential numbers. The DD Form 254
Instructions (April 2018, updated 20250711) say the same: 3a's date "will not change
and will continue to show on any subsequent revisions", each revision gets "a
sequential number", and a Final enters the original date in 3a. The stored draft
already kept 3a, but neither export printed it on a Revision or Final and nothing
enforced it, so the issued form lost the date the instructions require.

The owner chose a blocking error over locking the field, restarting numbers for each
issuance, the highest non-cancelled number plus one, and clearing 3a on an award
Original, whose date the instructions say may differ from the solicitation's.

## Verification and limits

The regression log for this exact build is in `TEST_RESULT.txt`; counts and hashes
are in `BUILD_FACTS.md`. Twelve new tests cover spawning through the dashboard, the
open-form and recount findings, both exports read back (the XFA data and the
flattened PDF text) and the worksheet.

Run against the v2.0.0 build, every earlier test still passed and ten of the twelve
new tests failed there. The two that passed describe behaviour v2.0.0 already had: a
first Revision kept the Original's 3a in the stored draft, and a Revision with no
chain raised no comparison error.

- A Revision of the Original is 1 and of Revision 1 is 2, each with the Original's
  3a even after an intermediate Revision's 3a was edited; a sibling takes 3, and a
  cancelled 3 is reused; a Final keeps 3a.
- An award Original spawned from a Solicitation has an empty 3a and its first
  Revision is 1 despite a solicitation Revision numbered 1.
- On an open Revision, an empty 3a and a different date each block; the same date in
  another format does not. Revision numbers "", A, 1.5, 0, 02 and -1 block; 3 does
  not. A Final with no 3a blocks, and a recount counts a changed date.
- A Revision with no chain is not compared; an Original is unaffected.

Limits: the comparison needs the Original in this browser's dashboard; a Revision
imported or started on its own is checked for a present, well-formed 3a and revision
number only. Numbering covers Revisions in this dashboard; a revision issued outside
the tool is not known to it.
