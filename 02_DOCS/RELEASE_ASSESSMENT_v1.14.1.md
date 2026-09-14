# Codex Astra v1.14.1 — trust patch

14 September 2026. Internal Tool v2.127. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | What was wrong | Safeguard now |
| --- | --- | --- |
| Release name in the header | v1.14.0 displayed "Codex Astra v1.12.0" | Rendered from `RELEASE_VERSION`; `check_manifest.py` fails a build whose filename, constant, title or literal release strings disagree; the browser smoke test reads the rendered header |
| Item 14 and 15 titles in exports | Worksheet and CO Package called Item 14 "Gov't Approval Required" and Item 15 "Supplemental Information" | Titles are read from the form's own item labels |
| CO Package signature block | A document marked not official carried signature and date lines, including subcontractor lines under the Item 6 prime's name | No signature lines; the package directs the signer to Item 17h/17i on the dynamic PDF and, for a SAP subcontract, names the Item 7 subcontractor |
| SAP subcontract in the CO Package | Recognised from Item 2b only | Recognised from Item 2b or 7a, matching the rest of the tool since v1.13.0; a 7a-only form is no longer summarised as a prime form |
| Demonstration seed authorities | CUI attributed to 32 CFR Part 117; a destruction certificate required for all classified material; a named visit system | Each citation verified against the approved library; a regression test rejects any unlisted citation in the seed |
| Drafts from earlier versions | Log entries, attached files and supporting records were dropped on the first save with no notice | A notice lists the material and offers Export, then open / Open without exporting / Cancel; the choice is audited |
| Card counts after an update | Snapshots from the previous rules until someone ran Recount | Drafts counted under another tool version are recounted once on load, without changing status or workspace |
| Recount writes | A recount wrote back the record it read at the start | Each record is re-read before its counts are patched, so dashboard changes made during a recount survive |

## Why

The roadmap review of v1.14.0 found each of these by reading the shipped build
and the live demonstration. They share a cause with most earlier defects: a
second, hand-maintained copy of something the tool already knows — the release
name, an item title, the SAP-subcontract test — or a behaviour documented only
in release notes. The fixes derive the value from its single source, or put the
consequence on screen at the moment it happens.

The demonstration seed is fictional contract language, but its citations are
real. A reviewer uses the demo to judge whether the tool gets the rules right,
so a wrong authority there costs the same trust as a wrong authority in a rule.
The corrected locators are 32 CFR 117.7(h)(1)(iii), 117.13(d)(5),
117.15(e)(2)(vii), 117.16(a)(4) and 117.21(c)(3), and 32 CFR Part 2002, each read
in the approved library on 14 September 2026.

## Verification and limits

The regression log for this exact build is recorded in `TEST_RESULT.txt`; counts
and hashes are in `BUILD_FACTS.md`. The new tests were also run against the
v1.14.0 build with its original seed: every earlier test still passed there and
18 of the 19 new tests failed, confirming they can fail. The one that passed
checks that the notice does not return after a draft has been saved — behaviour
v1.14.0 shares, since it never shows the notice — so it guards against a repeat
prompt rather than detecting the defect.

- The legacy-material notice is driven through `dashOpen` with the real stored
  record: Cancel leaves the record unchanged; Export writes the stored workspace
  verbatim, including attachment bytes; declining the download question leaves
  the draft unopened; the notice does not return once the draft has been saved.
- The automatic recount is tested for unchanged status, notes, issue date and
  earlier-version material; for running once; for skipping read-only tabs and an
  open draft; for not marking a stamp-only write as a change since backup; and
  for not overwriting a record changed while it ran.
- The three-way dialog focuses its non-destructive primary action, and Escape
  resolves as Cancel.

Limits: the automatic recount runs when the tool loads, not after a backup is
restored mid-session. The exported earlier-version file contains whatever that
draft held, including any attached file bytes, and inherits the handling limits
in the security fact sheet. No new legal rule, classification decision, service,
account, network call or storage medium is introduced.
