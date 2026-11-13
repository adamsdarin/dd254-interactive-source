# HANDOFF — dd254-interactive-source

Last updated: 2026-11-13T10:40-06:00 by Maintainer

Built and verified locally: **v2.20.1 (Tool 2.170)**, build 062dfcf9. Not yet
tagged or published at the time of writing.

**v2.20.0 (Tool 2.169), build 8f4c420b, IS published**: signed tag at f58767c
on `main`; 12/12 checksums, attestation (official 8f4c420b..., demo
35e6c743..., ref refs/tags/v2.20.0, commit f58767c), byte-identical kit
rebuild, no bytecode, downloaded build smoke PASS; live demo dd254-interactive
2aab8d7, served by Pages and byte-identical to the attested asset. Its verify
run took 15 minutes instead of 4 - the hosted runner was slow, not stuck.

What v2.20.1 changes, build 062dfcf9. **A solicitation is named for its
solicitation number.** `dashNameCompose` adds it to the tail when a contract
number leads the name - the same place an Original carries its subcontract
number - where before it was left out whenever a contract number was present.
`dashSolRetitle(rec)` brings existing ones into line on the recount every
update already triggers, and only when the stored title is EXACTLY what
`dashNameComposeLegacy` composes from the record's own identifiers: a title is
a name a person may change, so nothing is parsed or guessed. 1589 assertions
pass (six new), all five gates, both builds smoke-tested.

What v2.20.0 changes, build 8f4c420b. Two reports from the owner.

