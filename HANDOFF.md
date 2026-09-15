# HANDOFF — dd254-interactive-source

Last updated: 2026-09-15T17:00-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.16.0 (Tool 2.136)**, tag at 664cf3d on `main`; assets,
checksums, kit rebuild and both HTML attestations verified; live demo serves the
attested demo bytes.

v1.16.0 — roadmap 3.1, first v1.16 release. `exportCOPrep` split into
`coPackageModel(audience)` + `coPackageHtml` + `coPackagePdfBytes`/`coPackagePdf`;
menu opens `coPackageExport` (auto from 2b/7a via `coPackageAudienceAuto`, four
choices view/PDF x gov/prime). Line audience follows the actor its own text names;
no action wording changed. Gov-only: GCA biennial review (DoDM 5220.32 V1 6.3.g),
SOLICITATION, clause applicability review. Prime-only: SUBCONTRACT lines, SAP
subcontract signature, SAP/IR&D subcontract notices, flow-down ceiling and section,
17e, 18b warning, 7a/7b summary row. PDF: marking top/bottom, identity line, release,
generated date, page n of N on every page; audit `co-package-exported`. Two existing
tests re-pointed deliberately (5205.07 gate scan now includes package functions and
accepts `sapSub`; stylesheet test reads `coPackageHtml`).

v1.15.7 (published 922ab81): biennial review attribution — manual 3.14 cites DD 254
Instructions Item 3b(3) for the revision clock; GCA's own review is DoDM 5220.32 V1
§6.3.g (DoDI 5220.22 cancelled into DoDI 5220.31); CO package cites it.

v1.15.x summary: v1.15.6 Final-due prompt (`popEnd`, card-only) and demo portfolio
(seed writes `COUNTS`, never recounts; `draftPatch` render backfills); v1.15.5 SAP-only
countersignature, SAP lineage error, dialogs fit window, selectable summary baseline;
v1.15.4 revision summary and flow-down fix; v1.15.3 sensitive terms; v1.15.2 SCG
library; v1.15.1 received DD 254 → template; v1.15.0 card numbers, search, NISS.

Verification on the v1.16.0 build: regression 1138 PASS / 0 FAIL; all SETUP step-6
checks pass; live browser smoke passes for official and demo (demo three runs);
both PDFs read back with pypdf and rasterised with pdftoppm for inspection. Negative
control against v1.15.7: all earlier tests pass (the manual-source test cannot find
../02_DOCS from a scratch directory, an environment limit); all 6 new tests fail.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.16 (owner, 2026-09-15): 3.1 done in v1.16.0 -> next 3.3 signer readiness
   sheet and non-XFA go/no-go -> 3.5 generated rule catalog with "authority
   baseline as of" date. 3.4 NCCS view dropped.
3. 3.2 CMMC prompts wait for source text: missing_source requests filed as
   guidance_watch in ../workflow_requests.py (Librarian): 9868ef03f16a6bc5f0aed7d7
   DFARS 252.204-7021, 4788a4859333a8dc85cc9962 DFARS 252.204-7025,
   0a720c5dc61ea11c75f3071d 32 CFR Part 170. URLs verified (acquisition.gov pages
   by title; Part 170 hierarchy from the eCFR structure API). CMMC rollout phase
   still needs Guidance Watch review. Build only after an approved library release.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log
2026-09-15 17:00 Claude — Published v1.16.0 per SETUP.md: verify passed on 664cf3d,
tag pushed, release workflow passed, release and served demo verified.
2026-09-15 16:30 Claude — Built and verified v1.16.0 (3.1). Filed three verified
missing_source requests for CMMC text (acquisition.gov pages by title; Part 170 via
the eCFR structure API, since eCFR pages bot-block fetches). Split the CO package
by the actor each line names rather than rewording anything; kept one model for the
view and the PDF so they cannot drift.
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
