# PRD implementation update — v2.1.0

The original browser-only constraint remains: one downloadable HTML file, the
existing browser database, and user-managed backups. Docker/Kubernetes hosting
remains a separate future phase.

Added: a certifying-official link on a facility template. The facility editor row
carries a second dropdown listing the Certifying Officials library
(`dashTplFacCert`), and applying a facility template by CAGE fills Item 17 from
the linked official (`certTplFor` resolves the link, `certFill` writes the six
fields, shared with the existing Item 17 dropdown). The facility spreadsheet gains
a Certifier Link column (`ioCertLink`).

This closes the gap between the two libraries that already existed: facilities
carried their 6c CSO but not the official who certifies Item 17 for them, so that
selection was repeated on every form. It reuses the CSO link's shape rather than
introducing a second linking mechanism.

No storage format change. `certLabel` and `certSnap` are optional fields on a
facility entry; earlier drafts, backups, template exports and spreadsheets load
unchanged, and this version's facility entries load in an earlier build with the
link ignored. Existing approval holds, backup behaviour and the v2.0.x
corrections are retained.

See [release assessment](../RELEASE_ASSESSMENT_v2.1.0.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v2.0.3.md) for earlier
coverage.

Acceptance: the facility editor shows one certifier dropdown per row listing the
Certifying Officials library with the linked official selected; selecting one
stores the label and a snapshot; applying the facility fills Items 17a, 17b, 17c,
17e, 17f and 17g; a facility with no linked official leaves Item 17 untouched; a
corrected library entry wins over the snapshot; the link survives the facility
spreadsheet round trip; official and demo builds pass browser and regression
checks.
