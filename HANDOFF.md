# HANDOFF — dd254-interactive-source

Last updated: 2026-10-05T10:20-05:00 by Maintainer

## Current State

Latest published release: **v2.5.0 (Tool 2.148)**, signed tag at fb3d332 on
`main`; assets, checksums and both HTML attestations verified from a fresh
download (official 722df5ea..., demo 56b85cf4..., ref refs/tags/v2.5.0); live
demo published as dd254-interactive 152f4df and confirmed by hashing the
served page. Selected roadmap items from
the FSO and contracting officer review (owner, 5 October 2026).

Four were documents and shipped first at 5b8e966, with no tool change: the
generated rule catalog and its authority-baseline table (3.5, previously
skipped), a CycloneDX SBOM and a two-page ISSM brief (both part of 4.4). The
catalog and the SBOM are derived from the build and `check_documentation.py`
fails if a committed copy differs, so neither can become a second statement of
what the tool does. `make_rule_catalog.py` also refuses to write a catalog that
omits a claim; that guard caught its own first version, which silently dropped
the last claim in every box, 20 of 96. The ISSM brief's no-network claim was
verified under CDP with the Network domain enabled: one request, the file
itself, zero network requests.

v2.5.0 is the product change: a Contract authority table on both review
packages, and Items 16a-16f listed in the government package only. It also
fixes a real loss - the package reported the first filled of Items 2a/2b/2c, so
a subcontract showed the prime number and hid the subcontract number.
1271 regression assertions pass (seven new) against the shipped bytes; both
builds pass native Chrome.

Still open from that review: 508 conformance needs a funded external audit and
cannot be self-certified; validating the received-DD 254 import still needs one
sanitized, Acrobat-saved DD Form 254 from the owner. NCCS mapping and a
machine-readable export were considered and dropped as outside what a
single-file offline tool should take on.


1264 regression assertions were reproduced here against the shipped bytes
rather than taken from the recorded log, and both builds pass native Chrome.

- Prime/own coverage is chosen only in Add task order. Saved order headers
  show the coverage as a label and have no switching buttons.
- Source review and missing-own-template repair stay within saved coverage.
  Older records retain their existing choice, inferred from their current
  source mode or immutable snapshot. Review status does not erase the choice.
- Own-order templates retain the same complete editable row and block editor
  as prime templates. Existing source versions and workflows remain unchanged.
- v2.4 prime-only creation, newest-first placement, program fields/filter,
  contract/order search, continuous scrolling, lazy editors, group collapse and
  normalized prime/order duplicate flags remain.
- v2.3 separate order/source storage, migration and frozen workflow provenance
  remain. Full Backup, language JSON and packs retain the saved coverage field.
- v2.2 recipient, Item 18 save and blank-replacement behavior remains:
  performance/sub FSOs and requestor on To; facility FSOs, CSOs and managers CC.

All **1,264 regression assertions** pass against the exact candidate.
Official and demo native-browser checks, syntax, demo parity, documentation,
manifest, byte-identical reconstruction and pdf-lib provenance gates pass.
The 37-page manual and changed instructions were visually reviewed, as
were the actual repository creation form, saved labels and full child editor.
Official SHA-256:
`07de4ee987d09af095be961c1a646e4786e5531581506275da9d6d604e63bebd`.

Prior uncommitted v2.1.2, v2.2.0, v2.3.0 and v2.4.0 candidates/demos remain.
v2.4.0 retains its prior SHA-256. The live demonstration remains untouched.
No commit, tag, push, publication or production change was made.
Latest published release remains **v2.1.1 (Tool 2.142)**. Publication, when
requested, follows SETUP.md and its exact-commit release checks.

Do not name development assistants or tools in this public repository's prose.
Sign this file Maintainer. Signing uses the owner's Windows OpenSSH agent;
a stopped agent hangs on a hidden passphrase prompt. Never type a passphrase.

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

2026-10-02 Maintainer — Completed creation-only coverage correction as v2.4.1.
All 1,264 assertions and release gates pass. Saved orders cannot switch
coverage through their header or source review; full editing and prior source
history remain. Manual/build facts match; production and prior builds preserved.
Earlier state and checkpoints moved verbatim to HANDOFF-archive.md.
