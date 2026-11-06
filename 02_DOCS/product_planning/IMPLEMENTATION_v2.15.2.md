# PRD implementation update - v2.15.2

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## The supported-effort line

| Added | Does |
| --- | --- |
| `supLineFor(order)` | The line's wording for an order number |
| `supWant(order,standalone)` | Whether there is a line at all: none when the DD-254 is the order's own |
| `supStandalone()` | The coverage answer as the form holds it |
| `supText(text,want)` | The line as an operation on text, anchored at the head |

- `supBuild()` is now `supWant(supNum(),supStandalone())`, so every caller of
  `supSync` inherits the coverage rule.
- `supSync`'s no-match branch goes through `supText`, which strips a head line
  the tool does not recognise as its own before writing what is wanted. That is
  what lets a record from an older build be corrected without doubling the line.
  The SUP_LAST in-place rewrite is untouched, so a line the preparer moved stays
  where they moved it.
- `ctApplyDataToWorkspace` reconciles `ws.texts.item13` after composing it, from
  the workspace's own order number and coverage. This is the path every DD-254
  generated from the order repository takes, and the one that produced the
  report.
- `dashOpen` calls `supSync` under the same `I13_FINAL_STATUS` guard as
  `cmaSync` and `slAutoApply`.
- `dashCreate` calls `supSync` after the typed order number and its coverage are
  written - they are written after any matched template is applied, so the form
  writer's own sync had already run against an empty field.
- The `iStandalone` checkbox's handler calls `supSync` before `run`.

## Autosave

- `dashSaveNow` captures `DASH.current` once, uses it for the read and the
  fallback record, and returns without writing if `DASH.current` has changed by
  the time it is ready to write.

## Unchanged and deliberately so

Item 2a's combined export, the order repository's coverage model
(`ctOrderCoverage`, `dd254OrderStandalone`), `i13SupOffset` and
`i13HeadOffset`, the classified mailing address tail region, `collectWorkspace`,
`applyWorkspace`. No store changed shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.15.2.md) and
[prior implementation map](IMPLEMENTATION_v2.15.1.md).
