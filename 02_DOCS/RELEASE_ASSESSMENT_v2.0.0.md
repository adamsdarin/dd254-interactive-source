# Codex Astra v2.0.0 — restore merges templates instead of replacing them

15 September 2026. Internal Tool v2.137. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Restoring a Full Backup | Replaced every template list, silently removing templates created since the backup | Shows what would change per library, then merges; nothing is removed |
| Replacing everything | The only behaviour | A separate, confirmed choice that first takes a Full Backup of the current state |
| Undo after a colleague import | Emptied the library | Reverts the library |
| Security Classification Guides in import previews | Labelled "undefined" | Labelled |

## Why

The Full Backup is the tool's only recovery path, and restoring an older one cost
every template written since, including Standard Language and Security
Classification Guide entries that may exist nowhere else. The manual warned about
it; a warning is not a safeguard. The colleague-import planner already matched
templates by a stable identifier and kept same-name conflicts side by side, so the
restore now uses it rather than a second merge rule.

The owner selected 4.1, 4.3 and 4.4 for v2.0 and then skipped 4.1: headless Chrome
reports `persisted=false` and refuses `navigator.storage.persist()` for a page
opened from disk, so the feature would promise protection the browser does not
give. The major version marks the change in what restore does to existing data.

## Verification and limits

The regression log for this exact build is in `TEST_RESULT.txt`; counts and hashes
are in `BUILD_FACTS.md`. Nine new tests drive the real restore dialog with backups
built by the tool's own checksum functions. Run against the v1.16.0 build, the six
that need the new restore could not run, the two Undo tests failed there,
reproducing the emptied library, and the colleague-pack test failed on the
"undefined" label. Every earlier test passed there; one portfolio-export timing
test failed once and passed on a rerun.

- An older backup restores the backup's version of a changed template, adds one it
  holds that you deleted, keeps a template created since, and keeps a same-name
  template of different lineage renamed; the dialog states each count and the
  audit entry records a merge.
- An unticked library is untouched; Cancel changes no template and adds no draft.
- Replace all replaces nothing when the prior backup is not confirmed, and when it
  is, replaces the list and leaves an undo copy.
- Undo reverts a merged library and a colleague import; an undo copy in the old
  format still restores, and an unreadable one changes nothing.
- A tampered backup is refused before any preview; a colleague pack still gets its
  own preview, without the replace button, and no "undefined" label.

Limits: a restore matches templates the way a colleague import does, so a template
renamed and edited in a copy that never shared its identifier is treated as a
different template and kept alongside. Undo is one level per library.
