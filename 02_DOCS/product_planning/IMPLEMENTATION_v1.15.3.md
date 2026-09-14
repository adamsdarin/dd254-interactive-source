# PRD implementation update — v1.15.3

Fourth release of the v1.15 preparer-throughput horizon. The browser-only
constraint is unchanged.

Implemented (roadmap item 2.3, with owner decisions of 14 September 2026 on
fingerprint storage, warning-only behaviour and Items 9 and 13): a per-browser
sensitive-terms list stored as salted SHA-256 fingerprints, whole-word matching in
Items 9 and 13, a warning that never names the term, and an on-screen note that
never prints.

Remaining v1.15 point releases, in order: revision summary in Item 13; Final-due
prompt and demonstration portfolio. NCCS alignment is out of scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.3.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.2.md) for earlier coverage.

Acceptance: no term is stored or shown in readable form outside the on-screen note;
a listed term in Item 9 or 13 raises a warning naming only the item; the list is
absent from Full Backup, packs and exports; official and demo builds pass browser
and regression checks.
