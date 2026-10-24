# PRD implementation update - v2.14.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Removed

| Gone | Why |
| --- | --- |
| `lbOpenGet`, `lbOpenSet`, `lbToggle`, the `lbTab` element, the `lb-open` body class, `dd254_left_banner` | The rail is permanent; all of this existed only to hide it |
| `slRenderPanel`, `ctRenderFitPanel`, `#slPanel`, `#ctFitPanel` | The rail renders both libraries; these were the copies that could not insert |
| The intake caveat checklist: `np_cav`, `cavList`, the `cavChosen` field, `cavChosenGet`/`cavChosenSet`, `cavWanted`, and the `caveats`/`caveatsOffered` wiring | A second gate on a clause whose trigger is its own box |
| The level and scenario selects inside `ctEditorHtml` | Moved to the row, not duplicated onto it |

`cavNotice` stays: it is the edited-caveat warning, not part of the checklist.

## Added

| Function | Does |
| --- | --- |
| `lbStandardBody(st)` | The standard-language list on the rail: narrowing, held-back count, preview, insert, and the Block 13 footer |
| `lbContractBody()` | The same for contract templates, with Apply via `ctInsertAll` |
| `ctLangMode(t,key)` | `'always'` or `'box'`; `ctCaveatAlways` is now a thin reader of it |
| `reqByEmail`, `reqLookupEmail`, `reqEmailList` | The address-to-name direction, mirroring `reqFind`/`reqLookup` |

- `lbApply()` keeps its name and is now `lbRender()`, so every existing caller
  is unchanged.
- `slPanelShowAll` and `ctPanelShowAll` re-render the rail. Both keep their
  `window.SL_PANEL_ALL` / `window.CT_PANEL_ALL` flags.
- `dashNewDraft` records the matched template in `workspace.selects.ctTplSel`
  and sets `#ctTplSel`, which is what makes per-box language fire.
- `dashPartyRow` takes a seventh argument, `listId`, attaching a datalist. Every
  existing call passes fewer arguments and is unaffected.
- The contract-template row carries `.ct-program`, `.ct-scenario` and
  `.ct-level`; `ctLevelSet` and `ctScenarioSet` remain the only writers.

## Unchanged and deliberately so

`ctOrderRows`, `ctOrderCoverage`, `ctOrderSource`, `ctSourceSnapshot`,
`ctDuplicatePairs`, `slPanelState`, `ctPanelState`, `slInsert`, `ctInsertAll`,
`reqRemember`. The rail is a new view over the same state; no store changed
shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.14.0.md) and
[prior implementation map](IMPLEMENTATION_v2.13.0.md).
