# DD254 Interactive v2.17.0 - a required contract template, a Done that says what is outstanding

6 November 2026. Internal Tool v2.166. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Contract template can be made mandatory | A DD-254 written from memory cannot be issued by accident | Three markers count as used; one that genuinely has none is set aside with a reason |
| Done lists what is outstanding | The preparer is told where they are, where they are looking | It also says plainly when nothing is outstanding |
| Item 13 and the repository boxes wrap | A long SCG or contract number is readable instead of behind a scrollbar | Line breaks are still preserved exactly, which Item 13's scanner depends on |

## Why

**A DD-254 built from no template is a DD-254 written from memory.** An
organisation that keeps its contract types in the repository can now say that
using one is not optional, exactly as it can for standard language. The
mandatory check asks the question three ways - the picker above Item 13, the
Contract Type recorded on the record, and the template whose wording the form is
carrying - because each of those is a template having been applied, and the
library's own apply sets only the last of them.

**Done was the wrong place to say nothing.** It is the button a preparer presses
when they believe they have finished. It wrote one line under the buttons
pointing at a panel on the other side of the screen, which is how a DD-254
missing a mandatory policy item reached the export with nothing said. It now
names what is outstanding - and says so when nothing is, because a prompt that
only ever warns is one people learn to click through.

**Wrapping.** `white-space: pre-wrap` keeps the line breaks Item 13's
cross-reference scanner anchors on, but it breaks lines at spaces only. An SCG
number, a long contract number or a pasted URL is one unbroken token, and it ran
off the side of the box behind a horizontal scrollbar - in Item 13 and in every
text box in both template repositories.

## Verification

- **1551 assertions, 0 failures**; eight are new and one was restated.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test, whose new `reqSettingsOk` drives the requirement and the Done report in
  a real browser.
- One assertion was restated: the Item 13 CSS check matched the rule's exact
  text, so it now reads the rule's declarations and requires both the newline
  behaviour it was written for and the new wrapping.

## Known and not fixed here

On the dynamic PDF, Items 14 and 15 marked **No** leave their explanation box
open and empty rather than closing up. The cause is in the DD Form 254's own
XFA template, which carries this on each No radio:

    if (this.rawValue == "1") { ... fourteen_identify.presence = "hidden"; }

as an `activity="change"` event. It runs when somebody clicks the radio in
Adobe. A form filled from saved data never fires it, so the field keeps the
presence the form draws it with. Nothing on the data side can set presence.

The fix is to add a start-up event to those fields in the embedded template that
applies the same rule, which means editing the embedded form and verifying the
result in Adobe on a real export. Both are the owner's call, so it is recorded
here rather than shipped unverified.

## Limits

- Mandatory contract template is satisfied by any template having been applied.
  It does not check that the right one was, or that its wording survived.
- Done reports the blocking findings the form already derives. It does not
  prevent an export; the issuance gate is what refuses to send.
- The wrapping change is the tool's own screen. The exported PDF's Item 13 field
  is `multiLine` in the form's template and wraps already.
