# HANDOFF — dd254-interactive-source

Last updated: 2026-09-15T14:00-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.7 (Tool 2.135)**, tag at 922ab81 on `main`; assets,
checksums, kit rebuild and both HTML attestations verified; live demo serves the
attested demo bytes. v1.15.7 is a
wording-only correction: the manual credited the revision review clock to DoDI
5220.22; it now cites DD 254 Instructions Item 3b(3), with a note that the GCA's own
biennial review is a separate government duty (DoDM 5220.32 V1 §6.3.g; DoDI 5220.22
cancelled into DoDI 5220.31), and the CO package cites it. Regression 1132/0.

v1.15.6 — roadmap items 2.5 and 2.6. Authority checked first: 32 CFR 117.13(d)(5),
117.15(j), 117.17(c). The roadmap premise "retention clock starts once a Final
exists" was wrong; the two-year clock starts at contract completion. Owner
decisions (2026-09-15): count down to both performance end and end + 2 years at
120/60/30 days; date on the dashboard card only (`popEnd` on the record, never in
the workspace, so never in PDF/XFA, Compare or the revision summary; option-year
extension never suggests a revision); demo seeds an example portfolio when the
dashboard is empty. `dashPopClock`/`dashPopBadge` show on the newest Original or
Revision with no Final in the chain (`dashChainHasFinal`); `dashSetPopEnd` audited;
`dashPopIcs` two events with 120/60/30 alarms; CSV column Performance End.
`demo_seed.html` `seedPortfolio`: twelve "(example)" records dated relative to
today, every status chip populated. Seed writes each record's error/warning counts
(`COUNTS`) and never recounts: a recount drives the live form and raced the CI
smoke test (first verify run failed on the demo). The suite checks the written
counts against a fresh recount, so update `COUNTS` when a rule change moves them.
Also fixed: `dashRenderCards` stage/"Awaiting info" backfills wrote back stale
display copies (lost a smoke-test note when the seed rendered mid-flush); now
`draftPatch` (single IDB transaction).

Earlier v1.15: v1.15.5 SAP-only countersignature, SAP lineage error, dialogs fit
the window, selectable summary baseline; v1.15.4 revision summary and flow-down
fix; v1.15.3 sensitive-terms screen; v1.15.2 SCG library; v1.15.1 received DD 254
→ template language; v1.15.0 card numbers, search, NISS re-confirm.

Verification on the v1.15.6 build: regression 1130 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; demo
dashboard and card control inspected in headless Chrome; demo smoke passed 5 runs
in a row after the fixes. Negative control against v1.15.5: all 1117 earlier tests
pass; 10 of 13 new tests fail (the render test reproduces the lost note), the
other 3 test `demo_seed.html` itself and pass on any build.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.16 contracting-officer readiness horizon (roadmap section 3) when the owner
   starts it; authority wording arrives as approved change notices.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log
2026-09-15 14:00 Claude — Published v1.15.7 per SETUP.md: verify passed on 922ab81,
tag pushed, release workflow passed, release and served demo verified.
2026-09-15 13:30 Claude — Built v1.15.7 on the owner's clarification that the GCA
biennial review (DoD policy) and the Item 3b(3) review of revisions (DD 254
instructions, binding industry with the NISPOM) are different obligations. Cited the
current DoD source found in the library rather than the cancelled instruction.
2026-09-15 12:30 Claude — Published v1.15.6 per SETUP.md. First verify run
(30e11a9) failed the demo smoke test; fixed in 39bacf2 (seed writes counts; render
backfills use draftPatch), verify passed, main fast-forwarded, tag pushed, release
workflow passed, release and served demo verified. Branch `release/v1.15.6` left.
2026-09-15 10:30 Claude — Built and verified v1.15.6. Read 117.13(d)(5),
117.15(j) and 117.17(c) before designing and put the corrected premise to the owner.
Kept the end date off the form so no path can print it or turn an option-year
extension into a revision. First verify run failed on the demo: the
seed's recount reset the form under the smoke test; seed now writes counts and a
test recounts them. Fixed a seed string broken by shell newline expansion and test helpers that
raced a pending autosave.
2026-09-15 01:30 Claude — Published v1.15.5 per SETUP.md: verify passed on
f29e9bc, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.5` left in place.
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
