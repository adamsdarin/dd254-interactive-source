# DD254 Interactive v2.21.0 - the template is chosen where a DD-254 is made

16 November 2026. Internal Tool v2.171. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| The create dialog asks which template the DD-254 is built from | A Contract Type, another DD-254 template, or none, chosen once instead of fixed afterwards from the form | The automatic match is still made and is the default |
| The copy dialog asks the same about Blocks 10 to 16 | Which template rebuilds the copy is said, not inferred | Keep as copied stays the default where language may come across |
| A copy is named for the contract it is given | No second trip through the pencil to retype the name | The name is shown before the copy exists and is editable |
| The pencil follows the contract number on names the tool wrote | A solicitation or a copy is renamed by changing its number | A name somebody typed is never touched |

## Why

**The owner's request.** "Are you using a DD254 template or are you using a
contract template? If you're using contract template, you get a drop-down menu
of all the available selections ... that would also apply when you're copying a
DD254." And: "I'm copying, changing the contract number. That doesn't change
the name. So then I save it, copy it, and then I go click the pencil and edit
it."

**A control, not a prompt.** A stand-alone contract-type question at creation
was removed in an earlier release because it was nearly always answered "no",
and a prompt usually answered "no" is one people stop reading. This is not that
prompt returning. It sits inside the dialog that is already open, defaults to
what the tool would have done, and asks nothing of a preparer with no template
to choose.

**The match becomes visible.** The tool already applied the template filed
under the typed contract number. It did so without showing a choice, so there
was no way to decline it, to take a Contract Type instead, or to settle the
case where two templates are filed under one number. The selection is now on
screen, already made, and can be changed.

**Overruling the match is allowed, and said.** A DD-254 template is filed under
one contract. v2.20.0 exists because another contract's Block 13 was being
issued from a copy, so choosing a template filed under a different contract is
exactly the risk that release addressed. It is still the preparer's decision -
the nearest template is often the right starting point for a contract that has
none - so the dialog allows it and states where the template is filed before
anything is created.

**Names.** A copy is made, most of the time, for a different contract. Naming
it "Copy of" the first one put the wrong contract number on the dashboard and
left the correction to a second dialog - which did not help, because the pencil
treated "Copy of ..." as a name somebody had typed and would not rebuild it.
Both ends are fixed: the copy dialog composes the name from the contract it is
given, and the pencil recognises every name the tool writes.

## Defects found on the way

- **A Contract Type applied at creation was forgotten by the record.** The type
  was set on the record object after it had been stored, and the save that
  follows reads the stored record back; the page's own note of it was cleared a
  few lines later. Found by reading the creation path while adding the chooser.
  It mattered little while a Contract Type could reach that path only by being
  filed under a contract number; it would have broken the new control outright.
- **The pencil wrote a solicitation's number out of the record's identity.** It
  shows no solicitation row and reported the missing field as empty. Item 2c on
  the form was not affected. The dialog now keeps what it did not ask about.

## Verification

- **1607 assertions, 0 failures**; eighteen are new and none was restated. The
  1589 that existed passed unchanged against the new build before any new test
  was written.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test, which now presses the chooser in a real browser.
- The create and copy dialogs were photographed in headless Chrome and read.

## Limits

- The copy dialog does not change the security manager when a template is
  chosen; the create dialog does, as it always has for a matched template.
- Task orders that carry their own DD-254 are reached through their bound
  template in the list, not listed under the order number as they are in the
  picker on the form.
- A copy whose original had a name of somebody's own keeps "Copy of ..." until
  a name, contract, order, subcontract or solicitation field is changed in the
  dialog.
