# PRD implementation update — v1.15.6

Final release of the v1.15 preparer-throughput horizon. The browser-only constraint
is unchanged.

Implemented (roadmap items 2.5 and 2.6, with owner decisions of 15 September 2026):
a tool-only period of performance end date on the dashboard record, prompting at
120, 60 and 30 days before performance ends and before the two-year retention window
closes, cleared by a Final in the chain, with a calendar invite and a portfolio CSV
column; and an example portfolio seeded into an empty demonstration dashboard.

Authority verified first: 32 CFR 117.13(d)(5), 117.15(j) and 117.17(c). The
roadmap's premise that the retention clock starts with a Final was corrected; it
starts at contract completion.

v1.15 is complete: dashboard numbers and search (v1.15.0), received DD Form 254
import (v1.15.1), SCG library (v1.15.2), sensitive-terms screen (v1.15.3), revision
summary (v1.15.4), SAP countersignature and lineage (v1.15.5), and this release. NCCS
alignment is out of scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.6.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.5.md) for earlier coverage.

Acceptance: the date never reaches XFA data; a spawned Final clears the prompt; an
option-year extension does not suggest a revision; every status chip is populated
on the demo's first load; demo parity shows the official build differs only by the
seed.
