# PRD implementation update — v1.14.0

This update removes features rather than adding them. The original browser-only
constraint remains: one downloadable HTML file, the existing browser database,
and user-managed backups. Docker/Kubernetes hosting remains a separate future
phase.

Removed: the Source & Validation Log (its panel, PDF export and file attachments)
and the Optional supporting records panel introduced in v1.11.0 (guidance
sources, contract attachment reconciliation, attachments and delivery,
requirements and cost estimates, questions and decisions, changes and closeout,
local review history, the separate review PDF, its findings in the CO package and
its Item 13 insertion). Both recorded the preparer's working material, which is
not needed to prepare or issue a DD Form 254. The v1.11.0 and v1.12.0 PRD
increments that lived in that panel are therefore withdrawn, not retained.

Kept: the Final-form retention guidance, in the Item 3 instructions, the Item 3c
validation note and the CO package; and the v1.12.0 drafting tools — site reuse,
go-to-field, combined Item 13 template insertion and unfinished-prompt search.

Drafts saved by earlier versions still open. Their log entries, attachments and
supporting records are not shown and are dropped when the draft is next saved
from the form; until then they remain in browser storage and Full Backup.
Existing approval holds, backup behaviour and the v1.13.0 corrections are
retained.

See [release assessment](../RELEASE_ASSESSMENT_v1.14.0.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.13.0.md) for earlier
coverage.

Acceptance: no log or supporting-records panel, export or attachment remains in
the official or demo build; a draft carrying either from an earlier version opens
and saving it writes neither; Final-form retention guidance still appears in all
three places; official and demo builds pass browser and regression checks.
