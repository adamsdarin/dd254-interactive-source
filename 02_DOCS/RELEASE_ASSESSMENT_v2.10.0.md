# DD254 Interactive v2.10.0 - requester intake, template matching, and the Security Manager at issuance

9 October 2026. Internal Tool v2.156. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| One Create DD-254 Workspace dialog | The person, the contract, the order and the e-mail are asked once and written where they belong | Nothing is created while a required field is empty, and the message sits beside the field |
| Requester repository | A requester who has had a DD-254 issued is offered by name | Only an issued DD-254 counts; a typed e-mail is never overwritten; two of a name are never chosen between |
| Template matching at intake | The template for this contract is applied at creation instead of hunted for afterwards | Exact matches only, one match only, and what the operator typed always wins |
| The lowest work identifier | A task order is found by its own number | The prime stays beside it; nothing is parsed back out of the title |
| Security Manager on the DD-254 | The manager is on the To line beside the requester, every time | Snapshotted, so a repository edit cannot alter an issued record |

## Why

**Intake asked for a title and got whatever was typed.** The things a DD-254 is
actually identified by - the person it is for, the contract, the order - were
typed again on the form afterwards. They are now asked once and written to
Items 2a, 2b, 2c, the solicitation due date, the task-order field and the
requestor. Block 2b is required on an Original because the form requires an
answer there, and `N/A` is an answer; it goes in Item 2b and stays out of the
name.

**An automatic e-mail is only safe when something has been proved.** A name
typed into one draft proves nothing - it may be a typo, or a person who never
came back. The repository therefore counts DD-254s that reached Issued, and
offers an address only for a requester who has one. A typed address is never
overwritten, and two people of the same name are shown rather than resolved:
guessing which of two addresses belongs to this contract is the kind of help
that is discovered months later, in the wrong inbox.

**A template that merely looked similar is worse than no template.** Matching is
exact: an order-specific template beats the contract's, a prime match counts
only against a template carrying no order, two matches are never chosen between
and a partial match is a suggestion. Nobody reviews what they believe was
already decided, so a near-enough match is never applied.

**Custody records do not change because a directory did.** The requester and the
Security Manager are snapshotted onto the draft. Editing either repository
changes what the next DD-254 is offered and never rewrites one already made.

**The Item 6 facility FSO moved from CC to To.** The owner's specification puts
Items 6, 7 and 8 FSOs on the To line behind the requester and the Security
Manager. This is a change to who appears where on an issuance e-mail, and is
called out here because it changes what recipients see.

## Verification

- 1395 assertions, 0 failures, against build `aecc5ce2`.
- All five release gates pass; the rebuild kit round-trips byte-identically;
  pdf-lib is the unmodified upstream release; the native-browser smoke test
  passes on the official and demo builds.
- Full Backup moves to version 5 and carries the requester repository; a
  version-4 file still restores, carrying no requesters.

## Limits

- The spec was written against a v1.12.0 baseline in a separate folder. It was
  implemented on the current product instead, at the owner's direction; several
  of its requirements were already built and were left as they were.
- Requester matching is exact on the normalised first and last name. A person
  who appears under two spellings is two requesters, which is why the repository
  is editable.
- Backfilling a Security Manager onto an older draft only happens when exactly
  one template could be meant. Where several could, the issuance screen warns
  instead of guessing.
- The demo seed carries no requester records; the repository is empty in the
  demo until one is entered.
