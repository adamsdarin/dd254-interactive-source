# PRD implementation update - v2.20.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

## Naming

| Added | Does |
| --- | --- |
| `dashNameComposeLegacy(p)` | The name v2.20.0 and earlier composed, kept only to recognise it |
| `dashSolRetitle(rec)` | Retitles a solicitation whose title is exactly the legacy composition of its own identifiers |

- `dashNameCompose` adds the solicitation number to the tail when a contract
  number leads the name; with no contract number it already leads and is not
  repeated.
- `dashRecountDrafts` calls `dashSolRetitle` on each record it rewrites, which is
  every record once after an update.

## Unchanged and deliberately so

An Original's name, the " - Solicitation" suffix, the rename dialog, and every
title a person typed. No store changed shape and no backup format moved.

See [release assessment](../RELEASE_ASSESSMENT_v2.20.1.md) and
[prior implementation map](IMPLEMENTATION_v2.20.0.md).
