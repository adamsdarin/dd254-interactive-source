# PRD implementation update — v1.13.0

This update prioritizes correctness of what the tool asserts about the DD Form
254. The original browser-only constraint remains: one downloadable HTML file,
the existing browser database, and user-managed backups. Docker/Kubernetes
hosting remains a separate future phase.

Corrected: the form's own CUI marking is no longer derived from the contract's
CUI indicators; the SAP flag raises the subcontractor-signature requirement as a
finding rather than a hidden advisory, and reaches forms that name their
subcontractor in Item 7a as well as Item 2b; the tool no longer directs that
signature to Item 17, which is the issuer's certification and carries no
subcontractor block; Item 13 states a shared Item 7/8 classified mailing address
once; the Items 16/17 required-field asterisks are restored; and the preparer's
worksheet reads its Item 10/11 labels from the boxes instead of a second copy
that had drifted away from them.

Implemented: template source provenance — Original, numbered Revision or Final
beside the existing source date — and two independent 32 CFR 117.15 two-year
retention clocks, one armed when a template is revised to Final and one when a
Final DD Form 254 is issued to a subcontractor.

These remain preparation aids, not automated authority or classification
decisions. A retention clock computes a date from a date the operator enters; it
does not determine whether retention was authorised. Existing approval holds,
backup behavior and v1.12.0 evidence records are retained.

See [release assessment](../RELEASE_ASSESSMENT_v1.13.0.md) for behavior and
limits, and [prior implementation map](IMPLEMENTATION_v1.12.0.md) for retained
PRD coverage.

Acceptance: a form whose contract involves CUI is marked, badged, grouped and
sent as UNCLASSIFIED unless the operator marks it CUI; a SAP subcontract
identified in Item 2b or Item 7a raises the signature requirement and records
where that signature is held; Item 13 prints one address per company and reports
a genuine disagreement; the printed worksheet names each ticked box exactly as
the form does; a Final arms the retention clock and a revision does not. Whether
the retention reminders change real disposition timeliness still requires user
trials.
