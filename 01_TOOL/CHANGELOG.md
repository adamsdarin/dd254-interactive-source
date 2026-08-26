# DD-254 Interactive — change notes, v155 → v1.9

Written 2026-08-11 from the record of the sessions that produced these versions.

## v1.9 — authority-correct Contracting Officer Package — 2026-08-26

**Corrected.** Replaced obsolete or misapplied clause mappings throughout the
live clause panel, subcontract flow-down guidance and generated Contracting
Officer Package. DFARS 252.204-7005 is no longer presented as a SAP/SCI clause;
252.204-7008 is no longer described as a NATO or export-control flow-down; and
252.204-7003 is no longer tied to CNWDI. FAR 52.204-2 now uses its
substantially-conforming subcontract language, and overseas clauses are review
prompts rather than automatic consequences of Item 11f.

**Added.** The CO package now checks entity eligibility and safeguarding
capability separately; Item 12 completion; Item 13 quality and supporting
documents; CUI designation and contract direction; revised/final/solicitation
lifecycle actions; Items 14 and 15 coordination; minimum signed distribution;
and the foreign/NATO instrument boundary. CNWDI now cites 32 CFR 117.20 and
classification-guidance responsibility cites 32 CFR 117.13(d).

**Safer clause presentation.** Renamed the clause output to `Contract Clause
Applicability Review`, added the current DFARS 204.73 review set, and states
that DD Form 254 selections do not prescribe a complete clause matrix. COTS,
acquisition type, agency supplements, location, personnel status and actual
subcontract performance still require contracting-officer review.

**Testing and documentation.** Added focused regression coverage for the
corrected citations, CUI gaps, Item 12, minimum distribution and stale-clause
exclusions. Updated the demo instructions and user-manual source for v1.9; the
release facts, final assertion count and rebuild manifest are regenerated from
the verified official file. The complete run passed `923 PASS / 0 FAIL`, and
the rebuild kit reproduced the v1.9 file byte-for-byte.

## v189 — sign the dynamic PDF, not the drafting screen — 2026-08-26

**Changed.** Removed the visible Item 17h Signature placeholder and Item 17i
Date Signed input from the browser drafting form. Those two items belong to the
generated dynamic DD Form 254 and are completed there during signing.

**Data boundary.** Item 17i is no longer captured in draft data or carried into
the XFA data packet. The packet deliberately emits a blank signed-date value,
leaving the dynamic PDF's own signing workflow in control. The browser still
captures Items 17a through 17g, and the embedded government form and its Item
17 signing controls are unchanged.

**Release parity.** Added `DD254_Interactive_v189_DEMO.HTM` and
`DEMO_SCRIPT_v189.md`, updated the user manual and test instructions, and
regenerated the build facts and rebuild manifest from the official v189 file.

**Testing.** Added regression coverage proving 17h/17i are absent from the
drafting screen and saved form data, the XFA signed-date value starts blank,
and the internal PDF oracle still preserves its Item 17h signature field. The
complete v189 run passed `918 PASS / 0 FAIL`.

## v188 — cited, nonblocking access and performance advisors — 2026-08-26

**Promoted.** The separately evaluated v187 advisory prototype is now the
official `DD254_Interactive_v188.HTM` release, tool version 2.114.
`DD254_Interactive_v187.HTM` remains intact as the preceding official build;
the prototype also remains as the review record that preceded promotion.

**Added.** An Item 10 Access Eligibility Advisor that compares the form's
required FCL and safeguarding levels with a user-entered NISS verification
snapshot, selected special-category levels, on-site handling, and supporting
authorization evidence. Coverage includes SCI, SAP, NATO, CNWDI,
RD/FRD, COMSEC, FGI, ACCM, CUI, foreign/NATO recipients, SAPF/SCIF status, and
the Item 11l classified-access basis.

**Safety boundary.** Advisor findings are rendered in a separate array and are
never added to `DD254_ERRORS`, `DD254_WARNS`, compliance holds, status gates, or
official PDF data. The advisor classifies findings as potential internal
contradictions, access/work-start holds, evidence or clarification needs, and
information. Every finding remains advisory and identifies its authority.

**Changed.** The advisor introduction now lists the authorities and guidance
used by the advisor: 32 CFR Part 117, the DD Form 254 Instructions, DoDM
5105.21 Volume 3, DoDM 5205.07, DoDI 5200.48, and DoDM 5200.01 Volume 3. The
notice calls the collection authorities and guidance rather than describing
every source as a DoDI.

**Removed.** The redundant `Item 13 Template Language` section from the
Checklist & Templates side panel. `DD-254 Template Language` remains the single
visible template workflow, while the shared defaults and section-composer
helpers remain available behind it.

**Added.** A dedicated `Item 11 Performance Advisor` beneath Item 11. It checks
11a through 11m against safeguarding, related Item 10 selections, Item 13/14
support, Item 18d distribution, prohibited combinations, and external evidence
such as DTIC sponsorship, COMSEC account authority, TEMPEST/OPSEC direction,
Defense Courier approval, overseas coordination, and CUI designation. Its
findings and evidence snapshot remain separate from all blocking validation and
official PDF data.

**Changed.** Thirty-one rule-backed conditional alerts now display an
`Authority:` footer in the same visual pattern as the advisory findings. The
references identify the applicable DD Form 254 Instruction item and, where
applicable, DoDM 5105.21-V3, DoDM 5205.07 (2025), DoDI 5200.48, or DoDD
5205.02E. The subcontractor e-mail reminder is expressly labeled `Workflow
control:` so it is not presented as a regulatory mandate. The reference footer
is display-only and does not change warning severity, validation counts, draft
status, workflow gates, or exported form data.

**Changed.** Prototype wording and badges were replaced with official
nonblocking-advisor wording. The NISS and Item 11 evidence snapshots remain in
the saved workspace for continuity across revisions but are deliberately
excluded from the official DD Form 254 data.

**Release parity.** Added `DD254_Interactive_v188_DEMO.HTM` and
`DEMO_SCRIPT_v188.md`, updated this manual and the test instructions, and
regenerated the build facts and rebuild manifest from the official v188 file.

