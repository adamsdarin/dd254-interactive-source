# PRD implementation update — v1.15.2

Third release of the v1.15 preparer-throughput horizon. The browser-only
constraint is unchanged.

Implemented (roadmap item 2.2): a Security Classification Guides library with
unclassified title, identifier, date, issuing office, distribution statement and
delivery; one-click citation into Item 13; attachment reminder naming cited guides;
a non-blocking warning and Update citation when a cited guide's date changes; Full
Backup, template pack and spreadsheet support.

Remaining v1.15 point releases, in order: sensitive-terms screen for Items 9 and
13; revision summary in Item 13; Final-due prompt and demonstration portfolio.
NCCS alignment is out of scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.2.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.1.md) for earlier coverage.

Acceptance: a guide added to the library can be cited into Item 13 once, above the
managed tail; changing its date raises a warning on a draft citing the old date and
Update citation clears it without losing portions; cited guides appear in the
attachment reminder; the library travels in Full Backup, packs and spreadsheets;
official and demo builds pass browser and regression checks.
