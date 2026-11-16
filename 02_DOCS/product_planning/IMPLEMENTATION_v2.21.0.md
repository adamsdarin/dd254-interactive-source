# PRD implementation update - v2.21.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## The template chooser

| Added | Does |
| --- | --- |
| `dashTplChooserHtml(p,o)` | Markup: kind buttons, one select, one status line (`o.noteId`); `o.keep` adds **Keep as copied** |
| `dashTplChooser(g,p,o)` | Wires it. Returns `mode()`, `manual()`, `value()`, `match(m)` |
| `dashTplKey(e)` | Identity of a pool entry across separate loads of the libraries |
| `dashTplFiledNote(v,prime)` | The sentence shown when a DD-254 template is filed under another contract |

- One implementation, used by `dashPartyPrompt` (prefix `np`, creation only)
  and `dashCopyPrompt` (prefix `cp`, every copy).
- `match(m)` takes a `dashIntakeMatch` result. Until the operator touches the
  control it selects `m.one` and its kind; afterwards it only remembers the
  match. In a `keep` dialog it never moves the selection.
- `value()` returns `{t, kind, idx, level, chosen}`. `chosen` is false only
  when the selection is the automatic match; the audit entry says which.
- The status lines keep their ids (`np_match`, `cp_match`) and now live inside
  the chooser. They report what is selected, not what matched.

## Creating

- `dashNewDraft` settles the template before the first `draftPut`: `ctType` and
  a security manager taken from the template are part of the record as stored.
  `DD254_CT_APPLIED` is set once, after the form is reset, and no longer
  cleared at the end.
- A Contract Type is not written to `selects.ctTplSel`.

## Copying

- `dashCopyPrompt` answers `{mode, stage, resetBlocks, template, title, party}`.
  `resetBlocks` is true whenever the chooser is not on **Keep as copied**.
- The name: `follow` starts true when the original's name is one the tool
  composed, and becomes true on the first edit of an identifying field.
  `nameNow()` composes with `dashNameCompose`, adds the solicitation suffix,
  and prefixes "Copy of" only when the result equals the original's name.
- `dashDuplicate` uses the dialog's title and no longer overwrites it.

## The pencil

- `dashPartyPrompt` takes `nameStage`. A title is the tool's own when it is the
  composed name, with or without the solicitation suffix or "Copy of", or the
  pre-v2.20.1 composition.
- `keepOr(id,was)`: a field the dialog did not render answers with the value it
  was opened with, for the name and for the result.

## Unchanged and deliberately so

`dashIntakeMatch` and its exact-match rule; `dashCopyTplKind`; what a copy does
to workflow history and Item 3 dates; the stored shape of records, templates
and backups.

See [release assessment](../RELEASE_ASSESSMENT_v2.21.0.md) and
[prior implementation map](IMPLEMENTATION_v2.20.1.md).
