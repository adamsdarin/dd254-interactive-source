# PRD implementation update - v2.13.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

Added, mirroring the standard-language module function for function:

| Standard language | Contract templates |
| --- | --- |
| `slLevelOf` | `ctLevelOf` (template first, captured data second) |
| `slMatches` | `ctMatchesForm` |
| `slCandidates` | `ctCandidates` |
| `slPanelState` | `ctPanelState` |
| `slPanelShowAll` | `ctPanelShowAll` |
| `slRenderPanel` | `ctRenderFitPanel` |

- `ctLevelSet` and `ctScenarioSet`, one writer each, called by the two new
  selectors in the contract-template editor.
- `ctCaptureData` records `level` from `fcl1a`.
- A `#ctFitPanel` section in the checklist panel, rendered wherever
  `slRenderPanel` is.

Unchanged and deliberately so: `ctOrderRows`, `ctOrderCoverage`,
`ctOrderSource`, `ctSourceSnapshot`, `ctDuplicatePairs` and the rest of the
repository. Section 135 asserts they still exist, because the risk in a change
described as "rebuild it like the other one" is losing the parts the other one
never had.

See [release assessment](../RELEASE_ASSESSMENT_v2.13.0.md) and
[prior implementation map](IMPLEMENTATION_v2.12.0.md).
