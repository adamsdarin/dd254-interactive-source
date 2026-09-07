# PRD implementation map — Codex Astra v1.11.0

7 September 2026. Internal Tool v2.123. Companion to the original
[PRD draft 0.2](DD254_Tool_Enhancement_PRD.docx) and
[assessment PDF](../../output/pdf/DD254_Tool_Assessment_and_Recommendations.pdf).
This map supersedes their future-work status for the increments below. It does
not claim completion of the PRD's Government/industry pilot or future hosting.

| PRD area | Implemented behavior | Practical boundary |
|---|---|---|
| R01 — Policy guidance and applicability | Qualified ordinary/SAP completion and retention help, Item 5 template and CO guidance; versioned source metadata, applicability and executed-clause basis | Sources are recorded locally. No live policy feed, automatic contract amendment or legal determination. Existing records retain their source version. |
| R02 — Contract and attachment reconciliation | Contract/modification/attachment references; form revision/date comparison; document versions and supersession; existing attachment hash references; separate delivery and acknowledgment evidence; issuance review | Incorporation and receipt are operator-recorded. The review PDF exports references, without attaching file bytes. Existing issuance audience separation remains in force. |
| R03 — Questions and decisions | Competing sources, affected items/requirements/documents, reviewer, request, response, scoped resolution, hold reference and history; changed evidence prompts review | No shared workflow or authenticated approvals. A resolution never clears an existing hold. Select appropriate records for a clarification package; send externally through the authorized process. |
| R04 — Requirement, inspection and cost review | Task/authority/site/owner, inspection scope/criteria/frequency, cost quantity/hours/rate/events, currency, estimate status and one-time/recurring basis; previewed Item 13 insertion | The calculation is a labor/effort estimate with free-text assumptions, not a full pricing engine. Unknown values remain unknown. Items 14 and 15 require separate decisions. |
| R05 — Changes and closeout | Recorded impact-review comparison points for requirements and documents; changed source, form/site and record dependencies named; decisions and completed actions rechecked; separate completion/disposition/retention/continuation actions | The original form-chain comparison and missing-parent warning remain separate. New impact review begins when a reviewer records a basis. Reminders operate in the open review panel and when a draft is reopened; there is no closed-file notification service. |

## Browser-only architecture

The delivery remains one self-contained HTML file. `workspace.astra` schema 1
adds records to the existing browser draft store. It introduces no new storage
engine, backend, authentication service, API, remote dependency or application
network call. User-requested JSON/PDF downloads are portable output artifacts.

Existing v1.10.0 workspaces import with empty review metadata and no inferred
approvals or receipts. Unknown additive metadata is preserved; unsupported
schema versions and malformed record lists are rejected before import writes.
Full Backup includes pending Astra edits and local history. Old HTML versions
do not understand the new metadata: do not use an old version to save and return
new review work.

## Output and evidence scope

The review PDF and CO package include the current draft's contract-package
metadata and selected records. Unselected record content, embedded file bytes
and local event history are excluded. References to omitted records are labeled
as omitted. Full Backup retains the history. Export does not mark incorporation,
delivery, acknowledgment or Government approval.

The proposed separate file-bundling/attachment-selection feature is not added
to the review PDF. Use the existing attachment and issuance workflow to provide
authorized supporting files. There is no automatic sending.

## Acceptance evidence and remaining work

Automated regression coverage and real Chrome tests verify the single-file
implementation, saved records, backup behavior, existing safeguards, reviewed
Item 13 insertion and actual PDF content. Exact build identity and passing
counts are generated in [BUILD_FACTS.md](../../BUILD_FACTS.md). The release
workflow repeats these checks before publishing attested HTML artifacts.

The PRD's field pilot, measured task-time/completeness outcomes and independent
Government/industry acceptance have not occurred. These remain product
validation work; local tests do not substitute for them.

F01–F03 Docker/Kubernetes hosting remains future scope. Even initial static
hosting would retain browser-local records. Shared records, server-side storage
or an authenticated approval service require a separate product decision.

## Upgrade

Take a Full Backup in the previous release, open the new HTML, restore and
inspect representative drafts/templates/attachments, recount validation, then
take a new backup. Keep the previous release and backup for rollback. See the
[updated manual](../DD254_Interactive_User_Manual.pdf), section 12.
