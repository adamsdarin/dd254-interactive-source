# PRD implementation update - v2.15.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Where a box's wording comes from

| Added | Does |
| --- | --- |
| `ctLangSrc` (hidden field) | What the applied template says for each Item 10/11 box, carried on the DD-254 |
| `ctLangSrcData(d)` / `ctLangSrcRemember(d)` | The one writer of that field |
| `ctLangSnapshot()` | Reads it back as a template-shaped object |
| `ctLangSourceFor(key)` | The picker's template first, then the snapshot; whichever has wording for the box |
| `ctLangFromData(d,key,purpose)` | The wording rule, as a pure function of data |
| `cavPurposeForWs(ws,live)` | The purpose of the DD-254 being written, not of the one on screen |

- `ctAutoLangKey` resolves through `ctLangSourceFor` instead of `ctActiveTpl`.
  Nothing else about it changed: the insert, the withdraw, the `addOnly` paths
  and the edited-wording notice are as they were.
- `ctLangOf(t,key)` is now `ctLangFromData(t.data,key,cavPurposeNow())`, so the
  box trigger and whole-template application cannot read the same template
  differently.
- The field is an ordinary hidden text input, so `collectWorkspace`,
  `applyWorkspace` and `resetFormFields` already carry, restore and clear it.

## Whole-template application

- Item 13 is composed from wording that the template ticks **or** marks always,
  rather than from the ticks alone.
- The wording is taken through `ctLangFromData` with the purpose of the record
  being written, so Item 11c's variants apply on this path too.
- `ctApplySel` (apply one block's selections) follows the same two rules and
  remembers the same snapshot.

## The editor

- The wording box and the mode select are shown whenever there is wording, not
  only while the template ticks that box. The checkbox's and textarea's own
  handlers keep them in step as text is typed or cleared.

## Unchanged and deliberately so

The two modes and their default (unmarked waits for its box), what applying a
template does to Items 10, 11, 16 and 18, `dashSpawn`, `collectWorkspace`,
`applyWorkspace`, the order repository and the issuance gate. No store changed
shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.15.1.md) and
[prior implementation map](IMPLEMENTATION_v2.15.0.md).
