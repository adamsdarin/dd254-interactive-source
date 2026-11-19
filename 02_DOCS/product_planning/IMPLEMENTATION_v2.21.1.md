# PRD implementation update - v2.21.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Items 4 and 5

- `run()`: `S.fo` and `S.fin` are `''` when unanswered (were `'no'`). Every
  existing reader compares with `'yes'`, so only the progress count changes
  meaning, and correctly: an unanswered item is not done.
- `buildPanel()`: two errors after Item 3's, and `req-missing` toggled on the
  new `#foYN` / `#finYN` row containers.
- Markup: the `checked` attribute is removed from both No radios.
- `completionTarget`: Item 4 mapped to radio `fo` (was the non-existent
  `follow`).
- `dashDuplicate`: deletes `radios.fo` and `radios.fin`, blanks `i4prev`,
  `i5_reqdate`, `i5ret`. Revisions are spawned by another path and are not
  touched.

## Unchanged and deliberately so

The export writer, which already wrote both boxes as unticked for an
unanswered item; the upgrade recount; the stored shape of records, templates
and backups. An unanswered radio is absent from `workspace.radios`, as it
already was.

See [release assessment](../RELEASE_ASSESSMENT_v2.21.1.md) and
[prior implementation map](IMPLEMENTATION_v2.21.0.md).
