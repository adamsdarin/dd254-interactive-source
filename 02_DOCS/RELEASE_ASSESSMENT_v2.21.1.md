# DD254 Interactive v2.21.1 - Items 4 and 5 always have an answer

18 November 2026. Internal Tool v2.172. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| An unanswered Item 4 or 5 holds the DD-254 at Draft | A blank Block 4 or 5 cannot be issued unnoticed | Two clicks; Yes and No are both answers |
| The Yes/No rows are outlined until answered | The question is found without reading the list | Clears the moment it is answered |
| A copy answers Items 4 and 5 again | The original's answers cannot ride along unread | Revisions keep theirs |

## Why

**The owner's report.** "There is always a response to question 4 and 5,
because those are not captured by the template." Templates write Items 10 to
16 and 18; Items 4 and 5 describe this contract and this issuance, so nothing
fills them in but the preparer.

**The defect was a silent default.** The markup pre-checked No, which suggested
the questions were answered. Every DD-254 clears all radios when it opens, so
in fact a new DD-254 had neither answered - and validation read the empty
answer as No (`S.fo=...||'no'`). The panel was clean; the exported government
form showed neither box in Block 4 or Block 5.

**Required, not defaulted.** Fixing the default to No was considered and not
taken. It would have put an answer on the form that nobody gave, which is the
failure the tool is built against elsewhere - Item 3 and Item 12 are required
for the same reason. Two clicks per DD-254 is the cost.

**Copies.** A copy is usually made for another contract. Whether that contract
follows on from a predecessor, and whether this issuance is a final, are not
facts the original can supply, so the copy asks again and clears the details
that went with the old answers.

## Existing records

The upgrade recount updates counts and never changes a status, so nothing is
moved by installing this version. A Draft with Items 4 and 5 unanswered shows
the finding when opened. A record already Issued, Cancelled or Skipped is not
rewritten.

## Verification

- **1614 assertions, 0 failures**; seven are new. Seven existing assertions
  failed against the new rule, all because the shared "complete form" fixture
  relied on the silent No; the fixture now answers Items 4 and 5, and no
  assertion was weakened.
- A new assertion records the exported Block 4 and Block 5 with both answered
  and unanswered.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
