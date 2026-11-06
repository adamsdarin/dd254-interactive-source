# DD254 Interactive v2.16.0 - a clause that waits is not asserted by its own template

6 November 2026. Internal Tool v2.165. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Wording that waits is not written, and its box is not ticked, by the template | Nothing to delete from Item 13 on a DD-254 the clause does not apply to | Ticking the box in the workflow inserts it; unticking removes it |
| A tick the DD-254 already had is left alone | A Revision keeps what its Original asserted | The template is silent about that box, not opposed to it |
| Wording marked always applies is unchanged | A contract type's standing wording still lands on every DD-254 | The template states its box exactly as before |
| Required attachments travel with the applied template | The issue screen lists what actually has to be attached | An attachment both libraries require is listed once |

## Why

**The setting had no effect in the case it was written for.** A template is
authored by ticking an Item 10/11 box and typing the wording beside it, then
choosing whether that wording always applies or waits for its box. But applying
the template also ticked that box - so the condition was satisfied by the
template itself, the instant it was applied, and the wording went straight into
Item 13. "Applies when 11d is ticked" could only ever mean *ticked by the
preparer, on this DD-254*. A template that answers the question cannot also be
leaving it open.

So a template now defers the box whose wording waits: it does not tick it and
does not write the wording. Everything else about whole-template application is
untouched - every other box is still stated, blanks included - and a tick the
DD-254 already carried is left exactly as it is, because silence about a box is
not a denial of it.

**Existing templates keep doing what they do.** Wording with no setting
recorded would otherwise read as "waits for its box" - a safe default when the
setting was introduced, and a much stronger statement now that it is honoured.
Until this release a template asserted the box whatever the setting said, so
that wording has in fact been behaving as "always applies"; it is stamped once
as exactly that, on the next read of each template, and the stamp is what makes
the settings in a template the author's from then on. A clause set back to
"applies when its box is ticked" stays that way, and wording added from now on
waits by default, because ctBlankData carries the stamp.

The owner chose this over honouring the bare default, on the principle that a
setting nobody chose should not become a decision. The cost is that a clause
somebody did deliberately mark "applies when ticked" between v2.14.0 and
v2.15.2 is stamped too - there is no way to tell the two apart, because that
choice was recorded as the absence of a flag, and in those releases it behaved
as "always" regardless. One edit in the editor puts it back.

**Attachments had the same defect the wording had.** They were derived from the
template picker above Item 13 and from the Contract Type label recorded on the
record. Neither is set by the library's own apply, so a template applied that
way listed none of its required attachments - on the form or on the issue screen
that tells the preparer what to attach before sending. The DD-254 already
carries what the applied template says per box, from v2.15.1; it now carries
what that template requires attached, and both readers consult it.

## Verification

- **1543 assertions, 0 failures**; thirteen are new and eight were restated.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test, whose restated `boxGateOk` fails against v2.15.2.
- The behaviour was reproduced against the published v2.15.2 build before the
  change: a template ticking 11d with wording marked "applies when ticked" both
  ticked it and wrote the wording on application. A probe of the published build
  also showed a template applied from the library contributing none of its
  attachments to either list.
- Eight assertions encoded the old rule and were restated rather than deleted:
  their fixtures now declare which setting they are testing, and each one that
  proved "the wording lands on application" is paired with one proving the other
  setting waits.

## Limits

- A template cannot both assert a box and carry wording for it that waits. The
  two statements contradict each other; marking the wording *Always applies* is
  how a template asserts the box and carries the wording with it.
- Only the most recently applied template's attachments and wording are
  remembered on the DD-254. Applying a second template replaces them.
- Required attachments are still text the preparer attaches by hand. The tool
  lists them; it does not hold the files.
