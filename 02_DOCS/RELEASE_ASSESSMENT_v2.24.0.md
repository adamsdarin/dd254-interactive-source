# DD254 Interactive v2.24.0 - the template check at spawn

25 November 2026. Internal Tool v2.175. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| Spawning asks when the parent's template has changed | The new DD-254 starts on the current wording without a separate apply | Keep the wording is offered; the choice is audited |
| A Revision is asked even though its parent is Issued | Revised template wording reaches revisions, where it matters most | The Issued parent itself is not touched |

## Why

**The owner's request.** "This template check should also take place when
you're spawning an original from a solicitation or a revision from an
original."

**The gap v2.23.0 left.** The check runs on the open form and never on an
Issued DD-254, because that is the record of what went out. A Revision is
spawned from exactly such a record, so its new DD-254 inherited the old wording
and only warned once it was opened. The question now belongs to the spawn: it
is asked for the new DD-254, before it exists.

**Current by default.** A revision is the moment a template change is meant
to be taken up, so building from the current template is preselected; keeping
the wording is one press and is audited. A Keep recorded on the parent is not
carried into the question - a revision is when that decision is taken again.

## Verification

- **1660 assertions, 0 failures**; six are new and none was restated.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- A parent made before v2.23.0 carries no fingerprint until it has been opened
  in v2.23.0 or later and saved; until then spawning from it asks nothing.
