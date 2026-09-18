# DD-254 Interactive — regression suite

The suite prints its current assertion count at the end. `BUILD_FACTS.md` takes
that count only from a recorded successful run, never by counting declarations.

## Running it

Use Node.js 24 or newer. From the repository root, install the locked test-only dependencies with `npm ci --ignore-scripts` and install `pypdf` in your Python environment. Copy the current official build (selected by `.github/scripts/newest_build.py`) to `01_TOOL/dd254.htm`, then run `node dd254_regression.js` from `01_TOOL`.

The harness prints the exact build SHA-256. Save the complete successful output to `01_TOOL/TEST_RESULT.txt` before regenerating build facts. It times out a stuck asynchronous assertion with its name.

The PDF-content assertion invokes `pdf_content_regression.py`. Set
`DD254_PYTHON` to the Python executable that has `pypdf` when `python` (Windows)
or `python3` (macOS/Linux) is not the right interpreter.

Then drive the versioned file in a real browser:

    node browser_smoke.js DD254_Interactive_vNNN.HTM

Exit code 0 means everything passed; 1 means at least one assertion failed, and
the failing names are listed at the end.

## Drafting tools coverage

The real-browser smoke test drives the drafting tools — Item 8 site reuse,
unfinished-prompt selection, combined Item 13 insertion and validation jump — as
well as settings, exports, signing, Block 18f, issuance safety and backup. Run it
against both the official and generated demo files.

## What it covers

| Section | Area |
|---|---|
| 1  | Block 18 and required attachments in the DD-254 Template Language entry |
| 2  | Stable template ids — reorder / delete safety, legacy positional refs |
| 3  | Full Backup SHA-256 integrity and count verification |
| 4  | Flow-down ceiling: 1a, 1b and Items 10/11, error vs warning split |
| 5  | CSV classification markings and importer tolerance |
| 6  | Single-tab lock, read-only guards, take-over |
| 7  | Dashboard search, portfolio capability export, card border, CAGE line |
| 8  | Holds — required reason, badges, resolve, Issued challenge |
| 9  | Distribution capture at issuance, prepared e-mail recipients and the log |
| 10 | Dialog attachment reminder and the CUI encryption warning |
| 11 | FSO e-mail fields on Items 6, 7 and 8 |
| 12 | Facility and Performance/Sub templates carrying the e-mail |
| 13 | Confirm-the-details warnings under 7a and 8a |
| 14 | Spawn clears parent events / carries context; Copy unchanged |
| 15 | To-do ICS date, dead-code removal, XFA export, core validation |
| 16 | Classified mailing addresses and the Item 13 trailing block |
| 17 | E-mail harvesting — apostrophes, one address one appearance |
| 18 | CSO linking on save, address in the Perf/Sub template |
| 19 | Item 12 warnings and Q1/Q2 numbering |
| 20 | Skipped and Cancelled statuses, chip filtering, export |
| 21 | Item 13 cross-reference scanning and template layout |
| 22 | Items 1–5: levels, contract numbers, form type, Final |
| 23 | Items 6–9: parties, performance locations, description |
| 24 | Item 10 access requirements and their interactions |
| 25 | Item 11 performance requirements and the exclusion matrix |
| 26 | Items 12–15 |
| 27 | Items 16–18, including the browser/PDF boundary for 17h and 17i |
| 28 | Wizard navigation and every validation panel section |
| 29 | All eight template libraries: CRUD, linking, filter, CSV, undo |
| 30 | Draft lifecycle, full backup round trip, audit log |
| 31 | Exports: dynamic official XFA PDF, internal legacy static builder, worksheet, CO package, notes report |
| 32 | CSO block layout in both internal PDF builders; no positional reads of the perf block |
| 33 | Spawn override, audit log in the backup, template-row undo, recount |
| 34 | Real file uploads, validation-log hashing, manager rollup, 60-draft portfolio |
| 35 | SAP flag gating every DoDM 5205.07 rule |
| 36 | Matching content across the internal static builder and dynamic export, with the signing date left to the PDF |
| 37 | Required-field enforcement |
| 38 | Item 18a contractor-FSO prefill |
| 39 | Contract-number slashes in filenames |
| 40–41 | Whole-form Contract Type templates and applying them |
| 42–47 | Dashboard markings, classifications, approval holds and workflow reset |
| 48–52 | Certifier and Standard Language libraries, solicitations, packs and export selection |
| 53–57 | Settings registry, form layout, dark theme, backup threshold and owner name |
| 58–61 | Supported-effort head line, CUI tail and shared Item 13 regions |
| 62–63 | Limited dissemination controls and distribution statements |
| 64 | Configurable export filename |
| 65–67 | Item 13 sections, template save and side-panel behavior |
| 68 | Separate Live Validation and Checklist scrollers |
| 69 | Durable chain of custody and backup history |
| 70–71 | Item-reference parsing and per-finding dismissals |
| 72 | CSV formula-injection defense and lossless apostrophe round trips |
| 73 | Template save truth, transaction failure and recovery-journal replay |
| 74 | Standalone task-order composition in Block 2a |
| 75 | Safe validation DOM rendering and the sole dynamic official export |
| 76 | Task-order templates |
| 77–81 | Bulk performance locations, editor layout, scalable workspace and live stylesheets |
| 82–84c | Audit cleanup, safe viewer rendering, Manage/guidance search, bulk selection, card menus and tile clicks |
| 87 | Cleared compliance holds remain cleared |
| 88 | Nonblocking Item 10/11 advisors |
| 89 | Conditional-alert authority references |
| 90 | v195 custody, audience isolation, CUI derivation, backup confirmation and revision-report safeguards |
| Additional v1.10.0 cases | Rapid notes on separate drafts, redraw preservation, immediate backup, later-edit reminders, emergency recovery and unreadable-store refusal |

