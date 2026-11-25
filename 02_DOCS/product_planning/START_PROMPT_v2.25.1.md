# Start prompt - v2.25.1 (Phase 0)

Paste everything below the line into a new Claude Code or Codex session opened
in `C:\Users\darin\src\dd254-interactive-source`.

---

You are starting Phase 0 of the DD254 Interactive roadmap: the v2.25.1 patch
release. Work in `C:\Users\darin\src\dd254-interactive-source` only.

**Read first, in this order**

1. `HANDOFF.md` - current state; the newest entry is at the top.
2. `02_DOCS/product_planning/REVIEW_AND_ROADMAP_2026-11.md` - the plan. §2 and §3
   are the verified defects, §6 the open owner decisions, §7 the Phase 0 table
   you are implementing, §9 the non-negotiables.
3. `SETUP.md` - the release procedure, gates and smoke tests.

Then run `git status` and `git log --oneline -5`. Do not assume a clean tree:
another assistant may have worked here since the last handoff entry.

**Before you change code, ask the owner the four decisions in §6** in one
question (Item 7 wording; 1a/1b as source facts on imported templates; cut the
flow-down wiring; Advisory drawer collapsed). Offer the proposed default for
each as the recommended option. Record the answers in `HANDOFF.md`.

**Branch.** Create `fix/v2.25.1` from `main`. Never commit to `main` directly.

**The work** - §7 items P0.1 to P0.11, in order:

- P0.1 first: rebase `fix/flaky-portfolio-export` onto `main` (expect a
  conflict in `HANDOFF.md` only), change the test to `await dashSaveNow()`
  instead of only clearing `DASH.timer`, run it 20 times, then merge it into
  `fix/v2.25.1`.
- For every item: write the regression assertion first, see it fail, then fix.
  New assertions go in a new section of `01_TOOL/dd254_regression.js`, inserted
  before the following section's `H('...')` anchor.
- An existing assertion that a change makes untrue is **restated** with a
  comment giving the reason and the item number. Never delete one.
- Working build: `01_TOOL/dd254.htm` (gitignored). Versioned files are made
  only at packaging.
- P0.9: before removing anything, grep to prove nothing but
  `buildClausesPanel` reads `CLAUSES`, and that `coPackageModel` builds its own
  clause list. Report what you found.

**Checkpoint after each item:** `node 01_TOOL/dd254_regression.js` must end
with 0 failures. Every two or three items, add a short dated entry to
`HANDOFF.md` per `../HANDOFF-PROTOCOL.md`, then commit on the branch.

**Packaging** - only when all eleven items pass: follow `SETUP.md` for v2.25.1
(Tool version +1): stamp the version, changelog, manual, ISSM brief and fact
sheet, `RELEASE_ASSESSMENT_v2.25.1.md`, `IMPLEMENTATION_v2.25.1.md`, demo,
build facts, SBOM, rule catalog, the four `.github/scripts` gates,
`verify_pdflib.py`, and both browser smoke tests.

**Stop and ask the owner** before merging to `main`, tagging, pushing a tag,
publishing a release or updating the live demo. Show the assertion count, the
gate results and the list of restated assertions.

**Rules**

- One offline HTML file; the CSP is never loosened; output stays unminified.
- Nothing classified, personal or case-specific in the repository or handoff.
- No attribution lines in commit messages.
- Never replace an asset on a published release; a changed build is a new
  version.
- Write helper scripts with the file-writing tool, not shell heredocs (they
  collapse backslashes), and keep them in your scratch directory.
- Do not use `rm -rf`; remove specific files by name.
- The release workflow has two known flakes ("timeout waiting for Chrome
  DevTools port" and the portfolio-export test). Re-run the failed job once;
  if it fails again, treat it as real.

**Done when:** v2.25.1 is packaged on `fix/v2.25.1` with every §7 item meeting
its "Done when", the suite and all gates green, `HANDOFF.md` updated, and the
owner has been asked to publish.
