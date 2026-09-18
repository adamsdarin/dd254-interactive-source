# DD254 Interactive v1.13.0 — what the form actually requires

12 September 2026. Internal Tool v2.125. Single HTML file; existing browser storage.

This release is mostly corrections. Each is a place where the tool stated
something more specific than the DD Form 254 or its governing authority
supports. In every case the statement was self-consistent and enforced, which is
why none of them surfaced as a failure.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| CUI marking separated from CUI requirements | An UNCLASSIFIED form stops being badged CUI, split into its own issuance audience and sent with a `(CUI)(CUI)(CUI)` subject | The contract requirement is still reported and pointed at the Item 13 guidance the GCA owes; it no longer sets the marking |
| SAP subcontractor signature enforced | A SAP subcontract can no longer reach Issued with no signature recorded anywhere | Does not block issuance — the form has to go out to be signed |
| Signature location no longer invented | Stops sending a preparer to Item 17 for a block the form does not have | States the requirement and the gap, and records where the signature is actually held |
| One classified mailing address in Item 13 | A company named in both Item 7 and Item 8 is stated once instead of twice | Keyed on CAGE; a genuine disagreement between the two is reported, not hidden |
| Items 16/17 asterisks restored | The only cue that those blocks must be completed is back | Still outside REQ, so a draft is never blocked on fields another party completes |
| Worksheet labels derived from the boxes | The printed worksheet stops mislabelling what was ticked | One source of truth; the two can no longer drift apart |
| Template source provenance | Records whether a template came from an Original, a numbered Revision or a Final | Carried through template import and export |
| Two retention clocks | A Final starts the 32 CFR 117.15 two-year window, separately for our holdings and for a subcontractor's | Independent of each other and of the Item 3b(3) biennial review |

## Verification and limits

1018 regression assertions pass. Five existing assertions encoded the previous
CUI and Item 17 behaviour and were rewritten to assert the corrected rules.
Native Chrome exercises both official and demo files; its issuance check now
proves that a CUI-marked record is marked and audience-split while a record that
merely involves CUI is neither. Its Items 16/17 check previously resolved labels
with `closest()`, which returns null for every one of those fields and made the
assertion true whatever the markup said; it now resolves by `for=` and fails if
the labels stop resolving. The PDF oracle gained exact-occurrence assertions, so
the Item 13 duplicate rule is proven in the generated PDF rather than only in the
text box that produces it. See the recorded test log and BUILD_FACTS.md for
results and hashes of the shipped files.

No new legal rule, classification decision, authority determination, service,
account or storage medium is introduced. The retention clocks compute a date from
a date the operator enters; they do not determine whether retention was
authorised, and the GCA's written authorisation remains the controlling record.
The subcontractor-signature requirement is raised, recorded and reported, but the
tool cannot confirm that a signature exists or that material was returned or
destroyed. Existing storage, records, approval holds and v1.12.0 evidence remain
available and backup-compatible.

## Known limitation carried forward

The Item 10/11 boxes state 93 assertions about the form and its authorities.
Every one is backed by at least one conditional rule, and of the 31 that name
another box only one is unpaired — 10a's "if accountable COMSEC needs Defense
Courier, also check 11k", whose antecedent is a fact the tool does not hold. The
residual risk is not missing rules but claims that are enforced and wrong, which
is the class this release corrected twice. Only reading each claim against the
DD Form 254 and its authority finds those, and that is an FSO decision rather
than an engineering one.
