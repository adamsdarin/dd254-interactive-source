# PRD implementation update - v2.15.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Security managers

| Added | Does |
| --- | --- |
| `smPrograms(m)` | A manager's programmes, from `programs` or from the single `program`, de-duplicated and trimmed |
| `smProgramsSet(i,arr)` | The one writer; mirrors `program` to the first entry |
| `smProgramEdit` / `smProgramAdd` / `smProgramDel` | The editor rows; add and delete save before redrawing, because `dashTplEdit` rebuilds the list from the store |
| `ctSmProgRender(i,ps)` | Points the template row's programme control at the assigned manager's programmes and says when a choice is outstanding |

- `ctSetSm` fills the programme when a manager runs one, keeps a programme the
  manager runs, and clears one they do not.
- `ctProgramOptions` reads every programme a manager runs.
- The `sm` CSV column becomes `Programs`, semicolon-separated.
- `program` is never removed. It is written on every save as the first
  programme, so the party dialog, the duplicate detector, the CSV and an older
  build all keep working unchanged.

## Block 18f

- `ctApplyDataToWorkspace` exempts `c18['18f']` from the group that replaces
  blanks, and writes `dist18fOther` only when the template both ticks 18f and
  carries an address.
- `ctInsertAll`'s confirmation no longer promises to clear Item 18f contacts.
- Nothing else in whole-template application changed: every other section still
  replaces, blanks included.

## Item 11c

| Added | Does |
| --- | --- |
| `CAV_PURPOSES`, `cavPurposeOf`, `cavPurposeNow` | The controlled list, and the purpose settled for this DD-254 (nothing when the engine is off) |
| `ctLangVariants(t,key)` | The two wordings a box carries, or null |
| `ctLangVarSet(i,key,which,value)` | The one writer, shared by the editor and the CSV column |

- `ctLangOf` is where the choice is made, so every path that inserts per-box
  language - the box trigger, whole-template application, the rail - gets the
  right clause without knowing the rule.
- `cavEvaluate` keeps its signature and its `text` list; its result gains
  `textFor` (its own wording, named per item) and `purpose`. `cavEngineApply`
  drops its own 11c paragraph when the active template supplies one.
- Template data gains `l11v: {'11c': {testing, producing}}`. A template without
  it behaves exactly as before.

## Unchanged and deliberately so

`dashSpawn`, `collectWorkspace`, `applyWorkspace`, `reqRemember`, the order
repository, and the issuance gate. No store changed shape and no backup format
moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.15.0.md) and
[prior implementation map](IMPLEMENTATION_v2.14.1.md).
