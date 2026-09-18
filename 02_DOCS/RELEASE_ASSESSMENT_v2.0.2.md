# DD254 Interactive v2.0.2 — SCGs linked to contracts; reasons optional

18 September 2026. Internal Tool v2.139. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Security Classification Guide and contract | No relationship; every guide listed alike on every form | Each guide links to contracts picked from the DD-254 Template Language library; linked guides are listed first and marked on that contract's forms |
| Reason for set-aside, Blocked and Cancel | Always required | Required by default; a Settings choice makes it optional, logged as "No reason given" |

## Why

The owner asked to tie guides to specific contracts, picked from the contract
templates, so the right guides are at hand on each contract's forms. Citing stays
a deliberate click because an Item 13 citation is a statement on the issued form.

The owner also asked that reasons which exist mainly for the audit trail be
optional for users who do not need that trail, behind a setting. The setting is off
by default, so an organisation that relies on the trail keeps it. When on, the
action itself is still logged, marked as having no reason, and switching the setting
is logged, so a reviewer can see when and why reasons are missing. NISS verifier
initials were left required: the owner did not include them.

## Verification and limits

The regression log for this exact build is in `TEST_RESULT.txt`; counts and hashes
are in `BUILD_FACTS.md`. Thirteen new tests drive the SCG editor's drop-down and
unlink buttons, the form panel, Settings and the real set-aside, Blocked and Cancel
dialogs.

Run against the v2.0.1 build, every earlier test still passed and each new test it
reached failed; the run then stopped, as designed, when the Blocked dialog of v2.0.1
waited for a reason that the test does not type.

- The drop-down lists each contract template with its prime contract; picking one
  stores its ID; a guide takes several links and unlinks them; the last unlink
  removes the field; a missing template is named; a hostile label is escaped.
- With Item 2a matching a linked contract (in another format) or with the linked
  template applied, the guide is listed first and marked, and Cite is still offered;
  with a different contract nothing is marked.
- Settings shows the choice, Required by default; changing it is logged once.
- Optional: a blank set-aside, Blocked and Cancel each succeed, record "No reason
  given" and log it. Back to Required: a blank set-aside is refused with a pointer
  to Settings, and Blocked insists on a reason.

Limits: a draft is matched to a contract by its applied template or its Item 2a
number, so a subcontract identified only in Item 2b is not matched. A link refers to
a template in this browser; guides shared without their contract templates show the
link as not in this browser.