**Testing.** The regression suite now covers the Item 1a SCI contradiction,
the Item 11 cross-checks, persistence and PDF exclusion of advisor evidence,
all registered authority footers, workflow-control labels, and confirmation
that neither advisor nor its references alter validation or status gates. The
complete v188 run passed `916 PASS / 0 FAIL`.

## How to read this, and what it is not

**These notes are reconstructed, not derived.** There is no version control on
this project. Official builds v176 through v184, v186 and v187 exist on disk;
v185 and builds before v176 do not. Hashes for absent builds are the values
recorded when those versions shipped and **cannot be re-checked today**. Treat
this as a release log, not as proof of an artifact that is no longer present.

**v155 is the starting point, not a change entry.** It is the build that
existed before this run of work. What it contained is not described here.

**Assertion counts are from actual recorded runs**, never from counting
declarations in the suite source — the same rule `make_build_facts.py` follows.

---

## Summary

| Version | SHA-256 (short) | Assertions | Headline |
|---|---|---:|---|
| v155 | `d0789c3c017fa2e4` | 566 | baseline (inherited) |
| v156 | `53fb6c19ae59d85b` | 593 | Settings panel, app-shell dark theme |
| v157 | `0596b895da4d8801` | 609 | Task order / effort number, Item 13 head line |
| v158 | `2ef6a0458590618e` | 626 | CUI designation block (3 rows) |
| v159 | `fdf72287abf1db98` | 644 | Limited dissemination controls |
| v160 | `ed5a9b83d3acb68b` | 660 | DoD distribution statements |
| v161 | `887ea743c93f0c50` | 678 | Configurable export filename |
| v162 | `9327fc76a6f83252` | 697 | Item 13 section composer |
| v163 | `74ec62f60db711a6` | 697 | Settings button restyle |
| v164 | `62e8b6aa4c42c48b` | 700 | Composer refresh fix |
| v165 | `a833477448b233f2` | 702 | `Reference NNx:` section format |
| v166 | `f08ecf28e757b69f` | 718 | Save Item 13 language to a template |
| v167 | `ac6d35fcc2fe4ddf` | 727 | Validation and checklist split into two panels |
| v168 | `ea74230a75ffc8dd` | 737 | Chain of custody |
| v169 | `5595def5f5b09310` | 752 | Semicolon delimiter, per-flag dismissal |
| v170 | `752421fb0e5c1580` | 761 | CSV formula injection guard |
| v171 | `79e11c376edbe23f` | 770 | Item 13 cleanup/undo, durable audit writes, export hardening |
| v172 | `55bd29a2b821a77f` | 782 | Explicit save and saved-state in template editors |
| v173 | `ac87bb2b946349bf` | 795 | Standalone DD-254 — combined Block 2a |
| v174 | `463d971e90973a6e` | 803 | Durable template writes, safe validation rendering, dynamic-only official PDF |
| v175 | `272fddaef6691259` | 803 | pdf-lib MIT attribution — vendored hash changed |
| v176 | `3753ff5ce021f96a` | 803 | Fictional phone number in a comment |
| v177 | `185d520e4914acf3` | 815 | Task order templates |
| v178 | `1771281ae3a27891` | 834 | Multi-facility organisations, bulk CAGE expansion |
| v179 | `40f4587781e5f256` | 838 | Template editor row layout fix |
| v180 | `5deb6b124442b0f6` | 843 | Template editors use the window |
| v181 | `fdeff1d1c475dc0e` | 856 | Scalable workspace — width presets, drag handle, text size |
| v182 | `d9dd9b488fff4852` | 861 | Stylesheets that never applied — v167, v180, v181 made live |
| v183 | `c1824211af883fda` | 871 | Clear the audit log, export-first with a tombstone |
| v184 | `f3255986d5570296` | 877 | Attribute-injection fix in the audit viewer, one shared PDF text sanitiser, Item 10/11 checkbox dead zone closed |
| v185 | `669806e853b5ec96` | 894 | Draft card overflow menu, searchable Manage menu, bulk selection/export, guidance search, tile hover/focus |
| v186 | `885297d3916c49d2` | 895 | Live Validation / Checklist panels fill their actual height instead of hugging a ~250px minimum |
| v187 | `a3607f369d2a0e85` | 906 | A cleared compliance hold stays cleared |
| v188 | `a4d96fcac53ea7a3` | 916 | Cited, nonblocking access and Item 11 performance advisors |
| v189 | `a44bd7ee258211fd` | 918 | Items 17h and 17i move from the browser to the dynamic PDF signing workflow |
| v1.9 | `9f032a083f0cef8f` | 923 | Authority-correct CO package, clause applicability review, CUI/lifecycle/distribution checks |

Net: **+357 assertions**, 566 → 923. Size 1,933,671 → 2,130,196 bytes.

---

## v156 — Settings panel and dark theme

**Added.** A Settings screen under Manage → Preferences, built as a registry
(`SETTINGS_DEFS`) with exactly one reader and one writer per setting, so adding
a setting later is one array entry rather than new markup plus a handler plus
new persistence. Four settings: appearance, form layout, backup reminder
threshold, owner name.

**Added.** A dark theme scoped to the application chrome — dashboard, menus,
modals, template editors, validation panel. The DD-254 facsimile stays white
so what is on screen matches what prints. The whole theme sits inside
`@media screen`, which is the structural guarantee it cannot reach print or an
export.

**Changed.** The one-page / step-by-step form layout toggle already existed as
a floating button (`wizSetView`); it was surfaced as a named setting. The
button and the setting share one writer and cannot disagree.

**Changed.** Backup reminder became a threshold. Default 1 reproduces the
previous behaviour exactly. Below the threshold the change count is still
shown, suppressed as a warning rather than hidden as a fact. Zero is not
offered.

**Not done.** `prefers-color-scheme` / "match system" was deliberately skipped.
The form facsimile was deliberately left light.

---

## v157 — Supported effort number

**Added.** An optional task order / BPA / other effort number under Item 2,
labelled as a tool field with no official sub-letter badge — there is no
Item 2 box for it on the form. Entering a number writes
`This is in support of effort <n>.` at the top of Item 13.

