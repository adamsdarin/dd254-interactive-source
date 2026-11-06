# DD254 Interactive v2.15.2 - the supported-effort line follows the order's coverage

6 November 2026. Internal Tool v2.164. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| An order under its prime's DD-254 is generated with the line | The effort is named on a form that has no field for it | Written where the DD-254 is built, so it is on the record before it is opened |
| An order with its own DD-254 has no line | Nothing to delete; Item 2a names the order instead | Unticking the coverage box puts the line back |
| Typing the order number at creation writes the line | No second visit to the order field | Unchanged for a DD-254 with no order |
| An older task-order DD-254 is reconciled when opened | The portfolio converges without being reworked | An Issued DD-254 is left exactly as it went out |
| An autosave belongs to the record it started on | No DD-254 silently overwritten by the next one opened | A save for the open record is unaffected |

## Why

**A task order has no field of its own on the DD Form 254.** The form
instructions put such numbers in Item 13, which is why the tool owns a leading
line there: *This is in support of effort N*. It was being written by one
path - the form writer - and every DD-254 generated from the order repository
is composed and saved as a workspace before it is ever opened, so it went out
with the order field filled and Item 13 silent about which effort the guidance
was for. The line is now established where the DD-254 is built, which is also
where a background update to a dashboard card is built.

**An order with its own DD-254 is already named on the face of the form.** Item
2a carries the prime and the order together, so the Item 13 line was the same
fact a second time and the preparer deleted it by hand. The line now follows
the coverage answer, in both directions, on the box's own handler.

**Reconciling on open, not in a migration.** A task-order DD-254 made before
this release has the order field filled and no line, or a line its Item 2a
repeats. Both are corrected the next time the record is opened - the same rule
and the same final-status exemption as the required Item 13 line and the
standard language. An Issued DD-254 is the record of what was sent.

**An autosave that outlived its record.** Found while testing the above:
`dashSaveNow` read which record was open, awaited the store, collected the form
and then read which record was open AGAIN. Closing or switching records in that
window wrote the open form's content onto the record just left, or - once the
dashboard had been reopened - a record with no identifier at all, which browser
storage rejects and the operator sees as an unexplained storage failure. A save
is now bound to the record it started on and abandoned if that record is no
longer open; whoever changes records saves first, as the order and template
paths already do.

## Verification

- **1530 assertions, 0 failures**; eight are new.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test, whose new `supLineOk` fails against v2.15.1.
- Both halves of the report were reproduced before being fixed, by a probe that
  generated an order DD-254 from the repository: under the prime, the stored
  Item 13 began with the template's wording and no line; with its own DD-254,
  Item 2a was combined and the line was present on the form.
- The autosave defect was proved by running the same sequence against the
  published v2.15.1 build, which overwrote the closed record.

## Limits

- Item 2a's combined form is unchanged: `PRIME | Task Order 0007`, the order
  type named. Only the exported value is combined; the form field keeps the
  bare contract number, which is what the length check reads and what names the
  exported file.
- The line is still a leading region of Item 13 identified by its own text. A
  copy the preparer has moved down the block is rewritten where it stands, and
  a copy whose wording has been edited is left alone.
- Coverage comes from the order record, not from a flag stored on the template.
  A task order nobody has recorded in the order repository is treated as running
  under its prime unless the box is ticked on the form.
