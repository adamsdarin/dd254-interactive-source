# DD254 Interactive v2.11.0 — who a DD-254 has to reach, and who an office chooses to copy

19 October 2026. Internal Tool v2.157. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| One fixed To line | The people the form exists to reach are on it, every time, without being configured | None of them can be switched off, and duplicates are removed across both lines |
| A CC line the office chooses | The two derived recipients are set once, in Settings, instead of being argued about per DD-254 | Both start off, and an address the operator entered by hand is never overridden by the setting |
| Issuance blocked on a missing recipient | The gap is found before the form goes out, not afterwards | Only where the form asks for it, so a prime DD-254 is unaffected |
| One rule, three readers | — | The single and bulk gates and the mail builder read one function, so no record is issuable one way and not the other |
| Settings in Full Backup | A move to a new machine keeps the copy list | Outside the checksummed body, so older backups still verify; applied only if the operator accepts |

## Why

**A distribution list is two different lists wearing one name.** Some recipients
are the reason the document exists: the facility receiving it, the places the
work is performed, the cognizant security office, and anyone written into Block
18f. Others are copied because an office finds it useful. The tool treated both
as one hardcoded sequence, so the second group could not be changed and the
first group could not be guaranteed. They are now separate: the first is fixed,
the second is a setting.

**The copy list starts empty on purpose.** The owner's decision, and the right
one: a CC list that fills itself in is how people stop reading it. An operator
who had to tick a box to copy their own Security Manager knows that they did.

**Only what the tool derives is a setting.** The first cut made four things
optional, including the hand-typed FSO box and the managers added with "Add to
CC". The live-browser smoke test caught it: those are decisions the operator has
already made, on this DD-254, and a global preference able to discard them would
make a button they just clicked do nothing. They are always copied. The setting
covers the Security Manager and the Item 6 FSO, which the tool works out on its
own — the two the owner named.

**A missing recipient is not a judgement call.** Issuance already asks the
operator to weigh things — an open hold, no NISS verification — and those stay
confirmations. A required address that nobody has written down is not something
to weigh, so it is a stop, and the message names each gap by the field it is
missing from.

**"Applies" is the whole safeguard.** Item 7 is empty on a DD-254 that is not a
subcontract. A requirement that fired there would have made every prime DD-254
unissuable. A row that does not apply is not a gap; a row that applies with
nothing in it is.

**The dialogs described a rule that was no longer in force.** Both the single
and the bulk issuance windows carried their own prose explanation of the To/CC
split. Both now state the rule actually being followed and name the roles this
office copies.

## Verification

- 1407 assertions, 0 failures, against build `d1695db9`. Seventeen assertions
  encoding the v2.10.0 To/CC rule were restated rather than removed; fixtures
  that could no longer be issued were given the addresses a DD-254 now needs
  rather than having the gate relaxed to suit them. Twelve are new.
- All five release gates pass; the rebuild kit round-trips byte-identically;
  pdf-lib is the unmodified upstream release.
- The Settings panel was exercised directly: four checkboxes, all unchecked,
  the required-recipients banner present, the empty-state note appearing and
  clearing on toggle, and the stored value written correctly.

## Limits

- **This changes who receives an issuance e-mail on upgrade.** The Security
  Manager and the Item 6 FSO stop being e-mailed until somebody turns them on.
  The Item 6 facility FSO moved from CC to To in v2.10.0 and now leaves the
  e-mail entirely unless copied: two moves in two releases for the same
  recipient.
- The cognizant security office is required unconditionally rather than only
  where it applies. A DD-254 carrying no address in Item 6c, Item 7c or a
  performance location cannot be issued at all. That is what was specified, and
  it is the one requirement that may need the same conditional treatment as
  Item 7 if it proves awkward at the solicitation phase.
- The copy list is one global setting. A contract with an unusual audience is
  handled by editing the distribution rows at issuance, not by a per-DD-254
  override; that was considered and declined as a second source of truth.
- Records already issued keep the distribution they went out with. Changing the
  setting never rewrites one.
