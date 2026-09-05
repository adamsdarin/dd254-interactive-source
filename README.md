# DD‑254 Interactive

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
| **Try it now** | *(demo build — fictitious data, nothing real)* → `https://adamsdarin.github.io/dd254-interactive/` |
| **Download** | [Releases](https://github.com/adamsdarin/dd254-interactive-source/releases/latest) → `DD254_Interactive_v1.10.0.HTM` |
| **Read the code** | [`01_TOOL/`](01_TOOL/) |
| **Verify it yourself** | [VERIFY.md](VERIFY.md) |

### Running it

1. Download `DD254_Interactive_v1.10.0.HTM` from the latest release.
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
still describes the committed build. The logs are public.

---

## Documentation

- [User manual](02_DOCS/DD254_Interactive_User_Manual.pdf)
- [Security fact sheet](02_DOCS/DD254_Tool_Security_Fact_Sheet.md)
- [Release assessment and change list](02_DOCS/RELEASE_ASSESSMENT_v1.10.0.md)

The live demonstration is published separately to `adamsdarin/dd254-interactive`.
The source, verification workflow and downloadable releases are in
`adamsdarin/dd254-interactive-source`.

## Licence

The application code is [MIT](LICENSE). Third‑party components keep their own
licences; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The DD Form 254
itself is a work of the U.S. Government.
