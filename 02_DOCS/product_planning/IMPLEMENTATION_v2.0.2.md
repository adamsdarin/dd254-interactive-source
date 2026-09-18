# PRD implementation update — v2.0.2

Point release in the v2.0 horizon. The browser-only constraint is unchanged.

Implemented (owner requests of 18 September 2026): Security Classification Guides
linked to contracts from the DD-254 Template Language library, listed first and
marked on those contracts' forms; a Settings choice, off by default, making the
reason optional for set-aside, Blocked and Cancel, with the action still logged.

Plan for the horizon is unchanged: 4.4 approval package (Section 508 accessibility
conformance report from an actual audit, CycloneDX software bill of materials, and a
two-page ISSM brief) is next. 4.1 persistent storage is skipped by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v2.0.2.md), and [prior implementation
map](IMPLEMENTATION_v2.0.1.md) for earlier coverage.

Acceptance: a guide can be linked to one or more contract templates and the link
survives renaming; a form for a linked contract lists its guides first; with the
setting off, reasons stay required; with it on, a blank reason is accepted and
logged as "No reason given"; official and demo builds pass browser and regression
checks.
