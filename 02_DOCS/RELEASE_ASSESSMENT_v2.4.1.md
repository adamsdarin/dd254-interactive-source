# DD254 Interactive v2.4.1 - creation-only order coverage

2 October 2026. Internal Tool v2.147. Local candidate; not published.

The prime/own selection is offered only while adding a Task Order, BPA or
Delivery Order. Saved order headers show Follows prime DD254 or
Task-order-specific DD254 as a label, with no coverage-switching buttons.
Own templates retain the same complete editable fields as prime templates.

Source review chooses a current template or revision within the order's saved
coverage. Missing own templates can be repaired within own coverage. Neither
operation offers or applies a prime/own switch. Existing selections, editable
templates, immutable source versions and outgoing workflows are retained.
Older records infer coverage from their current selection or saved snapshot.

All 1,264 regression assertions pass against the exact candidate in
TEST_RESULT.txt and BUILD_FACTS.md. Official and demo native-browser checks,
script syntax, demo parity, documentation, manifest, byte-identical rebuild and
pdf-lib provenance checks pass. The 37-page manual is updated; its changed
instructions and adjacent pages were rendered and visually reviewed. The
built repository was checked through actual creation and editing controls.

This patch retains the existing tool design, repository organization,
recipient handling, blank replacement and offline storage model. Prior
versioned builds are preserved. Production has not been updated.
