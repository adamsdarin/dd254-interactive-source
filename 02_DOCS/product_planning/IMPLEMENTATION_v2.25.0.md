# PRD implementation update - v2.25.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

| Added | Does |
| --- | --- |
| `tplChainKey`, `tplChainTyped` | Contract + task order; only Original/Revision templates are links |
| `tplChainRank`, `tplChainCmp` | Government revision, then source date, then last edit |
| `tplChainOf`, `tplChainLatest`, `tplChainSame` | The chain, its newest link, identity |
| `tplChainVersion` | "v2 · Government Revision 1 · source ..." |
| `tplChangeDiff` | Shared by the open-form and spawn checks; a superseded template is a change toward the newest link |
| `tplRevNeeded`, `tplRevSnapId` | The newest record of each line built from a superseded template |
| `tplRevNotice`, `tplRevChip`, `tplProvLine` | Dashboard notice, card chip, card provenance line |
| `tplRevOpen`, `tplRevExempt` | The Review list; exemption stored as `rec.revExempt` |

Changed: `ctLatestSource` sorts by `tplChainCmp`; `dashIntakeMatch` collapses a
chain to its strict latest and returns `chain`; `ctLangSrcData` records
`srcVer`; `ctPickerEntries` and `dashTplChooser` mark superseded templates.

Unchanged: the template editor and the stored shape of templates; records gain
only the optional `revExempt`.

See [release assessment](../RELEASE_ASSESSMENT_v2.25.0.md) and
[prior implementation map](IMPLEMENTATION_v2.24.0.md).
