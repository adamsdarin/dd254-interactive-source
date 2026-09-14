# PRD implementation update — v1.15.4

Fifth release of the v1.15 preparer-throughput horizon. The browser-only
constraint is unchanged.

Implemented (roadmap item 2.4, with owner decisions of 14 September 2026): a
revision summary region in Item 13 generated from the parent comparison, kept up to
date until edited by hand, with Redraft and Remove; short values inline; a warning
for point-of-contact-only revisions. Also fixed, by owner decision: the flow-down
ceiling no longer compares issuances of the same contract.

The roadmap's verification step was done first: the DD Form 254 instructions in the
approved library set no format for annotating revisions (Item 3b), so the wording is
the tool's and is reviewed by the preparer.

Remaining v1.15 point release: Final-due prompt and demonstration portfolio. NCCS
alignment is out of scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.4.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.3.md) for earlier coverage.

Acceptance: spawning a revision proposes a summary; editing it by hand keeps the
edits; removing it leaves the rest of Item 13 byte-identical; a Revision raising
Item 1a is not blocked by flow-down; official and demo builds pass browser and
regression checks.
