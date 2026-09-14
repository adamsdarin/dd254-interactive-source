# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T23:30-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.3 (Tool 2.131)**, tag at 5050413. **v1.15.4 (Tool
2.132) is built and verified on branch `release/v1.15.4`, being published.**
Owner chose separate, fully verified point releases for the v1.15 horizon.

v1.15.4 — roadmap item 2.4, revision summary in Item 13. DD 254 instructions in
the approved library checked first: they set no revision-annotation format (Item
3b), and 16d/16f/17a/17g say not to revise for POC changes alone. Owner decisions:
kept up to date until hand-edited, short values inline, warn on POC-only revisions,
and fix flow-down in this release. A spawned Revision carries `rsumPending`; first
open writes the region below the supported-effort line from the live form versus
the cached parent (`rsumText`, printed fields only). Identified by exact text
(`RSUM_LAST`), rewritten at the top of run(), deferred while Item 13 has focus;
Redraft/Remove above Item 13; Remove is the exact inverse. Next Revision or a Final
strips the inherited summary.

Flow-down fix: every parentId the tool creates is an earlier issuance of the same
contract (`dashParentIsIssuance`), so `flowIssuesLive` and the card chip no longer
run between them; previously a Revision raising Item 1a/1b was blocked. Recount now
restores the open draft's cached parent.

Earlier v1.15: v1.15.3 sensitive-terms screen; v1.15.2 SCG reference library;
v1.15.1 received DD Form 254 → DD-254 Template Language only; v1.15.0 card numbers,
search in any order, NISS re-confirm on spawn.

Verification on the v1.15.4 build: regression 1100 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; summary and
bar inspected in headless Chrome. Negative control against v1.15.3: all 1077
earlier tests pass, all 23 new tests fail.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.15.5 — unprinted period-of-performance end date with Final-due prompt, and
   a demonstration portfolio seed.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".
- The dashboard shows the subcontractor countersignature badge on every spawned
  child (`r.parentId||_sapSub`), the same lineage-as-subcontract assumption fixed
  for flow-down in v1.15.4. Not changed; needs an owner decision.

## Log
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
