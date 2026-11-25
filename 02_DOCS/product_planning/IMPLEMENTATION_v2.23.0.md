# PRD implementation update - v2.23.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Recording what was applied

`ctLangSrcData(d,label,template)` and `ctLangSrcRemember(d,label,template)` take
the template. When `tplChangeKindOf(template)` finds it in a library, the
snapshot (the hidden `ctLangSrc` field) gains `srcKind` (`ct` or `b13`),
`srcId`, `srcFp` and `srcAt`. `ctApplyDataToWorkspace` and `ctApplySel` pass the
template; every apply path goes through one of the two.

## The fingerprint

`tplCanon` drops `undefined`, `null`, `false`, empty strings, empty objects and
arrays, trailing spaces, and the keys in `TPL_FP_SKIP` (`langModeV`, `ioId`,
`label`, `updatedAt`), and sorts keys. `tplFingerprint(t)` hashes the canonical
JSON of the template's `data`, source fields and security manager with two
FNV-1a passes (16 hex characters). It detects change; it is not a signature.

## The check

`tplChangeInfo()` reads the snapshot, skips final statuses, finds the template
again (`tplChangeFind`) and compares fingerprints, honouring `srcAck` set by
Keep. A snapshot with no fingerprint is given one from today's template
(`tplChangeLegacy`, marked `srcBaseline`). `buildPanel()` adds the warning and
calls `tplChangeRender` for `#tplChangedBanner` in the title bar.
`tplChangeUpdate()` re-applies through `dashApplyTpl` / `dashApplyB13`, which
gained `{confirmed:true}` so the user is asked once; `tplChangeKeep()` writes
`srcAck` and audits `template-change-kept`.

## Unchanged and deliberately so

What applying a template writes to the DD-254; the task-order source banner;
the stored shape of templates, records and backups (the snapshot is an
existing text field).

See [release assessment](../RELEASE_ASSESSMENT_v2.23.0.md) and
[prior implementation map](IMPLEMENTATION_v2.22.0.md).
