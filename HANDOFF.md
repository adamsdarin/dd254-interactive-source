# HANDOFF — dd254-interactive-source

Last updated: 2026-11-09T10:15-06:00 by Maintainer

## Current State

Latest published release: **v2.18.0 (Tool 2.167)**, build 78bd3892. Signed tag
at a76cd85 on `main`; 12/12 checksums, the provenance attestation (official
78bd3892..., demo 8f893118..., ref refs/tags/v2.18.0, attested commit a76cd85),
a byte-identical kit rebuild with no bytecode and a PASS on the downloaded
build's native-browser smoke test, all verified from a fresh download. Live
demo published as dd254-interactive 71f465f and served by Pages,
byte-identical to the attested demo asset.

The release workflow failed once on this tag and was re-run: the hosted
runner's Chrome never opened its DevTools port ("chrome said nothing") after
all 1560 assertions had passed in the same job. It is the runner, not the
build - `verify` had run the same smoke step on the same commit fifteen
minutes earlier - and `gh run rerun <id> --failed` cleared it. Worth knowing
before anyone treats that failure as a defect.

**Still open, awaiting the owner:** Items 14/15 on the dynamic PDF leave their
explanation box open when marked No. Diagnosed in v2.17.0's release assessment -
the DD Form 254's own XFA template hides that field on an `activity="change"`
event, which a form filled from saved data never fires. The owner asked to be
told more before anything is touched; they have been, including the free test
(if an exported form shows the form's own "Please read Instructions" alert in
Adobe, then `$form`-ready scripts do fire and the fix will work).

**Items 14/15 on the dynamic PDF - diagnosed, not fixed.** Marked No, the
explanation box stays open and empty. The DD Form 254's OWN XFA template hides
it, on each No radio:

    if (this.rawValue == "1") { ... fourteen_identify.presence = "hidden"; }

and that is an `activity="change"` event - it fires when somebody clicks the
radio in Adobe. A form filled from saved data never fires it, and nothing on
the datasets side can set presence. The fix is a start-up event on those two
fields inside the embedded template, i.e. editing the embedded government form,
and it cannot be verified without Adobe on a real export. Both are the owner's
call; the evidence is in RELEASE_ASSESSMENT_v2.17.0.md. The XFA is at
01_TOOL/rebuild_kit/parts/03_dd254_xfa.b64 - base64 of a PDF whose XFA template
is in its Flate streams.

Note for whoever edits this file next: the Bash heredoc path collapses
backslashes, so a JS escape written through one (
, —) arrives as a real
newline or character and breaks the script it lands in. Build them from
chr(92), or use the editor directly. It cost two broken builds this session.

Two notes for whoever edits the tests or the smoke harness next. The smoke
test's page code is delivered inside a template literal, so an escape written
there is consumed before the page sees it - build a newline in the page
(`String.fromCharCode(10)`) instead. And in the regression suite, a string
inside an `E("...")` call needs the escape doubled.

Note for writing tests here: a section that empties the draft store should
cancel the pending autosave first (`clearTimeout(DASH.timer)`), and `E()`
strings that set Item 13 need `\n` so the escape survives into the inner JS
string literal.

Release ordering, again: `make_build_facts.py` runs BEFORE `make_sbom.py` and
`make_rule_catalog.py`, because build facts rewrites rebuild_kit/manifest.json.
Note too that `02_DOCS/manual_source/build.py` writes `DD254_User_Manual.pdf`,
which is copied to `02_DOCS/DD254_Interactive_User_Manual.pdf` — the names
differ.

Watch for this next time: v2.12.0 was already tagged when that work started,
and the versioned v2.12.0 build files were rebuilt in place before anyone
noticed. They were restored from the tag (2fae3050) and the new work cut as
v2.13.0. A tagged artefact must never change under its tag; compare
`git show v<ver>:01_TOOL/DD254_Interactive_v<ver>.HTM` against the working copy
before assuming a rebuild was harmless.

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

Open question worth deciding before the next release: the cognizant security
office is required unconditionally, not "where it applies" like Item 7 and
Item 8. A DD-254 with no address in 6c, 7c or a performance location therefore
cannot be issued at all. That is what was specified, but it may prove awkward
at the solicitation phase, where the contractor is not yet known.

## Log

2026-11-09 Maintainer - Size cap. Moved the release-by-release detail for
v2.17.0 and earlier, the description of v2.18.0, the old Current State and
every log entry through 2026-10-24 verbatim to HANDOFF-archive.md. What
stays is the latest release, the open item, the standing notes, Next and
Open Questions, none of it reworded. Next and Open Questions were carried
over as they stood and were not re-validated.

Older entries: HANDOFF-archive.md.
