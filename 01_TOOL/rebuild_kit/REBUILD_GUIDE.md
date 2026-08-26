# Rebuilding the DD-254 tool from independently sourced parts

**Audience:** the security reviewer or engineer deciding whether this file may
come inside. **Author involvement required: none.** Everything here runs on your
equipment, using your copies of the components, and produces a file you built.

---

## Why this exists

You have been handed a 2 MB HTML file with inline JavaScript and embedded
base64. That is the shape of an HTML smuggling payload, and treating it with
suspicion is correct.

The problem is that "review 2 MB from an outside individual" is not a
proportionate ask. This procedure makes it a proportionate one, by separating
the file into four parts and letting you replace three of them with copies you
obtain yourself.

The figures below are generated from the shipped v1.9 file by
`make_build_facts.py`. Component lengths are the characters captured by each
extractor; shares use the 2,130,196-byte shipped file as their denominator.
`split.py` independently records the exact extracted-part lengths and hashes in
`manifest.json`.

| Part | In the file | Share | Where you get your own |
|---|---:|---:|---|
| DD Form 254, flat | 738,164 chars | 34.7% | `esd.whs.mil` |
| pdf-lib | 525,598 chars | 24.7% | `github.com/Hopding/pdf-lib`, or your internal npm mirror |
| **Application code** | **560,855 chars** | **26.3%** | **The only code you must read** |
| Markup and CSS | 222,295 chars | 10.4% | Delivered in the application part |
| DD Form 254, dynamic XFA | 83,284 chars | 3.9% | `esd.whs.mil` |

After this procedure, the library came from your mirror, both government forms
came from the government, and the only thing originating outside your boundary
is source you have read.

---

## What you need

- Python 3 (standard library only — no pip install, no internet)
- A text editor
- Optional: Node.js and `jsdom` to run the included test suite

The two scripts are ~40 lines each. Read them first; they are short enough to
audit in a couple of minutes and they do nothing but read files, split on
markers, and write files.

---

## Step 1 — Verify what you were given

```
certutil -hashfile DD254_Interactive_v1.9.HTM SHA256
```

Expected: `9f032a083f0cef8f88866d6b8738a049abaa8a18b01a791fcd4eac8eac512c57`
(2,130,196 bytes)

A mismatch means the file is not the one this guide describes. Stop.

## Step 2 — Split it

```
python split.py DD254_Interactive_v1.9.HTM parts
```

Produces `parts/` containing four files and a `manifest.json` recording the size
and SHA-256 of each. The application part has the three large components carved
out and replaced with the markers `@@PDFLIB@@`, `@@DD254_BASE_B64@@` and
`@@DD254_XFA_B64@@`.

## Step 3 — Confirm the split is lossless before you change anything

```
python rebuild.py parts CHECK.HTM
```

This should report **byte-identical** and reproduce the original SHA-256. That
proves the four parts fully reconstitute the file with nothing hidden in the
seams. Do this before substituting anything — if it does not round-trip, the
rest of the procedure is meaningless.

## Step 4 — Replace pdf-lib with your own copy

pdf-lib is MIT-licensed and public. Obtain `pdf-lib.min.js` from your own
mirror or from the project's releases, then:

```
copy your-pdf-lib.min.js parts\01_pdflib.js
```

For reference, the copy in the delivered file hashes to:

```
1cd7d1f51f15de482b8e9cb7712539632a0ddefc289aa93fea9f2b145f78c9fb
```

If your copy matches that hash, it is the same build and you have confirmed the
delivered file did not carry a modified library. If it does not match, use yours
— that is the point of this step.

## Step 5 — Replace the government forms with your own downloads

Download the DD Form 254 from `esd.whs.mil` yourself, then base64-encode it:

```
certutil -encode dd254.pdf tmp.b64
```
(strip the BEGIN/END header lines and all newlines, leaving one continuous
string), or with Python:

```python
import base64
open('parts/02_dd254_flat.b64','w').write(
    base64.b64encode(open('dd254.pdf','rb').read()).decode())
```

Do the same for the dynamic XFA version into `03_dd254_xfa.b64`.

The decoded content of the delivered copies hashes to:

```
flat     ff0b984f0a217339904eb037c4c27f344c5dd42804df2d9ed614cca35d025cf0
dynamic  86d380749d592f2a900c695bf651de2ebfb962b2d8b0071b244b90045ff217b1
```

Compare against your own downloads. A match tells you the embedded forms are the
government's unmodified files.

> Note: `.gov` sites occasionally re-issue forms, so a mismatch is not
> automatically sinister — open both and compare. The point of this step is that
> you no longer have to care: you are using yours.

