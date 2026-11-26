# PRD implementation update - v2.25.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

| Added | Does |
| --- | --- |
| `rcv254Prime` | Splits an exported Item 2a ("PRIME" or "PRIME \| Task Order N") into prime, order and order type |
| `rcv254Level` | Reads a form level word (Secret, None, N/A ...) back into the tool's code |
| `tplSrcLevels` | "Items 1a/1b as received: Secret / None", or nothing |
| `ctChainGap`, `ctSrcFacts` | A typed template with no prime is flagged on its repository row, with its 1a/1b source facts |

Changed: `rcv254Parse` sets `data.primeContract`, `taskOrder`, `orderType` and
returns `srcFcl`/`srcSfg`; `rcv254Import` stores them on the template and its
preview says what was taken; `rcv254Summary` reports Item 2a and Items 1a/1b;
`ctSourceSnapshot` carries `srcFcl`/`srcSfg`; `ctSetPrime` repaints the row;
`tplRevOpen` shows the 1a/1b facts of the newest revision; `dashSaveNow` does
not write a record that is not stored; the completion meter's total is the
length of its list.

Removed: `flowIssuesLive` and its calls in `run()`, the Preparer's Worksheet
and the CO package; the card's flow-down chip; `buildClausesPanel`,
`buildFlowDownPanel`, `buildTemplateLanguage` and the hidden `#clausesPanel`,
`#flowDownPanel`, `#bpButtons` markup.

Unchanged: `dashFlowIssues` (kept for Phase 4), `dashParentIsIssuance`,
`coPackageModel` (its output compared before and after), the stored shape of
records. Templates gain only the optional `srcFcl`/`srcSfg`; every earlier
backup and template export still imports.

See [release assessment](../RELEASE_ASSESSMENT_v2.25.1.md),
[roadmap](REVIEW_AND_ROADMAP_2026-11.md) and
[prior implementation map](IMPLEMENTATION_v2.25.0.md).
