# DD-254 Interactive — 30-minute demonstration

**Build:** `DD254_Interactive_v189_DEMO.HTM`
**Audience:** FSOs and security staff who will use the tool
**Written for:** someone who has not rehearsed. Every step names the control to
click and what to say while clicking it.

*Supersedes `DEMO_SCRIPT_v188.md`. The browser now stops at Item 17g; Item 17h
Signature and 17i Date Signed are completed in the generated dynamic PDF.*

---

## Before you start

Open `DD254_Interactive_v189_DEMO.HTM` by double-clicking it. There is nothing
to install and no server to reach. A dark red banner across the top says
**DEMONSTRATION BUILD — fictitious template data**; leave it visible.

Every company, contract number, address and person in this build is invented.
Say that once, early, so nobody spends the session wondering whose data it is.

If you have demoed on this machine before, the templates are already seeded and
your previous drafts are still listed. For a clean start use a private window —
the tool keeps everything in that browser profile.

**The five things worth landing.** If you only get halfway, get these across:

1. It runs from a file. No install, no network, no server.
2. It knows the rules, shows the authority beside them, and catches what a
   reviewer would send back.
3. Templates mean you type a facility once, not every time.
4. It keeps a record of what happened and who did it.
5. The official PDF it produces is the real form.

---

## 1 · What this is (2 min)

**Say:** A single HTML file, running in the browser from the file itself. No
install, no network, nothing to stand up. Everything stays in this browser on
this machine — which is also why backups matter, and we will come to those.

**Do:** Point at the dashboard. Note **＋ New Solicitation** and **＋ Original
(no solicitation)**.

**Say:** The distinction matters later. A solicitation-stage form becomes a
contract-stage form at award, and the tool tracks that lineage rather than
making you remember it.

---

## 2 · The templates (5 min)

The part that saves the most time. Do it before anything else.

**Do:** **Manage ▾**. Before opening anything, point at the filter box at the
top — **🔎 Filter actions…**

**Say:** There are thirty-one actions in this menu. Type what you want rather
than hunting for it.

**Do:** Type `fac` and click **🏢 Facility**.

**Say:** Four facilities, each with its 6a address block, 6b CAGE and FSO
e-mail. Type a facility once; every DD-254 that involves it pulls from here.

**Do:** Note the **🔎 Filter facility templates by CAGE code…** box inside the
editor, then move through the other libraries briefly:

| Menu item | What to say |
|---|---|
| 🏛 CSO | Cognizant security offices with address and phone, linked from facilities so a change follows through. |
| 📍 Performance/Sub | Item 7 and 8 locations. Note the **Organisation** column — Aurora Group, Calder Holdings. Come back to this. |
| ✍ Certifier | Who signs Item 17, with title, address, CAGE and phone. |
| 📄 Contract Type | Whole starting points — CPFF Research, FFP Services, IDIQ Task Order, Subcontract flow-down. |
| 📝 DD-254 Template Language | Per-item Block 13 wording, with source date, assigned security manager, and prime contract / task order. |
| 📑 Standard Language | Your recurring Block 13 paragraphs. |
| 🛡 Security Managers | Names, e-mails and programmes. |

**Say while in an editor:** Everything saves as you go. The line beside **💾
Save now** reads *Unsaved changes* while you type and *Saved* with the time once
written. You never have to wonder whether it stuck.

**Do:** **✓ Done**.

---

## 3 · Finding things (2 min)

*New since the last demo — worth its own moment.*

**Do:** Start a form (**＋ New Solicitation**), then use **🔎 Search field
guidance…** in the toolbar. Type something like `courier` or `NATO`.

**Say:** Every field in this form carries the guidance for that box. Rather than
scrolling for the item that covers a situation, describe the situation. Picking
a result opens that field's instructions and, in step mode, jumps to its step.

---

## 4 · Starting a form (4 min)

**Say:** The form reads the way the printed DD Form 254 reads. On the right,
**Live Validation** on top and **Checklist & Templates** below, each scrolling
independently so a long template list never pushes your errors off screen.

**Do:** Set Item 1a FCL to **SECRET** and 1b safeguarding to **SECRET**. Watch
the right panel clear as you satisfy it.

**Do:** Item 2a — `HQ0034-25-D-0101`.

**Do:** Item 6a — insert **Aurora Dynamics** from the facility picker.

**Say:** Address, CAGE and cognizant security office arrive together, because
they were entered once.

---

## 5 · Multi-facility work (4 min)

Lands hard with anyone supporting a large prime.

