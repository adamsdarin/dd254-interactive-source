# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T18:20-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.1 (Tool 2.129)**, tag at 142cf80 on `main`; assets,
checksums, kit rebuild and both attestations verified from a fresh download; the
live demo (`dd254-interactive` cae5f8e) serves the attested demo bytes. Owner
chose separate, fully verified point releases for the v1.15 horizon.

v1.15.1 — roadmap item 2.1, scope set by the owner on 2026-09-14: importing a
received DD Form 254 must SOLELY create DD-254 Template Language. "Import received
DD 254 (PDF)" on the Template Language page reads the XFA datasets of a fillable
DD Form 254 (`rcv254ExtractDatasets`, `rcv254Parse`) and, after a preview, creates
one TPL_CT entry from Items 10-16 and 18, the form marking, and Item 3 source
type/date. No draft, dashboard record, parent link or stored PDF; prime contract
number deliberately not copied into the template. Refuses flattened/scanned,
encrypted, non-PDF, empty, above-CUI and read-only cases. Audit records file name
and SHA-256.

v1.15.0 (released): card numbers labelled Prime/Subcontract/Solicitation; search
terms in any order; NISS reset with "NISS re-confirm" on spawned stages.

Verification on the v1.15.1 build: regression 1044 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; import page,
preview and new row inspected in headless Chrome. Negative control against
v1.15.0: all earlier tests pass; 17 of 18 new assertions fail.

Limit: not yet tested against a DD Form 254 filled and saved in Acrobat by another
organisation; the government's blank form's own datasets packet does parse.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

1. Validate the import against a sanitized, Acrobat-saved DD Form 254 from the
   owner when one is available.
2. v1.15.2 — security classification guide reference library (template library;
   Item 13 citation lines; flag drafts when a guide's date changes).
3. v1.15.3 — sensitive-terms screen for Items 9 and 13 (local list, warning only,
   excluded from exports by default).
4. v1.15.4 — revision summary managed region in Item 13 (check DD 254
   instructions in the approved library for revision annotation first).
5. v1.15.5 — unprinted period-of-performance end date with Final-due prompt, and
   a demonstration portfolio seed.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log

2026-09-14 18:20 Claude — Published v1.15.1 per SETUP.md: verify passed on
142cf80, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.1` left in place.
2026-09-14 17:40 Claude — Built and verified v1.15.1 (received DD Form 254 →
DD-254 Template Language only). Owner narrowed item 2.1 from "read-only parent"
to template creation. Read form data by the export's own field names, confirmed
against the blank government form's datasets. Fixed two test-only issues: a
cross-realm TextEncoder in fixtures and a uiAlert left defined by earlier tests.
2026-09-14 15:10 Claude — Published v1.15.0 per SETUP.md; release and served demo
verified independently. Branch `release/v1.15.0` left in place.
2026-09-14 14:30 Claude — Built and verified v1.15.0 (dashboard numbers, search in
any order, NISS re-confirmation on spawn).
2026-09-14 08:30 Claude — Published v1.14.1; owner ruled NCCS out of scope;
committed the SETUP.md kit-repack note; deleted merged branches.
2026-09-14 07:40 Claude — Implemented and verified the v1.14.1 trust patch.
2026-09-13 Claude — FSO/CO roadmap review of v1.14.0 published as a private
artifact.
