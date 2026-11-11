# DD254 Interactive v2.19.0 - Items 14 and 15 close up, and guidance lands where it reads

11 November 2026. Internal Tool v2.168. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Items 14/15 marked No close their explanation box | The exported form stops showing an empty box a GCA has to interpret | One addition to the embedded form, running the form's own rule |
| The Apply button says what it would do | No guessing whether the engine has been applied | Grey is kept for the one case where there is nothing to apply |
| Guidance sorts by the box it belongs to | Item 13 reads in the order of the form | The head and tail regions are never crossed |
| A past bids-due date stops issue | A solicitation cannot go out asking for bids that closed | Dismissible with a reason; silent on a DD-254 already closed |

## Why

**The empty box on Items 14 and 15 was the form's own script not running.**
Each No radio carries `fourteen_identify.presence = "hidden"` on an
`activity="change"` event - it fires when a person clicks the radio in Adobe.
This tool fills the form from saved data, so nothing is ever clicked and the
field keeps the presence the form draws it with. No value in the datasets packet
can change a field's presence.

So the embedded form now carries one `activity="ready" ref="$form"` event per
field, running the rule the form itself wrote. This is the first and only change
this tool makes to the Government's blank form, and it is recorded in
`THIRD_PARTY_NOTICES.md`. The approach was confirmed before it shipped: the
owner reported that an exported DD-254 shows the form's own "Please read
Instructions" alert in Adobe, which is itself a `$form` ready script - so ready
events do fire on a data-filled open.

**A button that is grey before it is pressed teaches people not to press it.**
The Apply button took the panel's default colour and looked identical whether
there was work to do, none left, or nothing offered at all. It now answers the
question it is asked: blue while something is outstanding, blue with a tick once
the form already matches the answers, grey only when the questions above have
settled nothing. The state is computed from the form, not remembered, so it
corrects itself when a box is unticked by hand.

**Item 13 should read in the order of the form.** Clauses were appended, so a
clause for Item 11c could sit below one for Item 18 that happened to be written
first. They now sort by the box they belong to, whoever supplied them - the
template or the engine - between the head region (the supported-effort line and
the revision summary) and the tail (the standing sentence and the classified
mailing address), neither of which is ever crossed.

**A solicitation with the response date behind it cannot be issued.** The form
would be telling bidders to respond by a day that is gone. It is an ordinary
finding, so it holds the DD-254 at Draft, appears in the panel and on Done, and
can be set aside with a written reason. It stays silent on a DD-254 that is
already issued, skipped or cancelled: the finding is about issuing, and the
demonstration portfolio's Skipped solicitation - closed 215 days ago - is
exactly that case.

## Verification

- **1568 assertions, 0 failures**; eight are new, including one that reads the
  embedded form back out of the build, inflates its XFA template, and checks
  both additions are present, that every packet survived, and that no other
  `ready` event appeared.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- A real export was produced through the tool's own path with both items marked
  No and sent to the owner to open in Adobe.

## Limits

- The addition to the embedded form is two events. It does not touch the Yes
  radios, the field's own validation, or anything else the form does - including
  its "Please read Instructions" alert, which is the form's and is left alone.
- The bids-due check reads the date on the form. A solicitation with no date
  entered is not flagged; the date being *required* on a Solicitation is a
  separate rule at creation.
- Clause placement sorts by Item 10/11 box. Text somebody typed themselves is
  not moved, and a clause whose wording has been edited is no longer recognised
  as that box's, so it stays where it is.