**Added.** `i13HeadOffset()` as the single definition of where Item 13 content
begins.

**Fixed.** `slInsert` prepended standard language at offset 0, which would have
landed it above the supported-effort line. It now asks `i13HeadOffset` rather
than assuming.

**Fixed.** Contract Type templates replace Item 13 wholesale and dropped the
line while the field stayed filled. `ctApplyWsToForm` now re-syncs.

**Behaviour.** Write-once placement: an existing line is rewritten where it
stands, so moving it down the block is respected.

---

## v158 — CUI designation block

**Added.** Optional Controlled By, CUI Category and Point of Contact fields
under Item 18, written at the very bottom of Item 13 after five blank rows.
All labels print even when blank, so a missing element is visible rather than
silently absent.

**Added.** `i13TailOffset()` as the single definition of where the managed tail
begins. `cmaSync` was routed through it — the classified mailing addresses and
the CUI block both claimed "the bottom".

**Fixed.** Four sites collapse runs of three or more newlines, which would have
crushed the five blank rows. The tail is rebuilt after those run.

---

## v159 — Limited dissemination controls

**Added.** Ten LDC controls rendered from a registry (`LDC_OPTIONS`) with full
descriptions on hover, multi-select, alphabetised by marking and joined with a
single forward slash per CUI marking guidance. `REL TO`, `DISPLAY ONLY` and
`DL ONLY` take a typed list.

**Fixed.** `applyWorkspace` sets checkboxes directly and never fires the change
handler, so reopening a draft with `REL TO` ticked left its country list stored
but its input hidden and uneditable. Visibility now derives from tick state.

---

## v160 — Distribution statements

**Added.** Statements A–F with verbatim templates, a reason-for-control picker
filtered per statement from the source table, YYYYMMDD date, controlling
office. An invalid statement/reason pairing cannot be produced.

**Decision.** Category lists are per-statement, not one shared list: B offers
`Proprietary Information` and `Small Business Innovation Support (SBIR)` where
E offers `Proprietary Business Information` and `SBIR`. Carried verbatim.

**Fixed.** `applyWorkspace` assigned `distCat` before its options existed, so
the reason silently blanked on reopen — the same failure the `ctTplSel` comment
already documented.

**Decision.** Statement and LDC are joined with a semicolon, not a slash: the
controls are already slash-separated among themselves.

---

## v161 — Configurable export filename

**Added.** Settings → Filename contents. Thirteen boxes selectable and
orderable, dash or underscore separator, live example. Defaults reproduce the
previous fixed convention exactly so no existing exports rename on upgrade.
Each box is capped at 30 characters; empty boxes are skipped without leaving a
separator.

**Reverted during development.** An attempt to strip the separator from values
destroyed real contract numbers (`N00178-24-F-1234` → `N0017824F1234`) and was
caught by three existing assertions.

**Changed (test).** "The Contract Type editor does not offer Block 2a" scanned
the whole document and matched the new Settings picker. Scoped to `#tplView`.

**Not done.** Item 3a has no field — Item 3 is radios, not a text box. The
validation log still builds its own filename from `i2a` directly rather than
going through `dd254ExportName`.

---

## v162 — Item 13 section composer

**Added.** Settings → Item 13 layout: one block, or a labelled section per
ticked Item 10/11 box.

**Architecture.** Sections are managed regions of the same Item 13 text, found
by heading and rewritten where they stand. There is no second store, so
switching layouts alters nothing, and the raw Item 13 field stays visible below
as the failsafe because it *is* the field.

**Behaviour.** A section ends at the first blank line after its heading. The
alternative — running to the next heading — was caught by an assertion eating
a paragraph the operator had typed below.

---

## v163 — Settings button

**Changed.** "Back to dashboard" restyled to `pbtn-primary` at 13px. No
assertion change.

---

## v164 — Composer refresh

**Fixed.** The composer only re-rendered when the layout setting changed, so
ticking an Item 10/11 box produced no section. Every assertion had called
`b13RenderCompose()` explicitly and passed while the real path was broken.

**Changed.** Hooked to `run()` rather than to the four separate toggle paths.
Markup is only rebuilt when the *set* of sections changes, so a keystroke
elsewhere does not take focus out of a section box.

---

## v165 — Section format

**Changed.** Sections write as `Reference 10a:`, a blank line, then the text.
The boundary rule changed with it — the mandated blank line is stepped over
before the body is measured.

**Behaviour.** Written as `Reference`, read loosely: `Ref. 10a:` and
`Refs 10a:` also match, because inserted templates and older drafts use them
and a section the composer cannot find is one it would silently duplicate.

---

## v166 — Save language to a template

**Added.** Item 13 language for an Item 10/11 box can be pushed into the
selected DD-254 Template Language template, from the section box or from the
side-panel card. Refused with a reason when no template is chosen or the box is
empty; asks before replacing existing language.

**Changed.** In sections layout, Item 10/11 cards leave the side panel and
their inserts move into the section boxes. Items 12, 14, 15 and 18f stay.

**Fixed.** `TPL_DEFAULTS['10a'].text` already began `Reference 10a:`, so
inserting it produced two headings. `b13SectionSet` now strips a leading
heading from any text handed to it.

---

## v167 — Two panels

**Changed.** The right-hand panel split into **Live Validation** (errors,
Item 3 rules, warnings, flow-down, clauses, required Item 13 entries,
completion status) and **Checklist & Templates** (standard language, DD-254
template language, Item 13 template language, email distribution, attachment
reminder). Each scrolls independently; the column became the frame.

**Why.** Scrolling down to reach the template language pushed the errors off
screen in a tool whose point is that the errors stay in front of you.

---

## v168 — Chain of custody

**Fixed.** `dashDelete` wrote the `deleted` audit entry *before* the
confirmation, so cancelling left the record asserting the destruction of a form
that still existed.

**Added.** Deleting a draft that has descendants now names them and states that
the revision trail will break. Proceeding records how many were orphaned.

**Changed.** The audit log moved from localStorage to the drafts database. Cap
raised 5,000 → 100,000, and reaching it now records what was removed and the
dates covered, rather than silently shifting the oldest off the front. At a
thousand forms a year the old ceiling arrived in about four months.

