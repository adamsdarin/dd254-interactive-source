# PRD implementation update — v2.0.3

Point release in the v2.0 horizon. The browser-only constraint is unchanged.

Implemented (owner request of 18 September 2026): the release label shown in the
window title, the form header and the review-package PDFs is the product name,
"DD254 Interactive", with the version; documentation uses the same name. No
behaviour changed.

Plan for the horizon is unchanged: 4.4 approval package (Section 508 accessibility
conformance report from an actual audit, CycloneDX software bill of materials, and a
two-page ISSM brief) is next. 4.1 persistent storage is skipped by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v2.0.3.md), and [prior implementation
map](IMPLEMENTATION_v2.0.2.md) for earlier coverage.

Acceptance: the header, title and review-package release line read "DD254
Interactive" with the version; official and demo builds pass browser and regression
checks.
