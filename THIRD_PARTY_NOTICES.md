# Third-party notices

The shipped `DD254_Interactive_vNNN.HTM` embeds third-party code and a
U.S. Government form. This file carries their notices, as their licences
require, and records how to confirm that what is embedded is what it claims
to be.

The in-file comment above the library block points here. If you arrived from
there, [§ Proving the pdf-lib block](#proving-the-pdf-lib-block) is what you
came for.

---

## pdf-lib 1.17.1 — MIT

- Upstream: <https://github.com/Hopding/pdf-lib>
- Package: <https://www.npmjs.com/package/pdf-lib/v/1.17.1>
- Embedded file: `dist/pdf-lib.min.js`

Embedded rather than linked because the tool must run from `file://` with no
network and no install. A CDN reference or a `node_modules` dependency would
leave it non-functional for the people it is for.

```
MIT License

Copyright (c) 2019 Andrew Dillon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Components bundled inside that file

`dist/pdf-lib.min.js` is a bundle. These are compiled into it and are not
separately visible in the shipped HTML:

| Component | Licence | Upstream |
|---|---|---|
| `tslib` (1.x) | Apache-2.0 — see below | <https://github.com/microsoft/tslib> |
| `@pdf-lib/standard-fonts` 1.0.0 | MIT | <https://github.com/Hopding/standard-fonts> |
| `@pdf-lib/upng` 1.0.1 | MIT | <https://github.com/Hopding/UPNG.js> |
| `pako` 1.0.11 | MIT AND Zlib | <https://github.com/nodeca/pako> |

**On tslib's licence.** pdf-lib 1.17.1 declares a dependency on `tslib@^1.11.1`
and the helper preamble compiled into the bundle carries the Apache-2.0
notice reproduced below. That notice is the operative one for the code as
shipped here. Microsoft later relicensed tslib to 0BSD (from 1.14.0 onward);
that relicensing does not retroactively change the notice embedded in this
bundle, so the Apache-2.0 text is reproduced rather than the newer terms.

The notice below is present verbatim in the shipped file, immediately after
the library's opening wrapper — you do not have to take this document's word
for it:

```
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
```

Full Apache-2.0 text: <https://www.apache.org/licenses/LICENSE-2.0>

---

## Proving the pdf-lib block

The embedded block is **byte-identical** to the published
`pdf-lib@1.17.1` `dist/pdf-lib.min.js`, once a header comment added by this
project is removed and trailing whitespace is normalised to a single newline.

Expected, for the upstream file:

```
sha256  0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f
bytes   525099
```

Confirm it in two commands. First, get the upstream file from npm and hash it
yourself — do not trust the value above:

```bash
npm pack pdf-lib@1.17.1
tar xzf pdf-lib-1.17.1.tgz
sha256sum package/dist/pdf-lib.min.js
```

Then confirm the shipped HTML contains exactly that:

```bash
python3 01_TOOL/rebuild_kit/verify_pdflib.py
```

The script extracts the block using the same code path `split.py` uses — it
does not carry its own copy of the extraction rule — applies the
normalisation, and compares. It exits non-zero on any mismatch. It runs on
every push; the log is public.

If it fails, do not assume tampering. The most likely cause by far is that
the library was upgraded and the constant in the script was not. Read
`01_TOOL/CHANGELOG.md` first.

---

## DD Form 254

Two encoded copies of the form are embedded. The form is a work of the
U.S. Government and is not subject to copyright in the United States.

- Official source: <https://www.esd.whs.mil/Directives/forms/dd0001_0499/DD254/>
- Form: <https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0254.pdf>
- Instructions: <https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0254-Inst.pdf>

Neither copy is modified in substance by this project. Their exact provenance
and how to check it are in [VERIFY.md](VERIFY.md#3-the-two-embedded-forms),
including one item still open.

Embedding the form is not an endorsement by, and implies no relationship
with, the Department of Defense or any of its components.
