# DD254 Interactive v2.5.0 - contract authority and Item 16 in the review packages

5 October 2026. Internal Tool v2.148. Single HTML file; existing browser storage.

Selected from the FSO and contracting officer roadmap review. Both changes are
to the review packages, which are reading aids: the form, its validation and its
storage are untouched.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Contract authority table on both packages | The reviewer reads the DD-254 beside the contract; the package now states which contract, which issuance stage and which guides without opening the form | Derived from the form, so the package cannot disagree with the printed DD Form 254 |
| Every Item 2 number reported in its own right | A subcontract shows both the prime number and the subcontract number | Fixes a real loss: the package reported the first filled of 2a, 2b and 2c, which on a subcontract hid the number under review |
| Guides cited in Item 13 listed | The reviewer sees the exact guides relied on, and is told when none is cited | A cited date that differs from the held guide is flagged, and a guide not held in this browser is marked as such; neither is corrected |
| Item 16 listed in the government package only | The GCA sees which of its own fields are outstanding | The prime package does not carry it, and the preparer's required set is unchanged |

## Why

The Contracting Officer reads a DD Form 254 next to the contract it belongs to,
and the package was not stating that relationship. It showed one contract number
chosen as the first of Items 2a, 2b and 2c that happened to be filled - so for a
subcontract, the case where the question "which contract is this?" matters most,
it showed the prime number and omitted the subcontract number entirely.

Item 16 is the opposite problem. The tool deliberately does not require Items 16
and 17 of the preparer, because other parties complete them after handover. That
is right for the FSO and unhelpful for the Contracting Officer, who **is** the
other party. The government package now lists those fields and what is in them.
It is a reading aid, not a new obligation: a blank Item 16 still raises no error
on the form, and a regression assertion holds that line.

## Verification and limits

Seven regression assertions cover the trail, the guides, the no-guide wording,
both packages carrying the trail, Item 16 appearing in the government package
only, an entered Item 16 field displacing the placeholder, and a blank Item 16
raising no validation error. Both builds pass native Chrome.

The tool reports what Item 13 cites and what the guide library holds. It does not
determine which guide is current, and the Government Contracting Activity's
written guidance remains the controlling record. No new legal rule, authority
determination, service, account or storage medium is introduced, and no storage
format changed.
