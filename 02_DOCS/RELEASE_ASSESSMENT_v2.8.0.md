# DD254 Interactive v2.8.0 - copies start clean, pickers that work, standard language that can be required

6 October 2026. Internal Tool v2.153. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A copy takes the form, not the original's workflow | A copy of a blocked DD-254 no longer arrives blocked, carrying holds raised against a different document | The copy reconciles its OWN approval holds, so copying is not a way past a GCA gate |
| The copy dialog says what it does | Two choices that differ in one stated way, instead of a label that contradicted its own code | Both choices state that the workflow stays with the original |
| Contract Type offers the security managers | The manager can be assigned where the field already was, instead of typing into a dead box | The same list both repositories use; assigning one still fills the programme from that manager |
| Programme options come from the Security Manager templates | One place records a programme; the template libraries read it | A programme already written on a template stays in the list, so nothing existing disappears |
| Standard language can be made mandatory | The organisation's wording is offered on every new DD-254 and cannot be forgotten on one being issued | Presence in Item 13 is what is checked; the offer can be declined and the finding set aside with a reason |

## Why

**A copy carried events that had happened to something else.** Full copy brought
the holds, the distribution record, the countersignature and the Blocked status
across. The copy then showed open holds raised against the original and dated
before the copy existed, and it sat in a queue it had never been in. Spawning an
Original, a Revision or a Final has cleared those for exactly this reason since
the behaviour was corrected; copying had the same problem and the opposite rule.
Copying now routes through the same reset, then reconciles the copy's own
compliance holds: if the copy's own Item 10, 11 or 14 boxes call for GCA
approval it raises its own hold, dated the day of the copy. Starting clean is
not a way past the gate, only a way of not inheriting someone else's.

**The dialog contradicted the code it ran.** "Full copy - everything comes
across, including holds, distribution and countersignature" sat above a branch
that cleared the notes and the to-dos and kept the holds. Both halves were
wrong. The choices are now Copy and Copy the form only, and the difference
between them is the one difference that remains.

**A picker with nothing behind it reads as an empty library.** Contract Type
rows have had a security-manager box and a Programme box since v2.6.0, and the
two datalists that fill them were rendered only for the DD-254 Template Language
repository. On Contract Type both were plain text fields. The v2.6.0 regression
test asserted that the Program box pointed at a datalist, and passed while that
datalist was never rendered for this repository - a test that locked in half a
feature. It now requires the list element to exist.

**Programmes were being typed in twice.** The option list was built from
programmes already present in the repository being edited, so the Security
Manager templates - which is where a programme and its manager are actually
recorded - had no bearing on it. Two libraries each keeping their own spelling
of a programme name is how they drift apart. The list is now derived from the
security managers, plus any programme already written on a template so that
nothing existing drops out of the picker.

**Standard language was a library with no way to require it.** An organisation
that puts the same wording on every DD-254 it issues had to remember to insert
it. The setting makes that a rule: a new DD-254 is offered the entry matching
the programme and the Item 1a level, and a DD-254 whose Item 13 carries none of
the library wording cannot leave Draft. What is checked is what is in Item 13,
never a flag recorded at creation - a preparer who deletes the paragraph has
deleted the standard language, and bookkeeping that disagreed with the form
would be the worse answer. The blocking message is stated once and read by both
the status gate and the issue checklist.

## Verification

- 1314 assertions, 0 failures, against build `1deac142`.
- The copy defect was reproduced on the published v2.7.1 before the fix: the
  copy arrived carrying `SCG missing [2026-03-03]`, one distribution record and
  a countersignature. On this build it arrives with none.
- The Contract Type pickers were shown absent on v2.7.1 and present on this
  build by driving the repository directly, not by reading the source.
- All five release gates pass; the rebuild kit round-trips byte-identically;
  pdf-lib is the unmodified upstream release; the native-browser smoke test
  passes.

## Limits

- Mandatory standard language asks at creation only. A draft created before the
  setting was turned on is blocked until wording is inserted by hand, which is
  the honest outcome but is not a migration.
- The programme and Item 1a level on a Standard Language entry are optional, and
  blank means any. An organisation wanting them required would need a different
  setting; none is offered.
- Nothing here changes what the form requires. The only validation rule added is
  the one the new setting creates, and it is off by default.
