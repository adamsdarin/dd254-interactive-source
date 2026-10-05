# HANDOFF archive — dd254-interactive-source

Moved verbatim from HANDOFF.md on 2026-09-19 (size cap). Newest first.

## Initial template-storage draft checkpoint — 2026-10-02

2026-10-02 Maintainer — Prepared the requested template-storage draft in the
current layout. Program/search, entry position, child creation and duplicate
feedback were browser-verified. Source-strip choice pending; application unchanged.

## Architecture review checkpoint — 2026-10-02

2026-10-02 Maintainer — Reviewed future architecture at the owner's request.
Recommend a modular application core, record-level indexed storage, explicit
contract/source/workflow entities and an optional shared API/database edition.
Recommendation only; no architecture migration or application change authorized.

## Handoff before completed v2.3.0 — 2026-10-02

# HANDOFF — dd254-interactive-source

Last updated: 2026-10-02T07:08-05:00 by Maintainer

## Current State

Owner approved the prime/order/source draft for implementation on 2 October.
v2.3.0 (Tool 2.145) is in progress. Orders are separate identities under a prime;
each links to one shared immutable received-source version. The current editable
rows sit inside collapsible prime groups, with source review and order paging.
Orders may be listed before an outgoing workflow exists, as in the approved draft.
Focused checks pass for source reuse, duplicate order prevention, saved history,
workflow creation/reopen, read-only storage, paging and large duplicate scans.
The full regression suite is running. Demo, documentation and release gates
remain to complete. Previous versioned builds and production are preserved.

Owner approved implementation of the four scoped changes on 1 October 2026.
**v2.2.0 (Tool 2.144)** is built and verified locally; it is not published.
The existing dashboard/template rows are preserved, with the approved compact
prime/order/grouping toolbar and inline duplicate warning/comparison.

- Performance-location and subcontractor FSOs plus requestor on To; facility
  FSOs, CSOs, selected security/program managers, additional FSOs and checked
  Item 18f addresses on CC. Manager selections travel with draft snapshots.
- Item 18 saves current language as a named template without leaving the form.
  Source dates are converted from form YYYYMMDD to repository YYYY-MM-DD.
- Whole-template application clears represented blank fields, false checks and
  empty radios, including old Item 18f contacts. Absent legacy sections remain.
- Contract/order search, optional grouping and duplicate-only filtering use
  the existing rows. Matching ignores names/IDs, compares applied language too,
  and distinguishes shared wording and same-source conflicts. No automatic
  merge/deletion; reviewed copies remain reviewed through reorder.

1217 regression assertions pass. Official and demo pass native browser
checks, including the new controls and date conversion. Script syntax, demo
parity, documentation labels, manifest, byte-identical rebuild and pdf-lib
provenance gates pass. Manual updated and changed pages visually checked.
Official SHA-256: `71dba9b7c0bcac3ef3d4bd545ce22f540a0d753f99165be9f454f8976fe9f5cc`.

The prior uncommitted v2.1.2 (Tool 2.143) candidate and its versioned demo remain
preserved. v2.2.0 includes those attachment/document-marking fixes. Earlier
published files and the live demo repository were not edited.

Latest published release remains **v2.1.1 (Tool 2.142)**, signed tag at 0db06bc
on main; live demo commit 189bdbd. Publication, when requested, follows SETUP.md:
exact-commit public verify, signed tag, release asset/checksum/attestation checks,
then byte-exact demo replacement and served-hash verification.

Do not name development assistants or tools in this public repository's prose,
commits, tags or release notes. Sign this file Maintainer. Commit/tag signing
uses the owner's Windows OpenSSH agent; a stopped agent hangs on a hidden
passphrase prompt. Never type a passphrase.

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

2026-10-02 Maintainer — Implemented the approved order/source model in the
v2.3.0 candidate. Nineteen focused behavioral checks pass; the full suite and
release documentation are in progress. No publication or production change.

2026-10-02 Maintainer — Prepared the prime/order/source design draft within
the current repository layout. Browser checks cover source selection,
example workflow language, duplicate-order prevention, paging and narrow
layout. v2.2.0 and production remain unchanged.

2026-10-02 Maintainer — Scoped prime/order/source relationships: the current
standalone flag incorrectly doubles as order identity during template capture.
Proposed explicit source links and revision history; linked orders are not
duplicate templates. v2.2.0 build and production remain unchanged.

2026-10-01 Maintainer — Built the owner-approved v2.2.0 recipient and template
workflow changes within the existing design. All local release gates pass;
publication and the production demo are unchanged. Prior state moved verbatim
to HANDOFF-archive.md.


