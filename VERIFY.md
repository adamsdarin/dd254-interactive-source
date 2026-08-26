# Verifying this tool

You have been handed a 2 MB HTML file, most of which is minified JavaScript
and base64. That is a reasonable thing to be suspicious of. This page exists
so you can resolve the suspicion yourself rather than take anyone's word.

**The claim being made is narrow and checkable:** roughly two-thirds of the
shipped file is third-party code and a Government form that you can obtain
independently and compare byte-for-byte. The remaining third is application
code, and it is the only part you have to actually read.

Requirements: `python3`, `node`, `npm`, and a SHA-256 utility. Ten minutes.

---

## 0. What you should end up believing

Not "this file is safe" — nobody can hand you that. What this procedure
establishes is:

1. The library blob is the genuine, unmodified published release of a
   well-known open-source project.
2. The form blobs are the Government form, not a payload wearing its name.
3. The file you downloaded is the file this repository describes, built from
   the commit you can read.
4. Therefore the surface you need to review by eye is **one file of
   application code**, not two megabytes of noise.

Steps 1–3 are mechanical. Step 4 is your job and no script replaces it.

---

## 1. Split the file into its parts

```bash
cd 01_TOOL/rebuild_kit
python3 split.py            # writes ./parts/ and a fresh manifest.json
```

`split.py` finds the newest non-demo build on its own and cuts it into four
files. It reads nothing outside its own directory and its parent — the
`rebuild_kit/` directory is designed to be handed over on its own.

You now have:

| Part | What it is | What to do with it |
|---|---|---|
| `01_pdflib.js` | pdf-lib 1.17.1 | § 2 — verify against upstream, then ignore |
| `02_dd254_flat.b64` | DD Form 254, flat rendering | § 3 |
| `03_dd254_xfa.b64` | DD Form 254, dynamic XFA | § 3 |
| `04_application.html` | **Everything written for this project** | **§ 5 — read this one** |

Compare the printed hashes against the committed
`rebuild_kit/manifest.json`. They should match. If they do not, see § 4.

### Confirm the split is lossless

The split is only meaningful if the parts reassemble into exactly the file
you were given:

```bash
python3 rebuild.py parts REBUILT.HTM
```

It prints `RESULT : byte-identical` when the round-trip is clean. If it does
not, the parts you are reading are not the file you have, and nothing else on
this page matters — stop and say so.

---

## 2. The pdf-lib block

The single largest blob. Get it from upstream yourself:

```bash
npm pack pdf-lib@1.17.1
tar xzf pdf-lib-1.17.1.tgz
sha256sum package/dist/pdf-lib.min.js
```

Expected — but hash it yourself rather than trusting this line:

```
0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f
```

Then confirm the shipped file contains exactly that, and nothing else
smuggled alongside it:

```bash
python3 01_TOOL/rebuild_kit/verify_pdflib.py
```

The embedded copy carries a short header comment added by this project
(attribution, and why the library is embedded rather than linked). Strip that
comment and normalise trailing whitespace to one newline and the remainder is
byte-identical to the published release. The script does exactly that and
exits non-zero on any mismatch.

This is a strong result: it means no line of the library was altered, and
nothing was appended to it.

---

## 3. The two embedded forms

Both decode to PDFs. Decode and inspect them yourself:

```bash
cd 01_TOOL/rebuild_kit/parts
base64 -d 03_dd254_xfa.b64 > xfa.pdf
base64 -d 02_dd254_flat.b64 > flat.pdf
sha256sum xfa.pdf flat.pdf
```

Compare against `decoded_sha256` in `manifest.json`. Then satisfy yourself
they are PDFs and not something else wearing a `.pdf`:

```bash
head -c 8 xfa.pdf; echo        # %PDF-1.7
strings xfa.pdf | grep -i -m5 'Producer\|Creator'
```

### `03_dd254_xfa.b64` — the official form

