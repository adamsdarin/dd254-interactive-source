# PRD implementation update — v2.0.0

First release of the v2.0 horizon. The browser-only constraint is unchanged.

Implemented (roadmap item 4.3, owner decisions of 15 September 2026): restoring a
Full Backup previews and merges templates per library instead of replacing every
list; replace-all remains as an explicit choice after a backup of the current
state. Also fixed Undo after a colleague template import.

Plan for the horizon: 4.4 approval package (a Section 508 accessibility conformance
report from an actual audit, a CycloneDX software bill of materials and a two-page
brief for the ISSM) is the next release. 4.1 persistent storage is skipped by owner
decision, because Chrome does not grant it to a file opened from disk. The v1.16
horizon closed with 3.1; 3.3, 3.4 and 3.5 were not built, and 3.2 (CMMC prompts)
waits for approved library text.

See [release assessment](../RELEASE_ASSESSMENT_v2.0.0.md), and [prior implementation
map](IMPLEMENTATION_v1.16.0.md) for earlier coverage.

Acceptance: restoring an older backup never removes a template created after it;
the preview shows per-library changes before anything is applied; replace-all
cannot proceed without a completed backup; official and demo builds pass browser
and regression checks.
