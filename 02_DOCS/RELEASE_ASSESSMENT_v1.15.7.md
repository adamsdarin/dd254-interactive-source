# DD254 Interactive v1.15.7 — biennial review attribution

15 September 2026. Internal Tool v2.135. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Manual 3.14, review clock | "DoDI 5220.22 requires a review every two years" | Cites DD Form 254 Instructions Item 3b(3), the review of revisions the clock tracks, with a note on the GCA's separate duty |
| CO package, GCA review line | No authority named | Cites DoDM 5220.32 Volume 1, paragraph 6.3.g, and separates it from Item 3b(3) |

## Why

The owner distinguished two obligations. DoD policy requires the Government
Contracting Activity to review the security classification requirements of a DD
Form 254 at least biennially during contract performance; it is a government duty.
The DD Form 254 Instructions, Item 3b(3), state that classification requirements are
reviewed at least biennially in the context of revisions, and that is what the
dashboard clock implements. Contractors are bound by 32 CFR Part 117 and the DD Form
254 instructions, not by the DoD issuances. Checked in the approved library: DoDI
5220.31 (9 May 2023) incorporates and cancels DoDI 5220.22, and the GCA requirement
is in DoDM 5220.32 Volume 1 (Change 2, 10 December 2021), paragraph 6.3.g.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. Run against the v1.15.6 build, every earlier test still passed there and the Contracting Officer package test failed; the manual test, applied to the v1.15.6 manual source, fails on its "DoDI 5220.22 requires a review" sentence.

Limits: wording only. The tool does not track the GCA's own review and never did.
