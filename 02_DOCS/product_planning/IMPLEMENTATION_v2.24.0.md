# PRD implementation update - v2.24.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

| Added | Does |
| --- | --- |
| `tplChangeSnapOf(ws)` | The `ctLangSrc` snapshot of a stored workspace |
| `tplChangeForWorkspace(ws)` | `tplChangeInfo` against a stored record, ignoring status and `srcAck` |
| `dashSpawnTplHtml(tch,what,from)` | The question's markup, used by both dialogs |
| `dashSpawnTplWire(root,state)` | Its two choices |
| `dashSpawnTplPrompt(src,kind,tch)` | The dialog for a Revision or Final |

`dashSpawn` computes the check before anything is made, passes it to
`dashSpawnPrompt(src,tch)` for an Original (its answer gains `tpl`), and asks
`dashSpawnTplPrompt` for a Revision or Final only when the template changed.
On "current" the child's workspace goes through `ctApplyDataToWorkspace` after
its stage fields are written, and `ctTplSel` or `ctType` is set to match.

Unchanged: spawning when the template is unchanged; the stored shape of
records, templates and backups.

See [release assessment](../RELEASE_ASSESSMENT_v2.24.0.md) and
[prior implementation map](IMPLEMENTATION_v2.23.0.md).
