# DD254 Interactive v2.6.0 - the required Item 13 line, Program, and task-order Block 2a

5 October 2026. Internal Tool v2.149. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| "Please direct all questions to the prime contractor." on every DD Form 254 | The line no longer has to be typed, and cannot be forgotten | Written as part of the same managed region as the classified mailing addresses, so it stays directly above them; added to an existing draft when it is opened |
| Program on Contract Type templates | The field DD-254 Template Language entries already had is now on Contract Type rows too, filled from the assigned security manager | The security-manager link and its CC distribution already existed; only the field was missing |
| An issued DD-254 is never rewritten | Opening a record that already went out leaves it exactly as it was | Issued, Cancelled and Skipped are closed; a record that leaves one of those statuses gains the line on its next open |
| The line is not reported as a revision | A Revision no longer claims Item 13 was changed when only the maintained line differs | Excluded in `rsumItem13`, beside the revision summary and supported-effort line it already ignored |
| Task order in Block 2a only when the form is order-specific | A DD-254 for an order covered by the prime's DD-254 stops exporting "CONTRACT \| Task Order NNNN" | A template that records the choice is still honoured; only the silent default changed |

## Why

The required line is guidance the owner puts on every outgoing DD Form 254. It
was typed by hand, which means it was sometimes missing. It is now maintained,
and it is deliberately part of the classified-mailing-address region rather than
a region of its own: the requirement is that it sits immediately above those
addresses, and making it the same block is what guarantees that rather than
leaving two tail writers to compete for position.

Block 2a was the opposite problem - a default asserting something that may not
be true. The export has always been gated on "This outgoing DD Form 254 is
specific to the order above", which is correct. But applying a template that
happened to carry a task order ticked that box for you, so a DD-254 covered by
the prime's own specification still went out claiming to be order-specific. The
tool has recorded the coverage choice explicitly since v2.4.1; a template that
does not record one no longer invents it.

## What this cost to get right

Making the line unconditional invalidated sixteen existing assertions, and one of
them was a genuine regression rather than a stale expectation: with the line
written before a Revision's summary was drafted, every Revision opened reporting
"Item 13 Reference 10a: revised" when nobody had touched it - the tool
attributing its own text to the preparer. The fix is in `rsumItem13`, which
already excluded the revision summary and the supported-effort line on exactly
that reasoning. Ordering the writes was tried first and did not fix it, because a
draft saved with the line already present still carried it into the comparison.

The remaining fifteen were expectations that encoded "Item 13 is untouched unless
you touch it". They now read Item 13 without the maintained line rather than each
restating it, so they keep testing what they were written to test.

## Verification and limits

Nine regression assertions cover the line appearing once on open, not
duplicating when the draft is reopened, sitting above the addresses, and a draft
written before this release keeping exactly one copy of its addresses; the
Program field rendering on Contract Type rows and filling from the assigned
manager; the manager reaching the distribution; and the task-order default in
both directions. Both builds pass native Chrome.

The line is maintained text, not a validation rule: the tool writes it and keeps
it in place, and does not police an operator who edits Item 13 afterwards. No new
legal rule, authority determination, service, account or storage medium is
introduced, and no storage format changed.
