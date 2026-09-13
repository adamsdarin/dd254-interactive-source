# Codex Astra v1.14.0 — working-material records removed

13 September 2026. Internal Tool v2.126. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Source & Validation Log removed | No log to keep, no separate log PDF | Nothing on the DD Form 254 depended on it |
| Optional supporting records removed | No sources, attachment, requirement, cost, question or closeout records to maintain; no separate review PDF | Approval holds, validation and the drafting tools are unchanged |
| Final-form retention guidance kept | The guidance a Final needs is still in front of the preparer | Shown in the Item 3 instructions, the Item 3c validation note and the CO package |
| No uploaded file bytes stored | Drafts, backups and exports carry no attached files or working documents | Remaining file inputs import drafts, backups and template data only |

## Why

Both features recorded the preparer's working material rather than anything the
DD Form 254 requires. The log held sources consulted, notes and uploaded files.
The supporting-records panel held review sources, attachment reconciliation,
requirement cost estimates, policy questions, closeout actions and a local
history, with its own review PDF. Neither printed on the form, and between them
they gave the preparer two places to record sources and a second workflow beside
the one that produces the form.

The retention guidance was the exception. It is genuine DD-254 guidance for a
Final, and it was used by the form itself, so it was moved out of the removed
code and kept. It had been loading in a script block after the first validation
run; it now loads with the form.

## Verification and limits

The regression suite asserts that neither panel is on the page, and that a draft
saved by an earlier version with both a log and supporting records — including a
records schema the removed validator would have rejected — still opens and saves
without writing either back. The retention guidance keeps its tests: ordinary and
SAP wording keep their different scope, and a SAP Final with written program
direction does not demand an extended-retention answer. The removed features' own
tests, and the live-browser checks that drove the supporting-records panel, went
with them. See the recorded test log and BUILD_FACTS.md for results and hashes of
the shipped files.

This is a removal, and it discards data. Log entries, attachments and supporting
records in a draft saved by an earlier version are not shown in this version and
are dropped the next time that draft is saved from the form. Until then they
remain in browser storage and in Full Backup. Anyone who needs that material
should export it from v1.13.0 before opening the draft in v1.14.0. No new legal
rule, classification decision, service, account or storage medium is introduced.
