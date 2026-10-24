# PRD implementation update - v2.14.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

One change in the tool, in `dashPartyPrompt`: a closure-local `autoFilled`
flag and an `autoClear()` that empties the requester name fields when the
address no longer identifies one person. `autoFilled` is set only where the
dialog writes those fields itself and cleared whenever the operator types in
them, so `autoClear` can never take back a typed name. No signature changed.

Everything else is in `01_TOOL/demo_seed.html`, which is appended to the
official build to make the demonstration build.

| Added to the seed | Does |
| --- | --- |
| `REQUESTERS` | Four programme contacts, keyed by contractor CAGE |
| `exRequester(cage)` | Resolves a draft's requester from the Item 6 CAGE already on its workspace, so a draft cannot be requested by another contractor's office |
| `seedRequesters(recs)` | Builds the repository from the seeded drafts and publishes it on `window.DD254_DEMO_REQUESTERS` |

- `exRec` now sets `requestedBy`, `requestedByName` and `requester`.
- `seedRequesters` runs after `draftPut`, so it counts records that exist.
- It uses the existing `seed()` helper, which leaves a non-empty store alone.
  That is why the rows are published on `window` as well: in the regression
  window an earlier test has already put a requester in the store, so what was
  derived is the only thing an assertion can read.

See [release assessment](../RELEASE_ASSESSMENT_v2.14.1.md) and
[prior implementation map](IMPLEMENTATION_v2.14.0.md).