**Do:** Item 8 → **Add several at once**. Type `7AUR1;3MER5;9CAL2` → **Add by
CAGE**.

**Say:** Three performance locations with name, address, cognizant security
office and FSO e-mail, from three CAGE codes. Paste a spreadsheet column
straight in — semicolons, commas and line breaks all work.

**Do:** Choose **Aurora Group (demo)** → **Add organisation**.

**Say:** A large prime may hold dozens of CAGE codes on one DD-254. Tag them
once and they come in together. It reports what it added, what it skipped as
already present, and anything it did not recognise.

**Do:** Add a made-up code such as `1ZZZ9`.

**Say:** A code it has never seen still gets a block carrying the code, and
validation flags it as incomplete. It will not quietly drop what you asked for,
and it will not let an empty location through either.

---

## 6 · Items 10 and 11, with advisory cross-checks (5 min)

**Do:** Tick **10a** and **11c**. Point at the hover ring as you move across the
tiles.

**Say:** Ticking marks the form and tells the tool what Item 13 must now
address — see *Required Item 13 Entries* appear on the right.

**Do:** Tick **11l** (CUI).

**Say:** This is where it earns its keep. It knows which combinations conflict,
which need a matching Item 13 narrative, and which are prohibited together —
the findings that otherwise come back from the GCA weeks later.

**Do:** Point at a red REQUIRED / amber RECOMMENDED line under a ticked item.

**Say:** The guidance sits next to the decision, not in a separate handbook.
Every conditional alert now carries its authority or reference on the last
line, so the reviewer can see where the rule came from.

**Do:** With Item 1a still at **SECRET**, temporarily tick **10e(1) SCI**. Open
the **Access Eligibility Advisor** below Item 10 and point to the potential
contradiction: SCI requires Top Secret while Item 1a says Secret. Point to the
authority line beneath the finding, then untick 10e(1).

**Say:** This is deliberately advisory. It compares Items 1a, 1b, 10 and 11
with a NISS verification snapshot and the cited authorities. It does not add a
validation error, change status, block issuance or alter the exported form.
The FSO still verifies the actual eligibility and safeguarding in NISS.

**Do:** Open the **Item 11 Performance Advisor** beneath Item 11. With 11c
selected, point to the request to document the security classification guide.

**Say:** Item 11 has its own cross-check. It asks for the evidence behind each
selected performance block and checks relationships to Items 1, 8, 10, 13, 14
and 18. These findings are also advisory only.

---

## 7 · Item 13 — two ways to work (5 min)

**Do:** **Manage ▾ → ⚙ Settings → Item 13 layout → ▥ Sections per item**, then
back to the form.

**Say:** Some people want one long block, others want each item's language in
its own labelled box. A preference, not a different file — both write the same
Item 13, and the full text stays visible underneath throughout.

**Do:** In the **10a** box, **⬇ Insert template language**. Edit it slightly,
then **💾 Save to template**.

**Say:** Improve the wording once, on the form, and push it back so the next
person gets the better version. It asks before replacing anything already
there — these templates travel between colleagues.

**Do:** Untick **11c**.

**Say:** Its Item 13 language goes with it, with a **Put back** if that was not
what you meant. An unchecked item should not leave language behind referring
to it.

**Do:** Insert a **Standard Language** entry from the right panel.

**Say:** Recurring paragraphs your office puts on every form, landing above your
item-specific language in a consistent order.

---

## 8 · The CUI designation block (3 min)

**Do:** Item 18 → **CUI Designation Block**. Set Controlled By, a CUI Category,
**Distribution Statement C**, then tick **NOFORN** and **FEDCON**. Hover one.

**Say:** Hovering gives the full definition, so you choose against the control
rather than the acronym. Tick more than one and it alphabetises and joins them
the way CUI marking guidance requires.

**Do:** Tick **REL TO**, enter `GBR, AUS`.

**Say:** Some controls carry a country list. It knows which, and asks only for
those.

**Do:** Scroll to the bottom of Item 13.

**Say:** The block is written at the very bottom, after five blank rows, in the
standard order. Clear the fields and it removes itself cleanly.

---

## 9 · Task orders with their own DD-254 (2 min)

**Do:** Item 2 → **Task Order / BPA / Other Effort Number** = `0042`, then tick
**This is a standalone DD Form 254 for the task order above**.

**Say:** The exported Block 2a reads `HQ0034-25-D-0101 | Task Order 0042`. The
field keeps the bare contract number, so the length check and the file name are
unaffected — and Item 13 gets its reference line at the top.

---

## 10 · Exporting (3 min)

