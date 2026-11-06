# PRD implementation update - v2.17.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## A required contract template

| Added | Does |
| --- | --- |
| `CT_REQ_KEY`, `ctRequired`, `ctRequiredModeGet/Set` | The setting, stored like every other, and logged when it changes |
| `ctTplUsedLabel()` | The name of the template this DD-254 was built from: the picker, then `DD254_CT_APPLIED`, then the carried snapshot's `srcLabel` |
| `ctRequiredError()` | The finding, worded like `slRequiredError` beside it |

- Raised in the same two places as the standard-language finding: the main
  validation pass and the issuance gate's `must` list. Being an ordinary finding
  means it holds the status at Draft, shows in the panel, and can be set aside
  with a written reason.
- `ctLangSrcData` now records the applied template's name even when the template
  carries no wording and no attachments, so "was a template used" has an answer
  for a template that only makes selections.
- One settings row, `ctRequired`, beside `slRequired`.

## Done

- `nextStep` on the last step runs the validation pass, then reports
  `window.DD254_ERRORS` through `uiAlert` - up to twelve, with a count of the
  rest - and says plainly when the list is empty.

## Wrapping

- `#item13` gains `overflow-wrap:anywhere` and `word-break:break-word` beside
  the `white-space:pre-wrap` it has always had.
- `#tplRows textarea`, `#tplRows input[type=text]` and `#b13Compose textarea`
  get the same, and the repository textareas `resize:vertical`.

## Unchanged and deliberately so

The standard-language requirement and its wording, the issuance gate's own
rules, the XFA datasets builder, `collectWorkspace`, `applyWorkspace`. No store
changed shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.17.0.md) and
[prior implementation map](IMPLEMENTATION_v2.16.0.md).
