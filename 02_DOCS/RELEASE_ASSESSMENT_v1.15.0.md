# DD254 Interactive v1.15.0 — dashboard numbers, search in any order, NISS re-confirmation

14 September 2026. Internal Tool v2.128. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Contract numbers on the card | One number, the first of Items 2a, 2b, 2c that was filled | Each filled item labelled Prime (2a), Subcontract (2b), Solicitation (2c) |
| Dashboard search | The whole query had to appear as one phrase | Every term must match the same record, in any order; quotes for exact phrases; contract numbers match with or without hyphens |
| NISS on a spawned Original, Revision or Final | Copied from the parent and shown as verified | Starts unverified; the card shows "NISS re-confirm" with the parent's verification in the tooltip until verified again |

## Why

Preparers find a DD-254 with what they hold — usually the requestor, then the
subcontractor CAGE, then the prime number — typed in whatever order it comes. The
card did not show the subcontract or solicitation number at all, and the search
box only matched adjacent text. Each spawned stage is a separate issuance, often
months after the parent, and a facility clearance or safeguarding level can change
in between; carrying the parent's verification forward presented an old check as
current for the new form.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. The new tests were also run against the
v1.14.1 build: every earlier test still passed there except the section 14 spawn
test deliberately changed to assert the reset, and 16 of the 20 new assertions
failed. The four that passed are the seed step and guards of behaviour v1.14.1
shares: a missing term matches nothing, punctuation-free matching never joins
words, and a child of an unverified record shows the ordinary badge.

- Cards for a prime, a subcontract, a solicitation and a record without Item 2
  text are rendered and read back; numbers are escaped rather than rendered as markup.
- Search is driven through the dashboard in both term orders, with a missing term,
  a hyphen-free contract number, a phrase in and out of order, a stray quote mark,
  and a check that punctuation-free matching never joins separate words.
- NISS reset is checked for an Original from a solicitation, a Revision and a
  Final from an Original, and a Final from a Revision; re-confirmation is checked
  to clear the prompt and be audited; a child of an unverified record shows the
  ordinary "NISS not verified" badge. Existing copy tests confirm Copy still keeps
  NISS verification.

Limits: search has no field-specific syntax; a term can match any field. Drafts
spawned before this release keep the NISS record they inherited. No new legal
rule, classification decision, service, account, network call or storage medium
is introduced.
