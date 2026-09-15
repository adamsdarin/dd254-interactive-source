# HANDOFF — dd254-interactive-source

Last updated: 2026-09-15T01:00-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.4 (Tool 2.132)**, tag at d478e28. **v1.15.5 (Tool
2.133) is built and verified on branch `release/v1.15.5`, being published.**
Owner chose separate, fully verified point releases for the v1.15 horizon.

v1.15.5 — corrective release. Authorities checked in the approved library: DoDM
5205.07 (2025-01-17) section 10.1.d "Subcontractor DD Form 254s must be signed by the
subcontractor"; the DD Form 254 instructions require only the certifying official's
Item 17 signature. Owner decisions: countersignature badge on SAP subcontracts only
(`dashSapSub`: SAP flag with 2b or 7a), on every issuance; a contract is SAP or
non-SAP for life, so a spawned issuance whose SAP flag differs from its parent is a
blocking error (`sapLineageIssue`); Item 17 help text corrected; worksheet uses the
2b-or-7a definition. `dashParentContext` now feeds both dashOpen and recount, so
recounts count parent-dependent findings. From owner testing: `.ui-modal-box` capped
at window height with a scrolling message (the Item 13 missing-language review was
stuck off screen); Redraft can pick the summary baseline from the issuance chain
(`rsumChain`, stored `rsumBaseId`, `rsumLoadBase`); POC-only warning keeps using the
spawned-from parent.

Earlier v1.15: v1.15.4 revision summary in Item 13 and flow-down fix; v1.15.3
sensitive-terms screen; v1.15.2 SCG reference library; v1.15.1 received DD Form 254
→ DD-254 Template Language only; v1.15.0 card numbers, search in any order, NISS
re-confirm on spawn.

Verification on the v1.15.5 build: regression 1117 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; the
five-section language review dialog measured in headless Chrome (fits the window,
buttons visible, Cancel closes). Negative control against v1.15.4: all 1100 earlier
tests pass; 13 of 17 new tests fail, the other 4 guard kept behaviour.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.15.6 — unprinted period-of-performance end date with Final-due prompt, and
   a demonstration portfolio seed.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log
2026-09-15 01:00 Claude — Built and verified v1.15.5. Reproduced the badge on a
prime-contract Revision in jsdom, read DoDM 5205.07 10.1.d and the DD 254
instructions, and asked the owner before changing it. Owner testing mid-release
found the stuck language-review dialog (fixed in CSS for every modal) and asked for a
selectable summary baseline; confirmed in real Chrome that typed and inserted Item 13
changes were already detected, so the report was a baseline expectation, not a
detection bug.
2026-09-14 23:55 Claude — Published v1.15.4 per SETUP.md: verify passed on
d478e28, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.4` left in place.
2026-09-14 23:30 Claude — Built and verified v1.15.4 (revision summary). Proposed
the summary on first open rather than writing it at spawn, so the exact-text match
is computed from the same live form it is later compared with. Compared printed
fields only. Found and, with owner approval, fixed the flow-down ceiling blocking
revisions. Made Remove an exact inverse after a test caught leading blank lines.
2026-09-14 22:10 Claude — Published v1.15.3 per SETUP.md: verify passed on
5050413, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.3` left in place.
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