**A copy no longer carries another contract's Block 13.** The report: a
finished DD-254 is copied, Block 13 is not updated, the wrong contract's
language is issued. `dashCopyTplKind(rec)` says what the source was built from:
`'dd254'` when a DD-254 template is behind it by any of the three paths that
apply one (`selects.ctTplSel`, `ctSource` from the order repository, or the
carried snapshot's `srcLabel` with no `ctType` from the library's own apply),
`'type'` for a Contract Type, `''` for hand-typed. Only `'dd254'` changes:
`dashCopyResetBlocks` clears Blocks 10 to 16 and the template link, the dialog
starts with the contract fields EMPTY and refuses to copy until one is named
(a **Same contract** button reaffirms the original's in one press), and
`dashDuplicate` rebuilds from the template `dashIntakeMatch` finds for the
named contract - reset, identifiers, template, then `dashPartyApply`, the same
order creating a DD-254 follows. A copy built from a Contract Type or from no
template is carried whole exactly as before, which is why no existing copy
assertion needed restating.

Deliberately not taken: keeping the blocks when the contract number is
unchanged. It preserves hand edits, which is the failure with a narrower
trigger. Rebuilding applies the WHOLE template, so the new contract's Item 18
comes with it; where nothing is applied Item 18 stays as copied.

Also in the copy dialog: a stored `YYYYMMDD` date showed blank in a date field
(`dashDateForInput`, applied in `dashPartyRow`, so create and rename are fixed
too), and the overlay could not scroll.

**Standard language that has been edited is still standard language.**
`slAppliedIn` compared Item 13 with the library character for character, so an
edited paragraph read as missing - the mandatory finding fired, and
`slAutoApply`, which asks the same question, wrote a second copy. Presence is
still the only source of truth, with no bookkeeping: `slSurvivesIn` counts an
entry while at least `SL_EDIT_KEEP` (0.5) of its three-word runs are still in
Item 13. Deleting it is still deleting it.

1583 assertions pass (fifteen new, none restated), all five gates pass, both
builds pass the native-browser smoke test.

Latest published release: **v2.19.0 (Tool 2.168)**, build b206a6d2. Signed tag
at 03743df on `main`; 12/12 checksums, the provenance attestation (official
b206a6d2..., demo 71279f7e..., ref refs/tags/v2.19.0, attested commit 03743df),
a byte-identical kit rebuild with no bytecode and a PASS on the downloaded
build's native-browser smoke test, all verified from a fresh download. Live
demo published as dd254-interactive 5674c71 and served by Pages,
byte-identical to the attested demo asset.

What v2.19.0 contains, build b206a6d2. One approved change to the embedded
form and three reports from the same message.

**ITEMS 14/15: THE EMBEDDED DD FORM 254 IS NO LONGER BYTE-IDENTICAL TO THE
GOVERNMENT DOWNLOAD.** It carries one addition and nothing else: an
`activity="ready" ref="$form"` event on each of `fourteen_No` and `fifteen_No`,
running the rule the form's own `change` script already runs
(`fourteen_identify.presence = "hidden"`). That change event only fires when a
person clicks the radio in Adobe, so a form filled from saved data left the
explanation box open and empty. Nothing in the datasets packet can set
presence. The owner approved it after confirming in Adobe that the form's own
"Please read Instructions" alert appears on an export - itself a `$form` ready
script, which is the evidence that ready events fire on a data-filled open.
Written up in THIRD_PARTY_NOTICES.md and the release assessment; asserted by
section 148, which inflates the template out of the build and checks both
additions, every XFA packet, and that no other ready event appeared. The patch
script is in the session scratchpad; it works through the page's own pdf-lib so
the xref is rebuilt by the same writer the export uses.

**The caveat engine's Apply button** was the panel's default grey whether there
was work to do or none. `cavPending(out)` counts what is outstanding against
the form as it is now: grey only when nothing is offered, blue while something
is outstanding, blue with a tick when the form already matches the answers. No
state is stored, so unticking a box by hand corrects it.

**Guidance is placed where its box reads.** `i13BoxOffset(text,key)` finds the
spot between the head region (supported-effort line, revision summary) and the
tail (standing sentence, classified mailing address), after every earlier Item
10/11 box's clause and before every later one. `ctAutoLangKey`, `ctForceLang`
and `cavEngineApply` all place through it.

**A solicitation whose bids-due date has passed cannot be issued.** An ordinary
finding, so it holds the record at Draft and can be set aside with a reason. It
asks `window.DD254_STATUS` first - new, set by `dashOpen` and
`dashRecountDrafts`, cleared by `resetFormFields` - and says nothing on a
record that is Issued, Skipped or Cancelled. Without that the demonstration
portfolio's Skipped solicitation, closed 215 days ago, would have carried a
permanent error and the seeded counts would have drifted from the recount.

1568 assertions pass (eight new), all five gates pass, both builds pass the
native-browser smoke test including its export assertions.

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

**v2.17.0 (Tool 2.166), build b1f6c094, IS published**: signed tag at 4e63153
on `main`; 12/12 checksums, attestation (official b1f6c094..., demo
cdf0e01a..., ref refs/tags/v2.17.0, commit 4e63153), byte-identical kit
rebuild, no bytecode, downloaded build smoke PASS; live demo dd254-interactive
cd18fc3, served by Pages and byte-identical to the attested asset.

What v2.18.0 changes, build 78bd3892. The owner's report: the template row
offered bare manager names with no programme and no narrowing, and the create
dialog listed a manager with one of their programmes. Both lists read the
single `program` field, which since v2.15.0 holds only the first.

**A manager is now offered once per programme they run.** `smPairsFor(program)`
is the list, `smPairLabel` the label, `smPairParse` reads one back - exact name
first, then split from the right and checked against that manager's own
programmes, so a manager whose name contains the separator still resolves. The
row's manager control has its own datalist `ctSmList_<i>` because the options
depend on the row, and `ctSmProgRender` ends by calling `ctSmListRender` while
the programme input calls `ctSmProgRender` - the two controls narrow each other
in both directions. A manager-programme mismatch is reported on the row, not
resolved: it is usually the programme that is wrong.

**The create dialog lists every programme** and records `programs`, leaving
`program` blank where the manager runs several - the rule the template row has
followed since v2.15.0. `dashSecurityManagerLabel` and `distSmAdd` read
`smPrograms`, so a record written before this reads unchanged.

1560 assertions pass (nine new, none restated - the v2.15.0 manager assertions
all still hold), all five gates pass, both builds pass the native-browser smoke
test, whose new `smPairsOk` drives the pair list and the dialog in a real
browser.

**Still open, awaiting the owner:** Items 14/15 on the dynamic PDF leave their
explanation box open when marked No. Diagnosed in v2.17.0's release assessment -
the DD Form 254's own XFA template hides that field on an `activity="change"`
event, which a form filled from saved data never fires. The owner asked to be
told more before anything is touched; they have been, including the free test
(if an exported form shows the form's own "Please read Instructions" alert in
Adobe, then `$form`-ready scripts do fire and the fix will work).

**v2.16.0 (Tool 2.165), build 91f1fc44, IS published**: signed tag at b911416 on
`main`; 12/12 checksums, attestation (official 407ad934..., demo 3bc5d2b6...,
ref refs/tags/v2.16.0, commit b911416), byte-identical kit rebuild, no bytecode,
downloaded build smoke PASS; live demo dd254-interactive 2d25ebf, served by
Pages and byte-identical to the attested asset.

What v2.17.0 adds, build b1f6c094. Three things the owner asked for in one
message, plus one thing diagnosed and deliberately NOT shipped.

**Contract template can be made mandatory**, beside the standard-language
setting that already worked that way. `ctRequiredError()` is an ordinary
finding, raised in both places `slRequiredError` is, so it holds the status at
Draft and can be set aside with a reason. `ctTplUsedLabel()` answers "was a
template used" three ways - the picker, `DD254_CT_APPLIED`, and the carried
snapshot's `srcLabel` - because the library's own apply sets only the last.
`ctLangSrcData` now records the template's name even when it carries no wording
or attachments, which is what makes that third answer exist.

**Done says what is outstanding.** `nextStep` on the last step re-runs the
validation pass and reports `DD254_ERRORS` through `uiAlert`, and says plainly
when the list is empty.

**Text wraps** in Item 13 and in both repositories' editors: `overflow-wrap:
anywhere` beside the `white-space: pre-wrap` that keeps the line breaks the
Item 13 scanner anchors on.

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

1551 assertions pass (eight new, one restated), all five gates pass, both builds
pass the native-browser smoke test, whose new `reqSettingsOk` drives the
requirement and the Done report in a real browser.

Note for whoever edits this file next: the Bash heredoc path collapses
backslashes, so a JS escape written through one (
, —) arrives as a real
newline or character and breaks the script it lands in. Build them from
chr(92), or use the editor directly. It cost two broken builds this session.

**v2.15.2 (Tool 2.164), build 6ee1ced3, IS published**: signed tag at 629aedf on
`main`; checksums, the provenance attestation (official 6ee1ced3..., demo
87e15378..., ref refs/tags/v2.15.2, attested commit 629aedf) and a
byte-identical kit rebuild all verified from a fresh download; the downloaded
build passes the native-browser smoke test; live demo published as
dd254-interactive fe271cf..5a54267 and served by Pages, byte-identical to the
attested asset. What it contains is below.

What v2.16.0 changes, build 91f1fc44. The owner reported the box-mode rule a
second time: "11D, I have it checked, applies when 11D is ticked. That language
only populates when 11D is ticked in the workflow. That is currently not how
it's working."

**A clause that waits is no longer asserted by its own template.** v2.15.1 made
the box govern the clause after application; what was still wrong is that the
template ticked the box itself, so the condition the mode exists to leave open
was true the instant the template was applied. `ctBoxDeferredIn(d,key)` is the
new reader, and `ctApplyDataToWorkspace` skips `ws.checks['c'+k]` for such a box
- the same shape as the 18f exemption - and takes its wording from the tick
already on the record rather than the template's. `ctApplySel` does the same.
A tick the record already had is left alone, so a Revision keeps what its
Original asserted and the wording then applies.

This CHANGES EXISTING TEMPLATES: wording with no setting recorded reads as
"waits for its box", so those templates now leave those boxes to the workflow.
The changelog and the manual both say to mark such wording **Always applies**
where the contract type is meant to assert it. The demo seed was updated the
same way - every demo template now declares its setting, and Meridian keeps 11d
waiting on purpose.

**Attachments had the same defect as the wording.** `ctTplAttachments` and
`dashDistAttachments` read only the picker above Item 13 and the Contract Type
label on the record, so a template applied from the library listed none of its
required attachments - on the form or on the issue screen. The v2.15.1 snapshot
(`ctLangSrc`) now carries `attText`/`attList` and the template's name, and both
readers consult it through `ctLangSnapshotOf`.

1539 assertions pass (nine new, eight restated), all five gates pass, both
builds pass the native-browser smoke test, whose restated `boxGateOk` fails
against v2.15.2.

Two notes for whoever edits the tests or the smoke harness next. The smoke
test's page code is delivered inside a template literal, so an escape written
there is consumed before the page sees it - build a newline in the page
(`String.fromCharCode(10)`) instead. And in the regression suite, a string
inside an `E("...")` call needs the escape doubled.

What v2.15.2 fixes, build 6ee1ced3. One report, two ways round, plus one thing
found while testing it.

**The Item 13 supported-effort line now follows the task order's coverage.** A
task order has no field of its own on the DD Form 254, so the tool owns a
leading line in Item 13 naming the effort. It was written by exactly one path -
`supSync`, the form writer - and every DD-254 generated from the order
repository is composed and saved as a workspace BEFORE it is opened. So an
order running under its prime's DD-254 went out with the order field filled and
Item 13 silent. `ctApplyDataToWorkspace` now reconciles the line on the
workspace it builds, which also covers a dashboard card updated in the
background.

The other half: an order WITH its own DD-254 kept the line while Item 2a
already carried `PRIME | Task Order N`. `supBuild` is now
`supWant(supNum(),supStandalone())`, so no line when the DD-254 is the order's
own, and the `iStandalone` handler calls `supSync`. Section 74's assertion "the
Item 13 reference line still appears" was **reversed** on the owner's
instruction and now reads "gives way to Block 2a"; the whole rule lives in
section 144. Item 2a's combined format was left exactly as it was - the owner's
example used a colon, which was read as describing the composition rather than
specifying a separator, and it is flagged for them.

`dashOpen` reconciles the line under the same `I13_FINAL_STATUS` guard as
`cmaSync` and `slAutoApply`, so older task-order records converge on open and
an Issued one is untouched.

**Also fixed: `dashSaveNow` read `DASH.current` again after awaiting.** It
reads the record, awaits the store, collects the live form, then used
`DASH.current` for the fallback record - so closing or switching records mid-save
wrote the open form onto the record just left, or wrote one with `id:null`,
which IndexedDB rejects and the operator sees as an unexplained storage
failure. The id is captured once and the save is abandoned if it is no longer
the open record. Proved against the published v2.15.1 build, which overwrites
the closed record; it is what made the new section crash the suite, which is
how it was found.

1530 assertions pass (eight new), all five gates pass, both builds pass the
native-browser smoke test, whose new `supLineOk` fails against v2.15.1.

Note for writing tests here: a section that empties the draft store should
cancel the pending autosave first (`clearTimeout(DASH.timer)`), and `E()`
strings that set Item 13 need `\n` so the escape survives into the inner JS
string literal.

Latest published release: **v2.15.1 (Tool 2.163)**, build a1178052. Signed tag
at b180205 on `main`; assets, checksums, the provenance attestation and the kit
rebuild all verified from a fresh download (official a1178052..., demo
5cb3bebb..., ref refs/tags/v2.15.1, attested commit b180205, rebuild
byte-identical, no bytecode in the kit); the downloaded build passes the
native-browser smoke test; the attached documents are this version's. Live demo
published as dd254-interactive fe271cf, staged blob byte-identical to the
attested demo asset and now served by Pages.

Corrected after the tag, so it ships with the next release rather than being
patched onto this one: the security fact sheet's date line read 24 October 2026
in v2.13.0 through v2.15.1. Only its version was being moved at release time.
SETUP.md step 1 now says both lines move. The published v2.15.1 fact sheet
still carries the stale date; it is a documentation asset, so it can be
replaced with `gh release upload --clobber` plus a regenerated SHA256SUMS.txt
if that is ever wanted.

What v2.15.1 fixes, build a1178052. One report: "the 11d language is inserted
and I have to delete it by hand."

**An Item 10/11 box governs its own template wording again.** The box trigger
resolved its wording through `ctActiveTpl` — the picker above Item 13 —
and nothing else. Every other path that applies a template leaves that picker
alone, and `ctFind` reads TPL_CT only, so a **Contract Type** template (TPL_B13)
could never be the active one at all: for that whole repository the box did
nothing. The clause arrived with the template, unticking left it on the form,
and ticking a box the template had left alone inserted nothing.

Applying a template now writes what it says per box into a hidden `ctLangSrc`
field on the form, and `ctLangSourceFor(key)` reads the picker first and that
snapshot second. A snapshot and not a reference, deliberately: what the box has
to withdraw is the wording that is on the form, not what the template says
today — there is an assertion for exactly that.

Two more in the same mechanism. Whole-template application decided what to
write from the template's own ticks, so wording marked **always applies** was
dropped whenever the template left its box alone — the one case the setting
exists for. And the editor only showed wording while the template ticked that
box, so **"applies when its box is ticked" could not be written at all**: the
tick is what makes a template assert the box. Wording is now shown for an
unticked box, which is what "kept ready" looks like.

Item 11c's two wordings now also apply on the whole-template path, through the
one function `ctLangFromData`. `cavPurposeForWs(ws,live)` exists because
`cavPurposeNow` reads the open form: a record written in the background would
otherwise be given whichever DD-254 happens to be on screen.

1522 assertions pass (ten new, section 143), all five gates pass, both builds
pass the native-browser smoke test, and the demo was driven in a real browser:
Task Order 0042 — Meridian asserts 11c and keeps an 11d clause ready.

`browser_smoke.js` gained `boxGateOk`, which **fails against v2.15.0** —
worth knowing because that is twice now that the browser caught what the jsdom
suite was green on.

Release ordering, again: `make_build_facts.py` runs BEFORE `make_sbom.py` and
`make_rule_catalog.py`, because build facts rewrites rebuild_kit/manifest.json.
Note too that `02_DOCS/manual_source/build.py` writes `DD254_User_Manual.pdf`,
which is copied to `02_DOCS/DD254_Interactive_User_Manual.pdf` — the names
differ.

Latest published release: **v2.15.0 (Tool 2.162)**, build 769f90f9. Signed tag
at 3f5a4e1 on `main`; assets, checksums, the provenance attestation and the kit
rebuild all verified from a fresh download (official 769f90f9..., demo
c73d3d95..., ref refs/tags/v2.15.0, attested commit 3f5a4e1, rebuild
byte-identical, no bytecode in the kit); the downloaded build passes the
native-browser smoke test; the attached documents are this version's. Live demo
published as dd254-interactive 21a5ffa, staged blob byte-identical to the
attested demo asset.

What v2.15.0 contains, build 769f90f9. Three things the owner asked for.

A **security manager is one listing however many programmes they run**.
`programs` is the record and `program` is mirrored to the first of them on
every write, so the party dialog, the duplicate detector, the CSV and an older
build all still find the single value they expect. Assigning a manager to a
contract template fills the programme when they run one and leaves it blank
when they run several, naming the choices — the same rule the requester
search follows for a shared address.

**Block 18f stopped disappearing.** The report was "18f is not carrying over on
a revision"; the carry was never broken. A probe against v2.14.1 showed
dashSpawn deep-copies it and the form shows it, and that the loss was the first
template applied afterwards: whole-template application was treating 18f as a
section to replace including blanks. It is now exempt — 18f is an
instruction to send somebody a copy, not a property of the work — and a
template that ticks 18f without naming anybody no longer blanks the address on
the form, which used to leave a ticked box the issuance gate refuses to send.

**Item 11c can carry a testing wording and a production one**, chosen by the
caveat engine, which now asks what the effort is. `ctLangOf` is where the
choice is made, so every insertion path gets it without knowing the rule. A
template with no variants, or an engine that is off or unanswered, behaves
exactly as before.

1512 assertions pass (24 new), all five gates pass, both builds pass the
native-browser smoke test, and all three features were driven in a real browser
against the demo build.

Two assertions were restated rather than deleted, both encoding the 18f rule
that changed: the jsdom full-replacement guard and `templateReplaceOk` in
browser_smoke.js. The browser one is the reason to keep reading that file:
**the smoke test is the only thing that caught it** — the jsdom suite was
green.

Note for the next release: `make_build_facts.py` runs BEFORE `make_sbom.py` and
`make_rule_catalog.py`. Build facts rewrites rebuild_kit/manifest.json, and an
SBOM generated first no longer matches it.

Latest published release: **v2.14.1 (Tool 2.161)**, build c7c30816. Signed tag
at 783a4f2 on `main`; assets, checksums, the provenance attestation and the kit
rebuild all verified from a fresh download (official c7c30816..., demo
9e1b28f5..., ref refs/tags/v2.14.1, attested commit 783a4f2, rebuild
byte-identical, no bytecode in the kit); the downloaded build passes the
native-browser smoke test; the attached documents are this version's. Live demo
published as dd254-interactive 4072f59, staged blob byte-identical to the
attested demo asset.

What v2.14.1 contains, build c7c30816.
The demonstration portfolio gains the people who requested its DD-254s. Every
example now carries a requester, chosen by the contractor's CAGE on Item 6, and
the requester repository is derived from those examples rather than written
beside them: completedCount counts that person's Issued examples. Two of the
four share one programme-desk address, so the demo shows the case the create
dialog refuses to guess at. Until now the demo seeded no requester at all, so
`Manage → Requesters` opened blank and the v2.14.0 requester search had
nothing to search.

One defect fixed, found by driving the demo once it had data: a requester name
filled in from one address stayed in the field when the address changed. Pick a
known address, the name fills in; switch to a shared address and the dialog
said "the name is not filled in" with the previous person still showing. A
DD-254 created there would have recorded the wrong requester. A name the dialog
wrote is now withdrawn when the address stops identifying one person; a name
the operator typed is still never touched. The first of the two new assertions
fails against v2.14.0.

Why a version bump for what began as demonstration data: the demo build is an
attested release asset, and an attested asset is never replaced under its own
tag. Changing the seed means a new version.

1490 assertions pass, all five gates pass, both builds pass the native-browser
smoke test.

Note for the next release: run `make_build_facts.py` BEFORE `make_sbom.py` and
`make_rule_catalog.py`. Build facts rewrites `rebuild_kit/manifest.json`, and an
SBOM generated first no longer matches it — check_documentation catches it,
but only after the fact.

Latest published release: **v2.14.0 (Tool 2.160)**, build b45d553c. Signed tag
at fc84ef0 on `main`; assets, checksums, the provenance attestation and the kit
rebuild all verified from a fresh download (official b45d553c..., demo
89eb2330..., ref refs/tags/v2.14.0, attested commit fc84ef0, rebuild
byte-identical, no bytecode in the kit); the downloaded build passes the
native-browser smoke test; the attached manual, ISSM brief, fact sheet,
release assessment and implementation map are all this version's. Live demo
published as dd254-interactive 1809a03, staged blob byte-identical to the
attested demo asset.

What v2.14.0 contains, build b45d553c.
The language a DD-254 may use now lives in one place, beside the form, and
cannot be hidden. The left rail lost its tab, its stored open/closed state and
the `dd254_left_banner` key; the right-hand panel lost its Standard Language
and Contract Templates That Fit sections, which were duplicate lists that could
only look at a library the rail can insert from. The rail took over everything
those sections did, and gained Apply for contract templates.

Template language now carries one of two modes, chosen beside the wording:
always applies, or waits for its own Item 10/11 box. The intake caveat
checklist is gone with it — it was a second gate on the same clause, and
three ways to suppress one clause is why clauses were silently not appearing.

A contract-template row states its name, programme, scenario and Item 1a level
as four controls, the way a standard-language row has since v2.12.0; the level
and scenario moved out of Edit blocks rather than being copied onto the row.
The requester e-mail field searches the requesters on file and fills the name
from the match.

Three defects fixed, each of which predates this work:
- per-box template language never fired on a template matched at intake, because
  the draft did not record which template it came from (`ctActiveTpl()` was
  null). Shipped broken in v2.12.0; section 136 fails without the fix.
- the removed contract panel's Apply called `ctPickContractType` with an id
  where it expects an array, so it would have thrown.
- the demo seed guessed a template's programme from its label with `/ALDER/i`,
  and "Calder Aerospace" matches, so the CEDAR template was tagged ALDER.

1487 assertions pass, all five gates pass, both builds pass the native-browser
smoke test, and all six previously tagged build files still match their tags
(checked per the note below before any rebuild).

Known gap, deliberate: the demo cannot show the requester search, because its
seed creates no requester records and its drafts carry no requester details.
Extending the demo portfolio with requester personas was out of scope here.

Latest published release: **v2.13.0 (Tool 2.159)**, build ce0bee7e. Signed tag
at 2ea07bf on `main`; assets, checksums, the provenance attestation and the
kit rebuild all verified from a fresh download (official ce0bee7e..., demo
b73dd458..., ref refs/tags/v2.13.0, attested commit 2ea07bf, rebuild
byte-identical); the downloaded build passes the native-browser smoke test;
live demo published as dd254-interactive 1fd4bfc and served byte-identical.

What v2.13.0 contains, build ce0bee7e.
Contract templates now offer what fits the open DD-254 the way standard
language already did: a template records a programme, an Item 1a level and a
purchase/bids scenario, and a new "Contract Templates That Fit" panel lists the
matching ones beside the form with the rest one link away. All three keys may
be left as Any, and a template saved earlier reads as Any on every one, so no
library shrinks when this version is installed. The Item 1a level is its own
field and deliberately not `data.cls`, which is the form's CUI marking.

Layered, not rebuilt: orders and coverage, source provenance and duplicate
detection are untouched, and section 135 asserts they still exist. 1473
assertions pass, all five gates pass, both builds pass the smoke test.

Watch for this next time: v2.12.0 was already tagged when that work started,
and the versioned v2.12.0 build files were rebuilt in place before anyone
noticed. They were restored from the tag (2fae3050) and the new work cut as
v2.13.0. A tagged artefact must never change under its tag; compare
`git show v<ver>:01_TOOL/DD254_Interactive_v<ver>.HTM` against the working copy
before assuming a rebuild was harmless.

Latest published release: **v2.12.0 (Tool 2.158)**, build 2fae3050. Signed tag
at 276a4c3 on `main`; assets, checksums, the provenance attestation, the kit
rebuild and the pdf-lib check all verified from a fresh download (official
2fae3050..., demo 3008ba49..., ref refs/tags/v2.12.0, attested commit 276a4c3,
rebuild byte-identical, no bytecode in the kit); both downloaded builds pass the
native-browser smoke test; live demo published as dd254-interactive 4cb662e and
served byte-identical.

The published rebuild kit now has three parts rather than four — no
`02_dd254_flat.b64` — and still round-trips byte-identically, which is the
retired payload proven end to end from a published artifact rather than
locally.

## How v2.12.0 was built — branch `argon-port`, now merged

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

**v2.12.0 is cut and gated**, build fbbbf4e2. 1460 assertions pass, all five
gates pass, and both builds pass the native-browser smoke test.

Retiring the flat payload rippled through four release scripts, all of which
assumed it was always present: `make_build_facts.py` threw,
`rebuild_kit/split.py` would have written an empty part, `rebuild_kit/
rebuild.py` read a file that was no longer cut, and `make_sbom.py` indexed a
component that no longer exists. All four now treat the flat payload as
optional and describe only what a build actually carries. The XFA payload
stays mandatory: it is the official export. The ISSM brief's stated file size
moved from 2.3 MB to 1.7 MB.

Done: merged, tagged, published, demo refreshed, all verified from a fresh
download.

Open for whoever picks this up: Argon's own prototype files were mirrored into
`01_TOOL/`, the repository root and `dd254-interactive/` on 23 October. They
are untracked, so none of them is in the release, but they are clutter in the
canonical source tree and `DD254_Interactive_Argon.HTM` sitting in `01_TOOL/`
is the kind of thing a future `newest_build()` change could trip over. Ask the
owner before removing them.

Both gaps are now closed: REQ-11's always-insert flag has a control beside each
Item 10/11 language box in the template editor as well as the CSV column, and
the caveat engine surfaces in the intake dialog as well as the banner, which is
the architecture's hybrid option.

Closing them found one worth recording. The intake caveat checklist had been
reported as built when it was not: an edit lost its anchor and was never
written, so the dialog collected checkboxes nothing rendered and the choice was
never recorded. Every caveat assertion still passed, because they all called
the data layer directly. Section 134 drives the dialog itself, which is the
only thing that would have caught it.

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

2026-10-24 Maintainer - Published v2.13.0: contract templates offer what fits
the open DD-254, the way standard language already did. Same three keys -
programme, Item 1a level, purchase/bids scenario - in the same order, and the
same panel beside the form. Layered on the repository rather than replacing
it: orders and coverage, source provenance and duplicate detection are
untouched, and section 135 asserts they still exist, because the risk in
"rebuild it like the other one" is losing the parts the other one never had.

The Item 1a level is its own field and deliberately not data.cls, which is the
form’s CUI marking - a different question from the clearance the work needs.

Also removed the Argon prototype files the owner approved clearing: sixteen
untracked paths across 01_TOOL, the repository root and dd254-interactive,
plus an empty vitest cache in the demo repo. The demo repo is now index.html
alone. Nothing tracked was touched and the gates stayed green afterwards.

2026-10-24 Maintainer - Published v2.12.0, the Argon prototype rebuilt on
v2.11.0. Verified from a fresh download rather than from the workflow result:
every published checksum, the official build against the local one, the
attestation subject/digest/ref/commit, the kit round-trip from the published
tarball, pdf-lib against upstream 1.17.1, and the smoke test run against both
downloaded files. The kit now ships three parts rather than four and still
rebuilds byte-identically, which proves the retired flat payload end to end.

The release changes two things people will notice: the official export is the
dynamic XFA form and nothing else, so signing needs Acrobat rather than the
free Reader; and Item 13 has no formatting buttons. Both were owner decisions,
raised and confirmed twice, and both are stated in the changelog and the
manual rather than left to be discovered.

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
