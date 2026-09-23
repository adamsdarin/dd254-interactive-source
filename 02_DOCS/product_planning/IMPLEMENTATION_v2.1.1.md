# PRD implementation update — v2.1.1

The original browser-only constraint remains: one downloadable HTML file, the
existing browser database, and user-managed backups. Docker/Kubernetes hosting
remains a separate future phase.

Fixed: the v2.1.0 facility-to-certifier link reached Item 17 only inside
`applyFacTplFromSearch`, so it never fired for a draft that was opened, typed or
spawned. `facCertSync` now resolves the facility from the CAGE in Item 6b
(`facTplExactCage`, an exact match rather than the filter's prefix match) and
fills Item 17 through `certFillBlank17`, which acts only when every Item 17 field
is empty. It runs from `dashOpen` after the workspace is applied, and from a
`change` listener on Item 6b wired once at load.

No storage format change and no change to the explicit apply path, which still
replaces Item 17 outright.

See [release assessment](../RELEASE_ASSESSMENT_v2.1.1.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v2.1.0.md) for earlier
coverage.

Acceptance: opening a draft whose Item 6b names a linked facility fills Items
17a, 17b, 17c, 17e, 17f and 17g; committing that CAGE in Item 6b does the same;
a partial CAGE and a facility with no linked official fill nothing; an Item 17
holding any value is left entirely alone; applying a facility by CAGE still
replaces Item 17; official and demo builds pass browser and regression checks.
