# PRD implementation update - v2.20.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Copying

| Added | Does |
| --- | --- |
| `dashCopyTplKind(rec)` | `'dd254'`, `'type'` or `''` - what kind of template the record was built from |
| `dashCopyTplLabel(rec)` | The name of that template, for the dialog |
| `dashCopyResetBlocks(ws)` | Clears Blocks 10 to 16 and the template link from a workspace |
| `dashDateForInput(v)` | A stored date as a date field can show it |

- `dashCopyTplKind` reads three markers, because three paths apply a DD-254
  template: `selects.ctTplSel`, `ctSource` (the order repository) and the
  carried snapshot's `srcLabel` with no `ctType` (the library's own apply).
- `dashCopyPrompt` in the reset case: a notice, empty contract fields with a
  datalist of the repository's contract numbers, a **Same contract** button, a
  live `cp_match` note from `dashIntakeMatch`, and a refusal to answer without a
  prime contract. Its result gains `resetBlocks` and `template`.
- `dashDuplicate` resets, writes the named identifiers, applies the matched
  template with `ctApplyDataToWorkspace`, then runs `dashPartyApply` - the same
  order creating a DD-254 follows, so what was typed wins over what the template
  carries. The audit entry says what was rebuilt, or that nothing was.
- `dashPartyRow` normalises a date value through `dashDateForInput`, which fixes
  the copy, create and rename dialogs together.
- The copy overlay scrolls.

## Standard language

| Added | Does |
| --- | --- |
| `SL_EDIT_KEEP` | The share of an entry's wording that must survive: 0.5 |
| `slWordsOf` / `slRunsOf` | An entry, or Item 13, as lower-case words and their three-word runs |
| `slSurvivesIn(entryText,body,bodyRuns)` | Exact first; otherwise the share of the entry's runs found in Item 13 |

- `slAppliedIn` uses it, so everything that asks "is standard language there" -
  the mandatory finding, the automatic insert, the record's own `stdLang` and
  the rail - gets the same answer. Item 13's runs are computed once per call.
- An entry with fewer than four runs is matched exactly or not at all: it is too
  short to recognise once edited.

## Unchanged and deliberately so

Copies with no DD-254 template behind them; `dashResetWorkflow`; what a copy
does to Item 3 dates, notes and to-dos; `dashIntakeMatch` and its exact-match
rule; the stored format of dates. No store changed shape and no backup format
moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.20.0.md) and
[prior implementation map](IMPLEMENTATION_v2.19.0.md).