**Do:** **Export Official DD-254 (PDF)**.

**Say:** The actual government form, filled in. It is the dynamic form, so Item
8 grows to fit however many performance locations you added. There is no limit.
Item 17h Signature and 17i Date Signed are intentionally completed here in the
dynamic PDF, not on the browser drafting screen.

**Do:** **More exports ▾** → show **📋 DD-254 Preparer's Worksheet** and the CO
package.

**Say:** The worksheet is for you — what is outstanding. The CO package is for
the contracting officer, listing what they must verify. Neither is the official
form and both say so on their face.

**Say if asked about errors:** Exporting with errors outstanding asks first and
marks the result DRAFT — watermarked, not for signature.

---

## 11 · Workflow, holds and the record (5 min)

**Do:** Return to the dashboard. Point at a card's **⋯** menu.

**Say:** Copy, Reset workflow, Compare and the status override live here, so the
card stays readable. Open is still one click.

**Do:** Tick the checkboxes on two cards.

**Say:** Select several and export just those — useful when someone asks for the
forms on one programme rather than the whole portfolio.

**Do:** **Compare** on a revision.

**Say:** Revisions know what they came from. Compare shows what changed against
the parent, field by field.

**Do:** On a form with **10f** ticked, show the compliance hold, then clear it —
choose a basis and enter a reference.

**Say:** Some boxes require an approval before issue. The tool raises a hold and
the form cannot leave Draft until it is answered — and answering it means
recording the authority, date and reference, not clicking OK. Once cleared it
stays cleared; reopening the form does not raise it again.

**Do:** **Manage ▾ → 🧾 Audit Log**.

**Say:** Every meaningful action — created, edited, issued, cancelled, deleted,
and any validation flag set aside with its reason. This is the chain of custody,
and it lives with the drafts.

**Do:** Show **🧹 Clear Audit Log…** without confirming.

**Say:** It can be cleared, but it exports a copy first, makes you type CLEAR,
and leaves one entry recording that it happened. A log you can empty without
trace is not worth keeping.

**Do:** **Manage ▾ → 💾 Full Backup (.json)**.

**Say:** The one habit to build. Everything lives in this browser profile. The
backup is checksummed and the restore refuses a file that has been truncated or
altered.

---

## 12 · Making it yours (2 min)

**Do:** **Manage ▾ → ⚙ Settings**. Walk the rows:

- **Appearance** — light or dark.
- **Workspace width** — Reading, Wide, Full window, or drag the handle at the
  right edge.
- **Text size** — scales the application, not the form, so what you see still
  matches what prints.
- **Item 13 layout** and **Form layout** — as shown earlier.
- **Backup reminder** — how many changes before it nags.
- **Filename contents** — which boxes name your exported files, and in what
  order. File by contract number or by CAGE, whichever your office uses.

**Say:** Per person. Two people can share templates and still work their own way.

---

## Closing (1 min)

**Say:** It runs from a file, it knows the rules, you type a facility once, it
keeps a record of what happened, and what comes out is the real form. Remember
the backup, because everything lives in this browser.

---

## Questions you should expect

**"Where does the data go?"** Nowhere. It stays in this browser profile on this
machine. There is no network call in the file.

**"Is it approved?"** Answer for your organisation. About the tool itself: it
ships with a rebuild kit that splits it into parts and rebuilds it byte-for-byte,
so a reviewer can verify the file is exactly what it claims. Around seventy per
cent of it is the government's own form and an open-source PDF library, both
carried inline so it works with no network.

**"What if two of us edit at once?"** A single-tab lock; other tabs drop to
read-only rather than two copies fighting.

**"How many can it hold?"** Thousands. Drafts live in the browser's database,
not the small five-megabyte store. A typical form is about ten kilobytes.

**"What if it gets a rule wrong?"** Blocking validation findings can be set
aside with a written reason recorded against that form. They stop blocking,
stay visible, and can be put back; they cannot clear a compliance hold. The
Access Eligibility and Item 11 Performance Advisor findings never block in the
first place and always show the authority used for the comparison.

**"Can I import what we already have?"** Yes — libraries import and export as
CSV or Excel, and whole template packs move between colleagues as one file.

---

## If something goes wrong mid-demo

- **An unintended validation error** — use it. Show that it names the item,
  says what to do, and gives the reference underneath.
- **You cannot find a control** — **Manage ▾**, and type in the filter box.
- **The form looks cramped** — Settings → Workspace width → Full window.
- **Starting over** — private window, or delete the demo drafts. Templates
  re-seed only when empty.
