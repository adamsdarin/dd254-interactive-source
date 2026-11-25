# DD254 Interactive v2.25.0 - the revision chain

25 November 2026. Internal Tool v2.176. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A new DD-254 is built from the highest revision of its contract's template | No hunting for the current government revision among several templates | Only templates with a recorded source are chained; ties are not chosen between |
| DD-254s built from an earlier revision are flagged and listed | Every DD-254 a government revision affects is found, not remembered | A list to work through; nothing is revised automatically |
| Exempt with a reason | A deliberate decision is recorded once | Audited; lasts only until the next revision |
| The card records the template, version and date used | "Issued with this template on this day" is on the record | Taken from the snapshot made when the template was applied |

## Why

**The owner's request.** "Lets say I issued X DD-254 based on an original
issued by the government because I'm a prime. I should get a flag, if/when I
enter a new template that is a revision 1, 2, 3, 4, ect for all the DD-254's
that I issued under that template, and THEN also the DD-254 that is inserted
into the workflow, should be the DD-254 template that is highest in the
revision chain." He chose a list rather than automatic revisions, and our own
version numbers with the government's beside them.

**A chain, from what is already recorded.** DD-254 templates already record
which government DD-254 they came from (source type, revision number, source
date) and which contract and task order they are filed under. The chain is
read from those fields; nothing new has to be entered.

**Only what is known to be a revision.** The first draft also chained
templates with no source recorded, ordering them by when they were last edited.
Two existing assertions caught that it then chose between templates the tool
had always refused to choose between. Such templates may be for different
subcontracts; they are not chained.

**One ordering.** Task orders already chose their source by date first; that
is now the same order as the chain - the government's revision number first -
so the two cannot disagree about which revision is current.

**Listed, newest record only.** A DD-254 that already has a Revision or Final
below it has been dealt with by that child, which is checked in its own right;
listing the parent too would count every line twice.

## Verification

- **1667 assertions, 0 failures**; seven are new and none was restated.
- The dashboard notice and the Review list were photographed in headless
  Chrome.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- The chain is only as good as the source type and revision number recorded on
  each template.
- A Final is not part of the chain: it ends a contract rather than revising it.
- DD-254s created before v2.23.0 carry no snapshot of their template unless
  one was selected above Item 13; those are matched by that selection.
