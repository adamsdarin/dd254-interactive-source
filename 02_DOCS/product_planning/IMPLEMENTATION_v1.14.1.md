# PRD implementation update — v1.14.1

This update corrects the released tool; it adds no PRD requirement and restores
none withdrawn in v1.14.0. The browser-only constraint is unchanged: one
downloadable HTML file, the existing browser database and user-managed backups.
Docker/Kubernetes hosting remains a separate future phase.

Implemented, from the v1.14.1 "trust patch" horizon of the FSO and contracting
officer roadmap review:

- 1.1 Release name rendered from one constant and checked against filename and
  title at build verification.
- 1.2 Item 14/15 titles read from the form in the worksheet and CO Package; the
  CO Package's signature lines removed; SAP subcontract recognised from 2b or 7a.
- 1.3 Demonstration seed citations verified against the approved library and
  guarded by a regression test.
- 1.4 Notice and verbatim export before a draft from an earlier version drops its
  removed log or supporting records.
- 1.5 One-time automatic recount of drafts counted under another tool version;
  the manual recount no longer overwrites concurrent dashboard changes.

Not in this release: the remaining roadmap horizons (received DD Form 254 import,
SCG reference library, audience-specific CO packages, clause review refresh,
storage durability and adoption materials). Each needs its own scope decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.14.1.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.14.0.md) for earlier
coverage.

Acceptance: build verification fails when the filename, `RELEASE_VERSION`,
`<title>` or any literal release string disagree; neither export contains
"Gov't Approval" or "Supplemental Information", and the CO Package contains no
signature line; every seed citation is on the verified list; a draft carrying
earlier-version material cannot be opened without the notice, and Cancel changes
nothing; a portfolio counted under Tool v2.126 is recounted once on load with
statuses unchanged; official and demo builds pass browser and regression checks.
