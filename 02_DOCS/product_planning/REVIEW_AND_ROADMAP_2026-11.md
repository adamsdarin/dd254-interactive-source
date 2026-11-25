# Architecture review and roadmap - November 2026

25 November 2026. Baseline reviewed: released v2.24.0 (Tool 2.175); current
release v2.25.0 (Tool 2.176). Owner-commissioned independent review of the
code, plus a second opinion on an external critique. This document is the
working plan; the start prompt for the first phase is
[START_PROMPT_v2.25.1.md](START_PROMPT_v2.25.1.md).

## 1. Decision in one paragraph

Evolve, do not rewrite. The external critique's diagnosis is largely right -
the form page is the rules engine, field ids are the schema, Item 13 is one
string juggled by regexes - but a clean-sheet v3 would throw away 1667
assertions that encode about 150 sections of owner decisions. The plan is a
patch release of verified defects now (v2.25.1), then a phased move to pure
state, pure rules and a structured Item 13 behind the existing tests, each
phase shipped as an ordinary minor release. "v3.0" is the release in which the
form page is no longer the rules engine - not the day someone starts over.

## 2. The external critique's defect list - verified

Checked directly in the v2.24.0 build; all still present in v2.25.0.

| # | Finding | Verdict | Where |
| --- | --- | --- | --- |
| D1 | `dashParentIsIssuance()` always true, so the flow-down ceiling and the "exceeds prime" badge never fire | **Real, and worse.** Only `dashSpawn` (orig/rev/final) and the demo seed ever set `parentId`; a subcontract-to-prime link cannot be created at all. The whole flow-down ceiling is unreachable. | `dashParentIsIssuance`, `flowIssuesLive`, card badge in `dashRenderCards` |
| D2 | Completion meter divides at most 6 by `total=12` | **Real.** "Estimated completion" can never pass 50%. | `buildPanel`, `const total=12` |
| D3 | Item 12 header says "(optional — not required)"; instructions say REQUIRED; validation blocks | **Real.** Q1 routing is required; Q2 (release authority name) is optional. | Item 12 markup; `buildPanel` Item 12 block |
| D4 | Item 3a `onclick="e=>{e.stopPropagation()}"` | **Real, harmless.** Defines a function and never calls it. | `#i3a_date` markup |
| D5 | Item 7 says both "this form covers the one subcontractor" and "informational only" | **Real.** Contradictory text. **Owner to confirm which is right** (see §6). | Item 7 alerts |
| D6 | `FN_FIELDS` labels `i16a` "16a — Certifier name" | **Real, cosmetic.** Only the export file-name settings list; the Item 16 editor says "16a GCA Name". Same field described twice. | `FN_FIELDS` |
| D7 | Clauses and Flow-Down panels rebuilt every keystroke into containers that are never shown; `#bpPanel` gone, `#bpButtons` left | **Real.** Nothing un-hides `data-co-only`. The CO review package builds its own clause list. | `run()` calls `buildClausesPanel`, `buildFlowDownPanel`; `buildTemplateLanguage` |
| D8 | `rcv254Parse` never sets `primeContract`; drops 1a/1b | **Real, now urgent** (see N1). | `rcv254Parse`, `rcv254Import` |
| D9 | Demo banner "resets on every refresh" | **Real.** `seed()` / `seedPortfolio()` do nothing when data exists. | demo seed |

## 3. Findings the external review missed

- **N1 - the importer breaks v2.25.0's revision chain.** The chain keys on
  `data.primeContract`. A government revision brought in through *Create from a
  received DD-254* has no prime number on the template, so it never joins its
  contract's chain: no "Revision needed" flag, no automatic use of the latest
  revision, until someone types the number onto the template by hand.
- **N2 - recount replays every draft through the live form.** `dashRecountDrafts`
  resets the page, applies each workspace, runs `run()` and reads the error
  count. The suite's own notes measure 20-33 s for 61 drafts. It does not scale
  to a few hundred.
- **N3 - findings are keyed by their wording.** A set-aside is stored against the
  finding text, so rewording a rule silently re-asks every set-aside, and the
  closed-contract finding embeds the template's name, so renaming a template
  does the same. Rules need stable ids.
