# HANDOFF — dd254-interactive-source

Last updated: 2026-10-23T18:00-05:00 by Maintainer

## IN PROGRESS — branch `argon-port`, v2.12.0 not released

Eight feature commits on `argon-port` off d9d6bab. **1460 assertions pass; both
builds pass the native-browser smoke test; every commit was smoke-tested before
it landed.** The Argon prototype (untracked, in `dd254-interactive/`) was
rebuilt on v2.11.0 rather than adopted: it measurably descends from the shipped
v2.11.0 (it carries DIST_CC_ALWAYS, which exists in no earlier build) but had
deleted the flat PDF writer and the Item 13 toolbar and drifted elsewhere.

Owner decision, 23 October 2026: ACCEPT both deletions. The dynamic XFA form is
the only export and Item 13 is plain text. Raised twice, decided twice.
Consequence recorded beside the removal and in the changelog: an XFA form cannot
be digitally signed in the free Adobe Reader without Reader Extensions usage
rights, so signing needs Acrobat.

**BLOCKER for the release.** `01_TOOL/make_build_facts.py` (lines 58, 60, 114)
and `01_TOOL/rebuild_kit/split.py` (lines 80, 85) still expect
`DD254_BASE_B64`. With the flat payload gone make_build_facts throws, so
BUILD_FACTS.md, manifest.json and the check_manifest gate are all stale. Both
files need the flat constant made optional before v2.12.0 can be cut. Nothing
else is known to be wrong.

Done for the release: version bumped to v2.12.0 / Tool 2.158,
DD254_Interactive_v2.12.0.HTM and its demo built, TEST_RESULT.txt regenerated
(build fbbbf4e2), CHANGELOG entry written.

Still to do: fix those two scripts, regenerate BUILD_FACTS and manifest, the
manual (VER plus a changes section, then rebuild both PDFs), the fact sheet and
ISSM brief version lines, the rule catalog and SBOM,
RELEASE_ASSESSMENT_v2.12.0.md and product_planning/IMPLEMENTATION_v2.12.0.md,
then the five gates, then merge to main, tag and publish.

Deliberately left short, and said rather than hidden: REQ-11's always-insert
flag is settable through a CSV column on each Item 10/11 key rather than a
dedicated editor control, and the caveat engine surfaces in the language banner
but not yet in the intake dialog.

## Current State

Latest published release: **v2.10.0 (Tool 2.156)**, which carries v2.9.1 as
well; v2.9.1 was built and gated but never tagged, so the two ship under one
tag. Signed tag at db385ab on `main`; assets, checksums, the provenance
attestation, the kit rebuild and the pdf-lib check all verified from a fresh
download (official aecc5ce2..., demo e1d730a0..., ref refs/tags/v2.10.0,
rebuild byte-identical, no bytecode in the kit); live demo published as
dd254-interactive f3ceebc.

Latest published release: **v2.11.0 (Tool 2.157)**, build e595b104. Tag at
ec9c08a on `main`; assets, checksums, the provenance attestation, the kit
rebuild and the pdf-lib check all verified from a fresh download (official
e595b104..., demo 15ed0d7a..., ref refs/tags/v2.11.0, attested commit ec9c08a,
rebuild byte-identical, no bytecode in the kit); the downloaded build passes the
native-browser smoke test; live demo published as dd254-interactive fec0899 and
served byte-identical. The configurable
distribution rule, from the owner decision of 17 October 2026. The issuance To
line is now everyone the DD-254 has to reach, and is not configurable: the
requestor, the Item 7 FSO of the receiving facility, every Item 8
performance-location FSO, the cognizant security office, and any Block 18f
address. CC carries whatever the operator entered on the form themselves -- the
hand-typed FSO list and managers added with Add to CC -- plus the Security
Manager and the Item 6 FSO when the office ticks them under Manage -> Settings,
and those two DEFAULT TO OFF. Issuance is blocked rather than merely warned when
a required recipient applies to a DD-254 and has no address; "applies" is why a
prime DD-254 with no Item 7 is still issuable. 1408 assertions pass; all five
gates pass; both builds pass the native-browser smoke test; the kit round-trips
byte-identically.

