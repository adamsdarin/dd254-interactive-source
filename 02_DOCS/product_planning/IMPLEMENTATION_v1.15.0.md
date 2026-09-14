# PRD implementation update — v1.15.0

First release of the v1.15 preparer-throughput horizon. The browser-only
constraint is unchanged: one downloadable HTML file, the existing browser
database and user-managed backups.

Implemented (owner requests added to the horizon on 14 September 2026):

- Dashboard cards label Items 2a, 2b and 2c as Prime, Subcontract and Solicitation.
- Dashboard search matches every term in any order, with exact quoted phrases and
  hyphen-insensitive contract numbers.
- Spawning an Original, Revision or Final resets NISS verification and prompts
  re-confirmation for the new issuance.

Planned as separate point releases, in this order: received DD Form 254 import as
a read-only parent for subcontract preparation; security classification guide
reference library; sensitive-terms screen for Items 9 and 13; revision summary in
Item 13; Final-due prompt and demonstration portfolio. NCCS alignment is out of
scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.0.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.14.1.md) for earlier coverage.

Acceptance: a subcontract card shows its prime and subcontract numbers together;
requestor, subcontractor CAGE and prime number typed in either order find the same
single record; a contract number typed without hyphens matches; every spawned
stage starts with NISS unverified and a re-confirm prompt when the parent was
verified; Copy keeps NISS verification; official and demo builds pass browser and
regression checks.