- **N4 - the rule catalog is scraped from source by regex.** The rules exist only
  as code, so the catalog given to an ISSM is inferred, not declared.
- **N5 - autosave can re-create a deleted record.** `dashSaveNow` writes a fresh
  record when the open id no longer exists. In-app deletion and the tab lock
  probably prevent it; it should be proven by a test, not assumed. (Found while
  reviewing the flaky-test fix.)

## 4. Where the critique is wrong or naive

| Critique says | Position | Why |
| --- | --- | --- |
| "DOM-as-database" | **Reframe** | Records are JSON in IndexedDB. The problems are *DOM as rules engine* and *field ids as schema*. Drafts already store `{texts, checks, radios, selects}` keyed by id, so no data migration is needed to fix them. |
| `.innerHTML` + inline `onclick` = XSS | **Overstated** | One `htmlEsc` behind every escape; ~15 injection assertions including attribute context. The real cost: 278 inline handlers force `script-src 'unsafe-inline'`, so one missed escape would run. Remove inline handlers to drop `'unsafe-inline'` - that is the gain. |
| File System Access as storage | **Reject as primary** | Chromium-only, often blocked by enterprise policy, unverified from a `file://` page. Keep IndexedDB; offer a workspace folder only where it works. |
| Modular source + build step | **Accept, unminified only** | Extends the existing byte-identical rebuild kit and attestation. Minified output would break "the ISSM can read what runs". |
| Collapse to 4 entities | **Partly** | Merge the people/place lists (fac, cso, perf, cert, sm, req) into one Directory - yes. Merging Contract Types (a kind of contract) with DD-254 templates (one contract) - no; owner decisions depend on that difference. |
| Clean-sheet v3 | **Reject** | The suite is the asset. Evolve behind it. |
| XFA-only export trap | **Real, not avoidable** | The official form is XFA; stripping `/Perms` is unavoidable once modified, so free Reader cannot save or sign. Say "needs Acrobat Pro" plainly; keep the plain PDFs (review package, template library) for everyone else. Verify exact Reader behaviour before documenting it. |

## 5. Product identity

Three products share one file: **A** preparation, validation and official
export (the core); **B** FSO portfolio and workflow (dashboard, distribution,
holds, revisions, the template chain); **C** advisory and reference (two
advisors, caveat engine, clause panels, review packages).

- **Keep A and B together.** They share every record; the template and revision
  chain is what joins them. Two single files would need an import/export step
  between them.
- **Cut:** the hidden Clauses and Flow-Down panels; the dead `#bpPanel` path; the
  flow-down ceiling wiring until a real prime link exists (keep the pure
  `dashFlowIssues` - it has direct tests and is what v3 will call).
- **Merge:** the two advisors and the caveat engine into one collapsed
  *Advisory* drawer; the backup/export pairs into one Full Backup plus one
  *Share templates*; the chained issuance pop-ups into one pre-issue checklist.

## 6. Open decisions for the owner

1. **Item 7 (D5):** on a DD-254 issued by a prime to a subcontractor, Item 7 *is*
   that subcontractor. Proposed: keep "one subcontractor per DD Form 254", drop
   "informational only". Confirm.
2. **Items 1a/1b on imported DD-254s (D8):** templates have no 1a/1b fields.
   Proposed for v2.25.1: record them on the template as source facts
   (`srcFcl`, `srcSfg`) and show them in the import summary and the revision
   chain, without applying them to forms. Applying them is a later decision.
3. **Flow-down ceiling (D1):** cut the unreachable wiring now and rebuild it on
   `primeSourceId` in Phase 4, or keep it dormant. Proposed: cut.
4. **Advisory drawer (§5):** collapsed by default - confirm.

## 7. Phase 0 - v2.25.1 patch (start here)

Each item lands with its own regression assertion. Existing assertions that a
change makes untrue are restated with the reason, never deleted.