## Findings from the full sweep — both now fixed

The full-tool sweep turned up two defects in behaviour that predated this work.
Both are fixed, and both have tests pinning the fix.

- **A Final DD-254 could never validate clean.** The Item 3c disposition rule
  fired on the form type alone and never inspected Item 13, so it could not be
  cleared — every Final stayed in Draft with a DRAFT-watermarked PDF. It now
  checks Item 13 for disposition language (disposition / dispose of / destroy /
  return to / retain / retention). The shipped Item 5 template satisfies it;
  unrelated Item 13 text does not.
- **Block 17 had no spreadsheet support.** `TPL_IO` had no `cert` entry, so
  certifying officials were the one list that could not be bulk-loaded or
  exported. It now has the same CSV/XLSX round trip as the other six, with
  columns for 17a name, 17b title, 17c address, 17e CAGE, 17f phone and
  17g e-mail. The buttons render automatically because they key off `TPL_IO`.

## Notes for whoever maintains this

- Assertions run in order and share one JSDOM instance. Several sections seed
  drafts and wipe them again; if you add a section, wipe after yourself.
- `dashRenderCards()` is async. Await it before reading the DOM, or you will
  write a test that passes for the wrong reason.
- Three capability column headers contain commas. Parse exported CSV with the
  tool's own `ioCsvParse`, never `split(',')`.
- `dashTplEdit()` flushes the live editor buffer into the previous library when
  you switch. Call the `SEED()` helper before seeding a store directly, or the
  flush will undo it.
- The template search box hides rows with `display:none` rather than removing
  them, and `data-lbl` is lowercased. Assert on the style, not on innerHTML.
