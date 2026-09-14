# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T20:50-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.2 (Tool 2.130)**, tag at 744f1b4 on `main`; assets,
checksums, kit rebuild and both attestations verified from a fresh download; the
live demo (`dd254-interactive` 4505abc) serves the attested demo bytes. Owner
chose separate, fully verified point releases for the v1.15 horizon.

v1.15.2 — roadmap item 2.2, Security Classification Guides library (`TPL_SCG`,
kind `scg`): unclassified title, identifier, date, issuing office, distribution
statement, delivery. Cite adds one fixed-shape citation line to Item 13 above the
managed tail (`scgCitation`, `scgInsert`); citations are recognised from Item 13
text only (`scgMatch`: whole identifier, or whole title when no identifier). A
changed library date raises a warning (never an error) and Update citation
rewrites that guide's lines keeping portions (`scgFindings`, `scgUpdate`). Cited
guides are named in the attachment reminder and distribution dialog. Library is in
Full Backup, packs and the spreadsheet round trip. Citation content checked against
the DD Form 254 Instructions in the approved library (Item 13 SCG listing and
attach/separate cover; Item 11c unclassified titles).

Earlier v1.15: v1.15.1 received DD Form 254 → DD-254 Template Language only;
v1.15.0 card numbers, search in any order, NISS re-confirm on spawn.

Verification on the v1.15.2 build: regression 1061 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; library page,
citation, stale warning and panel inspected in headless Chrome. Negative control
against v1.15.1: earlier tests pass except the six count tests changed on purpose
(nine libraries, eight spreadsheet libraries, twelve panel sections); 16 of 17 new
tests fail.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.15.3 — sensitive-terms screen for Items 9 and 13 (local list, warning only,
   excluded from exports by default).
3. v1.15.4 — revision summary managed region in Item 13 (check DD 254
   instructions in the approved library for revision annotation first).
4. v1.15.5 — unprinted period-of-performance end date with Final-due prompt, and
   a demonstration portfolio seed.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log

2026-09-14 20:50 Claude — Published v1.15.2 per SETUP.md: verify passed on
744f1b4, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.2` left in place.
2026-09-14 20:10 Claude — Built and verified v1.15.2 (SCG reference library).
Chose text-derived citations over a stored list (one source of truth), exact
identifier/title matching after spotting SCG-1 vs SCG-10, and a warning rather
than an error because the date check is library consistency, not a rule. Reused
dark-theme-mapped colours after the theme tests caught two unmapped ones.
2026-09-14 18:20 Claude — Published v1.15.1; release and served demo verified.
2026-09-14 17:40 Claude — Built and verified v1.15.1 (received DD Form 254 →
DD-254 Template Language only).
2026-09-14 15:10 Claude — Published v1.15.0; release and served demo verified.
2026-09-14 14:30 Claude — Built and verified v1.15.0 (dashboard numbers, search in
any order, NISS re-confirmation on spawn).
2026-09-14 08:30 Claude — Published v1.14.1; owner ruled NCCS out of scope;
committed the SETUP.md kit-repack note; deleted merged branches.
2026-09-14 07:40 Claude — Implemented and verified the v1.14.1 trust patch.
2026-09-13 Claude — FSO/CO roadmap review of v1.14.0 published as a private
artifact.
