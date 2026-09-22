# DD254 Interactive v2.1.0 — a facility names its certifying official

22 September 2026. Internal Tool v2.141. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Certifier dropdown on a facility template | The official who certifies for a facility is chosen once, in the facility library, instead of being re-selected on every form | Optional; a facility with no official linked is unchanged |
| Applying a facility fills Item 17 | Items 17a, 17b, 17c, 17e, 17f and 17g arrive with Items 6a, 6b and 6c from one CAGE lookup | A facility with no linked official leaves Item 17 exactly as it was — it never blanks a typed entry |
| The link follows later corrections | Correcting an official once in the Certifying Officials library reaches every facility that names them | Resolved against the library on every use; the stored snapshot answers only when the library no longer holds that label |
| Certifier Link column in the facility spreadsheet | The pairing survives a bulk export and upload | Same column mechanism as the existing CSO Link |

## Why

Item 17 certifies that the security requirements stated on the form are complete
and adequate. It is completed by the activity **issuing** the DD Form 254, which
is the contractor named in Item 6. A facility and the official who certifies for
it are therefore a stable pair, and the facility library is where that pair
belongs. Until this release the two libraries existed side by side with nothing
joining them, so the official had to be selected again on Item 17 every time.

The link is stored the way the 6c CSO link has always been stored: a label plus a
snapshot. The label is resolved against the Certifying Officials library first,
so an official who changes title, telephone number or e-mail is corrected in one
place. The snapshot is a fallback for a browser whose library no longer holds
that label, not a second source of truth.

## Verification and limits

The regression suite adds six assertions: the dropdown renders once per facility
row with the whole library and the linked official selected; selecting one stores
the label and the snapshot; applying the facility by CAGE fills all six Item 17
fields; a corrected library entry wins over a stale snapshot; a facility with no
linked official leaves a hand-typed Item 17 untouched; and the link survives the
facility spreadsheet export and upload. See the recorded test log and
BUILD_FACTS.md for results and hashes of the shipped files.

No storage format change: `certLabel` and `certSnap` are optional fields on a
facility entry, so drafts, backups, template files and spreadsheets written by
earlier versions load unchanged, and a facility saved by this version loads in an
earlier one with the link ignored. No new legal rule, classification decision,
authority determination, service, account or storage medium is introduced.

The tool records who is expected to certify and fills the fields they would sign
under. It does not determine whether that person holds the appointment, and it
cannot confirm that Item 17 was signed — Item 17h remains a signature the form
carries and the tool does not.
