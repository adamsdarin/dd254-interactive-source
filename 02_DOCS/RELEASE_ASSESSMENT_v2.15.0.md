# DD254 Interactive v2.15.0 - one listing per manager, 18f that stays, 11c that knows what it is for

2 November 2026. Internal Tool v2.162. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A security manager holds every programme they run | One listing instead of one per programme; an address corrected once | A manager saved before this reads as the one programme they have |
| Assigning a manager asks which programme | The template is matched on a fact rather than on whichever programme was entered first | One programme is filled in; several are offered and none is chosen |
| Block 18f survives a template that is silent about it | A Revision keeps the distribution its Original was issued with | A template that ticks 18f and names somebody still replaces, as before |
| A template ticking 18f with no address leaves the form's alone | No more ticked box with nobody in it | The issuance gate's requirement is unchanged |
| Item 11c carries a testing wording and a production one | One template per contract instead of two differing in a paragraph | The general wording still applies with the engine off or the question unanswered |

## Why

**Four listings for one person is four things to keep in step.** A security
manager covering four programmes had to be entered four times, with the same
name, e-mail and address in each. Correcting an address meant finding all four,
and the one that got missed is the one that would be used. A listing now holds
a list of programmes; `program` remains on the record as the first of them, so
every existing reader and any older build still finds the single value it
expects.

**Picking somebody's programme for them is how a DD-254 gets the wrong
language.** The programme is what standard language is matched on. Where a
manager runs several, the template says so and waits; where they run one, there
is nothing to decide and it is filled in. This is the same rule the requester
search follows for a shared address, and for the same reason.

**A template is silent about Item 18f, not opposed to it.** This was reported
as "18f is not carrying over on a revision". The carry was never broken -
`dashSpawn` deep-copies the whole workspace, and a probe confirmed the box and
the address arrive intact. What removed them was the first template applied
afterwards: whole-template application replaces the sections a template
represents, including the blanks, and 18f was being treated as one of them.
Every other box in that group is a property of the work, which a template is
entitled to state. 18f is an instruction to send a copy to a named person, and
a template that does not tick it has no opinion rather than a negative one.

**Item 11c is two clauses pretending to be one.** The paragraph about test
data, performance curves and telemetry is not the paragraph about fabricating
classified hardware. An FSO issuing both kinds of effort under one contract
kept two templates differing in a single paragraph, or edited that paragraph by
hand every time. The template now holds both and the engine asks which this
effort is.

**Purpose chooses wording, not selections.** What Item 11c is ticked for is
whether classified information is generated, which the engine's existing
questions already decide. Conflating the two would have made a production
effort stop ticking 11c the day somebody answered the new question.

## Verification

- **1512 assertions, 0 failures**; twenty-four are new.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- The 18f defect was reproduced before it was fixed, by a probe that drove the
  real form: a plain template cleared a ticked box and its address, and a
  template ticking 18f with no address of its own blanked the form's. Section
  140 fails against v2.14.1.
- One existing assertion was restated: the full-replacement guard, which proves
  a template replaces its sections including blanks. It keeps that whole job
  and gives up only the clause about 18f, which section 140 now owns.

## Limits

- The programme a manager runs is still free text. A manager with several
  offers them on the template row, but nothing stops a programme being typed
  that no manager runs - which is deliberate, because a template may
  legitimately belong to a programme with no manager recorded yet.
- The create dialog's Security Manager list shows every programme a manager
  runs but still records the first. Choosing among them there would be a second
  place to answer the same question; the template is where this release asks it.
- Only Item 11c has testing and production wordings. The shape is general, so a
  second box needing the same split would not need a second mechanism, but no
  other box has one today.
- "Both" writes the testing clause and then the production one. It does not
  attempt to merge them into a single paragraph.