**Changed.** Reads stayed synchronous — eleven call sites expect an array from
`audAll()`.

**Added.** `auditSha256` in Full Backup, separate from the body hash so older
backups keep verifying. Restore verifies, then merges and de-duplicates rather
than replacing, so restoring an older backup cannot move history backwards.

---

## v169 — Semicolon and per-flag dismissal

**Fixed.** `10a;` was not detected as an Item 13 marking while `10a ;` was —
the spelling people actually type was the one that silently produced no entry
and left the warning lit. Semicolon added to the delimiter set and to the
disclaimer pattern.

**Added.** Any live validation finding can be set aside with a required written
reason, recorded against that draft with author and timestamp and written to
the audit log. It stays on the panel, struck through, with a *put back*
control; it only stops counting toward the total that holds the status at
Draft.

**Deliberately not possible.** A dismissal cannot clear a compliance hold. An
assertion fails if the hold gate ever starts depending on dismissals or stops
preceding `statusOverride`.

**Behaviour.** Findings are keyed by text, so rewording a rule asks for the
judgement again. Dismissals survive form changes until cleared by hand.

---

## v170 — CSV formula injection

**Fixed.** `ioCsvEsc` did RFC 4180 quoting but nothing for formula injection. A
cell beginning `= + - @` tab or CR is evaluated by Excel and LibreOffice on
open. This affected the audit log, portfolio and template exports — all of
which carry operator-typed text — and had just been made worse by the v169
dismissal reasons landing in the audit log's detail column.

**Changed.** Guarded with a leading apostrophe on export, stripped again in
`ioCsvParse` on import, so the round-trip stays lossless and an apostrophe the
operator typed themselves is preserved.

---

## v187 — A cleared compliance hold stays cleared

**Fixed.** Clearing a GCA approval hold did not stick. Reopening the draft
raised an identical hold and forced the status back to Blocked, so a documented
approval had to be re-entered every time the form was touched.

`dashSyncCompliance` looked only for an **open** hold when deciding whether a
trigger was already covered:

    const has = rec.holds.some(h => h.k===k && !h.done && !h.sup);

Clearing a hold closes it. The next reconcile therefore found nothing open for a
trigger whose box was still ticked, and raised a fresh one — the check meant to
preserve the clearance was the thing discarding it. A trigger is now satisfied
by an open hold **or** one cleared with a recorded basis.

**Deliberately unchanged.** A hold superseded because its box was unticked does
not count as satisfied: ticking that box again is a new circumstance and a fresh
hold is correct. Reopening a cleared hold by hand still blocks. Clearing still
demands a documented basis — authority, date and reference — and an approval
hold still cannot be waved away by the status override.

**Note.** A documented clearance now survives the triggering box being unticked
and re-ticked. The approving authority does not evaporate because a checkbox was
toggled; if it genuinely no longer applies, reopen the hold or reset the
workflow.

**Rebased.** Written against v183 and re-applied to v186 after v184–v186 were
found on disk.

---

## v186 — Live Validation / Checklist actually fill the frame

**Fixed.** Reported directly: "live validation no longer spans the space it
did in previous versions." Confirmed on v184 as well as v185, so this
predates the v185 UX work rather than being caused by it — likely present
since the two-stacked-scrollers design was introduced.

`.panel-col` (the sticky sidebar holding the Live Validation and Checklist &
Templates panels) declared `max-height:calc(100vh - 32px)` but no `height`.
`max-height` only caps a box; it does not stretch one. With nothing forcing
it to the cap, the column hugged its own content instead — about 250px on a
typical screen — and each panel, a flex child with `flex:1 1 0`, had nothing
real to grow into, so both sat at their 120px `min-height` floor no matter
how much taller the viewport actually was. Verified live: on a 720px-tall
viewport the column was rendering at 250px against a 688px budget, each
panel pinned to 120px while holding 733–907px of actual content.

Added `height:calc(100vh - 32px)` alongside the existing `max-height` (kept
as a defensive cap, now redundant with height but harmless). Verified live:
the column now renders at the full 688px, and each panel gets 339px — still
scrolling independently within its own share, which was the point of the
two-stacked-scrollers design in the first place.

**Also fixed.** The comment above this rule described the intended mechanism
as "min-height:0 is what lets a flex child shrink and scroll" — but the
actual rule has always read `min-height:120px`, not `0`. The 120px floor
itself is fine (a deliberate minimum so a near-empty panel doesn't collapse
to a sliver, confirmed not to interfere with growth in this fix's live
check), so the code was not the mismatched part — the comment was, and it
has been rewritten to describe what is actually there.

**New assertion.** jsdom cannot lay out `calc(100vh - ...)`, so the test
checks what it can: that `.panel-col` has *some* declared height distinct
from `auto`, which is precisely what the bug's absence looked like.

---

## v185 — Dashboard density, discoverability, and two corrections to the v184 UX review

Implements the UX/UI recommendations from an external interface review of
v184's app chrome. Two of that review's four "hard evidence" visual findings
did not survive implementation-time verification and were dropped rather
than force-fit — recorded below so the record is honest about what was
actually wrong versus what looked wrong from one measurement.

