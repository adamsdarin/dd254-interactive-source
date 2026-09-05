# Maintainer release procedure

The source repository is `adamsdarin/dd254-interactive-source`. The live
demonstration is `index.html` on the main branch of the separate
`adamsdarin/dd254-interactive` repository, served by GitHub Pages.

## Prepare and verify

1. Preserve previous official files; write the next semantic release pair in
   `01_TOOL/`. Update `TOOL_VERSION` and add its changelog entry.
2. Use Node 24 and `npm ci --ignore-scripts`. Python needs `pypdf` for tests and
   `reportlab` to rebuild the manual. These are development tools only.
3. Run `python make_demo.py`. It derives the current demo from the official
   build and `01_TOOL/demo_seed.html`. Never copy an earlier application into it.
4. Update `02_DOCS/manual_source/content.py`, run its `build.py` from that
   directory and copy the result to `02_DOCS/DD254_Interactive_User_Manual.pdf`.
5. Copy the current official build to `01_TOOL/dd254.htm`. From `01_TOOL`, run
   `node dd254_regression.js > TEST_RESULT.txt`; require exit zero. The log
   records the tested file's SHA-256. Then run `python make_build_facts.py`.
6. From the repository root, run each check below and require exit zero:

```text
python .github/scripts/check_scripts.py
python .github/scripts/check_release_tools.py
python .github/scripts/check_documentation.py
python .github/scripts/check_manifest.py
python 01_TOOL/rebuild_kit/verify_pdflib.py
node 01_TOOL/browser_smoke.js 01_TOOL/DD254_Interactive_v1.10.0.HTM
node 01_TOOL/browser_smoke.js 01_TOOL/DD254_Interactive_v1.10.0_DEMO.HTM
```

Use the current filenames for later releases. Inspect user-facing exports if
their behavior changed. The scripts compare demo bytes, manual versions,
component provenance and a byte-identical split/rebuild. `.gitattributes`
prevents Git from translating binary artifacts or hash-verified HTML bytes.

## Publish

Commit the reviewed changes and push the release branch. Require the public
`verify` workflow to pass on that exact commit. Merge or fast-forward to main
using the repository's branch rules, then create and push the corresponding
version tag. The `release` workflow repeats verification, includes both HTML
files, the manual and review material, and signs HTML build provenance.

After verification, replace only the production demo repository's `index.html`
with the exact generated demo, commit and push. Wait for Pages to finish and
verify the served file and its tool version. The two repositories have different
purposes; do not point download links at the demo-only repository.

## Rollback

Retain the prior production commit and previous versioned release files.
If rollback is required, publish the earlier known-good demo content as a new
commit and direct users to the previous downloadable release. Do not rewrite
public history or restore a draft backup automatically. Browser storage stays
with its file/origin; users should back up before changing versions and verify
their restored records in the new version.
