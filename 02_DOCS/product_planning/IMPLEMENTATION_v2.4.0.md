# Implementation update - v2.4.0

The approved first template-storage layout retains the existing offline HTML,
journaled browser storage, toolbar, source metadata and complete block editor.
No service or runtime dependency is added.

`ctPrimeCreate` accepts Block 2A, name and program, refuses an existing prime
identity and prepends the new source row. The main Add template action offers
prime creation only. `ctOrderCreateEditable` creates an independent blank source
template and order record under the matching prime for own coverage. Prime
coverage creates an order reference only. Source switches retain own-template
edits; ambiguous revisions still require explicit selection.

`ctRepoRender` displays all matching groups and order entries without paging.
Own sources use `CT_REPO_ROW` and the same `ctEditorHtml` as prime sources.
Full block fields are loaded only when Edit blocks opens their editor. Source
identity indices remain stable for each render; view sorting does not reorder
stored IDs. Child Block 2A is inherited. Editing an order number updates its
record while leaving earlier source snapshots and workflow identities intact.

The independent `program` field travels in ordinary JSON/backup and the shared
CSV column set. Legacy entries fall back to their security-manager program.
Program/contract/order/coverage filters operate on the complete repository.
`ctDuplicatePairs` indexes normalized prime/order identities, using bounded
representative comparisons so every copy is flagged. Wording, attachment lists,
source revisions and names do not distinguish an identity. Legitimate separate
orders following one prime source are not duplicates.

The v2.3 order/source store, immutable snapshot links, changed-source review,
workflow freezing, legacy migration and backup/import paths remain intact.
Program is repository metadata and does not alter frozen DD254 source language.
The separate source dropdown/View source strip is removed; an explicit review
panel uses readable DD254 item names when a saved version must be examined.

Regression coverage includes prime-only creation, newest placement, complete
editable children, independent autosave, prime/own switching, preservation of
own edits, program filtering/CSV, uncapped scrolling, normalized duplicates,
read-only guards and unconfirmed-write handling, plus all prior source/workflow
and recipient/blank-replacement checks. The built UI is reviewed separately.
