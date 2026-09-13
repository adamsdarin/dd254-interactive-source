# Codex Astra v1.14.0 — Source & Validation Log removed

13 September 2026. Internal Tool v2.126. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Source & Validation Log removed | One less panel, form and export beside the DD Form 254; no working material to record | Optional supporting records keep their source, attachment and evidence fields |
| No uploaded file bytes stored | Drafts, backups and exports no longer carry attached files, so they stay small and hold no stray working documents | The remaining file inputs import drafts, backups and template data only |
| File reference is typed | A supporting document names its file by name or SHA-256 without depending on the removed log | A reference already recorded in an older draft is kept and stays editable |

## Why

The log recorded the preparer's working material — sources consulted, notes and
uploaded files. That material is not needed to prepare or issue a DD Form 254.
The log also recorded sources in a second place alongside Optional supporting
records, and it made it easy to attach material that should never travel with a
form: its own banner warned that attachments were embedded in the browser
workspace, in saved drafts and in the exported log PDF.

## Verification and limits

The regression suite asserts that Optional supporting records stay present and
collapsed where the log used to sit; that a draft saved with a log by an earlier
version still opens and the log is not written back when it is saved; and that a
supporting document's file reference renders as editable text that keeps an
existing hash. Both new assertions fail against v1.13.0, which writes the log on
save and renders the reference as a picker. The log's own export and
file-hashing tests were removed with the feature. See the recorded test log and
BUILD_FACTS.md for results and hashes of the shipped files.

This is a removal, and it discards data. Log entries and attachments in a draft
saved by an earlier version are not shown in this version and are dropped the
next time that draft is saved from the form. Until then they remain in browser
storage and in Full Backup. Anyone who needs that material should export the log
from v1.13.0 before opening the draft in v1.14.0. No new legal rule,
classification decision, service, account or storage medium is introduced.
