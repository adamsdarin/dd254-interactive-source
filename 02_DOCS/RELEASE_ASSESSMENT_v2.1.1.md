# DD254 Interactive v2.1.1 — Item 17 read back from Item 6b

23 September 2026. Internal Tool v2.142. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Item 17 filled from the CAGE in Item 6b | Item 17 arrives filled on a draft that was opened, typed or spawned, not only on one where a facility template was just applied | Exact CAGE match; a half-typed code pulls in nobody |
| Filled only when Item 17 is entirely empty | Nothing the preparer has entered is touched | All-or-nothing, so two people can never share one certification block |
| Explicit apply unchanged | Applying a facility by CAGE still replaces Item 17 outright | That is an instruction to use that facility, not a read-back |

## Why

v2.1.0 linked a certifying official to a facility and filled Item 17 at the
moment a facility template was applied by CAGE. That is the only moment it
fired. A draft whose Item 6 was typed by hand, restored from browser storage or
copied from its parent when a Revision or Final was spawned never passes through
that step, so Item 17 stayed blank through the ordinary workflow — which is the
case the feature was asked for. The link is now also read back from the CAGE
already standing in Item 6b, when a draft is opened and when that field is
committed.

Filling only the empty fields was implemented first and rejected on the evidence:
a preparer who had typed another name into 17a was given the facility official's
title and telephone number beside it. Item 17 is one person's certification, so
it is filled only when every field in it is empty.

## Verification and limits

Seven regression assertions cover the opened draft, the typed CAGE, the
half-typed CAGE, a facility with no official linked, an Item 17 that already
holds something, the unchanged explicit apply, and the listener being wired once.
Both builds were driven in native Chrome through the same six situations, and the
same run against v2.1.0 leaves Item 17 blank in the two cases this release fixes.
See the recorded test log and BUILD_FACTS.md for results and hashes of the
shipped files.

No storage format change. The tool records who is expected to certify and fills
the fields they would sign under; it does not determine whether that person holds
the appointment, and Item 17h remains a signature the form carries and the tool
does not.
