# Implementation update - v2.4.1

Remove the prime/own buttons from saved order headers. Keep the two-option
coverage selection in the Add task order form. The header displays the saved
choice as a label and retains existing workflow and review actions.

New orders persist `coverageMode` at creation, including when a source is not
yet available. `ctOrderCoverage` reads that field and infers older records from
their existing source mode or immutable snapshot without rewriting history.
Migrated own-template orders also record own coverage. Review status remains
separate from the selected coverage.

`ctOrderBind` refuses an alternate coverage type. Source review resolves its
mode from the order instead of accepting a mode override. Replace the former
switch handler with `ctOrderRepairTemplate`, which can create a missing own
template only for an order already using own coverage. Review can still link
a changed or newer source within the original type. Source versions remain
immutable and outgoing workflows retain their saved provenance.

Repository labels, source filters, program selection and child editor display
use the saved coverage even while its source awaits review. JSON, packs and
Full Backup naturally retain the additional field; CSV remains template-only.
No runtime dependency or storage key is added.

Regression coverage replaces switching assertions with creation-only checks,
alternate-mode rejection, same-mode source refresh, legacy inference,
preservation of a missing-source creation choice and own-template repair.
Native browser checks verify the creation chooser, absence of header buttons
and restriction of review to the existing coverage.
