# PRD implementation update - v2.8.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Fixed:

- `dashDuplicate` routes through `dashResetWorkflow(rec)` for both copy modes,
  so status, holds, distribution record, countersignature, issue date, review
  date and the validation override stay with the original. It then calls
  `dashSyncCompliance(rec)`, which raises the copy's own approval holds from the
  copy's own boxes, exactly as `dashResetNow` does. The mode now decides only
  whether the notes and to-dos come across.
- `dashCopyPrompt` offers Copy (`#cpKeep`) and Copy the form only (`#cpForm`),
  and states that the workflow stays with the original. The old labels claimed
  the opposite of what the code did.
- `ctSmList` and `ctProgramList` are rendered for the Contract Type repository
  as well as for DD-254 Template Language, and `ctProgramList` for Standard
  Language. Both were gated on `kind==='ct'` while the row markup that uses them
  is shared by both kinds.

Added:

- `ctProgramOptions(arr)` returns the programme option list: every programme
  recorded on a Security Manager template, union any programme already written
  on a template in the repository being rendered, sorted. The repository filter
  dropdown is unchanged - filtering by a programme no template has would be
  useless.
- Standard Language entries carry optional `program` and `level` fields, with
  `slProgramOf`, `slLevelOf`, `slMatches` and `slCandidates` deciding which
  entries fit a programme and an Item 1a level. Blank matches anything.
- `slRequired` / `slRequiredModeGet` / `slRequiredModeSet` back a new
  `slRequired` entry in `SETTINGS_DEFS`, stored at `dd254_sl_required`,
  audit-logged on change, off by default.
- `slRequiredError()` states the blocking rule once. `buildPanel` pushes it into
  `errors` before the dismissal filter, so it holds the status at Draft and can
  be set aside with a written reason; `exportPrep254` pushes the same string
  into `must`. Neither carries the wording itself.
- `slPickForNew()` is the creation-time offer: programme and Item 1a level
  selects that narrow a list of matching entries, each shown with its tags and
  the first 180 characters of its text. `dashNewDraft` awaits it when the
  setting is on and the library is not empty, inserts the chosen entry through
  the existing `slInsert`, fills Item 1a from the chosen level when Item 1a is
  empty, and writes the choice to the audit log. Declining leaves the blocking
  error standing.

See [release assessment](../RELEASE_ASSESSMENT_v2.8.0.md) and
[prior implementation map](IMPLEMENTATION_v2.7.1.md).
