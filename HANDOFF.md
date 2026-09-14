# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T15:10-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v1.15.0 (Tool 2.128)**, tag at da54148 on `main`; assets,
checksums, kit rebuild and both attestations verified from a fresh download; the
live demo (`dd254-interactive` 9cffd04) serves the attested demo bytes. Owner
chose separate, fully verified point releases for the v1.15 horizon.

v1.15.0 (owner requests, 2026-09-14):

1. Dashboard cards label Items 2a/2b/2c as Prime/Subcontract/Solicitation
   (`dashCardNumbers`), beside contractor and subcontractor CAGE.
2. Dashboard search: every term must match the same record, any order;
   quotes = exact phrase; terms of 4+ alphanumerics match with punctuation
   ignored within a single word (`dashSearchTerms`, `dashSearchMatches`).
3. Spawning an Original/Revision/Final resets NISS (`rec.niss=null`); the
   parent's verification is kept as `nissPrior` and the card shows
   "NISS re-confirm" until verified again. Copy deliberately unchanged.

Verification on the v1.15.0 build: regression 1026 PASS / 0 FAIL; all SETUP
step-6 checks pass; live browser smoke passes for official and demo; dashboard
inspected in headless Chrome. Negative control against v1.14.1: prior tests pass
except the deliberately changed section 14 spawn test; 16 of 20 new assertions fail.

Product boundaries: not an NCCS/PIEE tie-in (owner, 2026-09-14). v1.14.0 scope
rule stands: keep only what is needed to prepare or issue a DD Form 254.

## Next

Remaining v1.15 point releases, in order (owner-approved scope, 2026-09-14):

1. v1.15.1 — import a received dynamic DD Form 254 (XFA datasets via embedded
   pdf-lib) as a read-only parent for subcontract preparation; not editable,
   issuable or tracked as its own workflow.
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

## Log

2026-09-14 15:10 Claude — Published v1.15.0 per SETUP.md: verify passed on
da54148, main fast-forwarded, tag pushed, release workflow passed, release and
served demo verified independently. Branch `release/v1.15.0` left in place.
2026-09-14 14:30 Claude — Built and verified v1.15.0 (dashboard numbers, search
in any order, NISS re-confirmation on spawn). Chose per-record AND matching with
chain surfacing, and punctuation-free matching per word only, to avoid false
joins across fields. Kept Copy's NISS behaviour because the owner named spawns
only. Widened the search box after the visual check truncated its new hint.
2026-09-14 08:30 Claude — Published v1.14.1 per SETUP.md; assets, attestations,
kit and served demo verified independently. Owner ruled NCCS out of scope.
Later: committed the SETUP.md kit-repack note (56132fb) after checking the
published v1.10.0–v1.12.0 kits; deleted merged local and remote branches.
2026-09-14 07:40 Claude — Implemented and verified the v1.14.1 trust patch
(roadmap items 1.1–1.5) plus related defects found while fixing them.
2026-09-13 Claude — FSO/CO roadmap review of v1.14.0 published as a private
artifact.
