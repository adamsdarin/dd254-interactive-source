# DD254 Interactive v2.25.1 - Phase 0: verified defects

26 November 2026. Internal Tool v2.177. Single HTML file; existing browser storage.

A patch release of the defects confirmed by the November 2026 architecture
review ([REVIEW_AND_ROADMAP_2026-11.md](product_planning/REVIEW_AND_ROADMAP_2026-11.md),
section 7). Nothing new is added; what was wrong, contradictory or unreachable
is corrected or removed.

## Changes and user benefit

| Item | Change | Concrete effect | Safeguard |
| --- | --- | --- | --- |
| P0.2 | A received DD-254 import records Item 2a as the template's prime contract (and a task order's own order number) | An imported government Revision joins its contract's revision chain: the *Revision needed* flag and the latest-revision choice work for it | Older imports with no contract are flagged on their row until one is entered |
| P0.2 | Items 1a/1b of the received form are recorded as source facts (`srcFcl`, `srcSfg`) | The preview, the row and the revision review say what the government form said | Never applied to a form (owner decision 2) |
| P0.3 | The unreachable flow-down ceiling and its card chip are removed | No code that can never run is executed on every keystroke | The rule (`dashFlowIssues`) and its tests stay for Phase 4 (owner decision 3) |
| P0.4 | The completion meter's total is the length of what it counts | A fully answered form shows 100%, not 50% | Asserted at 50% and 100% |
| P0.5 | Item 12 header and instructions match validation | Q1 required, Q2 optional, said once | Validation unchanged and asserted |
| P0.6 | No-op click handler removed from Item 3a | One less inline handler | Date entry asserted unchanged |
| P0.7 | Item 7 says it is the one subcontractor this form is issued to | No contradictory "informational only" | Owner decision 1 |
| P0.8 | 16a is "GCA name" in the file-name settings | One name for one field | Asserted |
| P0.9 | Hidden Clauses / Flow-Down panels and the dead `#bpPanel` renderer removed | Two panels nobody saw are no longer rebuilt per keystroke | CO package models compared before and after: identical |
| P0.10 | The demo banner says changes are kept until site data is cleared | The banner is true | The seed guards that make it true are asserted |
| P0.11 | An autosave never writes a record that is not stored | A DD-254 deleted while open cannot come back | Proved failing first; the in-app delete path asserted too |

P0.1 made the portfolio-export test deterministic (it asserts on what it
seeded and flushes the pending save first); the suite cut off after it passed
20 runs in a row.

## Why

**The importer was the urgent one.** v2.25.0 keys the revision chain on the
template's prime contract. The importer never set it, so every government
revision brought in through *Create from a received DD-254* sat outside its
chain until someone typed the number in. Item 2a is exactly the number the
chain needs, so it is now taken; a standalone task order's "PRIME | Task Order
N" is read back into its parts.

**Removed rather than repaired (P0.3).** The ceiling compared a draft with its
`parentId` record, and the only parents the tool creates are earlier issuances
of the same contract, which the ceiling correctly ignores. With no way to link
a subcontract to its prime, it could never fire. The owner chose to cut it now
and rebuild it on a real link (`primeSourceId`) in Phase 4.

**N5 was real.** The review suspected that `dashSaveNow` could re-create a
deleted record. The new test showed it does when a record is removed underneath
the open form; the in-app delete was already safe.

## Verification

- **1683 assertions, 0 failures.** Sixteen are new (section 160, labelled by
  item). Seventeen existing assertions were restated with the reason and the
  item number beside each, none deleted:
  - P0.1: the portfolio export assertion (asserts on the seeded drafts, not the
    store size).
  - P0.2: the import preview and stored-template assertion (section 94) and the
    import-from-page row check.
  - P0.3: the three section 4 "live:" ceiling tests, the non-issuance parent
    test, the card chip test, and the section 75 parent-text injection test
    (now through the SAP-lineage error).
  - P0.9: the panel census, the clauses and flow-down panel tests (now on the
    CO package), the obsolete-mapping test (now on `coPackageModel`), the three
    section 67 card tests, and section 68's section count.
- Each item's new assertion was seen failing against the build before its fix.
- All gates pass; the rebuild kit round-trips byte-identically; pdf-lib is the
  unmodified upstream release; both builds pass the native-browser smoke test.

## Limits

- **For the owner:** `ctDuplicatePairs` treats any two DD-254 templates under
  one prime contract and order as duplicates, whatever their source type. Now
  that imports carry their contract, importing a government Revision for a
  contract whose Original is saved asks "Possible duplicate templates - Save
  both?". Hand-entered chains in v2.25.0 already did the same. Not changed in
  this patch.
- Templates imported before v2.25.1 are flagged, not fixed: the source PDF is
  not kept, so the contract number has to be entered by hand.
- The flow-down ceiling is absent until Phase 4.
