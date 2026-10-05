# DD254 Interactive v2.2.0 - recipients and template workflow

1 October 2026. Internal Tool v2.144. Candidate build; not published.

The existing workflow and repository design are retained. Item 18 adds a
security/program manager picker and a button to save the current language as
a named template. Repository organisation is one compact toolbar above the
existing editable rows, with warnings and comparison underneath those rows.

| Change | Result | Safeguard |
| --- | --- | --- |
| Recipient routing | Performance and subcontractor FSOs plus requestor on To; facility FSOs, CSOs, managers, additional FSOs and checked 18f on CC | Case-insensitive dedupe across both lines; To wins; unrelated bulk audiences remain separate |
| Manager selection | Template manager included automatically; additional managers selected from the existing repository | Draft snapshots retain the selected addresses even after a library entry is deleted |
| Save from workflow | Named language template saved from Item 18 | Name collisions refused; duplicate warning before adding; storage success required for confirmation |
| Whole-template replacement | Blank fields, unchecked boxes and empty radios replace stale values in represented sections | Confirmation before insertion; missing legacy sections preserved; unrelated facility/certification data untouched |
| Repository organisation | Prime/order search and optional grouping using the current rows | Original order is default; grouping does not reorder stored entries or alter stable IDs |
| Duplicate review | Identical content, shared language and same-source conflicts are flagged and compared inline | No automatic deletion or merge; reviewed copies can be kept; content changes invalidate the review |

The v2.1.2 candidate's shared attachment computation and document-marking-only
issuance warning are included. All earlier versioned files remain preserved.

All 1217 regression assertions pass; both official and demo builds pass
native browser checks. Verification is recorded in TEST_RESULT.txt and BUILD_FACTS.md. Release gates
cover script syntax, release tools, manual labels, component hashes and
byte-identical split/rebuild. Both official and demonstration builds receive
browser smoke checks. This build does not change the live demonstration.

Duplicate matching is a local content comparison, not a decision that two
contracts or source revisions are interchangeable. Whitespace is normalised;
wording and attachments are compared. Shared wording across different contract
numbers is labelled separately. Editor autosave continues during duplicate
review; Save now/Done prompts are review reminders, not rollback of prior edits.
JSON exports and Full Backup preserve review metadata; CSV does not carry the
review acknowledgement, so a CSV round trip may ask for duplicate review again.

Manager selection records recipient details only. The tool opens the user's
mail application and never sends mail automatically. Item 13 prose remains in
the general address picker and is not automatically added to a composed message.
