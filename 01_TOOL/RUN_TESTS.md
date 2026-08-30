# DD-254 Interactive — regression suite

The suite prints its current assertion count at the end. `BUILD_FACTS.md` takes
that count only from a recorded successful run, never by counting declarations.

## Running it

Put `dd254_regression.js` in a folder with the tool renamed to `dd254.htm`, then:

    npm install jsdom@29 fake-indexeddb
    python -m pip install pypdf
    node dd254_regression.js

The PDF-content assertion invokes `pdf_content_regression.py`. Set
`DD254_PYTHON` to the Python executable that has `pypdf` when `python` (Windows)
or `python3` (macOS/Linux) is not the right interpreter.

Then drive the versioned file in a real browser:

    node browser_smoke.js DD254_Interactive_vNNN.HTM

Exit code 0 means everything passed; 1 means at least one assertion failed, and
the failing names are listed at the end.

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
