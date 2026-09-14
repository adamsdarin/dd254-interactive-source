# HANDOFF — dd254-interactive-source

Last updated: 2026-09-14T07:40-05:00 by Claude

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: v1.14.0 (Tool 2.126, tag and live demo). **v1.14.1 (Tool
2.127) is built and verified locally but not committed, tagged, released or
deployed to the demo repository.**

v1.14.1 is the "trust patch" horizon of the FSO / contracting officer roadmap
(published as a private artifact on 2026-09-13):

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

Verification on the final build (SHA-256 in `BUILD_FACTS.md`): regression
1006 PASS / 0 FAIL; all SETUP step-6 checks pass; live browser smoke passes for
official and demo builds; header, legacy notice and CO Package inspected in
headless Chrome. Negative control: against v1.14.0 all 987 earlier assertions
pass and 18 of 19 new ones fail (the passing one guards a no-repeat-prompt
behaviour v1.14.0 already had).

`SETUP.md` carries an uncommitted edit that predates this session (a note about
repacking v1.10.0–v1.12.0 kits). It is not part of v1.14.1; commit it separately
or with the owner's say-so.

## Next

1. Owner decision: commit v1.14.1 on a release branch, push, require the public
   `verify` workflow, tag, verify the published release, then replace the demo
   repository's `index.html` with `DD254_Interactive_v1.14.1_DEMO.HTM` and hash
   the served page (SETUP.md "Publish").
2. Update `C:\Users\darin\src\WORKFLOWS.md` section 4, which still names v1.13.0.
3. Next roadmap horizon (v1.15 preparer throughput) needs owner scope decisions
   D1–D4 from the roadmap before work starts.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).

## Log

2026-09-14 07:40 Claude — Implemented and verified v1.14.1 trust patch (roadmap
items 1.1–1.5) plus two defects found while fixing them: CO Package 2b-only SAP
test and recount snapshot overwrite. Chose to derive values from single sources
(RELEASE_VERSION, form labels, dd254WorkspaceSapSub rule) rather than correct
the copies, per START_HERE's "two sources of truth" lesson. Chose to guard the
seed with a verified-citation allowlist rather than rely on review. Chose a
stamp-only quiet write so an upgrade does not turn every backup reminder red.
Not committed or released pending owner approval.
2026-09-13 Claude — FSO/CO roadmap review of v1.14.0 published as a private
artifact; found the header version drift, CO Package label/signature defects,
demo seed authority error and silent legacy-data drop.
