# DD254 Interactive v2.7.0 - contract types are chosen, not asked about

5 October 2026. Internal Tool v2.150. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| No contract-type chooser at origination | Creating a solicitation or an Original goes straight to the form | Nothing is pre-populated that was not asked for |
| A Contract Type picker of its own | The rare case is one choice in a panel already open, instead of a question on every form | Sits beside DD-254 Template Language and Standard Language, found by the same search |
| One apply path | Applying from the picker still asks before replacing Item 13, records the contract type and writes the audit entry | Hands to `dashApplyB13`, the path the dashboard card already used |

## Why

The chooser asked a question that nearly every DD Form 254 answers the same way.
The vast majority of contracts are ordinary FAR-based ones with no contract type
at all; the owner's own description of the normal path is to create the DD-254,
search for a template and insert it. A prompt that is nearly always dismissed is
worse than no prompt, because dismissing it becomes reflex - and then it is
dismissed on the contract where it mattered.

So the question is gone and the capability is not. Contract vehicles are a
library like the others, and they are now reached the way the others are: by
opening the panel the preparer already opens and choosing from a list. The rare
case costs one selection; the common case costs nothing.

## Verification and limits

Five regression assertions cover it: creating a DD-254 calls nothing that asks
about contract type and leaves Item 13 empty; the picker lists the vehicles;
applying one fills Item 13 and the Item 10 selections, records `ctType` on the
draft and clears the select; the picker hands to `dashApplyB13` rather than
repeating its logic; and applying with no draft open refuses with a message
instead of doing nothing. Both builds pass native Chrome.

Discoverability is the trade. The chooser advertised that contract types exist;
without it, somebody who does not know to look will not meet them. They remain
visible in the Checklist and Templates panel and on the dashboard card, and that
cost is paid once by a new user rather than on every DD-254 by everyone.

No new legal rule, authority determination, service, account or storage medium
is introduced, and no storage format changed. Drafts created with a contract type
by an earlier version keep it.
