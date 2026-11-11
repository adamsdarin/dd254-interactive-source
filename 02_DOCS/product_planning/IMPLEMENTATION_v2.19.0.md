# PRD implementation update - v2.19.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## The embedded form

- `DD254_XFA_B64` carries one `activity="ready" ref="$form"` event on each of
  `fourteen_No` and `fifteen_No`, running the same body as the `change` event
  the form already had, minus the line that unselects the Yes radio - that part
  is about a click, not about state.
- The patch was applied once, offline, through the page's own pdf-lib: inflate
  the template packet, insert, deflate, assign a new `PDFRawStream` and save, so
  the cross-reference table is rebuilt by the same writer the export uses.
- Section 148 reads it back out of the build and asserts it.

## The caveat engine

| Added | Does |
| --- | --- |
| `cavTextToWrite(out)` | The paragraphs applying would write, with the template-owned 11c paragraph removed |
| `cavPending(out)` | How many boxes and paragraphs are not yet as the answers say, and how many were offered at all |

- The Apply button is rendered from `cavPending`: `offered===0` is the only grey
  state, `total>0` is blue, `total===0` is blue with a tick.
- `cavEngineApply` writes each paragraph through `i13InsertPara` at
  `i13BoxOffset` when the paragraph belongs to a box, and above the tail
  otherwise.

## Item 13 placement

| Added | Does |
| --- | --- |
| `ctLangAnyFor(key)` | The wording this DD-254 would use for a box, template first then engine |
| `i13BoxOffset(text,key)` | Where a clause for that box belongs, between the head and tail regions |
| `i13InsertPara(text,at,para)` | One paragraph in, with one blank line each side |

- `ctAutoLangKey` and `ctForceLang` place through them; `ctApplySel` passes the
  key it is inserting for.

## The bids-due finding

- `dd254TodayYmd()` is local-calendar, not UTC.
- The finding is raised in the main validation pass, like every other, and
  skipped when `window.DD254_STATUS` is one of `I13_FINAL_STATUS`.
- `window.DD254_STATUS` is set by `dashOpen` and by `dashRecountDrafts`, and
  cleared by `resetFormFields`, so an open record and a recounted one agree.

## Unchanged and deliberately so

The XFA datasets builder and the export path, the issuance gate's own rules,
`i13HeadOffset` and `i13TailOffset`, the classified mailing address region. No
store changed shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.19.0.md) and
[prior implementation map](IMPLEMENTATION_v2.18.0.md).
