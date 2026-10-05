# PRD implementation update - v2.7.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Changed, from the owner's request of 5 October 2026:

- `dashNewDraft` no longer calls `ctPickContractType`. A new draft is created
  with no contract type and nothing applied to it.
- A `Contract Type` section in the Checklist and Templates panel holds
  `ctTypeSel`, populated from `TPL_B13` by `buildTplSelects` alongside the other
  library pickers.
- `ctTypeApply(sel)` resolves the selection and hands to `dashApplyB13`, which
  already carries the overwrite confirmation, the `ctType` write and the audit
  entry. The picker adds no second copy of that behaviour; it only refuses, with
  a message, when no draft is open.

`ctPickContractType` itself is retained: it is still reachable and the suite
stubs it to prove origination does not call it.

See [release assessment](../RELEASE_ASSESSMENT_v2.7.0.md) and
[prior implementation map](IMPLEMENTATION_v2.6.0.md).

Acceptance: creating a solicitation or an Original asks nothing about contract
type and leaves Item 13 empty; the picker lists every Contract Type template;
applying one fills the form, records the type and resets the select; the picker
delegates to `dashApplyB13`; applying with no draft open refuses; official and
demo builds pass browser and regression checks.