| # | Change | Done when |
| --- | --- | --- |
| P0.1 | Merge `fix/flaky-portfolio-export` after rebasing onto `main`; flush the pending save (`await dashSaveNow()`) instead of only clearing `DASH.timer`. | Branch merged; full suite green. |
| P0.2 | **Importer sets the contract.** `rcv254Parse` reads `two_Prime` into `data.primeContract` (and 1a/1b per decision 2). Templates imported before the fix whose `primeContract` is empty show "contract number missing - revision chain cannot include this" in the repository. | An imported Revision 1 joins the chain of the Original already saved for that contract, with a test; older imports are flagged. |
| P0.3 | **Flow-down (D1).** Per decision 3: remove the card badge and the unreachable `flowIssuesLive` path; keep `dashFlowIssues` and its direct tests; restate the card-chip test. | No unreachable flow-down UI; `dashFlowIssues` tests unchanged. |
| P0.4 | **Meter (D2).** `total` is the length of the list being counted. | A fully answered form shows 100%. |
| P0.5 | **Item 12 header (D3)** reads as required (Q1), Q2 optional. | Header, instructions and validation agree. |
| P0.6 | **Item 3a (D4)** - remove the no-op handler. | Gone; date entry unchanged. |
| P0.7 | **Item 7 (D5)** per decision 1. | One consistent statement. |
| P0.8 | **16a label (D6)** - "16a — GCA name". | File-name settings show it. |
| P0.9 | **Hidden panels (D7).** Stop calling `buildClausesPanel` / `buildFlowDownPanel` from `run()`; remove the hidden markup, `#bpButtons` and the dead `#bpPanel` lookup. Confirm first that nothing but `buildClausesPanel` reads `CLAUSES`; the CO package builds its own list. Restate the 6 assertions that touch these panels. | No work on hidden panels per keystroke; CO package unchanged. |
| P0.10 | **Demo banner (D9)** - say it keeps changes until site data is cleared, or make the demo actually reset. | Banner true. |
| P0.11 | **Autosave after delete (N5)** - a test proving a deleted open record is not re-created; fix if it is. | Test exists and passes. |

Release v2.25.1 by `SETUP.md`. Ask the owner before publishing.

## 8. Phases 1-6 - toward v3.0

Each phase is a normal minor release. Every phase reads every earlier backup
format (version stamp, forward-only migrations). The suite is the ratchet.

1. **Field registry.** One table per field: id, Item, label, who requires it
   (preparer / GCA / certifier), XFA path, jump-to target, file-name use. The
   meter, requiredness, labels, diff and export read it. Removes the D2, D6
   class of bug and the "two sources of truth" note in `buildPanel`.
2. **Pure rules with stable ids.** Rules become functions from draft data to
   findings `{ruleId, item, severity, text}`. Run them beside the DOM rules
   across every regression state until they agree, then switch. Set-asides key
   on `ruleId` (fixes N3); the catalog is generated from the rule table (N4);
   recount no longer touches the page (N2).
3. **Item 13 as typed sections:** supported-effort line, standard language,
   per-box guidance (10a-11m), guide references, mailing address, CUI block,
   revision summary, free text; flattened only for export and preview.
   Migration: existing text becomes one free-text section, then the existing
   markers are recognised section by section - nothing is lost.
4. **Records with two links:** `supersedesId` (Sol → Orig → Rev → Final) and
   `primeSourceId` (subcontract → prime), and a **Government DD-254** entity
   imported whole, which absorbs v2.25's revision chain and the task-order
   source snapshots. The flow-down ceiling returns here, on `primeSourceId`.
5. **UI consolidation:** one validation panel, the Advisory drawer, one
   pre-issue checklist; merge the Directory lists.
6. **Module source, concatenating build:** `schema/`, `rules/`, `item13/`,
   `xfa/`, `storage/`, `ui/`; zero-dependency script producing one unminified
   HTML file; the rebuild kit proves source equals artifact; inline handlers
   replaced by delegated listeners so the CSP can drop `'unsafe-inline'`.

## 9. Non-negotiables (carried into every phase)

- One offline HTML file; the CSP stays at least as strict as today.
- Unminified, readable output; the rebuild kit and attestation keep working.
- Every earlier backup and template export still imports.
- No assertion is deleted to make a change pass; it is restated with the reason.
- UNCLASSIFIED / CUI only; nothing classified, personal or case-specific in the
  repository.
