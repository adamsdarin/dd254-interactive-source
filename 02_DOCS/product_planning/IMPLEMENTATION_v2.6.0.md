# PRD implementation update - v2.6.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Added, from owner requests of 5 October 2026:

- `PDQ_TEXT` is written by `cmaBuild()`, which now always returns a block: the
  required line alone, or the line followed by the classified mailing addresses.
  `cmaAddressBlock()` holds what `cmaBuild()` used to return. `cmaAdopt()` reads
  back whichever form is actually present, including the pre-v2.6.0
  addresses-only block, so the next sync strips it instead of duplicating it.
  `cmaSync()` is now also called from `dashOpen` after the workspace is applied
  and from `ctApplyWsToForm`.
- The Program field is rendered for `b13` rows as well as `ct` rows. No new
  storage: `ctProgram(t)` already read `t.program` with `t.smProgram` as the
  fallback, and `ctSetSm` already filled both from the assigned manager.

`dashOpen` writes it only when the record's status is not Issued, Cancelled or
Skipped (`I13_FINAL_STATUS`), evaluated on each open, so a record moved back to
Draft, Ready to sign or Blocked gains the line next time it is opened.
`rsumItem13` excludes the line from the revision-summary comparison.

Fixed: `ctApplyDataToWorkspace` defaulted `iStandalone` to true for any template
carrying a task order. It now defaults to false, so Block 2a carries the order
only when the form records that it is specific to it.

See [release assessment](../RELEASE_ASSESSMENT_v2.6.0.md) and
[prior implementation map](IMPLEMENTATION_v2.5.0.md).

Acceptance: a draft gains the line once on open and does not duplicate it on
reopen; the line sits above the classified mailing addresses; a pre-v2.6.0 draft
keeps one copy of its addresses; Contract Type rows show Program and fill it from
the assigned manager; the linked manager reaches the distribution; a template
carrying a task order leaves the order-specific box unticked unless it records
the choice; official and demo builds pass browser and regression checks.
