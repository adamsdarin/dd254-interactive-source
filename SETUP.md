# Maintainer release procedure

The source repository is `adamsdarin/dd254-interactive-source`. The live
demonstration is `index.html` on the main branch of the separate
`adamsdarin/dd254-interactive` repository, served by GitHub Pages.

## Prepare and verify

1. Preserve previous official files; write the next semantic release pair in
   `01_TOOL/`. Update `TOOL_VERSION` and add its changelog entry. Write
   `02_DOCS/RELEASE_ASSESSMENT_vX.Y.Z.md` and
   `02_DOCS/product_planning/IMPLEMENTATION_vX.Y.Z.md` for the version: the
   release workflow attaches the pair named for the tag and fails if either is
   missing. (Until v1.14.0 it attached v1.12.0's pair to every release.)
2. Use Node 24 and `npm ci --ignore-scripts`. Python needs `pypdf` for tests and
   `reportlab` to rebuild the manual. These are development tools only.
3. Run `python make_demo.py`. It derives the current demo from the official
   build and `01_TOOL/demo_seed.html`. Never copy an earlier application into it.
4. Update `02_DOCS/manual_source/content.py`, run its `build.py` from that
   directory and copy the result to `02_DOCS/DD254_Interactive_User_Manual.pdf`.
5. Copy the current official build to `01_TOOL/dd254.htm`. From `01_TOOL`, run
   `node dd254_regression.js > TEST_RESULT.txt`; require exit zero. The log
   records the tested file's SHA-256. Then run `python make_build_facts.py`.
   Run the suite on an otherwise quiet machine and in one process. An
   asynchronous test that exceeds its time budget stops the whole run on
   purpose — its promise is still acting on the page — so load from other jobs
   shows up as an aborted run with no summary, not as a list of failures.
6. From the repository root, run each check below and require exit zero:

```text
python .github/scripts/check_scripts.py
python .github/scripts/check_release_tools.py
python .github/scripts/check_documentation.py
python .github/scripts/check_manifest.py
python 01_TOOL/rebuild_kit/verify_pdflib.py
node 01_TOOL/browser_smoke.js 01_TOOL/DD254_Interactive_v1.14.0.HTM
node 01_TOOL/browser_smoke.js 01_TOOL/DD254_Interactive_v1.14.0_DEMO.HTM
```

Use the current filenames for later releases. Inspect user-facing exports if
their behavior changed. The scripts compare demo bytes, manual versions,
component provenance and a byte-identical split/rebuild. `.gitattributes`
prevents Git from translating binary artifacts or hash-verified HTML bytes.

## Publish

Commit the reviewed changes and push the release branch. Require the public
`verify` workflow to pass on that exact commit. Merge or fast-forward to main
using the repository's branch rules, then create and push the corresponding
version tag. The `release` workflow repeats every check, then attaches both
HTML files, the manual, `BUILD_FACTS.md`, `VERIFY.md`, the security fact sheet,
that version's release assessment and implementation notes, `rebuild_kit.tar.gz`
and `SHA256SUMS.txt`, and signs one build provenance attestation whose subjects
are the two HTML files.

Check the published release rather than the workflow's green tick: download
the assets, run `sha256sum -c SHA256SUMS.txt`, confirm the attached documents
are this version's and the kit contains no `__pycache__`, and run
`gh attestation verify <file> --repo adamsdarin/dd254-interactive-source --format json`.
The JSON shows each subject digest and the signing tag; the plain output can be
empty even when verification succeeds.

After verification, replace only the production demo repository's `index.html`
with the exact generated demo, commit and push. That repository's
`.gitattributes` keeps `index.html` byte-exact; without it Git normalised the
generated demo's CRLFs on commit and Pages served a file that did not match the
release. Confirm the staged blob matches the release demo before pushing, then
verify the served page by hashing it against `DD254_Interactive_vX.Y.Z_DEMO.HTM`
rather than trusting the Pages build status, which can lag what is actually
served. The two repositories have different purposes; do not point download
links at the demo-only repository.

## Correcting a published release

Never replace an HTML asset on a published release: its attestation binds those
exact bytes, so a changed build is a new version. Documentation assets, the
rebuild kit and `SHA256SUMS.txt` are not attested and may be corrected — attach
the right files with `gh release upload <tag> <file> --clobber`, remove the wrong
ones with `gh release delete-asset`, regenerate `SHA256SUMS.txt` from the full
corrected set, then re-verify the release from a fresh download. v1.13.0 and
v1.14.0 were corrected this way on 13 September 2026: each carried v1.12.0's
release documents and a stray `__pycache__` in its rebuild kit, and v1.13.0's
security fact sheet was labelled v1.12.0. v1.10.0, v1.11.0 and v1.12.0 had their
own documents but the same `__pycache__`; their kits were repacked the same way,
each confirmed to rebuild its release byte-identically before upload, and
v1.10.0's release notes were pointed at `VERIFY.md` for its own tag.

## Rollback

Retain the prior production commit and previous versioned release files.
If rollback is required, publish the earlier known-good demo content as a new
commit and direct users to the previous downloadable release. Do not rewrite
public history or restore a draft backup automatically. Browser storage stays
with its file/origin; users should back up before changing versions and verify
their restored records in the new version.
