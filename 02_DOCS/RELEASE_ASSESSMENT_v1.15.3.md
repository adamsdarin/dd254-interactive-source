# Codex Astra v1.15.3 — sensitive-terms screen

14 September 2026. Internal Tool v2.131. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Program names or code words in Item 9 or 13 | Only an instruction panel warned against them | A per-browser list is checked on the open form and a match raises a warning |
| The list itself | Not applicable | Stored as salted SHA-256 fingerprints; cannot be read back, exported, backed up or shared |
| Showing what matched | Not applicable | Warning names the item only; the phrase appears in an on-screen note that never prints |

## Why

The DD Form 254 instructions require Item 9 to be an unclassified description,
and a program nickname or customer-sensitive name in Items 9 or 13 is an easy
mistake that no rule catches. A list of such names can itself be sensitive, so the
owner chose fingerprints over a readable list, a warning over a block, and Items 9
and 13 as the scope. Warnings flow into the Preparer's Worksheet and dashboard
counts, so they must never repeat the term; the on-screen note is the only place a
match is shown.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. The new tests were also run against the
v1.15.2 build: every earlier test still passed there and all 16 new tests failed.

- Storage is checked to hold only a salt and 64-hex fingerprints; duplicates by
  case and punctuation and over-long terms are handled; salts change fingerprints.
- Matches in Item 9 and Item 13 raise one warning each without the term and never
  an error; the on-screen note shows the phrase and is hidden by the print
  stylesheet; partial words do not match; notes and warnings clear with the text.
- Removal by re-typing, clearing, counts-only audit entries, exclusion from Full
  Backup, read-only refusal, silence during recount and the dialog are tested.

Limits: salted fingerprints resist casual reading, not a determined guess of short
or predictable terms; only unclassified terms may be entered; other fields are not
screened; each browser keeps its own list. No new legal rule, classification
decision, service, account, network call or storage medium is introduced.