NOTE for whoever ships this: it is a behaviour change on upgrade. The Security
Manager and the Item 6 FSO stop being e-mailed until someone turns them on. The
Item 6 FSO moved CC -> To in v2.10.0 and now leaves the e-mail entirely unless
copied: two moves in two releases for the same recipient, which is called out in
the changelog and the release assessment.

Open question worth deciding before the next release: the cognizant security
office is required unconditionally, not "where it applies" like Item 7 and
Item 8. A DD-254 with no address in 6c, 7c or a performance location therefore
cannot be issued at all. That is what was specified, but it may prove awkward
at the solicitation phase, where the contractor is not yet known.

What v2.10.0 contains, build aecc5ce2:
Owner specification of 9 October 2026, implemented on the current product
rather than on the v1.12.0 copy it was written against (owner decision, same
day): requester repository and intake, solicitation intake with Block 2c and
its due date, Block 2b required on an Original, template matching at creation,
work-identifier precedence, and the Security Manager snapshotted and placed on
the issuance To line. Full Backup is version 5; version 4 still restores.
1395 assertions pass; all five gates pass; both builds pass the native-browser
smoke test. NOTE: the Item 6 facility FSO moved from CC to To.

Carried by v2.10.0: **v2.9.1 (Tool 2.155)**, build c5b337d6. One
owner request of 7 October 2026: the Standard Language panel lists the entries
written for this DD-254's programme and Item 1a level rather than the whole
library, with the rest one link away. 1367 assertions pass; all five gates pass.

Latest published release: **v2.9.0 (Tool 2.154)**, signed tag at 3ab69c0 on
`main`; assets, checksums, the provenance attestation, the kit rebuild and the
pdf-lib check all verified from a fresh download (official 4b7abae7..., demo
beb7ab11..., ref refs/tags/v2.9.0, rebuild byte-identical, no bytecode in the
kit); live demo published as dd254-interactive 2634483.

What it carries: Three owner reports of
6 October 2026: the form picker could not find a task order that follows the
prime, orders could not be deleted, and an order's coverage could not be
changed after creation. Standard language was reworked rather than extended -
the owner's intent is that it is ALWAYS inserted, from the programme and the
Item 1a level, so the v2.8.0 creation-time chooser is gone. A fourth request of
the same day put a DD-254 template picker on the dashboard card beside the
contract-type one, both searchable type-aheads because the libraries run to
hundreds or thousands of entries. The first cut of that was a row of pickers
in the dashboard toolbar, which was the wrong thing and has been removed; the
owner wanted it on the card, where contract type already was. A fifth request,
on 7 October 2026, replaced the free-text title box: a new Solicitation or
Original now asks for the person, the prime contract number, an optional
subcontract number and an e-mail, composes the name from them, and writes the
numbers to Items 2a and 2b and the e-mail to the requestor. The pencil reopens
the same fields. 1359 assertions
pass against build 4b7abae7; all five gates pass, the kit round-trips
byte-identically and the native-browser smoke test passes. Each change was
driven against the published v2.8.0 first and reported absent there.

Latest published release: **v2.8.0 (Tool 2.153)**, carrying v2.7.2 as well.
Signed tag at 3c37f72 on `main`; assets, checksums, the provenance attestation,
the kit rebuild and the pdf-lib check all verified from a fresh download
(official 1deac142..., demo cea149bc..., ref refs/tags/v2.8.0, rebuild
byte-identical, no bytecode in the kit); live demo published as
dd254-interactive 6757fba. The SBOM, the rule catalog and the ISSM brief are
attached as release assets for the first time, so the brief no longer promises
evidence the download lacks.

The first v2.8.0 attempt failed and its tag was moved. The release workflow
stopped at "Re-run every check" because a new test slept 200ms before looking
for a dialog that a hosted runner had not built yet; nothing was staged,
attested or published. The tag was deleted (no release existed for it) and
recreated at the fixed commit. Every dialog wait in the copy and
standard-language tests now polls through the suite's own waitFor/waitDlg
helpers, which had been there all along.
Three owner reports of 6 October 2026: a copy carried the original's workflow
(holds, distribution, countersignature, Blocked status), the Contract Type
repository had a security-manager box with no picker behind it, and the
standard-language work had not been built. All three are done: 1314 assertions
pass against build 1deac142, all five gates pass, the kit round-trips
byte-identically and the native-browser smoke test passes. v2.7.2 (the copy fix
alone, build 587abc15) is committed at f4c31c3 and preserved, as v2.7.0 was.
Tagging waits on the owner.

