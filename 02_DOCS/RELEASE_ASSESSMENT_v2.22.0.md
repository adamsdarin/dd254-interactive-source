# DD254 Interactive v2.22.0 - a searchable template library, closed contracts, and the award's contract number

24 November 2026. Internal Tool v2.173. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| The template library exports as a PDF or a Word document | Wording is found across every template by searching one document, not ten spreadsheets | A copy only: nothing is written back; the sensitive-terms screen runs first |
| Every Item 10/11 box says whether it is ticked and when its wording applies | The behaviour of a template is readable without opening the editor | Derived from the same fields the editor writes |
| Contract closed, ticked on the template | A closed contract is recognised wherever its template or number is used | Red in every dialog; a finding on the form until a reason is given |
| Spawning an Original asks for the contract number | The award carries the contract it was actually awarded under | Keeping the solicitation's number is one deliberate press |

## Why

**Three requests from the owner.** "A way within the tool to export all of the
templates ... as either a PDF or a Word document ... a searchable database
that I can look for keywords, key sections." "Flag if a contract is closed to
require me to ask why we're ordering a part for something that is currently no
longer open. The trigger ... should be done in the template language." And:
"when you spawn an original ... it should require you to enter in a contract
number. It isn't doing that currently."

**The export.** The spreadsheet export is one row per template and one column
per field - right for bulk editing, unreadable for finding wording. The new
document lays each template out by Item with a heading per Item, because "what
do we say under 11c" is how wording is looked for. One model is built and two
writers lay it out, so the PDF and the Word document cannot disagree. A test
fills every field the spreadsheet definition knows about and requires each to
appear in the document, so a field added to templates later cannot silently go
missing from the export.

**No new third-party code.** A .docx is a zip of XML files. The tool writes an
uncompressed ("stored") zip itself - about forty lines with a CRC table -
rather than adding an archive library to the file an ISSM reviews. The PDF uses
the pdf-lib already embedded, with the standard fonts, so its text is
searchable. The rebuild kit, SBOM and third-party notices are unchanged.

**Leaving the tool.** An export is a document that travels. When the browser
holds a sensitive-terms list, the export is screened first; templates are
named, phrases never are. The marking follows the templates' own recorded form
classification and the document says to check it.

**Closed contracts: why a finding, not a block.** The owner's word was "ask
why", not "refuse". There are legitimate reasons to prepare a DD-254 against a
closed contract (a part under warranty, a records correction). The existing
dismissal mechanism already requires a written reason, keeps it on the DD-254
and audits it; the closure is raised as a finding that holds the record at
Draft until set aside, so the reason is captured once and visibly. Issued,
Cancelled and Skipped records are not flagged: a contract closing after its
DD-254 went out is the normal life of a contract.

**The award.** Spawning an Original copied the solicitation's Item 2a and left
Block 2b blank, although an Original created any other way cannot be made
without 2b. The award is where the contract number is settled, so the dialog
asks for it and starts empty.

## Verification

- **1645 assertions, 0 failures**; thirty-one are new. One existing assertion
  read the tool's source for the first line matching the Standard Language
  editor; the new export's code was rearranged so that line stays unique, and
  the assertion is unchanged. Six existing tests spawn Originals; they now
  answer the dialog with the solicitation's own number, exactly what the tool
  did before, so their meaning is unchanged.
- The PDF was read back with pypdf (text, page markings, bookmarks); the Word
  file with Python's zipfile and XML parser in the suite, and separately opened
  with python-docx and converted by LibreOffice, which rendered every page with
  the marking header and page numbers.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- The export is a snapshot. Editing it changes nothing in the tool.
- Task orders are listed by number and coverage; the wording they use is in the
  DD-254 template they resolve to.
- The closed flag lives on DD-254 templates. A contract with no template saved
  cannot be marked closed until one is.
