# Codex Astra v1.15.6 — Final-due prompt and demonstration portfolio

15 September 2026. Internal Tool v2.134. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Retention decision at contract end | Nothing prompted it | A tool-only end date on the card prompts at 120, 60 and 30 days before performance ends and before the two-year window closes, until a Final exists |
| Calendar | Review and disposition invites only | An invite with the end date and the window close, each with 120/60/30-day reminders |
| Option-year extension | Not addressed | Changing the date is audited and never suggests a revision |
| Demonstration build | Opened with an empty dashboard | Opens with twelve fictitious DD-254s covering every status |
| Dashboard redraw during a save | Could overwrite a note or edit on a draft without a stored stage | Updates the stored record in one transaction |

## Why

32 CFR 117.13(d)(5): at completion of a classified contract the contractor returns
USG-provided or deliverable information; unless the GCA advises otherwise, copies
may be kept for two years after completion and the DD Form 254 stays in effect for
that period; a continuing need beyond two years requires a Final DD Form 254 with
disposition instructions. 117.15(j) sets what a retention request contains, and
117.17(c) routes a subcontractor's request through the prime, which issues the
Final. The roadmap said the retention clock starts once a Final exists; the library
shows it starts at completion, so the prompt counts down to completion and to the
close of the two-year window. The DD Form 254 carries no end date, so the date is a
dashboard fact; the DD Form 254 instructions (Item 3b(2)) say not to revise for an
option-year exercise.

The demo opened empty, so a reviewer had to build a chain before seeing the
features that distinguish the tool.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. Run against the v1.15.5 build, every earlier
test still passed there and 10 of the 13 new tests failed; the three that passed
test `demo_seed.html` itself, which does not depend on the build. The render test
left "old note" on v1.15.5, reproducing the lost write.

- The clock's phase, days and level at every boundary (121, 120, 61, 60, 31, 30, 0
  days before each deadline, the day after the end and after the window closes).
- No prompt without a valid date, on a Solicitation, Final, Cancelled, Skipped or
  superseded record, or with a Final in the chain; the card moves the prompt to a
  spawned Revision and a spawned Final clears it.
- Setting, extending and clearing are audited; the date is absent from the
  workspace, Compare, the revision summary and the XFA data; impossible dates and
  read-only tabs are refused; the invite and CSV column are checked.
- The demo seed fills an empty dashboard with twelve labelled records in every
  status with clean validation where issued or ready, the PSO approval hold, the
  bulk-issued pair, the review and disposition dates, the prompt at its levels and
  a live revision summary; a second run seeds nothing. Seeding leaves an open form
  untouched, and the counts it writes equal a fresh recount. In headless Chrome the
  demo dashboard shows every status chip populated.

The first push failed the verify workflow: the demo seed recounted its records,
which resets and refills the live form, while the browser smoke test was using
it. Seeding now writes the counts instead, and a test covers both halves. The demo
smoke test then failed locally on its quick-notes check: the seed's dashboard
render wrote back a stale copy of a draft without a stored stage over a note saved
a moment earlier. That lost write was an existing dashboard defect, now fixed with
a single-transaction patch; the demo smoke test then passed five runs in a row.

Limits: the end date is entered by hand and is not read from the contract; the
prompt is a reminder, not a determination of what may be retained.