This is the dynamic XFA form as published by the Executive Services
Directorate. Download it and compare:

<https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0254.pdf>

> **Expect this comparison to need judgement.** WHS re-posts forms, and a
> re-post can change bytes without changing the form. If the hash differs,
> check the edition date printed on the form itself (04/01/2018 at time of
> writing) and the internal metadata before concluding anything. A
> disagreement here is a question, not a finding.

### `02_dd254_flat.b64` — a flat rendering, **provenance open**

**This one is not a verbatim Government download and this repository does not
claim it is.** Its PDF metadata reports `Producer: Microsoft: Print To PDF`.
It is a flat page rendering of the official form, used as a background layer;
it is derived from the official form rather than being a copy of it.

> **Open item.** The exact steps that produced this file, and therefore
> whether it is independently reproducible, are being reconstructed. Until
> that is resolved, treat it as: a flat rendering of the official form,
> author-produced, byte-stable across releases, whose derivation you cannot
> currently reproduce from scratch.
>
> It is listed here as unresolved rather than described vaguely, because a
> provenance claim that turns out to be false is worse than an admitted gap.

What you *can* check today: open it and confirm it renders the DD Form 254 and
nothing else; confirm it contains no JavaScript
(`strings flat.pdf | grep -i javascript` should find nothing); and confirm its
hash is stable across releases.

---

## 4. The file you downloaded is the file described here

`BUILD_FACTS.md` in the repository root carries the current filename, version,
byte size and SHA-256. It is generated by `01_TOOL/make_build_facts.py`, never
hand-edited.

```bash
sha256sum DD254_Interactive_vNNN.HTM
```

Compare against `BUILD_FACTS.md`.

**A self-published hash proves only that the file was not altered in
transit.** It says nothing about who built it or from what. For that:

- Release assets carry a **build provenance attestation** (Sigstore-signed,
  produced by GitHub's own infrastructure, not by the author). Verify with:

  ```bash
  gh attestation verify DD254_Interactive_vNNN.HTM --repo adamsdarin/dd254-interactive
  ```

  This ties the file in your hands to a specific commit and a public build log.
  It is the strongest link on offer here, and it is the one you should rely on
  rather than any hash printed in a document.

- The workflow that produced it, and its full log, are public under the
  repository's Actions tab.

---

## 5. Now read the application code

`parts/04_application.html`. This is the part written for this project, and
the only part where a reviewer's time is well spent.

Things worth targeting, and what you should find:

| Question | Where to look |
|---|---|
| Does it make network calls? | Search for `fetch(`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, `src=`/`href=` pointing off-origin. Expect none. |
| Does it execute constructed code? | Search for `eval(`, `new Function(`, `setTimeout("`. |
| Where does typed data go? | `indexedDB`, `localStorage`. It should stay local. |
| Does it exfiltrate on export? | Export paths build a PDF in memory via pdf-lib and hand it to the browser's download. Nothing leaves. |

The most direct check needs no code reading at all: **disconnect the machine
from the network and use the tool.** It works identically. A tool that
functions with no network is not sending anything anywhere.

---

## 6. What the repository checks on its own

Every push runs, publicly:

- every `<script>` block extracted and `node --check`ed;
- the full regression suite (assertion count in `BUILD_FACTS.md`);
- a headless-browser smoke test driving the real form controls;
- `split.py` re-run and its output compared to the committed
  `manifest.json` — so a stale manifest fails the build rather than
  quietly misleading you;
- `verify_pdflib.py`, so the byte-identity claim on this page cannot
  silently stop being true.

That last pair matters more than it looks. A manifest that drifts behind the
build produces a hash mismatch *on the genuine file*, and a reviewer has no
way to distinguish a stale manifest from a tampered one. It has happened in
this project before. The check exists because of it.

---

## Found something?

[SECURITY.md](SECURITY.md). Please report it — including "your provenance
documentation is wrong," which is the finding this page is most likely to
produce.
