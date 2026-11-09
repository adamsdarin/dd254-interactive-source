# PRD implementation update - v2.18.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## The pair

| Added | Does |
| --- | --- |
| `SM_PAIR_SEP` | The separator, the middle dot already used in manager labels |
| `smPairLabel(name,program)` | The label for one manager and one programme |
| `smPairParse(text,sms)` | Reads a pair, a bare name, or neither; exact name first, then split from the right |
| `smPairsFor(program,sms)` | Every pair, narrowed when a programme is named |
| `ctSmListRender(i)` | Repopulates one row's manager list from that row's programme |

- The row's manager control has its own datalist, `ctSmList_<i>`, instead of the
  one shared `ctSmList`, because the options now depend on the row.
- `ctSetSm` resolves through `smPairParse`; a programme carried by the pair wins
  over the "one programme fills it, several leave it blank" rule, which still
  applies to a bare name.
- `ctSmProgRender` ends by calling `ctSmListRender`, and the programme input
  calls `ctSmProgRender`, so the two controls keep each other in step in both
  directions. The input is not rewritten while it has focus.
- The row's note reports a manager-programme mismatch rather than resolving it.

## The create dialog

- The option text is the manager's name followed by every programme from
  `smPrograms(m)`.
- The recorded `securityManager` gains `programs`, and `program` holds the single
  programme only when the manager runs exactly one.
- `dashSecurityManagerLabel` and `distSmAdd` read `smPrograms`, so a record
  written before this release - carrying only `program` - reads unchanged.

## Unchanged and deliberately so

`smPrograms`, `smProgramsSet` and the Security Manager editor; `ctProgram`,
`ctProgramOptions` and the programme-matching rules for standard language; the
distribution and issuance paths. No store changed shape and no backup format
moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.18.0.md) and
[prior implementation map](IMPLEMENTATION_v2.17.0.md).