- Never index a performance block by field position. Use the `PB()` helper (or
  the tool's own `perfFields`/`perfVals`) and the classes `.loc-8a`, `.cage-8b`,
  `.cso-8c`, `.fso-8`, `.cma-loc`. Ten call sites once indexed this block by
  position, so every added field silently repointed all of them.
- If you stub a global (the CSV importer section stubs `dashTplEdit`), restore
  it before the section ends. A leaked stub caused a false failure once already.
- Section 6 puts the tab into read-only mode and takes the lock back at the end.
  Anything added after it that writes will fail if that take-over is removed.
- The retired static builder remains under internal regression because it is a
  shipped rebuild-kit component. Its content test writes a short-lived PDF,
  then asks `pypdf` to extract representative values from Blocks 2a, 6a and 13.
  The user-facing dynamic XFA route separately has both packet-mapping and
  actual-PDF construction assertions.
- `browser_smoke.js` launches installed Chrome or Edge with a temporary
  profile. It clicks the real Item 10f tile, proves the Settings and Item 13
  remove/undo paths, checks validation text cannot create markup, confirms a
  template through durable readback, exercises checked and unchecked Block 18f,
  verifies bulk audience separation and CUI subject handling, and confirms that
  the dynamic XFA button is the only user-facing official PDF route.

The v1.12.0 completion tests exercise performance-site reuse and manual-edit preservation, direct field navigation, inline error clearing, combined Item 13 insertion, cancellation and stale-preview guards, and unfinished prompt selection. Native Chrome exercises the visible controls in both builds.

The v1.13.0 tests separate the form's own CUI marking from the contract's CUI
requirements and assert that a record which merely involves CUI is neither
badged, audience-split nor given a `(CUI)` subject; that the SAP flag raises the
subcontractor-signature requirement from Item 2b or Item 7a and names no block
on the form; that Item 13 states a shared Item 7/8 classified mailing address
once and reports a genuine disagreement; that only a Final arms each two-year
retention clock and neither is the Item 3b(3) biennial review; and that the
preparer's worksheet labels every box the way the form does. The PDF oracle now
accepts `Nx:VALUE` to assert an exact occurrence count, because a containment
check passes just as happily when an address is printed twice. Native Chrome
additionally proves the Items 16/17 asterisks are present and non-blocking; that
check previously resolved labels with `closest()`, which returns null for those
fields and made it true whatever the markup said.

The v1.14.0 tests cover the removal of the Source & Validation Log and the
Optional supporting records panel: neither is on the page; a draft saved by an
earlier version with both a log and supporting records — including a records
schema the old validator would have rejected — still opens, and saving writes
neither back. The Final-form retention guidance those records carried keeps its
tests: ordinary and SAP wording keep their different scope, and a SAP Final with
written program direction does not demand an extended-retention answer. The
removed features' own tests went with them.

The v1.14.1 tests were run against the v1.14.0 build they correct: 18 of 19
fail there, and the one that passes (no repeat notice once a draft is saved)
guards behaviour v1.14.0 already had. They check that the header's release name
renders from `RELEASE_VERSION` and agrees with the title and every literal
release string; that the worksheet and CO Package read the Item 14 and 15 titles
from the form; that the CO Package has no signature lines and recognises a SAP
subcontract from Item 7a; and that every citation in `demo_seed.html` is on the
verified list. Earlier-version drafts are driven through `dashOpen`: Cancel,
export, a declined download confirmation and opening without export, plus the
three-way dialog's focus and Escape. The automatic recount is checked for
unchanged status and workspace, running once, skipping read-only tabs and an open
draft, stamp-only writes not counting as backup changes (counted at their source,
because earlier sections leave `BK_UNLOADING` set), and not overwriting a record
changed while it runs. `check_manifest.py` separately fails a build whose
filename, `RELEASE_VERSION`, title and release strings disagree, and
`browser_smoke.js` compares the rendered header with the filename.

The v1.15.0 tests (section 93) render cards for a prime, a subcontract, a
solicitation and a record without Item 2 text and read the labelled numbers back,
including escaping. Search is driven through the real dashboard filter with terms
in both orders, a missing term, a hyphen-free contract number, quoted phrases in
and out of order, a stray quote and a guard that punctuation-free matching never
joins separate words. NISS re-confirmation is checked for every spawn path, for the
card badge and its tooltip, for clearing on re-verification with its audit entry,
and for a child of an unverified record. The section 14 spawn test that asserted
inherited NISS verification was changed deliberately to assert the reset.

The v1.15.1 tests (section 94) build received-form fixtures in the page realm from
the official form and the tool's own dynamic export, including a Flate-compressed
datasets stream and a single XDP stream, and parse the government's blank form's
own data packet. The import is driven with a real File through the preview: one
DD-254 Template Language entry, correct mapping and source, no draft or Contract
Type entry, no Item 9 or 17 text, a matching audit SHA-256, and a usable template.
Refusals are checked for a flattened PDF, a non-PDF, a SECRET marking, cancel and a
read-only tab. Fixtures pass XML to pdf-lib as a string because the harness's
Node TextEncoder returns arrays pdf-lib does not recognise across realms.

The v1.15.2 tests (section 95) cover the Security Classification Guides library:
its key, menu entry, editor row and unclassified-title note; the citation format;
insertion after the preparer's text and above the CUI block; duplicate refusal;
panel states; the date-change warning and that it is never an error; Update
citation keeping portions; whole-identifier and whole-title matching; unknown
guides; named attachments on the live form and stored drafts; spreadsheet
normalisation; escaping of hostile titles; and read-only refusal. The library-count
tests in sections 29, 51 and the panel split were changed deliberately to nine
libraries, eight spreadsheet libraries and twelve panel sections.

The v1.15.3 tests (section 96) cover the sensitive-terms screen: storage holding
only a salt and fingerprints, duplicate and over-long handling, salt dependence,
warnings for Items 9 and 13 that never contain the term and are never errors, the
on-screen note and its print exclusion, whole-word matching, clearing with the
text, removal by re-typing, counts-only audit entries, exclusion from Full Backup
(captured from the real backup download), read-only refusal, silence during
recount, and the Manage-menu dialog.

The v1.15.4 tests (section 97) cover the revision summary: proposal on first open of
a spawned Revision, lines for selects, boxes, short and long text and Item 13
sections in form order, Item 3 bookkeeping excluded, hand edits kept, Redraft,
Remove as an exact inverse with and without a supported-effort line, head offset,
exported Item 13, no interruption while typing, read-only tabs, save and reopen,
recount keeping the parent, replacement by the next Revision and removal on a Final,
the point-of-contact-only warning, and the flow-down ceiling not applied between
issuances while still applied to a non-issuance parent.

The v1.15.5 tests (section 98) cover the countersignature badge on prime-contract,
non-SAP and SAP subcontract issuances, a recorded signature kept in the record and
portfolio export, the SAP lineage error in both directions, on open and on recount,
no error without a parent, the Item 17 help text, the worksheet's Item 7a SAP
subcontract case, dialog height rules and Escape, and the revision summary baseline:
the choice offered, applied, kept through edits and reopening, cleared, cancelled,
not inherited, not asked with one earlier issuance, and the POC warning's own parent.

The v1.15.6 tests (section 99) cover the Final-due prompt: the clock at every
escalation boundary before performance ends and before the retention window closes,
the records that never prompt, the card moving the prompt to a Revision and clearing
it on a Final, audited setting and clearing, absence from the workspace, Compare,
revision summary and XFA data, refused dates and read-only tabs, the calendar invite
and the CSV column; a dashboard render from a stale snapshot not overwriting a
note saved after it; and the demo portfolio, run from `demo_seed.html` in the test
window: twelve labelled records in every status, clean validation where issued,
holds and dates, prompt levels, seeding beside an open form without touching it,
written counts equal to a fresh recount, a live revision summary, and no second
seeding.

The v1.15.7 test (section 100) checks that the Contracting Officer package cites the
GCA's biennial review to DoDM 5220.32 Volume 1 and separates it from Item 3b(3), and
that the manual source no longer credits the review clock to DoDI 5220.22.

The v1.16.0 tests (section 101) cover the review packages: automatic audience from
Item 2b or 7a; on one subcontract-heavy form, government-only and prime-only markers
each confined to their package with shared lines in both; the differing action
lines limited to the audience-specific ones word for word; draft, stage, contract,
release and marking in both; the PDF read back with pypdf for the release, notice
and marking on every page; and the menu dialog's choices, view, PDF and Cancel.

The v2.0.0 tests (section 103) drive the real restore dialog with backups built by
the tool's own checksum functions: an older backup returns changed templates to its
version, adds what it holds and keeps templates created since and same-name
templates of another lineage; an unticked library and Cancel change nothing;
replace-all needs a completed prior backup and leaves an undo copy; Undo reverts a
merged library and a colleague import, reads an old-format copy and refuses an
unreadable one; a tampered backup is refused before the preview; a colleague pack
keeps its own preview.

The v2.0.1 tests (section 104) cover Item 3 on spawned issuances: a Revision takes the
Original's 3a and the next number within its issuance (siblings do not share a number,
a cancelled one is reused, an award restarts at 1); a Final keeps 3a; an award
Original clears 3a; on an open Revision or Final a missing or changed 3a and a missing
or non-numeric revision number block, and a recount counts them; a Revision without a
chain is not compared; the XFA data and the flattened PDF text carry 3a on a Revision;
the worksheet shows the original date.

The v2.0.2 tests (section 105) cover guides linked to contracts (the editor's
drop-down and unlink chips, a missing template, escaping, library search, and the
form panel ordering and marking by Item 2a or applied template) and the reasons
setting (default, logging, and blank reasons accepted for set-aside, Blocked and
Cancel when optional and refused again when required).

The v2.0.3 test (section 106) checks that the header, window title and release label
name the product, "DD254 Interactive", with the release version.
