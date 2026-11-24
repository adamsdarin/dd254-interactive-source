# PRD implementation update - v2.22.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## The template library document

| Added | Does |
| --- | --- |
| `TPLBOOK_REPOS` | The repositories offered, in order, and which are ticked to begin with |
| `tplBookModel(kinds)` | Title, marking, sections of entries of blocks (`kv`, `h3`, `label`, `sub`, `p`) |
| `tplBookCtEntry` / `tplBookSlEntry` / `tplBookGenericEntry` | Lay one template out; the generic one walks `TPL_IO` columns |
| `tplBookPdfBytes(m)` | pdf-lib, standard fonts, marking and page number on every page, outline per repository and template |
| `tplBookDocxBytes(m)` | WordprocessingML with Title/Heading1-3 styles, header and footer, zipped by `tplBookZip` |
| `tplBookZip`, `tplBookCrc32`, `tplBookXml` | Stored zip, CRC-32, XML escaping that drops characters XML 1.0 forbids |
| `tplBookScreen(m)` | Sensitive-terms screen per entry; returns entry names only |
| `tplBookExport(fmt,kinds)`, `tplBookOpen(pre)` | Download and audit (`templates-exported`); the dialog |

`tplBookItems` saves edits still on screen first, as the CSV export does. Laying
a template out works on a copy, so the stored template never gains fields.

## Closed contracts

- Template fields: `closed` (boolean) and `closedOn` (YYYY-MM-DD, set when
  ticked). Absent means open, so nothing stored before needs migrating.
- `ctClosedFor(prime,order)`: a closed template with the prime and no order
  closes every order; one with an order closes that order.
- `ctClosedForForm()`: the template selected above Item 13, else Items 2a and
  the task-order field. `buildPanel()` shows `#a2aClosed` and raises the
  finding unless `DD254_STATUS` is in `I13_FINAL_STATUS`.
- `dashClosedPaint(host,prime,order,chosen)` drives `#np_closed`, `#cp_closed`
  and `#sp_closed`. Pickers append " — CLOSED".
- `TPL_IO` gains `Contract Closed` and `Closed On`; either column order imports.

## Spawning an Original

`dashSpawnPrompt(src)` runs before anything is created; cancelling leaves
nothing behind. The Original gets `texts.i2a`, `texts.iEffort`, `texts.i2b`,
`meta.contract` and `meta.identity` from the answer. Revisions and Finals are
unchanged.

## Unchanged and deliberately so

The CSV/XLSX export and import, the JSON template pack, the rebuild kit and the
SBOM; the stored shape of records and backups.

See [release assessment](../RELEASE_ASSESSMENT_v2.22.0.md) and
[prior implementation map](IMPLEMENTATION_v2.21.1.md).
