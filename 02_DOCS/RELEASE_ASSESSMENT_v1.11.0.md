# Codex Astra v1.11.0 — release assessment

7 September 2026. Internal Tool v2.123. Implements the authorized browser-only
enhancement release following v1.10.0. Release evidence and the exact file hash
are in [BUILD_FACTS.md](../BUILD_FACTS.md); behavior is mapped to the original
requirements in the [PRD implementation map](product_planning/IMPLEMENTATION_v1.11.0.md).

## What changed

1. **Guidance and applicability.** Corrected broad general/SAP retention and
   Final wording across the form's help, template and CO output. Added locally
   recorded source editions, locators, applicability and executed-clause basis.
2. **Contract package.** Added DD254 attachment identity, revision/date
   reconciliation, document version/supersession links and separate delivery
   and acknowledgment evidence. A download does not imply incorporation.
3. **Policy questions.** Added factual questions, competing sources, reviewer,
   response authority/reference and scoped resolution. Changed evidence requests
   review while retaining history. Existing holds remain independent.
4. **Requirements and costs.** Added task/authority/owner/site, inspection scope
   and criteria, estimated effort and documented cost assumptions. Previewed
   Item 13 wording excludes internal costs and refuses to overwrite manually
   changed inserted text. Items 14 and 15 remain separate decisions.
5. **Changes and closeout.** Added impact-review comparison points for document
   and requirement records, named changed dependencies, and separate completion,
   disposition, retention and continuation actions with dates and evidence.
6. **Review outputs and recovery.** Added selected-record PDF and CO evidence,
   advisory issuance review, additive schema validation, newest-edit backups,
   prior-event history and workflow-reset handling.

## Rule change and source basis

The former unconditional rule demanding Item 5 Yes for every Final is now
qualified for SAP continuation. The ordinary extended-retention path still
requires Item 5. SAP-specific written authorization and disposition/program
direction remain necessary; selecting SAP does not resolve an approval hold.

The reviewed general authority is
[32 CFR 117.13(d)(5)](https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117/section-117.13).
It distinguishes return of USG-provided/deliverable information from conditional
retention of copies, and addresses continued need beyond two years. SAP
disposition and continued requirements are qualified by
[DoDM 5205.07, 17 January 2025, section 10.5](https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodm/520507m1.PDF).
Sources were checked 6 September 2026; the embedded guidance identifies that
review date. The software does not determine classified-material disposition.

## Verification

- Full regression suite against the exact official HTML; passing count and
  SHA-256 captured together in `01_TOOL/TEST_RESULT.txt` and `BUILD_FACTS.md`.
- Native Chrome against official and generated demo: real form controls,
  existing issuance/CUI safeguards, official PDF, Astra review controls,
  confirmed Item 13 insertion, downloaded review PDF and database restore.
- All script blocks parse; deterministic demo parity; component manifest,
  byte-identical split/rebuild and upstream pdf-lib integrity checks.
- Rebuilt and visually inspected both identical user-manual PDF copies;
  documentation/version checks; selected review report rendering inspection.

Public verify and release workflow results belong to the repository's Actions
history. The tag workflow repeats verification and attests the HTML files.
Production uses the exact generated demo in the separate Pages repository.

## Boundaries and rollout

This remains a single-file, browser-only application. No Docker, Kubernetes,
backend, account, shared database, automatic message or policy feed is added.
Review records are operator statements, not authenticated Government approval.
The original official form assets and prior release files are preserved.

Take and verify a Full Backup before changing HTML versions. Restore in the
new version, inspect representative data, and recount validation. Older tools
do not understand Astra metadata. Keep the prior HTML and backup for rollback.
Do not describe passing automated checks as a field pilot or Government
acceptance; those have not been performed.

The original PRD/assessment documents remain historical planning artifacts.
The implementation map records delivered increments and remaining work. The
separate lifecycle training materials are unchanged by this software release.
