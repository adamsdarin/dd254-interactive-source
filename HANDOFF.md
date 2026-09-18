# HANDOFF — dd254-interactive-source

Last updated: 2026-09-18T19:00-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v2.0.2 (Tool 2.139)**, signed tag at 50780a3 on `main`; assets,
checksums, kit rebuild (byte-identical) and both HTML attestations verified from a
fresh download; live demo (dd254-interactive 65d0f7e) serves the attested demo bytes.
v2.0.1 (Tool 2.138) published the same day (tag at 277179a, demo bbabb53). Commit and tag signing
use the Windows OpenSSH agent: if it is stopped, `git commit`/`git tag` hang on a
hidden passphrase prompt (2026-09-18) — the owner starts it; never type a passphrase.

v2.0.2 — owner requests 2026-09-18. SCG entries take an optional `contracts` array
of DD-254 Template Language `ioId`s (`scgLinkHtml`, `scgLink`, `scgUnlink`);
`scgRenderPanel` lists guides linked to the open draft's contract first, marked
(`scgDraftContracts`: applied template label or Item 2a vs template primeContract,
normalised). Citing unchanged. Setting `reasonsOptional` (localStorage
`dd254_reasons_optional`, default Required): when Optional, `dismissAdd`,
`dashHoldPrompt`, `dashCancelPrompt` accept blank and store `REASON_NONE`; audit
detail adds "(reasons optional in Settings)"; switching logs `setting-changed`. NISS
initials stay required (owner did not select them). Regression section 105.

v2.0.1 — Item 3 on spawned issuances (owner report). Both exports now print 3a's
date for 3a/3b/3c (previously only when 3a was marked, so Revision/Final PDFs had an
empty 3a). `run()` on 3b/3c: 3a required and must equal `DD254_PARENT.origin.date`
(digits); 3b revision number required, `/^[1-9]\d*$/`. `dashIssuanceOrigin(rec)`
walks stored parents to the Original/Solicitation; attached in `dashOpen` and
`dashRecountDrafts`. `dashSpawn`: rev/final copy 3a from `dashIssuanceStartIn`; rev
number = max(highest non-cancelled rev number in the same issuance, branch depth)+1;
orig clears 3a. Owner decisions: blocking error (not a locked field), numbering per
issuance, highest+1, clear 3a on award Original. Regression section 104.

v2.0.0 — roadmap 4.3. `fullRestore` only reads the file; `fullRestoreData(data)`
keeps the count/sha256 gate, then plans every library with `tplPackPlan` and shows
`tplPackPreview({mode:'restore'})` (resolves `{picked}` or `{replaceAll}`; pack mode
still resolves an array). Merge applies `tplPackApply` to ticked libraries: nothing
removed. Replace-all: confirm, then `fullBackup()` must return true, then per-list
undo copy. Audit `full-restore` detail starts `merge:` or `replace-all:`. Fixed a
shipped bug: `tplPackApply` stored its undo copy as a bare array while `tplIoUndo`
reads `{ts,data}`, so Undo after a colleague import emptied the library;
`tplIoUndo` now also accepts a bare array and refuses unreadable copies. Fixed
`PACK_LABEL.scg` missing ("undefined"). Regression section is **103** (a section
titled "102. Notes and backup snapshot custody" already exists — section numbers
are not unique by position, so splice by title). Four `String(fullRestore)`
assertions also read `fullRestoreData`.

Verification on the v2.0.0 build: regression 1147 PASS / 0 FAIL; all SETUP step-6
checks and both browser smokes pass; restore dialog screenshotted in headless
Chrome. Negative control on v1.16.0: 6 new tests throw (no `fullRestoreData`), both
Undo tests and the pack-label test fail; earlier tests pass (portfolio export timing
test failed once, passed on rerun; manual-source test needs ../02_DOCS).

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
2. v1.16 closed as planned (owner, 2026-09-15): 3.1 shipped in v1.16.0; 3.3
   (signer readiness, non-XFA investigation) dropped; 3.4 (NCCS view) out of scope;
   3.5 (generated rule catalog, authority baseline date) skipped. Do not build them
   without a new owner decision. v2.0 (owner, 2026-09-15): selected 4.1, 4.3, 4.4;
   then skipped 4.1 (headless Chrome on file:// reports persisted=false and refuses
   persist()). 4.3 is v2.0.0. **Next: 4.4 approval package** — Section 508 ACR from
   an actual audit, CycloneDX SBOM, two-page ISSM brief. 4.2 encrypted backup and
   4.5 hosting were not selected.
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
2026-09-18 19:00 Claude — Published v2.0.2 per SETUP.md: verify passed on 50780a3,
main fast-forwarded, signed tag pushed, release workflow passed, release and served
demo verified. Branches `release/v2.0.1` and `release/v2.0.2` left.
2026-09-18 18:30 Claude — Published v2.0.1 per SETUP.md once the owner started the
SSH agent: tag pushed, release workflow passed, release and served demo verified.
2026-09-18 17:30 Claude — Built and verified v2.0.2 (SCG-contract links; optional
reasons). Asked the owner which contract list, what a link does, which prompts and
what to log; chose the DD-254 Template Language entries, surfacing without auto-cite,
set-aside/Blocked/Cancel, and "No reason given" in the audit log with the setting
change logged. v2.0.1 release blocked on tag signing (ssh-agent stopped).
2026-09-15 21:00 Claude — Built and verified v2.0.1 from the owner's Item 3 report.
Read the DD 254 Instructions (Items 3a, 3b, 3c) first: the stored draft already kept
3a, but the exports dropped it on Revisions and Finals and nothing enforced it or the
revision number. Asked four design questions; the owner chose a blocking error over a
locked field. Compared 3a against the issuance's Original rather than the direct
parent so an edited intermediate Revision cannot become the rule.
2026-09-15 19:30 Claude — Published v2.0.0 per SETUP.md: verify passed on 27a35e0,
main fast-forwarded, signed tag pushed (tags must be annotated: `git tag -m`), release
workflow passed, release and served demo verified. Branch `release/v2.0.0` left.
Trimmed log entries from 2026-09-14 and earlier (in git history).
2026-09-15 19:00 Claude — Built and verified v2.0.0 (4.3 merge on restore). Reused
the colleague-import planner rather than a second merge rule, kept replace-all behind
a completed backup, and took the major version because restore's effect on existing
data changed. The new Undo test exposed a shipped bug (Undo after a colleague import
emptied the library); fixed in the same release. The Custodian corrected the
library's mislabelled "DD 254 January 2026.pdf" by a `historical` metadata decision
(effective 1999-12) in release dd254-dec1999-lifecycle-fix-20260915; its title and
filename still await an owner decision in the Archivist handoff.
2026-09-15 18:00 Claude — Owner skipped roadmap 3.5 after seeing the rule survey
(31 alerts carry authorities; ~59 error/warning sites and 5 helper sources mostly do
not). Library mislabel handed to the Custodian through a background agent.
2026-09-15 17:30 Claude — Owner dropped roadmap 3.3 before any code. Findings kept
for the record only: the April 2018 form is XFA-only with Reader Extensions (UR3);
the tool's export removes UR3 on rewrite; the library's "DD 254 January 2026.pdf"
(FOCI, active) is byte-for-byte the size of the expired December 1999 edition and
titled December 1999 — a Custodian labelling question, not a tool change.
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
