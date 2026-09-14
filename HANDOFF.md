# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T08:30-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). **Latest
release: v1.14.1 (Tool 2.127), published 14 September 2026** — tag `v1.14.1` at
commit 83fe2d1 on `main`; release assets checksum-verified from a fresh
download; both HTML files carry a verified build-provenance attestation from the
release workflow; the rebuild kit reassembles the release byte-identically and
holds no `__pycache__`. The live demo (`adamsdarin/dd254-interactive`, commit
09b97b8) serves bytes identical to `DD254_Interactive_v1.14.1_DEMO.HTM`,
confirmed by hashing the served page.

v1.14.1 is the "trust patch" horizon of the FSO / contracting officer roadmap
(private artifact, republished 2026-09-14):

1. Release name rendered from `RELEASE_VERSION`; `check_manifest.py` section 4
   fails a build whose filename, constant, `<title>` or literal release strings
   disagree; `browser_smoke.js` compares the rendered header with the filename.
2. Worksheet and CO Package read Item 14/15 titles from the form
   (`formItemTitle`); CO Package signature/date lines removed; SAP subcontract
   recognised from 2b or 7a there (it was 2b-only).
3. Demo seed citations corrected and verified against the approved library
   (117.7(h)(1)(iii), 117.13(d)(5), 117.15(e)(2)(vii), 117.16(a)(4), 117.21(c)(3),
   Part 2002); a regression test rejects unlisted citations.
4. Opening a pre-v1.14.0 draft that still holds log/supporting-records content
   shows a three-way notice (`uiChoice`) with a verbatim workspace export first.
5. One-time automatic recount of drafts whose `meta.rulesVersion` differs from
   `TOOL_VERSION`; stamp-only writes do not mark the backup reminder
   (`DD254_QUIET_WRITE`); recount re-reads each record before writing.

Product boundary set by the owner on 2026-09-14: **the tool is not an NCCS/PIEE
tie-in.** NCCS-focused improvements (transcription views, field mapping,
alignment) are out of scope; the roadmap was revised accordingly.

Working tree: `SETUP.md` carries an uncommitted edit that predates the v1.14.1
work (a note about repacking v1.10.0–v1.12.0 kits). It is not part of v1.14.1;
commit it separately with the owner's say-so. Local branches
`docs/release-corrections-record` (at the old v1.14.0 `main`) and
`release/v1.14.1` (merged) can be deleted when convenient.

## Next

1. Update `C:\Users\darin\src\WORKFLOWS.md` section 4, which still names v1.13.0
   as the current release.
2. Next roadmap horizon (v1.15 preparer throughput) needs owner scope decisions
   D1–D3 from the revised roadmap before work starts.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).

## Log

2026-09-14 08:30 Claude — Published v1.14.1 per SETUP.md: release branch pushed,
public verify passed on 83fe2d1, main fast-forwarded, tag pushed, release
workflow passed; assets, attestations, kit and served demo verified
independently. Owner ruled NCCS out of scope; roadmap item and decision removed.
Cleared a stale .git/index.lock from 2026-09-13 18:37 after confirming no git
process was running.
2026-09-14 07:40 Claude — Implemented and verified v1.14.1 trust patch (roadmap
items 1.1–1.5) plus defects found while fixing them: CO Package 2b-only SAP test
and its "Prime form" summary row, and recount snapshot overwrite. Chose to derive
values from single sources (RELEASE_VERSION, form labels, the 2b-or-7a rule)
rather than correct the copies, per START_HERE's "two sources of truth" lesson;
guarded the seed with a verified-citation allowlist; chose a stamp-only quiet
write so an upgrade does not turn every backup reminder red.
2026-09-13 Claude — FSO/CO roadmap review of v1.14.0 published as a private
artifact; found the header version drift, CO Package label/signature defects,
demo seed authority error and silent legacy-data drop.
