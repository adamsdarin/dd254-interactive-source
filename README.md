# DD‑254 Interactive — Codex Astra v1.15.3

A single HTML file that helps a Facility Security Officer prepare a
**DD Form 254, DoD Contract Security Classification Specification**.

It runs entirely in your browser. There is no server, no install, no build step
and no network traffic. Download one file, open it, work offline.

> **Not affiliated with, endorsed by, or approved by DCSA, DoD, or any U.S.
> Government agency.** This is a private, personal project. Nothing it produces
> is authoritative. Verify every classification determination against
> 32 CFR Part 117 (NISPOM), your contract, and your Government Contracting
> Activity before relying on it. See [Intended use](#intended-use) below before
> entering real contract data.

---

## Get it

| | |
|---|---|
| **Try it now** | *(demo build — fictitious data, nothing real)* → `https://adamsdarin.github.io/dd254-interactive/` — the exact v1.15.3 demo build, covered by the release's signed provenance |
| **Download** | [Releases](https://github.com/adamsdarin/dd254-interactive-source/releases/latest) → `DD254_Interactive_v1.15.3.HTM` |
| **Read the code** | [`01_TOOL/`](01_TOOL/) |
| **Verify it yourself** | [VERIFY.md](VERIFY.md) |

### Running it

1. Download `DD254_Interactive_v1.15.3.HTM` from the latest release.
2. Double‑click it, or open it in Chrome or Edge.
3. That's it.

Your browser may warn about an unrecognised download, and many corporate mail
gateways strip `.HTM` attachments outright. Both are the file type's
reputation, not a signal about this file. If you want to satisfy yourself
before opening it, [VERIFY.md](VERIFY.md) tells you how — and the demo build
above lets you drive the whole tool without downloading anything.

### Where your data goes

Nowhere. Work is saved in your browser's local IndexedDB store, on your
machine. There is no telemetry, no analytics, no remote call of any kind. The
tool functions with the network cable pulled, which is the easiest way to
confirm this for yourself.

---

## Intended use

This tool is a **drafting aid**. It is useful for laying out a DD‑254,
catching internal inconsistencies, and producing a clean PDF. It is not a
compliance authority and it does not make classification determinations.

**On real contract data:** the tool stores what you type in your own browser
on your own machine. Whether that is an appropriate place for a given DD‑254
is a question for your organisation's security policy and your GCA — not one
this README can answer for you. If you are unsure, use the demo build, or
enter placeholder values and transcribe.

**This tool is not accredited for classified processing of any kind.**

---

## What is actually in the file

The shipped `.HTM` is large — the great majority of it is not code anyone
wrote for this project. See [`BUILD_FACTS.md`](BUILD_FACTS.md) for the current
figures, which are generated, never hand‑typed.

| Component | What it is |
|---|---|
| `pdf-lib` 1.17.1 | Third‑party PDF library, MIT. Embedded rather than linked so the tool works from `file://` with no network. Byte‑identical to the published npm release — [provable](VERIFY.md#2-the-pdf-lib-block). |
| DD Form 254, dynamic XFA | The official form, base64‑encoded, used to produce the real PDF output. |
| DD Form 254, flat | A flat page rendering of the form. **Provenance under review** — see [VERIFY.md](VERIFY.md#3-the-two-embedded-forms). |
| **Application code, markup, CSS** | **The part written for this project. This is what a reviewer should read.** |

If you are here to review the code, read
[`01_TOOL/rebuild_kit/`](01_TOOL/rebuild_kit/) first. It splits the single
file into those four parts so you only have to read the one that is ours.

---

## For reviewers

- **[VERIFY.md](VERIFY.md)** — reproduce every hash and confirm the
  third‑party blobs are what they claim to be. Should take under ten minutes.
- **[SECURITY.md](SECURITY.md)** — how to report something.
- **[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)** — licences carried through.
- **[`01_TOOL/CHANGELOG.md`](01_TOOL/CHANGELOG.md)** — what changed in each version and why.
- **[`01_TOOL/RUN_TESTS.md`](01_TOOL/RUN_TESTS.md)** — running the regression suite yourself.

Every push runs the full regression suite, syntax‑checks every `<script>`
block, and re‑derives the component hashes to confirm the committed manifest
still describes the committed build. Every release repeats those checks before
publishing and attaches a **signed build provenance attestation** covering both
HTML files — verify it with `gh attestation verify` as [VERIFY.md](VERIFY.md)
describes — plus `rebuild_kit.tar.gz`, whose parts reassemble into the exact
released file. Because the demo build is one of the attested files, the live demo
can be checked against it too. The logs are public.

---

## What changed in v1.15.3

- **Sensitive-terms screen.** Keep a list of unclassified program nicknames or
  other words that must not appear on the form. Items 9 and 13 are checked and a
  match raises a warning. The list is stored only as one-way fingerprints, so it
  cannot be read, exported or backed up, and warnings never repeat the term.

## What changed in v1.15.2

- **Security Classification Guides library.** Keep each guide's unclassified
  title, identifier, date, issuing office, distribution statement and delivery
  once. *Cite* adds a consistent citation line to Item 13, cited guides are named
  in the attachment reminder, and a draft still citing an older date of a guide
  gets a warning and a one-click *Update citation*.

## What changed in v1.15.1

- **Import a received DD 254 as template language.** On the DD‑254 Template
  Language page, *Import received DD 254 (PDF)* reads a fillable DD Form 254 and
  creates one template entry from its Items 10–16 and 18, its marking and its
  Item 3 source. It creates nothing else — no draft, no dashboard card — and does
  not keep the PDF. Flattened or scanned PDFs, encrypted PDFs and forms marked
  above CUI are refused with the reason.

## What changed in v1.15.0

Three dashboard changes for finding and re-issuing DD‑254s faster.

- **Cards show every contract number the form carries.** Item 2a appears as
  *Prime*, Item 2b as *Subcontract* and Item 2c as *Solicitation*, beside the
  contractor and subcontractor CAGE.
- **Search in any order.** Type the requestor, the subcontractor CAGE and the
  prime number in whatever order you have them; every word must match the same
  DD‑254. Quotes match an exact phrase, and contract numbers match with or
  without hyphens.
- **A new issuance re-confirms NISS.** Spawning an Original, Revision or Final
  no longer carries the parent's NISS verification; the new card shows
  *NISS re-confirm* until it is verified again. Copy is unchanged.

## What changed in v1.14.1

A trust patch. Nothing about how a DD Form 254 is validated, held or exported
changed; each fix is a place where the tool said something wrong or lost
something without saying so.

- **The header names the right release.** v1.14.0 displayed v1.12.0. The name
  now comes from one constant, and release verification fails if the filename,
  title or header disagree.
- **Exports name Items 14 and 15 correctly** — Additional Security Requirements
  and Inspections — by reading the titles from the form.
- **The Contracting Officer Package has no signature lines.** It is a review aid;
  it now points the signer to Items 17h and 17i on the dynamic PDF. It also
  recognises a SAP subcontract named only in Item 7a.
- **The demonstration's citations are verified.** It had attributed CUI to
  32 CFR Part 117; every citation in the demo seed now carries a locator checked
  against the source.
- **Older drafts warn before losing material.** A draft from an earlier version
  that still holds log entries, attachments or supporting records says so when
  opened and offers to export them first.
- **Validation counts refresh after an update** without Manage → Recount.

## What changed in v1.14.0

- **The Source & Validation Log and Optional supporting records are gone.**
  Both recorded the preparer's working material — sources consulted, notes,
  uploaded files, review questions, requirement costs and closeout records —
  which isn't needed to prepare or issue a DD Form 254. The tool no longer stores
  uploaded files and has no separate review PDF.
- **Final-form retention guidance stays.** It still appears in the Item 3
  instructions, the Item 3c validation note and the Contracting Officer package.
- **Older drafts still open.** Log entries, attachments and supporting records in
  a draft saved by an earlier version are no longer shown and are dropped when
  that draft is next saved from the form. To keep them, export them from v1.13.0
  first.

## What changed in v1.13.0

Mostly corrections, each one a place where the tool stated something more
specific than the DD Form 254 or its authority supports.

- **CUI marking is no longer derived from the contract's CUI requirements.**
  Item 10j, Item 11l, a CUI designation, a distribution statement or an LDC say
  the *contract* involves CUI. They no longer mark the *form*, badge it CUI,
  split its issuance audience or put `(CUI)(CUI)(CUI)` in an e-mail subject. A
  DD Form 254 naming CUI categories for a classified contract is routinely
  UNCLASSIFIED. Validation still reports the requirement and points at the Item
  13 guidance the GCA must supply.
- **The SAP flag now adds the constraint it exists for.** A SAP subcontract
  identified in Item 2b *or* Item 7a raises the subcontractor-signature
  requirement as a finding, shows it as owed on the card, and states at issuance
  that access stays closed until it is held. It does not block issuance — the
  form has to go out to be signed.
- **That signature is no longer directed to Item 17.** DoDM 5205.07 requires the
  subcontractor's authorised representative to sign and does not say where; Item
  17 is the issuer's certification and its one signature field belongs to the
  certifying official. The form provides no subcontractor block, so the tool
  states the requirement and the gap, and records where the signature is held.
- **Item 13 states a classified mailing address once** when the Item 7
  subcontractor is also an Item 8 performance location. A genuine disagreement
  between the two is reported rather than hidden.
- **Items 16 and 17 show their required-field asterisks again.** They remain
  outside preparer validation, so a draft is never blocked on fields the GCA and
  certifying official complete after handover.
- **The preparer's worksheet labels each box the way the form does**, reading
  them from the boxes rather than a second copy that had drifted.
- **Template source provenance and retention tracking.** A template records
  whether it came from an Original, a numbered Revision or a Final. Marking one
  Final starts the 32 CFR 117.15 two-year window for material held under it, and
  issuing a Final DD Form 254 starts a separate window for a subcontractor's
  holdings. Neither is the Item 3b(3) biennial review.

## Complete the form with fewer repeated steps

- Reuse Item 6 or 7 details as an Item 8 performance site with one action. Existing sites and manual edits are preserved.
- Jump from a validation finding directly to its field. Relevant text fields also show their existing validation messages beside the entry.
- Review and insert missing Item 13 template sections for selected Items 10/11 together, preserving existing sections.
- Find and select unfinished bracketed template prompts in Item 13.

These shortcuts use the existing form and browser database. Templates require
contract-specific review; the tool does not establish classification, verify
eligibility or decide authority. No server or new storage service is required.

[Implementation status and limitations](02_DOCS/product_planning/IMPLEMENTATION_v1.15.3.md)
describe this release. Docker and Kubernetes remain a future phase.

## Documentation

- [User manual](02_DOCS/DD254_Interactive_User_Manual.pdf)
- [Security fact sheet](02_DOCS/DD254_Tool_Security_Fact_Sheet.md)
- [Release assessment and change list](02_DOCS/RELEASE_ASSESSMENT_v1.15.3.md)
- [Implementation notes for this release](02_DOCS/product_planning/IMPLEMENTATION_v1.15.3.md)
- [Verifying a download and the live demo](VERIFY.md)
- [Maintainer release and demo procedure](SETUP.md)
- [Tool assessment and proposed enhancements (PDF)](output/pdf/DD254_Tool_Assessment_and_Recommendations.pdf)
- [Original enhancement requirements (Word PRD, draft 0.2)](02_DOCS/product_planning/DD254_Tool_Enhancement_PRD.docx)

The live demonstration is published separately to `adamsdarin/dd254-interactive`.
The source, verification workflow and downloadable releases are in
`adamsdarin/dd254-interactive-source`.

## Licence

The application code is [MIT](LICENSE). Third‑party components keep their own
licences; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The DD Form 254
itself is a work of the U.S. Government.
