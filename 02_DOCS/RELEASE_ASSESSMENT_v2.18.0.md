# DD254 Interactive v2.18.0 - a manager is offered once per programme they run

9 November 2026. Internal Tool v2.167. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| The manager list is manager-and-programme pairs | One choice instead of a choice and a second question | A pair names the programme, so nothing is assumed |
| Naming a programme narrows the manager list | The wrong manager is not offered for the programme | A manager with no programme recorded is still offered while none is chosen |
| A mismatch is stated on the row | The preparer sees which of the two is wrong | Neither is changed on their behalf |
| The create dialog lists every programme | The whole list is visible where it used to show one | The record keeps the list and claims no single programme where there is a choice |

## Why

**A manager who runs four programmes was one entry and then a blank field.**
v2.15.0 made a manager a single listing however many programmes they run, which
was right, and left the template row asking two questions: who, then which
programme. The second went unanswered often enough that the owner asked for the
two to become one - "Joe Schmuckatelli Windfall. You know, Joe Schmuckatelli
Ocean Breeze." A pair is also the only form in which the list can be narrowed by
programme at all, which is the other half of the same request.

**Narrowing runs the other way too.** An FSO works in whichever order the
paperwork arrived: sometimes the programme is known first. Naming it leaves the
managers that programme is recorded against, and a manager with no programme
recorded is offered only while nothing has been chosen - with a programme named,
a manager who does not run it is not an answer to the question being asked.

**A mismatch is reported, not corrected.** A template carrying a manager and a
programme that manager is not assigned to is a fact about the data, usually a
renamed programme. Silently clearing either would hide it; the row says which
programmes the manager does run and leaves the correction to the person who
knows.

**The create dialog cannot answer the programme question.** At creation there is
no contract template, no Item 1a level and often no programme - so it lists
every programme the manager runs, records all of them, and leaves the single
value blank where there is a choice. That is the rule the template row has
followed since v2.15.0: nothing claims a programme nobody chose.

## Verification

- **1560 assertions, 0 failures**; nine are new. Nothing was restated: the
  v2.15.0 manager assertions all still hold.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test, whose new `smPairsOk` drives the pair list and the create dialog in a
  real browser.
- Both halves were reproduced against the published v2.17.0 build first: the
  template row offered three bare names with no programme and no narrowing, and
  the create dialog listed names alone.

## Limits

- The programme on a template row is still free text. The list beside it is
  drawn from the Security Manager repository, but a programme no manager runs
  can still be typed - deliberately, because a template may belong to a
  programme whose manager is not recorded yet.
- A manager's name is matched exactly before a pair is parsed, so a manager
  whose own name contains the separator still resolves. A name that is a prefix
  of another manager's still resolves to the first match, as it always has.
- The separator is the middle dot the tool already uses in manager labels. A
  programme containing one is still read correctly, because the split is taken
  from the right and checked against that manager's own programmes.
