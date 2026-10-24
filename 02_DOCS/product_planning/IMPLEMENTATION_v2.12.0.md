# PRD implementation update - v2.12.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

Removed:

- `DD254_BASE_B64`, the `DD254Export` module (`buildOfficialPdf`, `wrap`) and
  `exportOfficial254`. `collect254Data` stays: the XFA exporter reads it. The
  Item 13 toolbar and `fmt13` go too, replaced by `i13PastePlain`.
- `standalone` from captured template data and from the CSV export.
- The release tooling stopped requiring the flat payload: `make_build_facts.py`,
  `rebuild_kit/split.py`, `rebuild_kit/rebuild.py` and `make_sbom.py` all treat
  it as optional now and describe only what a build carries. The XFA payload
  stays mandatory.

Added:

- `dashMailAttachments`, `dashMailBody`, `dashCopyText` and the copy helpers;
  `dashIssueMailMany` returns `atts`, `body` and `bodyInHref`.
- `ctAttSplit`, `ctAttSync`, `ctAttRowsHtml`, `ctAttSet/Add/Del`. `attText`
  remains canonical; `attList` is the editor's working copy.
- `dashPartyRow` and `dashSmOptionsHtml`, shared by the intake and copy
  dialogs. `dashCopyPrompt` takes the record and returns `{mode,stage,party}`.
- `dd254OrderStandalone(prime,order)`, derived from `ctOrderCoverage`.
- `slHeadEnd`, `slPositionGet/Set`, `pdqTextGet/Set`.
- `DD254_SCENARIOS`, `dd254ScenarioOf/Label/Fits`, `slScenarioOf`,
  `ctScenarioOf`, `dd254StageScenario`, `slScenarioForForm`.
- `lbOpenGet/Set`, `lbApply`, `lbToggle`, `lbRender`, `cavEnginePanelHtml`.
- `ctCaveatKeys`, `ctCaveatAlways`, `cavChosenGet/Set`, `cavWanted`,
  `cavNotice`; `ctAutoLangKey` withdraws on untick.
- `CAV_ARCHETYPES`, `cavEvaluate` (pure), `cavEngineGet/Set/On`,
  `cavEngineAnswers`, `cavEngineApply`. Surfaced in both the intake dialog
  (`np_eng`) and the language banner, which is the architecture's hybrid.
- `ctAlwaysSet`, and the always-insert control beside each Item 10/11
  language box in the template editor, alongside the CSV column.

Settings gained: `caveatEngineEnabled` (off), `pdqText`, `slPosition` (top).
Storage keys: `dd254_caveat_engine`, `dd254_pdq_text`, `dd254_sl_position`,
`dd254_left_banner`. Workspace fields: `cavChosen`, `cavEngine`.

New document: [Item 13 fixed-text inventory](../DD254_Item13_Fixed_Text_Inventory.md).

See [release assessment](../RELEASE_ASSESSMENT_v2.12.0.md) and
[prior implementation map](IMPLEMENTATION_v2.11.0.md).