## Release detail (Current State, v2.0.2 and earlier)

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


## Log entries (2026-09-15 and earlier)
2026-09-15 21:00 Maintainer — Built and verified v2.0.1 from the owner's Item 3 report.
Read the DD 254 Instructions (Items 3a, 3b, 3c) first: the stored draft already kept
3a, but the exports dropped it on Revisions and Finals and nothing enforced it or the
revision number. Asked four design questions; the owner chose a blocking error over a
locked field. Compared 3a against the issuance's Original rather than the direct
parent so an edited intermediate Revision cannot become the rule.
2026-09-15 19:30 Maintainer — Published v2.0.0 per SETUP.md: verify passed on 27a35e0,
main fast-forwarded, signed tag pushed (tags must be annotated: `git tag -m`), release
workflow passed, release and served demo verified. Branch `release/v2.0.0` left.
Trimmed log entries from 2026-09-14 and earlier (in git history).
2026-09-15 19:00 Maintainer — Built and verified v2.0.0 (4.3 merge on restore). Reused
the colleague-import planner rather than a second merge rule, kept replace-all behind
a completed backup, and took the major version because restore's effect on existing
data changed. The new Undo test exposed a shipped bug (Undo after a colleague import
emptied the library); fixed in the same release. The Custodian corrected the
library's mislabelled "DD 254 January 2026.pdf" by a `historical` metadata decision
(effective 1999-12) in release dd254-dec1999-lifecycle-fix-20260915; its title and
filename still await an owner decision in the Archivist handoff.
2026-09-15 18:00 Maintainer — Owner skipped roadmap 3.5 after seeing the rule survey
(31 alerts carry authorities; ~59 error/warning sites and 5 helper sources mostly do
not). Library mislabel handed to the Custodian through a background agent.
2026-09-15 17:30 Maintainer — Owner dropped roadmap 3.3 before any code. Findings kept
for the record only: the April 2018 form is XFA-only with Reader Extensions (UR3);
the tool's export removes UR3 on rewrite; the library's "DD 254 January 2026.pdf"
(FOCI, active) is byte-for-byte the size of the expired December 1999 edition and
titled December 1999 — a Custodian labelling question, not a tool change.
2026-09-15 17:00 Maintainer — Published v1.16.0 per SETUP.md: verify passed on 664cf3d,
tag pushed, release workflow passed, release and served demo verified.
2026-09-15 16:30 Maintainer — Built and verified v1.16.0 (3.1). Filed three verified
missing_source requests for CMMC text (acquisition.gov pages by title; Part 170 via
the eCFR structure API, since eCFR pages bot-block fetches). Split the CO package
by the actor each line names rather than rewording anything; kept one model for the
view and the PDF so they cannot drift.
2026-09-15 14:00 Maintainer — Published v1.15.7 per SETUP.md: verify passed on 922ab81,
tag pushed, release workflow passed, release and served demo verified.
2026-09-15 13:30 Maintainer — Built v1.15.7 on the owner's clarification that the GCA
biennial review (DoD policy) and the Item 3b(3) review of revisions (DD 254
instructions, binding industry with the NISPOM) are different obligations. Cited the
current DoD source found in the library rather than the cancelled instruction.
2026-09-15 12:30 Maintainer — Published v1.15.6 per SETUP.md. First verify run
(30e11a9) failed the demo smoke test; fixed in 39bacf2 (seed writes counts; render
backfills use draftPatch), verify passed, main fast-forwarded, tag pushed, release
workflow passed, release and served demo verified. Branch `release/v1.15.6` left.
2026-09-15 10:30 Maintainer — Built and verified v1.15.6. Read 117.13(d)(5),
117.15(j) and 117.17(c) before designing and put the corrected premise to the owner.
Kept the end date off the form so no path can print it or turn an option-year
extension into a revision. First verify run failed on the demo: the
seed's recount reset the form under the smoke test; seed now writes counts and a
test recounts them. Fixed a seed string broken by shell newline expansion and test helpers that
raced a pending autosave.
2026-09-15 01:30 Maintainer — Published v1.15.5 per SETUP.md: verify passed on
f29e9bc, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.5` left in place.
2026-09-15 01:00 Maintainer — Built and verified v1.15.5. Reproduced the badge on a
prime-contract Revision in jsdom, read DoDM 5205.07 10.1.d and the DD 254
instructions, and asked the owner before changing it. Owner testing mid-release
found the stuck language-review dialog (fixed in CSS for every modal) and asked for a
selectable summary baseline; confirmed in real Chrome that typed and inserted Item 13
changes were already detected, so the report was a baseline expectation, not a
detection bug.

## Log archived 2026-10-01

2026-09-18 21:00 Maintainer — Published v2.0.3 per SETUP.md: verify passed on 4f27459,
main fast-forwarded, signed tag pushed, release workflow passed, release, assets and
served demo verified and scanned clean; v1.11.0/v1.12.0 release titles and notes edited.
2026-09-18 20:30 Maintainer — Built and verified v2.0.3 (product name only). Owner chose
to scrub current files and editable release notes, neutral handoff wording, and to
leave history and attested builds untouched.
2026-09-18 19:00 Maintainer — Published v2.0.2 per SETUP.md: verify passed on 50780a3,
main fast-forwarded, signed tag pushed, release workflow passed, release and served
demo verified. Branches `release/v2.0.1` and `release/v2.0.2` left.
2026-09-18 18:30 Maintainer — Published v2.0.1 per SETUP.md once the owner started the
SSH agent: tag pushed, release workflow passed, release and served demo verified.
2026-09-18 17:30 Maintainer — Built and verified v2.0.2 (SCG-contract links; optional
reasons). Asked the owner which contract list, what a link does, which prompts and
what to log; chose the DD-254 Template Language entries, surfacing without auto-cite,
set-aside/Blocked/Cancel, and "No reason given" in the audit log with the setting
change logged. v2.0.1 release blocked on tag signing (ssh-agent stopped).


## State before v2.2.0 implementation - 1 October 2026

# HANDOFF — dd254-interactive-source

Last updated: 2026-10-01T18:25-05:00 by Maintainer

## Current State

Scope review 2026-10-01: recipient CC/manager selection, in-form saving, exact blank-field replacement, and contract/order grouping with duplicate detection are proposed. No product edits; existing v2.1.2 candidate preserved. Owner correction: performance-location FSOs go on To. Owner rejected redesigned repository layouts. Revised draft preserves the actual dashboard/editor rows and buttons, adding one contract/order/grouping filter row and inline duplicate flags/comparison; original order stays the default. Implementation awaits review.

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v2.1.1 (Tool 2.142)**, signed tag at 0db06bc on `main`; assets,
checksums and both HTML attestations verified from a fresh download (official
658a7cd3…, demo ed845d8c…, attestation ref refs/tags/v2.1.1); live demo published
as dd254-interactive 189bdbd. The fact-sheet label check added in v2.1.0 held:
this release's sheet named v2.1.1/2.142 on the published asset, unprompted.
Release titles and notes of v1.11.0 and v1.12.0 were rewritten without the codename.

v2.1.1 — owner report 2026-09-23: the v2.1.0 link reached Item 17 only inside
`applyFacTplFromSearch`, so a draft that was opened, typed by hand or spawned as
a Revision or Final never passed through it and Item 17 stayed blank — the case
the feature was asked for. Item 17 is now also read back from the CAGE in Item 6b
(`facCertSync`, from `dashOpen` and a `change` listener wired once at load), with
an exact CAGE match rather than the filter's prefix match.

Filling only the empty Item 17 fields was built first and rejected on the
evidence: a preparer who had typed another name into 17a was handed the facility
official's title and telephone number beside it, which is two people in one
certification block. `certFillBlank17` acts only when every Item 17 field is
empty. The explicit apply path is unchanged and still replaces Item 17 outright.
1186 regression assertions pass (seven new); both builds pass native Chrome. The
whole-file `Block 17` check caught the wording in a new source comment — the
form's term is Item, and that rule applies to comments too.

v2.1.0 — owner request 2026-09-22: a Facility template can name the certifying
official who signs Item 17 for it; applying that facility fills 17a, 17b, 17c,
17e, 17f and 17g alongside Item 6, and a facility with no official linked leaves
Item 17 untouched. Stored as `certLabel`/`certSnap`, the shape the 6c CSO link
already used, so no storage format change. Published: signed tag v2.1.0 at
227acbd on `main`; assets, checksums and both HTML attestations verified from a
fresh download (official 9b71313a…, demo b83e7c3f…, attestation ref
refs/tags/v2.1.0). 1179 regression assertions pass (six new), both builds pass
native Chrome (new `facCertLinkOk`). Negative controls run against v2.0.3: no
dropdown, no column, Item 17 left empty.

Two things this release had to work around. The owner pushed 830268f to `main`
(codename removed from archived builds) while the release branch was open, so
the branch was rebased onto it and `verify` re-run on the rebased commit before
the fast-forward — a pushed branch is not a private one. And the security fact
sheet shipped labelled v2.0.3/2.140: no check read that line, which is how
v1.13.0 shipped one labelled v1.12.0. The asset was replaced and SHA256SUMS.txt
regenerated (attested HTML untouched), and `check_documentation.py` now derives
RELEASE_VERSION and TOOL_VERSION from the build and fails if the sheet does not
name both — confirmed by restoring the stale label.

The manual also stopped claiming the Item 17 dropdown fills “all seven fields”:
17d AAC is not held in a Certifier template, so it fills six.

v2.0.3 — owner request 2026-09-18: the product carries only its own name. Release
label, title, header and review-package release line read "DD254 Interactive vX";
docs, release assessments, `check_manifest.py`, `browser_smoke.js` and the suite
use it. This file is signed "Maintainer". Do not name development tools or
assistants in this public repository, its commits, tags or release notes. The
stored draft key `astra` (v1.11-v1.13 legacy material) is data and stays. Archived
builds, their release assets and git history were left unchanged (owner choice). Commit and tag signing
use the Windows OpenSSH agent: if it is stopped, `git commit`/`git tag` hang on a
hidden passphrase prompt (2026-09-18) — the owner starts it; never type a passphrase.

Detail for v2.0.2 and earlier releases, and log entries from 2026-09-15 and before,
moved verbatim to HANDOFF-archive.md on 2026-09-19 to keep this file under 100 lines.

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
2026-10-01 Maintainer — Replaced both redesign concepts at owner request with a draft derived from the current demo markup/styles. Filtering, optional grouping and inline duplicate comparison verified; no product edits.
2026-10-01 Maintainer — Presented interactive sample designs for repository grouping, searching, duplicate comparison and save-time warnings. Scope correction: performance-location FSOs on To; facility FSOs and assigned managers on CC. Implementation awaits review.
2026-10-01 Maintainer — Synthetic checks on v2.1.1/v2.1.2 confirmed stale blank fields, FSO on To/manager omitted, contract/order search and capture gaps, and differently named copies added by pack import. Earlier log moved to archive.

2026-10-02 Maintainer — Restricted draft Add template to prime contracts.
Verified newest-first prime creation and editable order templates spawned under
their matching Block 2A prime. Draft only; application remains unchanged.

2026-10-02 Maintainer — Revised the draft with explicit prime/own DD254 choices.
Verified both creation modes, source selection and preserved own-template edits.
Task-order-specific templates retain the prime editor layout; no application edit.

2026-10-02 Maintainer — Completed the approved v2.3.0 prime/order/source build
within the existing layout. All local release checks pass. Manual and build
facts match; previous candidates and production remain preserved. Earlier
handoff state moved verbatim to HANDOFF-archive.md.

## Superseded working state - 2 October 2026

## Current State

Owner approved draft option 1 for implementation in the existing tool layout.
v2.4.0 (Tool 2.146) is being built locally: prime-only Add template, full editable
order templates beneath matching Block 2A primes, explicit prime/own coverage,
program filtering, continuous scrolling and newest-first prime creation.
Duplicate scans now use prime/order identity only. Verification is in progress.

Owner approved the existing-layout prime/order/source draft on 2 October 2026.
**v2.3.0 (Tool 2.145)** is built and verified locally; it is not published.
Prime groups retain the existing editable template rows. Each Task Order, BPA
or Delivery Order is a separate identity under its prime and may be listed
before an outgoing DD254 workflow exists.

- Each order explicitly selects a received prime source, an order-specific
  source, or needs review. Many orders share one immutable source version.
- Changed, removed or newer sources prompt review before a new workflow starts.
  Existing workflows retain saved source language, attachment requirements,
  manager and marking. Whole-template insertion retains linked order identity.
- Start DD254 creates an Original; Open DD254 reopens the existing linked draft.
  Received source choice and the outgoing order-specific checkbox are separate.
- Search, source filters, collapsible prime groups and paging support large
  libraries. Duplicate prime/number identities are refused; duplicate source
  comparisons use representative links and keep every matching copy flagged.
- Legacy order-specific metadata migrates idempotently. Full Backup, packs and
  language JSON preserve order records and immutable versions. Order import
  defaults off in shared packs; CSV continues to export source rows only.

The prior v2.2.0 recipient, Item 18 template save and blank-replacement changes
remain: performance/sub FSOs and requestor on To; facility FSOs, CSOs and
selected managers on CC. Whole-template insertion clears represented blanks.

All 1239 regression assertions pass against the exact build. Official and demo
pass native-browser checks. Script syntax, demo parity, documentation, manifest,
byte-identical rebuild and pdf-lib provenance gates pass. The 37-page manual is
updated; changed pages and the actual repository layout were visually reviewed.
The new controls/order rows wrap at 768px; the existing wide source-editor and
toolbar layout still requires horizontal scrolling at that width.
Official SHA-256:
`0963695b0c6e6eb108d90a86cd02a04896dbcfca0b0882cc13b224cfa9e9b0a6`.

Prior uncommitted v2.1.2 and v2.2.0 candidates and their demos are preserved.
The v2.2.0 official hash is unchanged. The live demo checkout is clean.
No commit, tag, push, release publication or production change was made.

Latest published release remains **v2.1.1 (Tool 2.142)**, signed tag at 0db06bc
on main; live demo commit 189bdbd. Publication, when requested, follows SETUP.md:
exact-commit public verify, signed tag, release asset/checksum/attestation checks,
then byte-exact demo replacement and served-hash verification.

Do not name development assistants or tools in this public repository's prose,
commits, tags or release notes. Sign this file Maintainer. Commit/tag signing
uses the owner's Windows OpenSSH agent; a stopped agent hangs on a hidden
passphrase prompt. Never type a passphrase.

## 2026-10-02 - prior v2.4.0 state and creation-only correction checkpoint

## Current State

Owner correction in progress: coverage is chosen only when creating an order.
The v2.4.1 candidate removes saved-order switching buttons and prevents source
review from changing existing coverage. Tests and release checks are pending.

Owner-approved draft option 1 is built as **v2.4.0 (Tool 2.146)** and verified
locally. It retains the existing tool layout. The candidate is not published.

- Main Add template creates prime contracts only; new entries appear first.
- Add task order beneath a prime creates a Task Order, BPA or Delivery Order
  with inherited Block 2A. Own-order templates use the same complete editable
  row and block editor as primes. Prime coverage keeps a compact reference.
- Explicit prime/own buttons retain saved own-template edits when switching.
  Source versions and existing workflows remain immutable; changed, removed or
  newer sources require review before creating another outgoing workflow.
- Program is an independent repository field, with a filter and CSV column.
  Contract/order search and view-only newest/contract/program sorting remain.
- All matching groups and entries scroll continuously. There are no pages or
  display caps. Full block editors load on demand. Filtered groups can collapse.
- Duplicate warnings use normalized prime/order identity only. Shared wording
  across different contracts is allowed. Inline Compare and reviewed-copy
  decisions remain; legitimate prime-following references are not duplicates.
- The extra source dropdown/View source strip is removed. Saved-source review
  is available when needed with readable DD254 item names.

The v2.3 separate order/source store, idempotent migration, frozen workflow
provenance and JSON/backup/import paths remain. The v2.2 recipient, Item 18
template save and blank-replacement behavior is retained: performance/sub FSOs
and requestor on To; facility FSOs, CSOs and selected managers on CC.

All **1,260 regression assertions** pass against the exact candidate. Official
and demo pass native-browser checks. Syntax, demo parity, documentation,
manifest, byte-identical reconstruction and pdf-lib provenance gates pass.
The 37-page manual is updated; changed/adjacent pages and actual repository
interactions were visually reviewed. At 768px the new rows and controls wrap;
the existing narrow toolbar still needs horizontal scrolling.
Official SHA-256:
`08892c857a7f81fc7ee684f082a2740d09f21e202187a554c0cdb7a82e89c562`.

Prior uncommitted v2.1.2, v2.2.0 and v2.3.0 candidates and demos are preserved.
The v2.2.0 and v2.3.0 official hashes are unchanged; live demo checkout is clean.
No commit, tag, push, publication or production change was made.
Latest published release remains **v2.1.1 (Tool 2.142)**. Publication, when
requested, follows SETUP.md and its exact-commit release checks.

Do not name development assistants or tools in this public repository's prose.
Sign this file Maintainer. Signing uses the owner's Windows OpenSSH agent;
a stopped agent hangs on a hidden passphrase prompt. Never type a passphrase.


## Log

2026-10-02 Maintainer — Created v2.4.1 for creation-only DD254 coverage.
Saved selections and source history are retained; verification pending.

2026-10-02 Maintainer — Completed approved option 1 as v2.4.0. All 1,260
assertions and release gates pass. Prime/own switching, full editable children,
program navigation, continuous scrolling and filtered collapse were verified.
The manual and build facts match; prior candidates and production are preserved.
Earlier working state moved verbatim to HANDOFF-archive.md.
