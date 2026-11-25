# DD254 Interactive v2.23.0 - a DD-254 says when its template has changed

25 November 2026. Internal Tool v2.174. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Opening a DD-254 checks its template against the repository | Revised template wording is not missed on DD-254s already in progress | A warning, never a block; the DD-254 may be right as it is |
| Update to new template | One press, one confirmation, instead of finding and re-applying the template | The confirmation says what is rewritten |
| Keep this version | A deliberate decision is recorded once, not re-asked on every open | Audited; returns if the template changes again |

## Why

**The owner's request.** "When a DD-254 workflow is opened, it checks the
template repo, every time, to see if there are any changes, and if there is
there is a warning saying 'template changed - update to new template'."

**Recorded at apply, compared on every check.** Every path that applies a
template already writes a snapshot of it onto the DD-254. That snapshot now
also records which template it was and a fingerprint of its content. The
check runs wherever the form is validated, so it happens on every open and on
every edit while the DD-254 is open, not only once.

**A fingerprint of meaning.** Comparing stored bytes would warn about nothing:
the editor writes empty fields when a template is opened, an upgrade stamps a
version marker, and names change. The fingerprint drops empty values, unticked
boxes, trailing spaces and those markers, and leaves out the template's name, so
only a change to what the template would put on a DD-254 is reported.

**A warning, not a block.** A DD-254 in progress may be deliberately on the
older wording. Update and Keep are both offered; Keep is audited and lasts only
until the template changes again.

**Issued records are left alone,** consistent with every other rule that
reaches into a DD-254 on opening.

## Verification

- **1654 assertions, 0 failures**; nine are new and none was restated: applying
  records the fingerprint; a change warns on every open; cosmetic edits and a
  rename do not; Update re-applies and clears it; Keep silences it until the
  next change; Contract Types are watched; Issued records are not; older
  DD-254s take a starting point on first open; a removed template is reported
  without an update button.
- The banner was photographed in headless Chrome.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- A DD-254 made before this version cannot know what its template said when it
  was applied; it is watched from the day it is first opened in v2.23.0.
- Applying Standard Language is not tracked here: it is inserted by its own
  rules and has no "applied template" to compare.
