# DD254 Interactive v1.16.0 — separate government and prime review packages

15 September 2026. Internal Tool v2.136. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Contracting Officer Package | One package mixing GCA duties and prime-contractor duties | Government CO / GCA review and Prime subcontract review, each with only its reader's actions |
| Choosing the audience | Not applicable | Automatic from Item 2b or 7a; the dialog says why and offers the other |
| Output | On-screen HTML only | On screen or as a PDF; every PDF page names the draft, stage, release, marking and page |

## Why

A contracting officer placing a prime contract and a prime contractor issuing a
subcontract DD Form 254 have different duties. The single package made each reader
skip the other's lines, such as the GCA's biennial review under DoD policy or a
prime's confirmation of GCA authorization before flowing requirements down. The
owner chose automatic selection from Item 2b or 7a with confirmation, and separate
point releases for items 3.1, 3.3 and 3.5.

No action line was reworded. A line is audience-specific only when its own text
names the actor; everything else appears in both packages. Clause applicability
prompts stay in the government package because the prescriptions are for government
solicitations and contracts; the prime package keeps the flow-down review.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. Run against the v1.15.7 build, every earlier
test still passed there and all six new tests failed. Two existing tests were
re-pointed at the new functions on purpose (the 5205.07 gate scan and the report
stylesheet check).

- On one form with a subcontract, SAP, CNWDI, TEMPEST, CUI, IR&D and a solicitation
  number, the government package contains every government-only and shared marker
  and no prime-only marker, and the prime package the reverse.
- The only action lines that differ between the two are the government review and
  solicitation lines and the subcontract lines, word for word; alerts are identical.
- Both editions name the draft, stage, contract, release and marking; the PDF text,
  read back with pypdf, carries the release, the review-aid notice and the marking
  on every page and page numbers, with no cross-audience sections. Pages were also
  rasterised and inspected.
- The menu dialog offers four choices with the automatic one first, opens the view,
  downloads the PDF with an audit entry, and does nothing on Cancel.

Limits: the "authority baseline as of" date waits for the rule catalog (3.5); the
split follows the wording of each line and is a review aid, not a determination of
who owes which duty on a particular contract.
