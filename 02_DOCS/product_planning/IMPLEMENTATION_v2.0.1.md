# PRD implementation update — v2.0.1

Point release in the v2.0 horizon. The browser-only constraint is unchanged.

Implemented (owner report of 15 September 2026, against the DD Form 254 Instructions
for Item 3): Revisions and Finals carry and print the Original's date in Item 3a,
which is required and may not change; Revisions are numbered in sequence within each
issuance and the number must be a whole number; an award Original spawned from a
Solicitation starts with Item 3a empty.

Plan for the horizon is unchanged: 4.4 approval package (Section 508 accessibility
conformance report from an actual audit, CycloneDX software bill of materials, and a
two-page ISSM brief) is next. 4.1 persistent storage is skipped by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v2.0.1.md), and [prior implementation
map](IMPLEMENTATION_v2.0.0.md) for earlier coverage.

Acceptance: a Revision spawned from an Original or Revision shows the Original's date
in 3a on screen and on both PDFs, and its revision number is the next in sequence; a
blank or changed 3a, or a blank or non-numeric revision number, blocks export; official
and demo builds pass browser and regression checks.
