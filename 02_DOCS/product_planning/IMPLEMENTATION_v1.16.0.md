# PRD implementation update — v1.16.0

First release of the v1.16 contracting-officer readiness horizon. The browser-only
constraint is unchanged.

Implemented (roadmap item 3.1, owner decisions of 15 September 2026): separate
Government CO / GCA and Prime subcontract review packages, chosen from Item 2b or 7a
and confirmable, each on screen or as a PDF identifying the draft, stage and tool
release on every page.

Plan for the horizon: 3.3 signer readiness sheet and a written go/no-go on a
non-XFA edition, then 3.5 the generated validation rule catalog with an "authority
baseline as of" date. 3.4 (NCCS transcription view) is dropped by owner decision.
3.2 (CMMC prompts) waits for DFARS 252.204-7021, 252.204-7025 and 32 CFR Part 170 to
reach an approved library release; source requests are filed with the Custodian.

See [release assessment](../RELEASE_ASSESSMENT_v1.16.0.md), and [prior implementation
map](IMPLEMENTATION_v1.15.7.md) for earlier coverage.

Acceptance: a prime form's package has no subcontract-only actions and a subcontract
package has no government-only actions; each exported PDF identifies the draft, the
stage and the tool release; official and demo builds pass browser and regression
checks.
