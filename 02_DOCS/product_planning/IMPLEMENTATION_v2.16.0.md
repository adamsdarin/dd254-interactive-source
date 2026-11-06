# PRD implementation update - v2.16.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Deferring a box to the workflow

| Added | Does |
| --- | --- |
| `ctBoxDeferredIn(d,key)` | Whether this template's data carries wording for that box which waits to be asked for |

- `ctApplyDataToWorkspace` skips `ws.checks['c'+k]` for a deferred box - the
  same shape as the Item 18f exemption - and decides its wording from the tick
  that is already on the record or the form, not from the template's own.
- `ctApplySel` skips the same boxes, so "apply these selections" and "apply this
  template" cannot mean different things about the same clause.
- The mode's own reader, `ctLangMode`, and the box trigger `ctAutoLangKey` are
  untouched: once the preparer ticks the box, v2.15.1's machinery inserts and
  withdraws the clause as it already did.
- The editor's wording changed, not its data: the option reads "Applies when
  <box> is ticked in the workflow" and its tooltip says the template leaves that
  box alone.

## The one-time stamp

| Added | Does |
| --- | --- |
| `TPL_LANG_MODE_V` | The stamp's version, carried on a template's data as `langModeV` |
| `ctLangModeStamp(d)` | Marks every piece of per-box wording in one template's data as always-applies, then stamps it; idempotent |
| `ctLangModeMig(arr)` | Runs it over a loaded store, including the template inside a saved received-DD254 source |

- `tplLoad` applies it to TPL_CT, TPL_B13 and TPL_ORDERS. It is a read-time
  migration, like `ctB13Mig` beside it, so nothing is written until the operator
  saves that template.
- Keys come from the stored wording itself, not from `CT_10`/`CT_11`: `tplLoad`
  can run before those declarations have initialised, and `typeof` does not
  protect a `const` in its temporal dead zone.
- `ctBlankData` carries the stamp, so a template written from now on is never
  retro-stamped and its wording waits by default.

## Attachments

| Changed | Does |
| --- | --- |
| `ctLangSrcData(d,label)` | Also carries `attText`, `attList` and the template's name |
| `ctLangSnapshotOf(raw)` | Parses the snapshot into a `{label,data}` source, for the form and for a stored record |
| `ctTplAttachments` / `dashDistAttachments` | Both consult the snapshot alongside the picker and the recorded Contract Type |

- The snapshot is now written on every whole-template application rather than
  only when the template carries per-box wording, because a template may require
  attachments and no wording.
- `dd254AttFromTemplates` is unchanged and still dedupes case-insensitively, so
  an attachment two sources require is listed once.

## Unchanged and deliberately so

The two settings and their default, `ctAutoLangKey`, the 18f exemption, the
supported-effort line, `collectWorkspace`, `applyWorkspace`. No store changed
shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.16.0.md) and
[prior implementation map](IMPLEMENTATION_v2.15.2.md).