Latest published release: **v2.7.1 (Tool 2.151)**, which carries v2.7.0 as well;
v2.7.0 was built and verified but never tagged, so the two ship under one tag.
Signed tag at 86cdc61 on `main`; assets, checksums, both HTML attestations, the
kit rebuild and the pdf-lib check all verified from a fresh download (official
144c5f6d..., demo 0a05b87b..., ref refs/tags/v2.7.1, rebuild byte-identical);
live demo published as dd254-interactive aabb31c and served from Pages at the
attested demo hash.

v2.7.0 removed the contract-type chooser from origination and gave contract
vehicles their own picker in the Checklist and Templates panel. v2.7.1 fixes a
defect the owner found in that area: a task order carrying its own DD-254 could
not be found in the form's template picker at all, because orders live in their
own store and `buildCtSelect` read only the template store. Own-coverage orders
are now listed under prime contract, order number and type; a selection resolves
to the template bound to the order, that template is not listed twice, and an
order awaiting source review is shown but disabled.

v2.7.1 also corrects an authority: box 11j cited DoDD 5205.02E for the rule that
Item 14 must be YES. The obligation is in the DD Form 254 Instructions, Item
11j(1), confirmed verbatim against the approved library. DoDD 5205.02E is the
OPSEC programme directive and is now named as that. Same defect class as the CUI
marking and the Item 17 signature location: right rule, wrong authority.

**CI browser, read this before trusting a red verify.** On 5 October every
workflow run began failing at the headless browser step, including on unchanged
`main` -- Chrome would not start on the hosted runner and the harness reported
only "timeout waiting for Chrome DevTools port", because it captured Chrome's
stderr and discarded it. `browser_smoke.js` now reports the browser, the sandbox
state and what Chrome said; `DD254_BROWSER_CI=1` (set by both workflows) adds
`--no-sandbox` and `--disable-dev-shm-usage`, and a local run keeps the sandbox.
`DD254_BROWSER_PATH` overrides the browser. Whether the flags are sufficient is
unproven: the fault could not be reproduced locally, and CI is the first test.
1292 regression assertions pass locally against the shipped bytes.

Still open from the owner's list: a Settings switch making Standard Language
mandatory (auto-insert and block), and the program/classification prompt at
creation that selects the matching Standard Language entry. Standard Language
entries have no program or classification field yet; the program vocabulary is
to come from the Security Managers library, which already carries one.
Also open: the reported 18f copy-then-paste defect could not be reproduced in
four separate paths, and the owner is checking whether the Contract Type
template's summary line shows "18f addr" - if it does not, the tick was never
stored in the template and the paste is correctly applying nothing.

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

2026-10-19 Maintainer - Published v2.11.0 and the live demo. Verified from a
fresh download rather than from the workflow result: every published checksum,
the official build against the local one, the attestation subject/digest/ref/
commit, the kit round-trip from the published tarball, pdf-lib against upstream
1.17.1, and the native-browser smoke test run against the downloaded file. The
release changes who receives an issuance e-mail - the Security Manager and the
Item 6 FSO are now off unless ticked - which is stated in the changelog, the
release assessment and the manual.

2026-10-19 Maintainer - Cut v2.11.0 and narrowed the setting after the live
browser caught a defect the jsdom suite could not. The first cut made four
things optional, including the hand-typed FSO box and the Item 18 managers
added with "Add to CC". browser_smoke.js failed on managerDropdownOk, and it was
right to: those are decisions the operator has already made, on that DD-254, and
a global preference able to discard them makes a button they just clicked do
nothing. DIST_CC_ALWAYS now carries both unconditionally and DIST_ROLES holds
only the two the tool derives for itself - the Security Manager and the Item 6
FSO, which are the two the owner actually named. The smoke assertion was
restated to prove both halves: the facility FSO on neither line by default and
on CC once ticked, the manager copied either way. Worth remembering that the
regression suite passed 1407 green over this defect; only the real browser,
exercising the real button, found it.

