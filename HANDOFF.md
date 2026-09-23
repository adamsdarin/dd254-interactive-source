# HANDOFF — dd254-interactive-source

Last updated: 2026-09-23T06:30-05:00 by Maintainer

## Current State

Canonical source for the DD-254 Interactive tool (single-file HTML). Latest
published release: **v2.1.1 (Tool 2.142)**, signed tag at 0db06bc on `main`; assets,
checksums and both HTML attestations verified from a fresh download (official
658a7cd3…, demo ed845d8c…, attestation ref refs/tags/v2.1.1); live demo published
as dd254-interactive 189bdbd. The fact-sheet label check added in v2.1.0 held:
this release's sheet named v2.1.1/2.142 on the published asset, unprompted.
Release titles and notes of v1.11.0 and v1.12.0 were rewritten without the codename.

v2.1.1 — owner report 2026-09-23: the v2.1.0 link reached Item 17 only inside
`applyFacTplFromSearch`, so a draft that was opened, typed by hand or spawned as
a Revision or Final never passed through it and Item 17 stayed blank — the case
the feature was asked for. Item 17 is now also read back from the CAGE in Item 6b
(`facCertSync`, from `dashOpen` and a `change` listener wired once at load), with
an exact CAGE match rather than the filter's prefix match.

Filling only the empty Item 17 fields was built first and rejected on the
evidence: a preparer who had typed another name into 17a was handed the facility
official's title and telephone number beside it, which is two people in one
certification block. `certFillBlank17` acts only when every Item 17 field is
empty. The explicit apply path is unchanged and still replaces Item 17 outright.
1186 regression assertions pass (seven new); both builds pass native Chrome. The
whole-file `Block 17` check caught the wording in a new source comment — the
form's term is Item, and that rule applies to comments too.

v2.1.0 — owner request 2026-09-22: a Facility template can name the certifying
official who signs Item 17 for it; applying that facility fills 17a, 17b, 17c,
17e, 17f and 17g alongside Item 6, and a facility with no official linked leaves
Item 17 untouched. Stored as `certLabel`/`certSnap`, the shape the 6c CSO link
already used, so no storage format change. Published: signed tag v2.1.0 at
227acbd on `main`; assets, checksums and both HTML attestations verified from a
fresh download (official 9b71313a…, demo b83e7c3f…, attestation ref
refs/tags/v2.1.0). 1179 regression assertions pass (six new), both builds pass
native Chrome (new `facCertLinkOk`). Negative controls run against v2.0.3: no
dropdown, no column, Item 17 left empty.

Two things this release had to work around. The owner pushed 830268f to `main`
(codename removed from archived builds) while the release branch was open, so
the branch was rebased onto it and `verify` re-run on the rebased commit before
the fast-forward — a pushed branch is not a private one. And the security fact
sheet shipped labelled v2.0.3/2.140: no check read that line, which is how
v1.13.0 shipped one labelled v1.12.0. The asset was replaced and SHA256SUMS.txt
regenerated (attested HTML untouched), and `check_documentation.py` now derives
RELEASE_VERSION and TOOL_VERSION from the build and fails if the sheet does not
name both — confirmed by restoring the stale label.

The manual also stopped claiming the Item 17 dropdown fills “all seven fields”:
17d AAC is not held in a Certifier template, so it fills six.

v2.0.3 — owner request 2026-09-18: the product carries only its own name. Release
label, title, header and review-package release line read "DD254 Interactive vX";
docs, release assessments, `check_manifest.py`, `browser_smoke.js` and the suite
use it. This file is signed "Maintainer". Do not name development tools or
assistants in this public repository, its commits, tags or release notes. The
stored draft key `astra` (v1.11-v1.13 legacy material) is data and stays. Archived
builds, their release assets and git history were left unchanged (owner choice). Commit and tag signing
use the Windows OpenSSH agent: if it is stopped, `git commit`/`git tag` hang on a
hidden passphrase prompt (2026-09-18) — the owner starts it; never type a passphrase.

Detail for v2.0.2 and earlier releases, and log entries from 2026-09-15 and before,
moved verbatim to HANDOFF-archive.md on 2026-09-19 to keep this file under 100 lines.

## Next

1. Validate the received-DD 254 import against a sanitized, Acrobat-saved DD
   Form 254 from the owner when one is available.
2. v1.16 closed as planned (owner, 2026-09-15): 3.1 shipped in v1.16.0; 3.3
   (signer readiness, non-XFA investigation) dropped; 3.4 (NCCS view) out of scope;
   3.5 (generated rule catalog, authority baseline date) skipped. Do not build them
   without a new owner decision. v2.0 (owner, 2026-09-15): selected 4.1, 4.3, 4.4;
   then skipped 4.1 (headless Chrome on file:// reports persisted=false and refuses
   persist()). 4.3 is v2.0.0. **Next: 4.4 approval package** — Section 508 ACR from
   an actual audit, CycloneDX SBOM, two-page ISSM brief. 4.2 encrypted backup and
   4.5 hosting were not selected.
3. 3.2 CMMC prompts wait for source text: missing_source requests filed as
   guidance_watch in ../workflow_requests.py (Librarian): 9868ef03f16a6bc5f0aed7d7
   DFARS 252.204-7021, 4788a4859333a8dc85cc9962 DFARS 252.204-7025,
   0a720c5dc61ea11c75f3071d 32 CFR Part 170. URLs verified (acquisition.gov pages
   by title; Part 170 hierarchy from the eCFR structure API). CMMC rollout phase
   still needs Guidance Watch review. Build only after an approved library release.

## Open Questions

- Should the post-upgrade recount also run immediately after a mid-session
  backup restore? Currently it waits for the next load (documented limit).
- Should an imported template also carry the received form's prime contract
  number (template field `primeContract`)? Left empty under "solely template language".

## Log
2026-09-18 21:00 Maintainer — Published v2.0.3 per SETUP.md: verify passed on 4f27459,
main fast-forwarded, signed tag pushed, release workflow passed, release, assets and
served demo verified and scanned clean; v1.11.0/v1.12.0 release titles and notes edited.
2026-09-18 20:30 Maintainer — Built and verified v2.0.3 (product name only). Owner chose
to scrub current files and editable release notes, neutral handoff wording, and to
leave history and attested builds untouched.
2026-09-18 19:00 Maintainer — Published v2.0.2 per SETUP.md: verify passed on 50780a3,
main fast-forwarded, signed tag pushed, release workflow passed, release and served
demo verified. Branches `release/v2.0.1` and `release/v2.0.2` left.
2026-09-18 18:30 Maintainer — Published v2.0.1 per SETUP.md once the owner started the
SSH agent: tag pushed, release workflow passed, release and served demo verified.
2026-09-18 17:30 Maintainer — Built and verified v2.0.2 (SCG-contract links; optional
reasons). Asked the owner which contract list, what a link does, which prompts and
what to log; chose the DD-254 Template Language entries, surfacing without auto-cite,
set-aside/Blocked/Cancel, and "No reason given" in the audit log with the setting
change logged. v2.0.1 release blocked on tag signing (ssh-agent stopped).