## Step 6 — Review the application code

`parts/04_application.html` is the only part that originated with the author.
It is about 771 KB after the three replaceable components are carved out:
roughly 555 KB of unobfuscated, commented JavaScript plus 223 KB of markup and
CSS in the shipped-file accounting.

Start with the searches that exclude whole classes of risk. Expect a small
number of hits rather than none — the file's own header comment names these APIs
while explaining the security policy. Read each hit; every one should be prose,
not a call site:

```
findstr /C:"fetch(" /C:"XMLHttpRequest" /C:"WebSocket" /C:"EventSource" parts\04_application.html
findstr /C:"sendBeacon" /C:"eval(" /C:"new Function" /C:"importScripts" parts\04_application.html
findstr /C:"<script src" /C:"<iframe" /C:"<object" /C:"<embed" parts\04_application.html
```

Then confirm the Content Security Policy is present in the `<head>` and reads:

```
default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';
img-src data: blob:; font-src data:; media-src data: blob:;
connect-src 'none'; form-action 'none'; base-uri 'none';
object-src 'none'; frame-src 'none'; worker-src 'none'
```

`connect-src 'none'` is the load-bearing directive: the browser refuses `fetch`,
`XMLHttpRequest`, `WebSocket` and `sendBeacon` from the page whatever the code
attempts. Two limits are worth knowing before you read further, because the
policy is narrower than it looks:

- `script-src 'unsafe-inline'` permits any injected `<script>` or `onerror=`
  handler to run. Against injection the policy is inert.
- No shipped directive covers top-level navigation, so `window.open('https://…'
  + data)` and `location = …` are unrestricted. The tool uses this deliberately
  once, for a SAM.gov lookup carrying a form value in the query string.

**Look at the generated-report paths early.** The worksheet, briefing and
contracting-officer package build HTML documents from form data. v171 changed
those paths to encode every operator-controlled value, apply a restrictive
report CSP, and open through a `noopener noreferrer` Blob URL. Search for
`openGeneratedReport`, `htmlEsc` and `document.write`; confirm values pass
through the shared encoder and that no old live-window `document.write` path
remains.

The remaining review is ordinary source reading. The code is organised in
labelled sections and commented with the reasoning behind decisions, not just
what each line does. Note that the majority of it was generated by a large
language model under the author's direction, which is why reading it matters
more than usual.

## Step 7 — Rebuild from your parts

```
python rebuild.py parts DD254_INTERNAL.HTM
```

The script prints `unchanged` or `REPLACED` for each part, so the build log
itself records which components came from where. Keep that output.

**Your rebuilt file will not match the original SHA-256, and that is correct.**
It is not the same file — it contains your library and your copies of the forms.
Record the hash of what you built as your own baseline.

## Step 8 — Confirm it still works

```
npm install jsdom fake-indexeddb
node dd254_regression.js
```

Expect 918 assertions passing and 0 failing, covering validation rules, storage,
import/export, PDF generation and the workflow. No network access required. This is what tells you the
substitutions in steps 4 and 5 did not break anything.

## Step 9 — Watch it on the wire

The claim is that the tool contacts nothing unless you ask it to. Test it rather
than accept it. On an isolated VM with no other tabs open, start a capture
(Wireshark, `netsh trace`, or DevTools Network with "preserve log"), then open
your rebuilt file, fill a form, run every export, and use the dashboard.

You should see no outbound traffic attributable to the page, with one exception
you can trigger on purpose: press the SAM.gov lookup and you should see that
navigation and nothing else. Anything further means the claim is false and you
should reject the tool — which is exactly why this step is worth more than any
assurance in writing.

---

## What this procedure does not give you

Stated plainly, because a procedure that only lists its strengths is not useful.

- **It is not a reproducible build.** You are reassembling a delivered artifact
  from its parts, not compiling from independently authored source.
- **It does not replace code review.** It reduces what must be reviewed from
  2.1 MB to about 771 KB. Someone still has to read that.
- **It provides no chain of custody for the application code.** That part was
  directed by one person on a personal machine, with no signed commits and no
  formal SDLC, and the majority of it was generated by a large language model
  under that person's direction. There is no version control history for it.
  You are reading model-generated JavaScript that a human specified, reviewed
  and tested — not code a human wrote line by line. Step 6 is where that
  matters. Steps 6, 8 and 9 are how you compensate for that; if your policy
  requires provenance you cannot obtain, that is a legitimate reason to decline.
- **There is no support commitment, patch process or disclosure channel.**

If the outcome is that your organisation reads the source and writes its own
implementation, that is a perfectly good result and the author would regard it
as a success rather than a rejection.
