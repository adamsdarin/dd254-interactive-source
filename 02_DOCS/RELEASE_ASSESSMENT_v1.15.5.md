# Codex Astra v1.15.5 — SAP countersignature badge, SAP lineage, dialogs and summary baseline

14 September 2026. Internal Tool v2.133. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Countersignature badge | "no countersignature" on every spawned issuance, including Revisions of prime contracts | Only on SAP subcontracts (SAP flag with Item 2b or 7a), on every issuance |
| SAP flag across issuances | Could change silently between an Original and its Revision | A difference from the parent is a blocking error |
| Item 17 help text | Said every subcontract needs the subcontractor's signature | Limits that to SAP subcontract forms |
| Long confirmation dialogs | Buttons pushed off screen; no way to close | Dialog fits the window and scrolls; OK, Cancel and Escape reachable |
| Revision summary baseline | Always the issuance the Revision was spawned from | Redraft can choose the Original or any earlier Revision |

## Why

DoDM 5205.07 (January 17, 2025), section 10.1.d: subcontractor DD Form 254s must be
signed by the subcontractor. That is a Special Access Program rule. The DD Form 254
instructions in the approved library require only the certifying official's
signature (Item 17) and ask for no subcontractor signature on other forms. The badge
keyed on having a parent draft, and every parent the dashboard creates is an earlier
issuance of the same contract, so it marked ordinary revisions. The owner confirmed
that the countersignature flows with the SAP and that a contract is always SAP or
never SAP, and chose a blocking error when the flag differs between issuances.

While testing, the owner found the Item 13 missing-language review dialog could not
be scrolled or closed, and asked for a revision summary that can compare with the
Original as well as the spawned-from issuance.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. Run against the v1.15.4 build, every earlier
test still passed there and 13 of the 17 new tests failed; the other four check
behaviour this release keeps (the SAP badge, no lineage error without a parent, the
default baseline, and no prompt with one earlier issuance).

- A prime-contract Revision and a non-SAP subcontract Revision show no badge; both
  issuances of a SAP subcontract show "owed", then "countersigned" once recorded; a
  recorded signature on a non-SAP card stays in the record and the CSV.
- Setting or clearing the SAP flag against the parent is an error on open and on
  recount; a DD-254 with no parent sets the flag freely.
- The Item 17 help text and the worksheet's Item 7a case are checked.
- A long dialog carries the height rules, keeps its buttons and closes on Escape;
  in headless Chrome the five-section review fits a 905-pixel window with the
  buttons visible and Cancel closes it.
- Redraft offers the chain with the spawned-from issuance first, writes the chosen
  baseline, keeps it through edits and reopening, clears it when the parent is
  chosen again, honours Cancel, is not inherited, and does not ask with one earlier
  issuance; the POC warning still uses the spawned-from issuance.

Limits: the SAP flag is not locked on spawned issuances; the error reports a
difference. No new legal rule beyond DoDM 5205.07 section 10.1.d is introduced.