**Corrected, not fixed.** The review flagged the "Validation & Checklist ▾"
toggle as unstyled (`border: 2px outset black`, the browser default). It was
measured at a 1280px viewport, where the toggle is `display:none` by design —
it is a small-screen-only control (`@media (max-width:1080px)`, comment "FIX
7 — collapsible validation sidebar"), and a `display:none` element's computed
border falls back to the UA default whether or not it is actually broken.
Re-checked at its real breakpoint: it renders in the app's navy/gold styling
exactly as intended. Nothing changed here.

**Corrected, not fixed.** The review also flagged one navy color doing five
jobs on a single draft card (Open/Copy/Notes/Revision all supposedly the same
blue). The CSS cascade for `#dashCards .dash-btn*` — accumulated across three
successive re-stylings of `.dash-btn-primary` still present in the sheet, only
the last of which (most specific, declared last) actually wins — already
resolves to three correctly distinct colors: primary blue for Open only,
steel-grey for standard actions, crimson for Delete. The example built to
demonstrate the finding used the wrong color for the demonstration, not a
color the running tool actually uses. Nothing changed here either.

**Added.** A "⋯" overflow menu on every draft card. Copy, Reset workflow,
Compare and the Draft-override checkbox move into it; Open, Notes, the spawn
buttons (Revision/Final) and Delete stay directly on the card. Every moved
control keeps its exact original `onclick`/`onchange` — this is placement
only, nothing about what any of them do changed. One menu per card, closes
on an outside click or when a different card's menu opens; reuses the same
toggle/outside-click shape already established for the Manage and Export
menus, generalized to handle more than one instance at once.

**Added.** A filter box at the top of the Manage menu (31 items across 5
sections, previously all flat). Typing narrows to matching actions and
collapses any section with nothing left in it; opening the menu always
starts from a cleared filter rather than wherever the last search left off.

**Added.** Multi-select on the dashboard — a checkbox per card, a header
"Select all" for whatever the current search/filter is showing, and a bar
with a count and **Export selected (.csv)**. Deliberately does not offer a
bulk status change: `dashSetStatus` carries real compliance logic (a
cancellation needs its own reason, a hold gate can trigger its own prompt),
and wrapping N of those into one bulk action would either fire N sequential
dialogs or silently thin out the audit trail a single-item change gets today.
Selection is scratch UI state — not persisted, cleared by nothing but an
explicit Clear or a deleted draft.

**Added.** A guidance search box on the form (top toolbar). Every field's
"▶ Instructions" panel is indexed by the text it actually contains; picking a
result opens that panel, switches the wizard to its step if needed, scrolls
to it, and briefly highlights it. Items 10 and 11 correctly never appear in
results — their guidance is inline tile text with no collapsible panel to
begin with, nothing to search into. Building this exposed a real bug in its
own first draft: grouped items (16, 17, 18) share one `.sec` container, and
finding a panel's label by searching that whole container for the first
`.ilabel` would have mislabelled all three as "16". Fixed before it shipped
by reading the immediately-preceding sibling instead — verified with a test
that specifically checks 16/17/18 don't collide.

**Added.** A visible hover/focus ring on every Item 10/11 tile — the whole
tile has driven its checkbox since v184's dead-zone fix; nothing about its
appearance said so until now.

---

## v184 — Attribute injection, one PDF text sanitiser, and a checkbox dead zone

Found by an external security/quality/UI review of v183 (two static-analysis
passes plus a live browser session that actually clicked the real form,
which is how the checkbox finding surfaced — every existing test drove the
tile, never the checkbox itself).

**Fixed — high.** `audView()` had its own local, weaker escape (missing `"`)
that a dismissal reason or an imported draft title could use to break out of
the `data-hay` attribute and run script directly inside the app window, no
popup or opener needed. It now calls the one shared `htmlEsc`. Four other
ad-hoc copies of the same weak escape (`tplPackPick`, `tplPackPreview`,
`ctPickContractType`, `ioPreview`) were aliased to `htmlEsc` too — none were
exploitable today, but each was a landmine for the next feature that reused
one of them in an attribute context, which is exactly how this one shipped.
New regression assertion targets attribute break-out specifically (dispatches
a real `mouseover` and checks no handler fires) — the existing injection
probes only covered tag injection, which is why this was missed.

**Fixed — high.** The flattened-PDF export and the XFA export silently used
two different text sanitisers for years: a looser top-level `sanitizePdfText`
and a second, WinAnsi-safe one declared inside the flat-PDF module that
shadowed it for that module's own callers only. An em-dash or ellipsis typed
in Item 13 printed correctly in the flattened PDF and as a plain hyphen / not
at all in the dynamic XFA PDF — for the same draft. There is now exactly one
definition; the module's local copy was deleted so every caller, inside the
module and out, resolves to it. New assertions: one confirms there is
exactly one declaration in the file (a source-text check that the identifier
merely *appears* cannot tell two same-named functions apart — this is how
the original divergence hid), one renders a sample through both writers and
diffs the result.

**Fixed — medium.** Every Item 10/11 (and Item 3) tile checkbox had a dead
click zone: a real mouse click landing on the small checkbox glyph itself did
nothing, because the browser's native default toggle fired first and the
tile's own `onclick` handler (`tglCb`/`tgl11`/`check10c`/`check10f`) then read
`.checked` and flipped it again, netting zero change with no feedback.
Clicking anywhere else on the same tile worked. `pointer-events:none` on the
checkbox (merged into its existing rule — a second rule with the identical
selector was silently ignored by the runtime cascade during testing, which is
its own small lesson) forces every click through the tile; `tabIndex=-1`,
applied once for all of them in `apply508()`, closes the same gap for
keyboard Space landing on a directly-focused checkbox. No jsdom test can
reproduce the actual browser default-action race (jsdom has no layout
engine), so the real assertion lives in `browser_smoke.js`, dispatching a
genuine `Input.dispatchMouseEvent` at the checkbox's own screen coordinates —
a scripted `.click()`, which is all every existing test used, never touches
this path either way.

**Hardened.** Manage → Reports → Clear Audit Log now asks the operator to
affirmatively confirm the CSV actually downloaded, as a separate step before
the typed `CLEAR` confirmation. `audExport()` cannot detect a cancelled
Save-As or a blocked download — no exception is thrown either way — so the
"export first, or nothing is cleared" guarantee from v183 was weaker than it
read: the log could still be destroyed after an export that silently didn't
happen. This doesn't close that gap in code (no client-side API can), but it
puts a real decision in front of the operator instead of a flag that cannot
detect the failure it exists to catch.

**Fixed.** The workspace-width drag handle had no movement threshold, so a
plain click (no drag) silently converted a named preset like "Reading" into
an unlabeled "Custom" width — `up()` unconditionally read back `--ws-max` and
stored it. A 4px movement floor now distinguishes a click from a drag.

**Changed (comment only).** `ctApplyWsToForm`'s comment claimed it "drives
the real controls" uniformly; text fields there are still plain `.value=`
with no dispatched event, safe today only because every caller re-runs
`run()` immediately after. Reworded so that stops being an invisible
assumption for whoever adds a text field with its own `oninput` side effect.

**Test-only.** Added a real-click regression for `check10c`'s auto-check of
10b (CNWDI requires Restricted Data) — the validation-rule test for the same
combination deliberately bypasses the tile to reach a state the tile itself
cannot produce, so the auto-check side effect had no coverage of its own.

**Not done.** `START_HERE.md`'s Open Items list claimed 12 Item 10/11 boxes
have no cross-item validation rule; four of them (11b, 11c, 11d, 11e) do.
Corrected in that file rather than here.

---

## v183 — Clearing the audit log

**Added.** Manage → Reports → **Clear Audit Log…**

**A copy is written first.** The CSV export runs before the confirmation is
offered, so the confirmation cannot be reached without a file having been
produced. If the export fails, nothing is cleared. Warning someone to take a
backup and trusting them to have done it is not the same as having one.

**The confirmation is typed, not clicked.** It names how many entries will go
and the dates they cover, so the decision is made against what is actually
about to be destroyed rather than against the word "clear". Anything other than
CLEAR leaves the log untouched.

**The cleared log is not empty.** One entry remains: who cleared it, when, how
many entries went and the period they spanned. The history is gone, the fact of
its removal is not — a custody record that can be emptied without trace is
weaker than one showing an acknowledged gap.

**The recovery journal goes with it.** Left in place, startup replay would merge
the cleared entries straight back in. The legacy localStorage copy is removed
in the same step.

**Drafts are untouched**, and there is an assertion for it.

---

## v182 — The stylesheets that never applied

**Fixed.** Three features shipped with their CSS inside a generated report's
template string instead of the document head, so none of it ever applied:

- v167's two-panel independent scrolling
- v180's lifted width cap for template editors
- v181's whole workspace scaling

All three inserted at `rindex('</head>')`. This file contains four `</head>`
tags; three belong to generated report documents, and the last one belongs to
the Contracting Officer Preparatory Package. The rules were inert text in a
JavaScript string — and were being injected into every CO package generated.
The document head is now located as the first `</head>` that is not inside a
`<script>` block.

**Fixed.** `wsApply` writes the width onto the wrapper element rather than
relying on an `!important` rule out-ranking the inline `max-width` the wrapper
is born with. That worked in principle but made the result depend on cascade
order across eight stylesheets, and could not be read back in the harness — so
nothing could prove the width had changed. Auto still clears the inline value
and hands control to the rule, which is what lets it widen while a template
editor is open.

**Fixed.** The drag handle sat at `right:-14px`, outside the wrapper, so at full
window width it fell off-screen. It is now inside the edge.

**Why the tests passed.** Every assertion searched the file for the rule text.
The text was present — in the wrong place. The new assertions read
`getComputedStyle` on real elements: the panel column is flex, the handle is
`col-resize`, and choosing a width changes the wrapper's computed `max-width`.
A source-text assertion cannot tell a live stylesheet from a string literal.

---

## v181 — Scalable workspace

**Added.** Settings gains **Workspace width** — Auto, Reading, Wide, Full
window — and a drag handle on the right edge of the workspace for any width in
between. Double-clicking the handle returns to Auto, so a drag is never a
one-way door. Auto is the default and keeps v180's behaviour: reading width
normally, full width while a template editor is open.

**Added.** **Text size** for the application chrome — 100, 110, 125, 150 per
cent. Applied with `zoom` rather than a font-size cascade, because several
hundred sizes in this file are inline pixel values a cascade cannot reach.

**Design.** One stored value, two controls. Presets store a keyword, dragging
stores a pixel count, and both go through `wsWidthSet`; `wsApply` is the only
reader. The panel reports a dragged width as *custom* rather than pretending a
preset is selected. An assertion fails if either control starts writing its own
copy.

**Deliberately excluded.** The DD-254 facsimile is never resized or zoomed, and
both are switched off for print. It is a reproduction of a printed form, and
scaling it would put what is on screen out of step with what comes out of the
printer. Assertions cover the form sheet and the print path separately.

**Guards.** A width below 760px is clamped rather than accepted; an
unrecognised stored value falls back to Auto; a text size outside 90–175 falls
back to 100.

**Fixed (test).** The assertion that the form sheet is never zoomed matched the
word `.fw` inside the comment explaining that very rule and ran on into the next
rule. It strips comments before scanning now.

---

## v180 — Template editors use the window

**Changed.** The whole dashboard was wrapped at `max-width:1100px`. That is a
reading measure and it suits cards, settings and guidance; it does not suit an
eight-column template editor, which was confined to 1100px however wide the
screen was. While a template editor is open the cap is lifted and the view uses
the window. Everything else keeps the measure that suits it.

**Why this rather than v179's fix.** v179 gave the address field a minimum
width so it could not be crushed. That treated the symptom — the field was
starved because the container was too narrow for its contents, not because the
field was defined badly. Both changes stand: the minimum stops any single field
collapsing, the lifted cap gives the row room in the first place.

**Behaviour.** The cap returns when the editor is left by any route. A failed
save keeps you on the editor and keeps the wide view with it — an editor
rendered back at reading width while still open is the layout this avoids.

**Fixed (test).** The v172 assertion that every editor save routes through one
writer extracted functions with a 400-character cap, so adding a comment to one
of them reported it missing. It now brace-matches. An assertion that fails for
a reason unrelated to what it checks is worse than no assertion.

---

## v179 — Template editor row layout

**Fixed.** The Performance/Sub editor's address field collapsed to a single
character per line. v178 added an Organisation input to a row that already held
eight fixed-width children; the row overflowed its container and the whole
shortfall came out of the address, which was its only flexible child. It now
holds a readable minimum width and the row wraps to a second line rather than
squeezing anything.

**Changed.** Both textareas in that row can be dragged wider as well as taller.
The global rule allows vertical resizing only, which is right for the form
itself but wrong for an address being edited beside seven other fields.

**Note.** The regression was mine, introduced in v178 and not visible in the
assertions, which tested behaviour rather than layout. The four added here test
the layout properties directly, so a future field added to this row fails a
test instead of crushing a neighbour.

---

## v178 — Multi-facility organisations

**Added.** Two ways to add performance locations in bulk. Paste a list of CAGE
codes — `1ABC5;2XY99;3QQ12` — or pick an organisation and get every facility
belonging to it. A large prime may hold dozens of CAGE codes on one DD-254, and
adding them one block at a time was the work this removes.

**Added.** An **Organisation** field on Performance/Sub templates. Selecting an
organisation resolves to every template carrying that name, so there is no
second list of which CAGE belongs to whom. It is also a CSV column, so fifty
facilities can be tagged in one upload rather than typed.

**Design.** Both entry points reduce to one list of codes handed to
`perfExpand`; the organisation picker is only a different way of producing that
list. An assertion fails if either route stops going through it.

**Behaviour.** A known CAGE fills location, CSO, FSO e-mail and classified
mailing address from its template. A code that is not in the templates still
gets a block carrying the code, left visible rather than dropped. Duplicates —
within the paste or already on the form — are skipped and named in the result.

**Fixed.** Performance blocks were never validated. A block holding a CAGE and
nothing else exported as an empty Item 8 row, which mattered little when blocks
were added one at a time and typed into immediately; bulk expansion makes it
easy to create twenty at once. A block with a CAGE but no name or address is
now an error, and one with no cognizant security office a warning. A block with
nothing in it at all is left alone as work in progress.

**Fixed.** `tplPerfUpsert` and the harvest path both replace a stored facility
wholesale, so saving a location back to templates would have silently dropped
its organisation tag. The tag is now inherited the same way the label is.

**Measured, not assumed.** No cap exists anywhere and none was added: the
dynamic XFA form grows its Item 8 rows, and fifty blocks cost about 18 ms of
extra validation per keystroke in jsdom, on a 23 ms baseline. Fifty blocks add
roughly 2.4 KB to a draft.

**Note.** Splitting accepts commas, whitespace and newlines as well as
semicolons, so a column copied out of a spreadsheet pastes straight in.

---

## v177 — Task order templates

**Added.** DD-254 Template Language templates carry a **prime contract** and a
**task order** number. Where a task order has its own DD-254, the template is
named for the task order — which is how someone looks for it — and the numbers
live in fields rather than being read back out of the name.

**Behaviour.** Applying such a template fills the task order field and ticks
the standalone box, so the exported Block 2a reads
`prime | Task Order number`. The prime contract is written to Item 2a **only
when the draft has none**: a template must not quietly replace a contract
number on a form somebody has already started. The check is made against the
workspace being written when there is one, and against the live field when the
template is applied straight to the open form; both cases are asserted.

**Design.** The standalone tick is derived from the task order rather than
stored as its own flag. A template carrying a task order but claiming not to be
standalone would be a contradiction the editor could not display and nobody
could resolve.

**Scope.** Fields appear in the DD-254 Template Language editor only. They ride
in template packs automatically and are offered as CSV columns for round-trip.

**Rebased.** This work was first written against v173 and re-applied to v176
after v174–v176 were found on disk. See the note under v175.

---

## v176 — Fictional phone number in a comment

**Changed.** A real telephone number used as an illustration in a comment about
Item 16e field-width truncation was replaced with a reserved fictional number.
Single comment edit; no behaviour change and no functional difference in the
application script.

*Reconstructed by diff — this entry was written after the fact by comparing
v175 and v176, not recorded when the version shipped.*

---

## v175 — pdf-lib attribution

**Changed.** The pdf-lib block gained a proper MIT attribution header — library
name, version 1.17.1, copyright, author, upstream URL, and why it is embedded
rather than linked. The application script is byte-identical to v174.

**Consequence for review.** The header sits *inside* the pdf-lib `<script>`
block, so the vendored component hash in `rebuild_kit/manifest.json` changed:

| | `01_pdflib.js` sha256 | chars |
|---|---|---|
| v174 and earlier | `5bde366c8a218163` | 525,075 |
| v175 onward | `1cd7d1f51f15de48` | 525,598 |

The library itself is unchanged. This trips the standing rule that a moving
vendored hash means stop and report, so it is recorded here deliberately.
Moving the attribution outside the block would keep the vendored hash provably
equal to upstream; that has not been done.

*Reconstructed by diff — this entry was written after the fact by comparing
v174 and v175, not recorded when the version shipped.*

---

## v174 — Durable templates, safe findings and one official PDF path

**Fixed.** Template editors no longer report *Saved* when only the in-memory
cache changed. The status advances only after IndexedDB confirms the
transaction. A failed write stays visibly unsaved, and the newest library value
is first staged in a synchronous local recovery journal. Startup replays that
journal before clearing it, so closing or crashing during a pending write does
not silently discard the edit.

**Hardened.** Live validation errors and warnings are built with text nodes
instead of interpolated HTML. Operator-controlled phone text and inherited
draft titles are therefore displayed literally and cannot create elements or
event handlers in the application page. Dismissed findings use the same safe
rendering basis.

**Changed.** The flattened/static PDF button was retired. The dynamic XFA DD
Form 254 is now the sole user-facing official-form PDF export. The embedded
flat form and its builder remain internal so the security review split/rebuild
kit keeps its established component layout and the regression suite can still
detect mapping drift; there is no UI route to that builder.

**Testing.** The suite now waits for actual template transactions, exercises
write failure and recovery-journal replay, injects markup probes into both
validation sources, verifies only one official PDF button exists, and builds
the actual dynamic XFA PDF bytes. The real-browser smoke test also verifies a
durable template readback and the dynamic-only export surface.

**Block 2a note.** The dynamic form stores the complete combined contract/task
order value in its XFA data packet. Its official `two_Prime` field is a fixed
91.44 mm-wide, single-line text field with horizontal scrolling disabled and
no maximum-character or auto-fit rule in the template. The data is retained,
but a sufficiently long combined value can be visually clipped by the PDF
viewer. Retiring the static export removes that output's known overflow path;
it does not alter the official XFA field geometry.

---

## v173 — Standalone DD-254 for a task order

**Added.** A checkbox beside the task order field: *This is a standalone DD
Form 254 for the task order above*. When ticked, the exported Block 2a reads

    N00178-24-D-1234 | Task Order 0007

**Design.** The combined value is composed once, in `collect254Data`. Both the
flattened PDF and the XFA packet take their values from that one object, so the
two exports cannot disagree about the field a GCA reads to identify the
contract. An assertion fails if the composition ever appears in more than one
place.

**Deliberately unchanged.** The 2a field itself keeps the bare contract number.
The FAR 4.1603 seventeen-character check reads the field directly, so a
combined value — which will always exceed seventeen characters — never trips
it, with no suppression or special-casing needed. `dd254ExportName` also reads
the field directly, so filenames are unaffected; the task order is already
separately selectable there. The Item 13 `This is in support of effort …`
reference still appears, as requested.

**Testing.** The printed value is read back out of a generated flattened PDF
rather than inferred from the data object that produced it — possible only
because v171 added PDF content extraction.

**Note.** The structure is a deliberate departure from the form's convention
for Block 2a, made with the rules understood.

---

## v172 — Saving template work

**Added.** A **Save now** button and a live state line — *Unsaved changes* /
*Saved 14:32* — in every template editor. All eight kinds (facility, CSO,
performance/sub, certifier, contract type, DD-254 language, standard language,
security managers) share one code path, so none can behave differently.

**Changed.** Every save in the editor now goes through one writer,
`dashTplFlush`. Done, Save now, switching kinds and leaving the editor all call
it, so the state line cannot claim something the store did not do. An assertion
fails if any of those routes starts bypassing it.

**Fixed.** Leaving the editor relied on the 600ms autosave timer still firing.
Opening Settings or opening a draft tore the view down without flushing, and
closing the browser inside that window lost the last keystrokes. Those routes
now flush first, and closing with a write pending flushes and then warns.

**Note.** The autosave already existed; what was missing was any statement that
it had happened. The change is as much about being able to trust the editor as
about persistence.

**Not done.** The state line reports the last write by this tab. It does not
detect a second tab editing the same library — the existing single-tab lock
covers that case separately.

---

## v171 — Item 13 cleanup, durable history and hardened exports

**Fixed.** In Sections per item mode, unchecking an Item 10/11 tile now removes
that item's populated `Reference NNx:` paragraph from the underlying Item 13 in
both layouts. A visible *Put back* action restores the checkbox and the exact
wording. Loading or resetting a draft resets the transition tracker so opening
an existing form cannot be mistaken for an operator uncheck.

**Changed.** The audit history now has its own `audit` object store in the
`dd254_dashboard` database. Each event receives a unique id, is synchronously
journaled before the IndexedDB transaction, and leaves the recovery journal in
place if the write fails. Startup merges and de-duplicates the dedicated store,
the v169/v170 mistaken template-store location, legacy localStorage and the
recovery journal before removing obsolete copies. The 100,000-entry ceiling is
exact and records the span that was trimmed.

**Fixed.** A formula-like CSV value that legitimately begins with one or more
operator-entered apostrophes now round-trips exactly. Import removes only the
single guard added by export.

**Hardened.** Generated worksheet, CO package and notes HTML now encode every
operator-controlled value, declare a restrictive report CSP, and open from a
Blob URL through a `noopener noreferrer` anchor. The previous
`about:blank`/`document.write` path could give generated content a live handle
back into the draft database. Dismissal keys also moved from a collision-prone
32-bit hash to an exact UTF-16 key while still recognizing old keys.

**Testing.** The suite now extracts representative Blocks 2a, 6a and 13 values
from the actual flattened PDF instead of proving only that bytes were emitted.
A dependency-free Chrome/Edge smoke test clicks the real Settings controls and
Item 10f tile, then verifies removal and one-click undo in the browser engine.

---

## Tooling changes in the same period

Not versioned with the build, but changed alongside it.

- `split.py` defaulted to `DD254_Interactive_v149.HTM` and had to be remembered
  as a separate step; `manifest.json` drifted three versions stale, so the
  documented verification procedure failed on the authentic file. It now
  discovers the newest build.
- Both scripts sorted builds lexically. `sorted(['v99','v168'])[-1]` returns
  `v99`. Now sorted on the extracted version number, in one place.
- `BUILD_FACTS.md` and `manifest.json` published **different SHA-256 values for
  the same vendored pdf-lib** — one hashed the trimmed block, the other did
  not. Standardised on untrimmed, because that basis is load-bearing for the
  byte-identical rebuild.
- `make_build_facts.py` is now the single entry point: it regenerates
  `BUILD_FACTS.md` and refreshes `manifest.json` from one read of one file.
- The v171 verification exposed a Windows-only round-trip defect in
  `rebuild.py`: text-mode output rewrote the reconstructed byte stream even
  though every part hash was unchanged. The final HTML is now UTF-8 encoded
  once and written in binary mode. The manifest did not move; the authentic
  v171 build now rebuilds byte-identically on Windows.

---

## What was not done

- **v171 is live-browser verified**, but the deleted intermediate artifacts
  v162–v169 were not opened one by one. v171 exercises the current Settings and
  Item 13 paths that supersede them.
- **Generated report pop-ups were security-tested as documents and openers,**
  but were not each manually printed from a visible browser session.
- **The Item 16/17 asterisks** remain in the markup with nothing validating
  them.
- **Advisory findings do not replace blocking validation.** v188 adds broader
  Item 10 and 11 cross-checks, but intentionally leaves them informational
  until the cited rule, local facts and desired enforcement are separately
  approved.
- **The v188 demo is a training build.** Its demo-only helpers are not present
  in the official file and do not change the DD Form 254 output.
- **A reference finding can be set aside with an audited reason** when guidance
  legitimately mentions an unchecked sibling Item. No blanket exception was
  added that would hide a real reverse-reference error.
- **The revision-diff report** discussed after v170 was scoped but not built.
  `dashCompare` already diffs a draft against its parent on screen; what is
  missing is an export, a whole-chain view, human-readable field labels, and
  section-level Item 13 diffing.
