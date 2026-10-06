# DD254 Interactive v2.9.0 - the picker finds every order, orders can be managed, standard language inserts itself

6 October 2026. Internal Tool v2.154. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Every saved order is listed in the form's picker | An order that follows the prime is found by its own number instead of not being there | It says which template it resolved to, so nothing is inserted unseen |
| Task orders can be deleted | An order entered by mistake can be removed | The template and any DD-254 made from the order are kept, and the confirmation says so |
| Coverage can be changed after creation | A task order that turns out to need its own DD-254 is changed in place | The order drops to "source needs review"; no saved source is silently re-pointed |
| The dashboard starts a DD-254 from a contract type, a task order or a template | No blank form, then a hunt for the language that was always going to be applied | Each picker routes through the existing apply path for that kind of thing |
| Standard language inserts itself | The organisation's wording lands on the DD-254 without anyone remembering it | Only when one entry matches; two matching entries leave the blocking error, which names both |

## Why

**The picker could not find what the preparer searches by.** v2.7.1 added orders
to the picker, but only those carrying their own DD-254. An order that follows
the prime was absent entirely, so typing its number found nothing and the
preparer had to remember which prime covered it - the one thing the picker exists
to avoid. Every saved order is now listed under its own number, and a
prime-following order resolves to the prime's template and names it: the preparer
searched for an order number and is about to insert something filed under a
contract number, so the two identities are both on screen. The prime template
stays listed as itself, because it covers the prime and every order that follows
it.

**Coverage was locked, and that was the wrong fix.** v2.4.1 removed coverage
switching because switching silently re-pointed a saved source at language
written for a different scope. That protected the data by removing the function.
It returns with the actual problem addressed: the order drops to "source needs
review", `ctOrderStart` refuses to start a DD-254 until that is answered, and
nothing is re-pointed without being looked at. Moving an order to its own DD-254
seeds an editable template from the prime's language - which is what covered the
order until now, so it is the honest starting point - and leaves the prime
template untouched.

**Deletion keeps what exists.** Deleting an order removes an identity and a link.
It does not delete the order-specific template, which is language somebody wrote
and may be the only copy, and it does not delete a DD-254 already created from
the order: that document exists, carries its own immutable snapshot, and is not
made not to exist by removing a row from a repository.

**The dashboard knew less than the preparer did.** Its two buttons start an
empty form, and every saved contract vehicle, order and template was reachable
only from inside that form. Someone who already knew which of those this DD-254
was for had to create a blank one and then go looking. Three pickers now sit
above the buttons. The template picker shares one function with the form's
picker, so the list cannot be right in one place and wrong in the other - which
is exactly what happened to orders following their prime.

**Standard language was asking a question it already knew the answer to.** v2.8.0
asked at creation which entry to insert. At creation Item 1a is empty and the
programme is unknown, so the dialog could only ask the preparer to describe the
form they were about to fill in. The programme is recorded on the language
applied to the DD-254, which takes it from the Security Manager template, and the
level is Item 1a. When those two identify exactly one entry, it is inserted. When
they identify two, neither is - which entry applies is an FSO judgement the
library has not expressed, and the blocking error names both rather than guessing.

## Verification

- 1334 assertions, 0 failures, against build `fb4b8025`.
- All three changes were driven against the published v2.8.0 first and reported:
  order 0077 following its prime `NOT LISTED`, `ctOrderDelete` and
  `ctOrderSetCoverage` `ABSENT`, standard language `NOT inserted`. On this build:
  listed and resolved to the prime template, both functions available, inserted.
- All five release gates pass; the rebuild kit round-trips byte-identically;
  pdf-lib is the unmodified upstream release; the native-browser smoke test
  passes.

## Limits

- Standard language is inserted when the form carries both a programme and an
  Item 1a level. A DD-254 with neither is blocked and says what is missing; it is
  not guessed at.
- Replacing one standard-language paragraph with another when the level changes
  is not done. Text already in Item 13 is the preparer's, and swapping it is a
  judgement about a document that may already have been sent.
- Coverage changes do not touch a DD-254 already created from the order. It keeps
  the source snapshot it was built from, which is what makes the record of what
  went out stable.
