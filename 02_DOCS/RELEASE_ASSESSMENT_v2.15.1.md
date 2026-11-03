# DD254 Interactive v2.15.1 - a box governs its own clause again

3 November 2026. Internal Tool v2.163. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A box withdraws its own clause, however the template was applied | No deleting template wording out of Item 13 by hand | Only the wording that was inserted is removed, matched verbatim |
| Ticking a box the template left alone inserts that template's wording | The clause is there when the preparer says it applies | Still nothing until the box is ticked |
| Wording marked "always applies" is written by whole-template application | The setting means what it says | A template with no wording for a box is unaffected |
| Wording can be written for a box the template does not tick | "Applies when its box is ticked" can be authored at all | The template's selections are unchanged by this |
| Item 11c's two wordings are used on application | One template, not one per kind of effort | A record written in the background uses its own answer |

## Why

**Reported as "the 11d language is inserted and I have to delete it".** The box
trigger read one thing: the template picker above Item 13. Everything else that
applies a template left that picker alone - the dashboard's "apply this
template" and "apply this Contract Type", and the contract library's own insert
- and a **Contract Type** template cannot be in that picker at all, because the
store it reads is the DD-254 Template Language store. So a clause arrived with
the template, unticking its box did nothing to it, and ticking a box the
template had left unticked inserted nothing. The mechanism worked only for a
template the preparer had separately selected in the picker.

A DD-254 now carries what the template said for each Item 10/11 box. A snapshot
rather than a reference, deliberately: what the box has to be able to withdraw
is the wording that is on the form, which is not necessarily what the template
says today.

**"Always applies" promised something it did not do.** Whole-template
application decided what to write from the template's own ticks, so a clause
marked "always" was dropped whenever the template left its box alone - the only
case in which the setting changes anything.

**The mode could not be used as described.** Wording was only visible while the
template ticked that box, and a template that ticks the box asserts it on every
DD-254 built from the template. So a clause that waits had nowhere to be
written. It is now shown for an unticked box, which is what "kept ready" looks
like.

**Item 11c's two wordings were honoured by one path and not the other.** Ticking
11c used the wording for the effort; applying a whole template wrote the general
clause whatever the engine had been told. Both now read the same rule, and a
record written while another is on screen is given its own answer rather than
the open form's.

## Verification

- **1522 assertions, 0 failures**; ten are new, and section 143 fails against
  v2.15.0.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- The defect was reproduced before it was fixed, by a probe driving the real
  form: a template applied with the picker empty wrote its 11d clause, unticking
  11d left it in place, and ticking an unticked box inserted nothing.

## Limits

- Only the most recently applied template's wording is remembered. Apply a
  second template and the first one's clauses become ordinary Item 13 text,
  which is what they already were on the page.
- Wording whose text has been edited in Item 13 is still left alone when its box
  is unticked, and still said out loud. Removing an approximate match would
  delete somebody's writing.
- A template that ticks a box and carries box-mode wording for it still writes
  that wording when applied, because the box is then ticked. To keep a clause
  ready without asserting it, leave the box unticked in the template - which is
  what this release makes possible.
