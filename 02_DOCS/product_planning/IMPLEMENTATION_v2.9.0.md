# PRD implementation update - v2.9.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Fixed:

- `buildCtSelect` lists every row from `ctOrderRows`, not only own-coverage
  orders. A prime-following order resolves to its bound prime source if it has
  one, otherwise to `ctLatestSource(ctSourceCandidates(o,'prime',arr))`, and the
  option text carries the resolved template's label. Own-coverage orders still
  suppress their bound template from the Templates list; prime templates do not,
  because one prime template covers the prime and every order under it. An order
  with nothing to resolve to is rendered disabled and says which case it is.
- `slAutoApply` reads the library once and takes its index from that array.
  `slAll()` deserialises on every call, so an entry from one call is never
  identical to the same entry from another and `indexOf` across two calls is
  always -1; the first cut inserted nothing and reported success. It now also
  verifies that the body is present in Item 13 before returning 1.

Added:

- `ctOrderDelete(id)` with `ctOrderDeleteScope`, which counts the templates and
  source records that will be kept so the confirmation can name them. Removes
  only the order row; audit-logged as `order-deleted`.
- `ctOrderSetCoverage(id,mode)` sets `coverageMode`, forces `sourceMode='review'`
  and drops `sourceVersionId`, so no saved source survives a scope change
  unreviewed. `ctOrderSeedFromPrime` builds the order-specific template from the
  prime's latest non-final source with a fresh `ioId`, this order's number, and
  cleared source identity. Audit-logged as `order-coverage-changed`.
- Both are reachable from `ctOrderRowHtml`; the coverage button names its
  destination rather than the current state.
- `slProgramForForm()` resolves the programme from the applied template, then the
  applied contract type, then the order the draft came from. `slLevelForForm()`
  reads Item 1a. `slAutoApply()` inserts when exactly one entry matches, guarded
  by `SL_AUTO_BUSY` against re-entry through `slInsert`'s `run()`.
- `slAutoAfterEdit()` is the editing-gesture entry point: it fetches the open
  record and refuses for Issued, Cancelled and Skipped, then calls
  `slAutoApply()`. Wired to Item 1a's `onchange` and to the end of
  `ctApplyWsToForm`. `dashOpen` calls `slAutoApply()` directly under the same
  `I13_FINAL_STATUS` guard that governs `cmaSync`.
- `slCandidates(program,level,arr)` takes an optional list so a caller can keep
  one array identity.

Removed:

- `slPickForNew()`, the v2.8.0 creation-time chooser, and its `dashNewDraft`
  hook. Nothing calls it; leaving it would be dead code describing a behaviour
  the owner withdrew.

See [release assessment](../RELEASE_ASSESSMENT_v2.9.0.md) and
[prior implementation map](IMPLEMENTATION_v2.8.0.md).