2026-10-18 Maintainer - Built the configurable distribution rule on the working
build; not versioned, not tagged, not published. The owner answered four
questions on 17 October: the receiving FSO is Item 7 plus every Item 8
performance location deduped, optional roles default off, one global setting
rather than a per-DD-254 override, and a missing required recipient blocks
issuance rather than warning. One function, dashDistRequired, is the single
source of truth for the single-issuance gate, the bulk gate and the mail
builder, so a record cannot be issuable one way and not the other. Seventeen
existing assertions encoding the v2.10.0 To/CC rule were restated rather than
removed, and fixtures that could no longer be issued were given the addresses a
DD-254 now needs rather than having the gate relaxed to suit them. Twelve new
assertions cover the defaults, the toggles, applicability, both gates and the
backup. Settings now ride in a Full Backup beside the audit log, outside the
checksummed body, so there is no schema bump and older files still verify; they
are applied on restore only if the operator agrees.

2026-10-10 Maintainer - Published v2.10.0, carrying v2.9.1, and the live demo.
Verified from a fresh download rather than from the workflow result. The
release moves the Item 6 facility FSO from CC to To on every issuance e-mail,
which the owner was told twice before tagging: it is what the specification
asked for and it reverses an earlier deliberate choice.

2026-10-09 Maintainer - Implemented the owner specification as v2.10.0. The
spec named a v1.12.0 baseline in OneDrive whose hash matched; building there
would have forked the product back thirty tool versions, so the owner chose to
port the requirements onto the current line. Parts of the spec were already
built and were left alone. Three assertions encoding the previous To/CC rule
were restated rather than removed, and the browser smoke test with them.

2026-10-07 Maintainer - Published v2.9.0 and the live demo, verified from a
fresh download. One cosmetic drift found afterwards and corrected on main: the
security fact sheet shipped dated 6 October although the release went out on
the 7th. check_documentation.py asserts the fact sheet names the right version
but says nothing about its date, so the date can drift without failing a gate.
Not worth re-releasing for; it corrects itself in the next release.

2026-10-06 Maintainer - Built v2.9.0. Coverage switching returns after being
removed in v2.4.1: the reason it was removed (a saved source silently
re-pointed at language written for another scope) is addressed by dropping the
order to "source needs review" rather than by withholding the function. Two of
my own defects were caught by the new tests before release: the auto-insert
took an index across two separate library loads, so it inserted nothing and
reported success, and the suite was reading a stale 01_TOOL/dd254.htm because
the copy is made by hand - re-copy after every build edit.

2026-10-06 Maintainer - Published v2.8.0 and the live demo; verified both from a
fresh download rather than from the workflow result, including the first use of
attest-build-provenance v4 after the workflow actions were bumped off the
deprecated Node 20 runtime. Note for the next release: GitHub migrates the
ubuntu-latest label to Ubuntu 26 from 19 October 2026, which both workflows
will follow unless they are pinned.

2026-10-06 Maintainer - Built v2.8.0 for three owner reports: copies no longer
take the original's workflow events (they reconcile their own approval holds
instead, so copying is not a way past a GCA gate); the Contract Type repository
and Standard Language now render the security-manager and programme pickers,
whose programme options are derived from the Security Manager templates rather
than from whatever had been typed into the repository being edited; and
Standard language can be set to Mandatory, which offers a matching entry at
creation and blocks a DD-254 whose Item 13 carries none of the library wording.
Two earlier half-truths were corrected in passing: the copy dialog claimed the
opposite of what its code did, and the v2.6.0 test for the Contract Type
Program field passed while the picker behind it was never rendered.

2026-10-06 Maintainer — Published v2.7.1 and the live demo; verified both
from a fresh download rather than from the workflow result. Closed the
approval-package gap in the same pass: the ISSM brief still named v2.4.1 on a
v2.7.1 build, and promised an SBOM and rule catalog that no release attached.
Both documents and the brief are now release assets, and the brief's version
and stated file size are checked against the build the way the fact sheet is.
The attestation row no longer claims more than the attestation covers: only
the HTML files are attested.

2026-10-02 Maintainer — Completed creation-only coverage correction as v2.4.1.
All 1,264 assertions and release gates pass. Saved orders cannot switch
coverage through their header or source review; full editing and prior source
history remain. Manual/build facts match; production and prior builds preserved.
Earlier state and checkpoints moved verbatim to HANDOFF-archive.md.
