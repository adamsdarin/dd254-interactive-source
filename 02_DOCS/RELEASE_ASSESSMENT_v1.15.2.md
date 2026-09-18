# DD254 Interactive v1.15.2 — Security Classification Guides library

14 September 2026. Internal Tool v2.130. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Guide details | Typed freehand into Item 13 on each form | Kept once per guide in a library: unclassified title, identifier, date, issuing office, distribution statement, delivery |
| Citing a guide | Retyped, with inconsistent titles and dates across a portfolio | One click adds a citation line in a fixed shape, with optional portions |
| A guide is reissued | Nothing noticed | An open draft still citing the old date gets a warning and an Update citation button |
| Attachment reminder | "Security Classification Guide(s) (SCG) cited in Item 13" | Each cited guide named, so the envelope can be checked against the form |

## Why

Item 13 is the substance of the DD Form 254, and the guides it cites are what the
contractor actually classifies from. The DD Form 254 instructions in the approved
library ask Item 13 to list applicable security classification guides with page
numbers or other designations, to attach or forward under separate cover every
referenced document, and for Item 11c to give the unclassified titles or
identities of the guides. Freehand citations drift: the same guide appears with
different dates across forms, and a reissued guide leaves older forms citing the
superseded date with nothing to prompt a review.

Citations are recognised from Item 13 text alone rather than recorded in a
separate list, following the project's rule that there is one source of truth,
and the date comparison is a warning because it is a library-consistency check,
not a regulatory requirement.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. The new tests were also run against the
v1.15.1 build: every earlier test passed there except the six library-count and
panel-count tests changed deliberately for this release, and 16 of the 17 new
tests failed. The one that passed checks that a matching date raises no warning,
which an older build without the check also satisfies.

- The editor, citation format, insertion position relative to the CUI block,
  duplicate refusal, panel states, stale-date warning (never an error), Update
  citation preserving portions, whole-identifier and whole-title matching, unknown
  guides, attachment naming on the live form and stored drafts, spreadsheet import
  normalisation, escaping of hostile titles and read-only refusal are tested.
- Library-count tests were changed deliberately to nine libraries, eight
  spreadsheet libraries and twelve side-panel sections.

Limits: only citations in the tool's own shape are recognised; a changed title or
identifier in the library is not detected; findings appear when a draft is opened
or recounted, not on every stored record automatically. No new legal rule,
classification decision, service, account, network call or storage medium is
introduced.
