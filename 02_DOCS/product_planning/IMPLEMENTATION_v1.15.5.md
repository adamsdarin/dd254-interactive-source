# PRD implementation update — v1.15.5

Corrective point release in the v1.15 horizon. The browser-only constraint is
unchanged.

Implemented, with owner decisions of 14 September 2026: the countersignature badge
keys on a SAP subcontract rather than on having a parent draft; a SAP flag that
differs between issuances is a blocking error; the Item 17 help text limits the
subcontractor signature to SAP subcontract forms; the Preparer's Worksheet uses the
same SAP subcontract definition (Item 2b or 7a). From owner testing: dialogs fit the
window, and Redraft can choose the revision summary's baseline from the chain.

Remaining v1.15 point release, now v1.15.6: Final-due prompt and demonstration
portfolio. NCCS alignment is out of scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.5.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.4.md) for earlier coverage.

Acceptance: no countersignature badge on a Revision of a prime contract or a non-SAP
subcontract; every issuance of a SAP subcontract shows it; a changed SAP flag is an
error; the missing-language review can be scrolled and closed; a Revision's summary
can compare with the Original; official and demo builds pass browser and regression
checks.
