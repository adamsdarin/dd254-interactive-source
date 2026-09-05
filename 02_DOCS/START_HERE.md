# DD254 documentation

The app manual is generated from `manual_source/content.py` by
`manual_source/build.py`. Rebuild both published PDF copies whenever behavior or
the tool version changes. `check_documentation.py` verifies the versions, the
paired copies and the corrected processing-limit guidance.

Shipped documents:

- `DD254_Interactive_User_Manual.pdf` — operating instructions.
- `DD254_Tool_Security_Fact_Sheet.md` — behavior, recovery and security boundaries.
- `RELEASE_ASSESSMENT_v1.10.0.md` — review findings and change rationale.
- `../BUILD_FACTS.md` — generated sizes, versions, hashes and regression count.
- `../01_TOOL/rebuild_kit/REBUILD_GUIDE.md` — verification and reconstruction.
- `../SETUP.md` — release and production-demonstration procedure.

The owner's lifecycle training rough draft is a separate local deliverable in
`training/`, when present, with editable source in `training_source/`. It is not
published as part of a software release. No handbook, older deck or social post
is asserted to exist unless it is actually present.

Use plain language. Distinguish a tool restriction from a requirement on the
actual DD Form 254. Never duplicate volatile build hashes or counts in prose;
link to generated BUILD_FACTS.md. Inspect the rendered manual after changes.
