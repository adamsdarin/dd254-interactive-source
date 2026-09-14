# PRD implementation update — v1.15.1

Second release of the v1.15 preparer-throughput horizon. The browser-only
constraint is unchanged.

Implemented (roadmap item 2.1, scope revised by the owner on 14 September 2026):
importing a received fillable DD Form 254 creates one DD-254 Template Language
entry from Items 10-16 and 18, the form's marking and its Item 3 source. It
creates no draft, dashboard record or parent link and keeps no copy of the PDF.
The roadmap's earlier "read-only parent with ceiling checks" design is withdrawn.

Remaining v1.15 point releases, in order: security classification guide
reference library; sensitive-terms screen for Items 9 and 13; revision summary in
Item 13; Final-due prompt and demonstration portfolio. NCCS alignment is out of
scope by owner decision.

See [release assessment](../RELEASE_ASSESSMENT_v1.15.1.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v1.15.0.md) for earlier coverage.

Acceptance: a fillable DD Form 254 imports into one template entry with its Items
10-16 and 18, marking and source after a preview; nothing else is created and the
PDF is not stored; flattened, encrypted, non-PDF, empty, over-CUI and read-only
cases create nothing and say why; official and demo builds pass browser and
regression checks.
