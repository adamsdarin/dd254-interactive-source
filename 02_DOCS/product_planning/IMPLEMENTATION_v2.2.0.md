# Implementation update - v2.2.0

One offline HTML file and the existing browser database remain the delivery
model. No service, external library or runtime dependency is added.

`dashDistEmails` resolves facility/performance/subcontractor FSOs and both
assigned and added managers. `dashIssueMailMany` claims To first and deduplicates
CC against it. The live checklist uses the same composed To/CC lists. Manager
snapshots use workspace text fields, so existing save/open, spawn, JSON and
backup paths carry them without a database migration. Legacy selected-template
references still resolve a manager until an explicit snapshot is applied.

`ctApplyDataToWorkspace` copies present sections completely. Empty strings,
false checks and cleared radios are applied by `ctApplyWsToForm`; absent legacy
sections are preserved. A temporary application guard prevents the old selected
template from appending its automatic Item 10/11 wording. Individual insert
actions retain their previous behavior. Prime numbers fill empty Item 2a only.

`ctSaveFormTemplate` captures the current form, prompts for a unique name,
checks duplicate content, saves through the journaled template store and reports
only confirmed storage success. Existing-row capture keeps contract/order
metadata and per-checkbox wording/attachments.

`ctRepoRender` filters and groups existing row nodes without modifying array
order. Stable IDs remain insertion references. `ctDuplicatePairs` compares
normalised supported sections independently of names, IDs and timestamps;
same wording under other contract/order metadata and same-source conflicts get
distinct labels. Comparison and review controls render inline. Review metadata
is tied to the compared content and survives a library reorder.

Duplicate notices cover editor typing, Save now/Done, direct workflow save,
JSON imports, CSV uploads, received DD254 imports and template-pack preview.
Imports and restores retain their existing identity/merge rules; there is no
automatic duplicate deletion. See the release assessment for review/export
limits and TEST_RESULT.txt for validation.
