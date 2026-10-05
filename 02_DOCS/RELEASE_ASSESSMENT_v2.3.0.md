# DD254 Interactive v2.3.0 - prime contracts, orders and received sources

2 October 2026. Internal Tool v2.145. Candidate build; not published.

The repository retains the current header, toolbar, editable source rows and
inline duplicate comparison. Sources and orders sit inside collapsible prime
groups. A Task Order, BPA or Delivery Order always has a parent prime and can
exist before its outgoing DD254 workflow is started.

| Change | Result | Preservation |
| --- | --- | --- |
| Order identity | A separate record holds parent prime, number and actual order type | Case-insensitive prime/number identity prevents duplicate order creation |
| Received source | Each order chooses prime source, order-specific source, or needs review | Many orders share one immutable saved version; their references are not duplicate templates |
| Start DD254 | Creates an Original from the selected source, with prime/order identity and source provenance | Opening a linked order reopens its existing workflow rather than creating another |
| Source changes | Edited, moved, removed and newer sources raise review | Existing snapshots and outgoing workflows are not silently rewritten |
| Navigation | Prime/source/order filters, search, collapsible groups and paging | Stored array order and stable template references remain intact |
| Migration | Existing order-specific source metadata becomes separate order records | Idempotent migration preserves source templates and earlier workflows |
| Portability | Full Backup, template packs and language JSON retain orders and saved source versions | CSV remains a source-row export; the order library defaults off on pack import |

The incoming received source does not choose whether the outgoing DD254 is
order-specific. New workflow creation leaves that checkbox for the preparer.
New captures preserve the order number and type independently of the checkbox;
legacy templates lacking an explicit selection retain their earlier behavior.

Duplicate scanning uses representative comparisons so a large collection of
identical copies does not create a quadratic list of pairs. Every matching row
is flagged, with the existing inline comparison and reviewed-copy behavior.
Source versions preserve exact stored content; imports refuse a source-version
ID that carries conflicting content. Source review is a local bookkeeping aid,
not a determination of classified scope or authority to perform work.

All 1,239 regression assertions pass against SHA-256
`0963695b0c6e6eb108d90a86cd02a04896dbcfca0b0882cc13b224cfa9e9b0a6`.
Both release files pass native-browser checks, including order creation, prime
and order-specific source selection, workflow start and duplicate prevention.
Script syntax, demo parity, documentation, manifest, byte-identical rebuild and
pdf-lib provenance checks pass. TEST_RESULT.txt and BUILD_FACTS.md record the
exact build. The 37-page manual is updated; changed pages and the built
repository layout are visually reviewed. Previous versioned candidates and
the production demonstration are preserved.

Received PDF import continues to capture language and source type/date only.
Set prime/order metadata after import before linking it to an order. The PDF
and file attachments are not stored in the source history. Existing outgoing
workflows retain their starting source even when an order's future source is
changed; updating an existing workflow remains a deliberate preparer action.
