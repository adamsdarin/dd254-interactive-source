# DD254 Interactive v2.20.0 - a copy does not carry another contract's Block 13

13 November 2026. Internal Tool v2.169. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A copy of a contract-specific DD-254 leaves Blocks 10 to 16 behind | Another contract's wording cannot ride along unnoticed | Contract Type and hand-written copies are carried whole, as before |
| The contract must be named before the copy is made | Which contract the copy is for is said, not inherited | One press reaffirms the original's |
| The dialog reports which template will rebuild the blocks | No surprise after the copy exists | Exact matches only; a near match is never applied |
| A solicitation's due date and last rows are visible | The dialog shows what it will carry | The stored date format is unchanged |

## Why

**The owner's report.** A DD-254 is finished and set to Draft, copied for the
next piece of work, and Block 13 is not updated - so the wrong contract's
language is issued. The copy was doing exactly what it was designed to do:
carry the form whole. The design was right for a Contract Type, whose language
belongs to a kind of contract, and wrong for a DD-254 template, whose language
belongs to one contract number.

**So the copy asks the one question that decides it.** Where the source was
built from a DD-254 template - by the picker above Item 13, by the order
repository, or by the library's own apply - Blocks 10 to 16 and the link to
that template are left behind, the contract fields start empty, and the copy is
refused until a contract is named. Inattention is the failure being designed
against, so the default cannot be "the same as before": reaffirming the
original contract is one press, but it is a press.

**Rebuilt from the repository, not from the original.** The template is the
record of what a contract says. Naming a contract rebuilds Blocks 10 to 16 from
the template saved for it today, even when it is the same contract - which also
means a copy does not inherit hand edits made to the original. Where no
template, or more than one, is saved for the number, the blocks start blank and
the dialog says so before the copy is made; with Contract template set to
Mandatory, such a copy is then held at Draft until one is applied.

**An alternative considered and not taken:** keep Blocks 10 to 16 whenever the
contract number is unchanged, and reset only when it differs. It preserves hand
edits, and that is exactly why it was not taken - the report is about wording
that should have been reviewed and was not, and a copy that silently keeps
edited wording is the same failure with a narrower trigger.

**The solicitation dialog.** Two defects, either of which reads as "the fields
are not there": the form stores dates as YYYYMMDD and a date field displays
nothing for anything but YYYY-MM-DD, so the due date arrived blank; and the
dialog could not scroll, with the solicitation fields as its last rows.

**Applied is not the same as untouched.** The mandatory standard-language rule
checked Item 13 against the library character for character. Standard language
is a starting point that gets edited for the contract in front of the preparer,
so the rule called an edited paragraph missing - and the automatic insert, which
asks the same question, wrote a second copy beside it. Presence is still the
only source of truth, with no bookkeeping to believe instead of the form: an
entry counts while at least half of its three-word runs are still in Item 13.
Runs rather than words, because every DD-254 says "contractor" and "classified"
somewhere; half rather than all, because changing a number or a sentence should
not cost a paragraph its identity. Deleted is still deleted, and a rewrite past
recognition brings the finding back.

## Verification

- **1583 assertions, 0 failures**; fifteen are new and none was restated - every
  existing copy assertion still holds, because a copy with no DD-254 template
  behind it behaves exactly as before.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- Both dialog defects were reproduced against v2.19.0 first: the due date field
  read empty for a stored `20261120`, and the overlay had no scrolling.

## Limits

- Rebuilding applies the whole template, as creating a DD-254 from it does - so
  the new contract's Item 18 selections come with it. Where no template is
  applied, Item 18 is left as copied.
- Items 6 to 9 and 17 - who the contractor is, where the work is performed, who
  certifies - are carried across. They are facts about the parties, which a copy
  for the next contract with the same company keeps.
- A DD-254 built from a Contract Type and then given a DD-254 template counts as
  contract-specific. The more specific template is the one whose language is at
  risk.
