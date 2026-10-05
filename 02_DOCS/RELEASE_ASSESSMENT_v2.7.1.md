# DD254 Interactive v2.7.1 - orders in the picker, the OPSEC citation, and a harness that says why

5 October 2026. Internal Tool v2.151. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Task orders with their own DD-254 appear in the template picker | An order-specific DD-254 can be reached from the form instead of not being there at all | Listed by prime contract, order number and order type; choosing one selects the template bound to it |
| The bound template is not listed twice | One entry per order, under the identity the preparer thinks in | An order still awaiting source review is shown but cannot be chosen, because there is nothing to apply |
| Item 11j cites the authority that actually imposes the rule | A preparer following the citation reaches the text that says it | The rule is unchanged; only the citation moved |
| The browser harness reports why it failed | A failed verification names its cause instead of its symptom | Sandbox is dropped only where the environment says so; a local run keeps it |

## Why

**Orders were absent, not hidden.** Orders are kept in their own store and the
form's picker read only the template store, so no amount of searching would have
found one. The fix lists own-coverage orders in the picker under their own
identity and resolves a selection to the template bound to that order, so
everything downstream is unchanged.

**The OPSEC citation was attached to the wrong document.** Box 11j pointed at
DoDD 5205.02E for the Item 14 obligation. The DD Form 254 Instructions, Item
11j(1), are what require it: if 11j is checked then Item 14 must be marked YES
with the additional requirements stated there or in an attachment, the pertinent
contract clauses identified, and clarifying guidance added to Item 13. DoDD
5205.02E is the DoD OPSEC programme directive and is now named as that rather
than as the source of a form-completion rule. This is the same defect class as
the CUI marking and the Item 17 signature location: the rule was right and the
authority attached to it was not.

**The harness hid its own evidence.** `browser_smoke.js` captured Chrome's
stderr and discarded it, so a browser that would not start reported only
"timeout waiting for Chrome DevTools port". That is the symptom; the cause was
thrown away, and a CI failure could not be diagnosed from its log.

## Verification and limits

Five regression assertions cover the picker: an order is listed under its order
number, choosing it resolves to the bound template, the bound template is not
listed twice, an order awaiting review is shown and disabled, and the search
matches on order number. 1292 assertions pass in total. Both builds pass native
Chrome locally with the sandbox on.

The harness change is partly unproven. Its browser name and sandbox state were
confirmed by pointing it at a non-browser; no local condition was found that
makes Chrome write to stderr, so that part of the report will first be exercised
in CI. The sandbox is dropped only when `DD254_BROWSER_CI=1`, which both
workflows set and a local run does not.

No new legal rule, authority determination, service, account or storage medium
is introduced, and no storage format changed.
