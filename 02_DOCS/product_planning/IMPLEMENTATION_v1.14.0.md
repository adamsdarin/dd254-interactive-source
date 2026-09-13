# PRD implementation update — v1.14.0

This update removes a feature rather than adding one. The original browser-only
constraint remains: one downloadable HTML file, the existing browser database,
and user-managed backups. Docker/Kubernetes hosting remains a separate future
phase.

Removed: the Source & Validation Log — its panel, its PDF export and its file
attachments. It recorded the preparer's working material, which is not needed to
prepare or issue a DD Form 254, and it duplicated the source records in Optional
supporting records. The tool no longer stores uploaded file bytes.

Adjusted: a supporting document's file reference was a picker populated only by
log attachments; it is now a text field for a file name or SHA-256 and keeps any
reference already recorded. Optional supporting records keep their collapsed
position on the page.

Drafts saved by earlier versions still open. Their log entries and attachments
are not shown and are dropped when the draft is next saved from the form; until
then they remain in browser storage and Full Backup. Existing approval holds,
backup behaviour, v1.13.0 corrections and Optional supporting records are
retained.

See [release assessment](../RELEASE_ASSESSMENT_v1.14.0.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.13.0.md) for retained
PRD coverage.

Acceptance: no log panel, log export or file attachment remains in the official
or demo build; a draft carrying a log from an earlier version opens and saving
it writes no log; a recorded file reference survives as editable text; official
and demo builds pass browser and regression checks.
