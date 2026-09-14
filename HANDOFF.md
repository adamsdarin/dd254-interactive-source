# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T21:40-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.2 (Tool 2.130)**, tag at 744f1b4. **v1.15.3 (Tool
2.131) is built and verified on branch `release/v1.15.3`, being published.**
Owner chose separate, fully verified point releases for the v1.15 horizon.

v1.15.3 — roadmap item 2.3, sensitive-terms screen. Owner decisions: stored as
fingerprints (not readable), warning only, Items 9 and 13. Local storage key
`dd254_sensitive_terms_v1` holds a random salt and salted SHA-256 fingerprints of
normalised 1-5 word terms; never in Full Backup, packs or exports; audit records
counts only; removal is by re-typing. Warnings name the item, never the term
(warnings reach the worksheet and dashboard counts); the phrase shows only in an
on-screen note hidden by the print stylesheet. Hashing is async, so run() reports
the last scan and schedules a rescan on change; recount skips the screen.

Earlier v1.15: v1.15.2 SCG reference library; v1.15.1 received DD Form 254 →
DD-254 Template Language only; v1.15.0 card numbers, search in any order, NISS
re-confirm on spawn.

Verification on the v1.15.3 build: regression 1077 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; dialog,
warning and note inspected in headless Chrome. Negative control against v1.15.2:
all 1061 earlier tests pass, all 16 new tests fail.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.15.4 — revision summary managed region in Item 13 (check DD 254
   instructions in the approved library for revision annotation first).
3. v1.15.5 — unprinted period-of-performance end date with Final-due prompt, and
   a demonstration portfolio seed.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log
2026-09-14 21:40 Claude — Built and verified v1.15.3 (sensitive-terms screen).
Kept the term out of warning text because warnings are copied into the worksheet
and counts; put the phrase in an unprinted on-screen note instead. Excluded the
list from backups so fingerprints never leave the browser. Guarded a new test
setup line after the negative control crashed on it.

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
