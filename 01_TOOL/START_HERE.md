# DD-254 tool — build stream

Paste this into the project's custom instructions, or open it at the start of a
new conversation. It exists so a fresh chat does not have to re-derive decisions
that were already argued out.

---

## What this project is for

Changing the DD-254 Interactive tool: features, validation rules, fixes, tests.

**Not** for the manual, the handbook, the deck or the security documents. Those
live in the documents project. See "Where the two streams touch" at the bottom —
they are not fully independent, and pretending otherwise causes stale documents.

## Current state

The generated `../BUILD_FACTS.md` is the authority for the current filename,
tool version, size, SHA-256 and passing assertion count. Do not copy those
volatile values into this file. `CHANGELOG.md` records what changed by version,
and `rebuild_kit/` holds the self-contained security-review split/rebuild kit.

The tool is one HTML file. No build step, no dependencies, no server.

## How to work on it

1. Copy the HTML to a scratch directory. Never edit in place in outputs.
2. Make the change.
3. **Syntax-check every `<script>` block** — extract each and `node --check` it.
   A comment-block error kills a whole block silently and the tool half-works.
4. Run `dd254_regression.js` (needs `jsdom` and `fake-indexeddb`, and the HTML
   named `dd254.htm` beside it).
5. Run `browser_smoke.js` against the versioned file. It drives the real Item
   10 tile, Settings, Item 13 removal and undo in headless Chrome/Edge.
6. **Then run any changed export live** — see the warning below.
7. Ship as the next version number and preserve earlier official builds unless
   the owner explicitly authorises archival or deletion.
8. **Add a `## vNNN` entry to `CHANGELOG.md`** — what changed, what was added,
   what was deliberately not done. Every change to the HTML gets one.
9. Run `python3 make_build_facts.py`. It regenerates `BUILD_FACTS.md` and
   `rebuild_kit/manifest.json` together, and exits non-zero if step 7 was
   skipped.

`RUN_TESTS.md` has the mechanics.

## Things learned the hard way

These cost real time. Worth reading before touching the file.

- **Unit tests passing is not evidence the feature works.** Twice a change
  passed every assertion and did nothing in the browser: Items 10/11 are hidden
  checkboxes behind clickable tiles, so setting `.checked` silently does nothing.
  Always drive the real form in a jsdom run, not just the data layer.
- **Two sources of truth is the recurring defect.** Every significant bug in
  this tool was the same shape: a red asterisk in the markup and a rule in the
  JavaScript that had drifted apart; a template list and a form list; a
  flow-down set and an approval set. Derive, do not duplicate.
- **Batch patches abort and discard.** A script that applies six edits and
  asserts on each will write nothing if edit five fails — including the four
  that succeeded. Write after each edit, or you will believe changes landed that
  did not.
- **`async function foo` and `function foo` both match `function foo`.** An
  anchored replace on the latter splits the keyword and kills the script block.
- **The suite takes about a minute** and background processes get killed between
  tool calls. Run it in one window.

## Conventions that are load-bearing

- **Comments say why, not what.** The file is read by security reviewers.
- **Managed regions of Block 13** are identified by their exact text, so user
  typing above and below survives. Do not switch to index-based editing.
- **Approval holds cannot be overridden.** The `statusOverride` checkbox
  deliberately does not clear them.
- **Records of things that happened** — Issued, Cancelled, Skipped — are never
  rewritten by autosave or reset.
- **The XFA packet name `Block17`** belongs to the official form. It is not our
  label and must not be renamed. There is a test guarding it.

## Open items

- The Item 16/17a–17g asterisks are still in the markup though nothing validates
  them. Deliberate, documented, but the screen and the rules disagree. Items
  17h and 17i no longer appear in the browser because they are completed in the
  generated dynamic PDF.
- The v188 Access Eligibility and Item 11 Performance Advisors add broad
  cross-item checks, but they are intentionally nonblocking. Promoting any
  advisory to validation remains an FSO and authority-review decision, not an
  engineering inference.
- The official dynamic PDF path is regression checked and the former static
  builder remains as an internal extracted-content oracle. A human should still
  click any export whose behavior changes; generated report pop-ups and
  downloads are browser surfaces that JSDOM cannot prove.

## Where the two streams touch

A tool change creates a documents task whenever it changes any of these:

| Changed in the tool | Needs updating in documents |
|---|---|
| Any user-visible behaviour | User manual |
| Version, file size, or hash | Security fact sheet, rebuild guide, rebuild manifest |
| Assertion count | Security fact sheet, rebuild guide |
| Component sizes | Security fact sheet, rebuild guide |

Finish the tool change, then hand the specifics over. Do not update documents
from this project — they will drift from the ones being maintained in the other.
