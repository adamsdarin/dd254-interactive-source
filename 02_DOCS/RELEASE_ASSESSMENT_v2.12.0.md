# DD254 Interactive v2.12.0 - the Argon prototype, rebuilt

23 October 2026. Internal Tool v2.158. Single HTML file; existing browser storage.

## What this release is

A prototype code-named Argon was built against this tool by another assistant.
It had good ideas and it drifted. Rather than adopt it, its requirements were
rebuilt on v2.11.0.

That was the right call for a measurable reason. Argon descends from the
shipped v2.11.0 - it carries `DIST_CC_ALWAYS`, which exists in no earlier build
- but it had deleted the flat PDF writer and the Item 13 toolbar, weakened a
validation rule "to protect existing tests rather than on the rule's merits",
and left the official regression suite stalling 800 assertions short. Its own
traceability document says so. Adopting it would have imported those with the
features.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Issuance e-mail names its attachments | The sender is told what must travel with the form, in the message itself | Too long means the list is dropped whole and said so, never truncated |
| One attachment name per box | A pasted note stops becoming a phantom attachment | `attText` is still what is stored, so CSV and old templates are untouched |
| Copy asks the stage and the intake | The person, contract and order are confirmed once, not retyped | A matched template never overwrites copied language |
| Standalone flag derived | The box is right without anyone remembering to fix it | It cannot be ticked on an order that follows the prime |
| Purchase and bids language split | A solicitation stops offering award wording | An entry written before this counts as either, so nothing disappears |
| Caveats chosen, and withdrawn | Unticking a box takes its wording back out | An edited caveat is left alone and flagged, never half-deleted |
| Caveat engine | 11c against 11d is asked directly rather than guessed | Off by default; advises, and changes nothing until applied |

## Why

**The flat PDF writer and the Item 13 toolbar are gone, by owner decision.**
Both were raised, both were decided twice. The consequence is recorded rather
than buried: an XFA form cannot be digitally signed in the free Adobe Reader
without Reader Extensions usage rights, so signing needs Acrobat. The build is
762 KB smaller.

**An operator was told who to send to and never what to send.** A DD-254
without its SCG is a DD-254 nobody can act on. The attachments are now in the
prepared message, deduplicated across each audience group, and in the bulk
window beside the e-mail they belong to rather than several screens away.

**"Is it classified" is the wrong question for 11c and 11d.** The right one is
whether the hardware is classified, or only what the testing produces - two
independent answers. The optional engine asks exactly that. It is off by
default because an FSO who knows their selections should not walk a
questionnaire to tick two boxes.

**Nothing silently reclassifies existing work.** A standard-language entry with
no scenario counts as either, not as purchase; a DD-254 with no recorded caveat
choice still takes everything its template offers; a template with a stored
standalone flag is ignored rather than obeyed.

## Verification

- **1460 assertions, 0 failures** against build `fbbbf4e2`. Every one of the
  eight feature commits was smoke-tested on a real browser before it landed.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release.
- Assertions that encoded a superseded rule were restated with the reason, not
  deleted - except the fourteen describing the flat writer, which were removed
  because the capability they tested no longer exists, and replaced by three
  asserting it is actually gone.

## What the tests caught that review did not

- `lsGet` treats an empty string as "nothing stored", so clearing the standing
  Item 13 sentence silently un-cleared itself.
- A hidden input is not collected by `collectWorkspace`, so the caveat choice
  never survived save and open.
- Closing the language banner left its content in the accessibility tree.
- `check_scripts.py` caught a generated-markup syntax error before the suite
  did.


## A gap the tests closed late

The intake caveat checklist was reported as built when it was not. An edit lost
its anchor and was never written, so the dialog collected checkboxes nothing
rendered: `caveatsOffered` was always false and the choice was never recorded.
Every caveat assertion still passed, because they all called the data layer
directly. Section 134 drives the dialog itself, which is the only thing that
would have caught it, and now does.

## Limits

- The language banner collapses below 1240px rather than reflowing.
- The engine's questionnaire covers the archetypes, the hardware-versus-testing
  matrix, COMSEC and OPSEC. It does not yet ask the Item 11l CUI question that
  Case 4 of the matrix points at.
- Argon's own prototype files remain untracked in the working tree as
  reference; they are not part of this release.
