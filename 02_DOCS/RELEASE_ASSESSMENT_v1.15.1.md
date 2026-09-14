# Codex Astra v1.15.1 — received DD Form 254 to template language

14 September 2026. Internal Tool v2.129. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Received DD Form 254 language | Retyped by hand into a DD-254 Template Language entry | Imported from the fillable PDF into a new entry after a preview |
| Template source | Set by hand | Taken from the received form's Item 3 (Original, Revision number, Final) and date |
| Unsupported files | Not applicable | Flattened or scanned PDFs, encrypted PDFs and forms marked above CUI refused with the reason |

## Why

A subcontract DD Form 254 is written from the language of the one the company
received. Retyping Items 10 to 16 and 18 is slow and invites transcription errors
in exactly the boxes that carry requirements. The owner set the scope: the import
creates only DD-254 Template Language, so the received form stays an input to a
reusable template rather than a record the tool tracks, consistent with the v1.14.0
rule that the tool keeps only what is needed to prepare or issue a DD Form 254.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. The new tests were also run against the
v1.15.0 build: every earlier test still passed there and 17 of the 18 new tests
failed. The one that passed checks that the template structure has no Item 1-9 or
17 fields, which was already true.

- Fixtures are built from the official form with the tool's own dynamic export,
  including a Flate-compressed datasets stream and a single XDP stream, and the
  government's blank form's own data packet is parsed and refused as empty.
- The import is driven through `rcv254Import` with a real File: one entry is
  created with the mapped fields, source and a stable id; no draft or Contract Type
  template is created; Items 9 and 17 text is absent; the audit SHA-256 matches the
  file; the entry applies to a form like any other template.
- Cancelling, a flattened PDF, a non-PDF, a SECRET marking and a read-only tab all
  create nothing; a Final raises the retention notice; the button appears only on
  the DD-254 Template Language page.

Limits: not yet tested against a DD Form 254 filled and saved in Adobe Acrobat by
another organisation; encrypted-PDF refusal is implemented but has no fixture.
Items 1-9 and 17, reviewers, signatures and attachments are not imported. No new
legal rule, classification decision, service, account, network call or storage
medium is introduced.
