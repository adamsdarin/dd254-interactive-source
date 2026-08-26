# Publishing this to GitHub — step by step

This file is for you, not for users. Delete it from the repo once you are set
up, or keep it; it does no harm.

Cost: **nothing**. Public repositories get Pages, Actions on standard runners,
and unmetered release-asset downloads at no charge. The only ways to incur a
bill are making the repo private or using Git LFS. Do neither.

---

## Part 0 — Fix these before you publish

Four things are wrong today. Two are quick, one needs a decision, one needs
investigation. **Do not push until at least the first three are resolved** —
publishing documentation that overstates what can be verified is worse than
publishing nothing, because it is the exact thing a sceptical reviewer will
find and it costs you the benefit of the doubt everywhere else.

### 0.1 — `manifest.json` and `BUILD_FACTS.md` are stale ⚠️

They describe `v188`. The build is `v189`. `make_build_facts.py` was not re-run
after the version bump.

This is not cosmetic. A reviewer following your own `rebuild_kit` procedure
gets a **hash mismatch on the authentic file**, and has no way to tell a stale
manifest from a tampered one. Your `split.py` docstring describes this exact
incident happening before.

```bash
cd 01_TOOL
node dd254_regression.js > TEST_RESULT.txt
python3 make_build_facts.py
```

It will also tell you `CHANGELOG.md` has no `## v189` entry. Add one.

`.github/scripts/check_manifest.py` now fails the build on this, so it cannot
recur silently.

### 0.2 — `THIRD_PARTY_NOTICES.md` did not exist ⚠️

The comment above the pdf-lib block in the shipped HTML points reviewers to
`THIRD_PARTY_NOTICES.md` for the MIT text, the Apache-2.0 tslib notice, and
"the command that proves this block is byte-identical." That file was not in
the release folder. A dangling reference, in the one file written specifically
for reviewers.

**Fixed** — the file is included here, and the byte-identity command it
promised now exists and is proven (see 0.5).

### 0.3 — `02_dd254_flat.b64` is not an official download ⚠️ **decision needed**

`manifest.json` describes both embedded forms as "Official DD Form 254 from
esd.whs.mil." The flat one's PDF metadata says:

```
Producer:  Microsoft: Print To PDF
Created:   2026-03-29
```

That is a print-to-PDF derivative, not a Government download. The claim as
written is false, and it is trivially checkable by anyone who decodes the
blob — which `VERIFY.md` explicitly invites them to do.

You said you are revising v189 elsewhere and may replace this with the
official form. Three ways this can end, all acceptable, one not:

| Outcome | What to do |
|---|---|
| You replace it with the verbatim official form | Update the manifest note; delete the "provenance open" section from `VERIFY.md`. Best outcome. |
| It stays a derivative, and you can document how it was produced | Change the note to "flat rendering derived from the official form" and add the steps. Honest and sufficient. |
| It stays a derivative and the steps are lost | Leave `VERIFY.md`'s open item as written. Weaker, but true. |
| **It ships still described as an official download** | **Don't.** This is the only bad outcome. |

`VERIFY.md § 3` currently documents it as an open item. That is deliberate —
an admitted gap costs you far less than a claim that turns out to be wrong.
Also update the `note` string in `split.py`, since `manifest.json` is
generated from it and hand-editing the manifest will be overwritten.

### 0.4 — The regression suite hangs on Linux ⚠️ **needs investigation**

Run in a clean Linux container against v189, the suite stalled: **8 minutes
20 seconds of wall time for 10 seconds of CPU**, producing 93 lines of output
and stopping partway through section 8 (Holds), with zero failures. It was
blocked on something, not computing.

On your Windows machine it finishes in about a minute. Something in the suite
waits forever under Linux — a timer, an event that never fires, or a spawned
process that never returns.

This matters because CI runs on Linux. Until it is understood:

- The workflows carry `timeout-minutes` on the job and on the long steps, so a
  hang fails in 10 minutes with a clear message instead of consuming a runner
  for six hours.
- Expect your first `verify` run to go red on that step. That is not the
  workflow being wrong.

How to run it down, cheapest first:

1. **Reproduce it under WSL** on your own machine — same suite, same file,
   `node dd254_regression.js`. If it hangs there too, you can iterate quickly.
2. **Find where.** The last line printed is immediately before the hang. Add a
   `console.error` at each section boundary, or run with
   `node --stack-size` / `SIGQUIT` to dump pending handles.
3. **Suspect first:** anything using a real timer, `BroadcastChannel`, the
   single-tab lock, or `cp.spawnSync` on a `python` binary name that resolves
   differently on Linux (`python` vs `python3` — line ~1540 uses a `python`
   variable).

If the fix is slow, you can still publish: temporarily replace the regression
step in `verify.yml` with `continue-on-error: true`, and say so in the README.
The other four checks — script syntax, the split/manifest agreement, the
round-trip, and pdf-lib provenance — are the ones carrying the security story,
and all four run clean.

### 0.5 — Good news, already done

The embedded pdf-lib **is** byte-identical to the published
`pdf-lib@1.17.1` `dist/pdf-lib.min.js`. Confirmed by pulling the package from
npm independently and comparing:

```
sha256  0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f
bytes   525099
```

`01_TOOL/rebuild_kit/verify_pdflib.py` proves it on demand and in CI. That is
the single strongest claim in your whole review story — 25% of the file
accounted for with certainty, by a check a stranger can reproduce in two
minutes without trusting you.

Also confirmed: `pdf-lib@1.17.1` depends on `tslib@^1.11.1`, so your
Apache-2.0 attribution is correct, and the notice text is genuinely present in
the shipped bundle.

---

## Part 1 — Assemble the repository folder

**Keep your existing layout.** `01_TOOL/` and `02_DOCS/` stay exactly as they
are. Renaming them would mean editing `split.py`, `make_build_facts.py` and
`RUN_TESTS.md` for no benefit, and would collide with the v189 work you have
in flight elsewhere.

The scaffolding drops in around them. Copy the delivered files so you get:

```
dd254-interactive/                 <- this becomes the repo root
├── README.md                      NEW
├── LICENSE                        NEW
├── THIRD_PARTY_NOTICES.md         NEW  (fixes the dangling reference)
├── VERIFY.md                      NEW
├── SECURITY.md                    NEW
├── SETUP.md                       NEW  (this file — for you)
├── .gitignore                     NEW
├── BUILD_FACTS.md                 existing, regenerate first (0.1)
├── .github/
│   ├── workflows/
│   │   ├── verify.yml             NEW
│   │   ├── pages.yml              NEW
│   │   └── release.yml            NEW
│   └── scripts/
│       ├── check_scripts.py       NEW
│       ├── check_manifest.py      NEW
│       └── newest_build.py        NEW
├── 01_TOOL/                       existing, unchanged except:
│   └── rebuild_kit/
│       └── verify_pdflib.py       NEW
└── 02_DOCS/                       existing, unchanged
```

Then:

1. **Substitute your GitHub username.** `README.md` and `VERIFY.md` contain
   `adamsdarin` and assume the repo is called `dd254-interactive`.

   PowerShell, from the repo root:
   ```powershell
   Get-ChildItem -Recurse -Include *.md | ForEach-Object {
     (Get-Content $_ -Raw) -replace 'adamsdarin','darinadams' |
       Set-Content $_ -NoNewline
   }
   ```
   Change `darinadams` to your actual username, and if you pick a different
   repo name, replace `dd254-interactive` too.

2. **Delete `__pycache__`** from `02_DOCS/manual_source/`. `.gitignore` covers
   it going forward, but a file already present gets committed anyway.

3. **Decide about old builds.** `v188_DEMO.HTM` is still in `01_TOOL/`. Your
   convention is to keep one back, which is fine — but note that once these
   are in git, history keeps every version forever regardless. Committing only
   the current pair keeps the working tree clean; the old ones remain
   retrievable from history and from their release tags.

---

## Part 2 — Create the repository

Two routes. The CLI is faster and less error-prone; use the web route if you
don't have `gh` installed.

### With the `gh` CLI

```bash
cd /path/to/dd254-interactive
git init -b main
git add .
git commit -m "Initial public release of the DD-254 Interactive tool"

gh repo create dd254-interactive --public --source=. --remote=origin --push
```

### Through the web UI

1. <https://github.com/new>
2. Name `dd254-interactive`. **Public.** Do **not** add a README, .gitignore or
   licence — you have all three, and letting GitHub add them creates a
   conflicting first commit.
3. Create, then locally:

```bash
cd /path/to/dd254-interactive
git init -b main
git add .
git commit -m "Initial public release of the DD-254 Interactive tool"
git remote add origin https://github.com/adamsdarin/dd254-interactive.git
git push -u origin main
```

**Expect the `verify` workflow to run immediately, and expect it to be red**
until 0.1 and 0.4 are resolved. That is the system working.

---

## Part 3 — Turn on Pages

1. Repo → **Settings** → **Pages**.
2. **Source: GitHub Actions.** Not "Deploy from a branch" — `pages.yml`
   handles it and discovers the demo build on its own, so version bumps need
   no edit here.
3. Trigger the first deploy: repo → **Actions** → **pages** → **Run workflow**.
4. Two or three minutes later the demo is live at
   `https://adamsdarin.github.io/dd254-interactive/`.

**Open it and click through the tool before telling anyone about it.** The
demo is most people's first contact; a broken first impression is expensive
and it is the one thing here no automated check covers.

---

## Part 4 — Cut the first release

Release assets are how people get the real file. They live outside git
history, so they add nothing to clone size, and downloads are unmetered.

```bash
git tag v189
git push origin v189
```

`release.yml` then re-runs every check, stages the build, the demo, the manual
and the review kit, generates `SHA256SUMS.txt`, attaches a **signed build
provenance attestation**, and publishes the release.

**The attestation is the point.** A hash you publish about your own file only
proves it was not altered in transit. The attestation is signed by GitHub's
infrastructure and binds the file to a specific commit and a public build log —
something you cannot forge. That is the answer to "how do I know this binary
matches the source I read," and it is what makes the whole review story stand
up. Anyone can check it:

```bash
gh attestation verify DD254_Interactive_v189.HTM --repo adamsdarin/dd254-interactive
```

> If the release workflow fails at the attestation step, check
> Settings → Actions → General → Workflow permissions. The workflow requests
> `id-token: write` and `attestations: write` explicitly, which is normally
> enough, but a restrictive org or account default can still block it.

---

## Part 5 — Confirm it actually worked

Do this as a stranger would, not as the author. Ideally on a different machine.

- [ ] The repo front page loads and the disclaimer is visible without scrolling.
- [ ] `https://adamsdarin.github.io/dd254-interactive/` loads the demo and the tool works.
- [ ] The latest release page lists the `.HTM`, the demo, the manual, `rebuild_kit.tar.gz` and `SHA256SUMS.txt`.
- [ ] Download the `.HTM` from the release. `sha256sum` it. Compare to `BUILD_FACTS.md`.
- [ ] `gh attestation verify` on that download succeeds.
- [ ] `python3 01_TOOL/rebuild_kit/verify_pdflib.py` prints byte-identical.
- [ ] `cd 01_TOOL/rebuild_kit && python3 split.py && python3 rebuild.py parts` prints byte-identical.
- [ ] Actions tab is green, or red only on the known regression-suite issue.
- [ ] Walk `VERIFY.md` top to bottom and do exactly what it says. **Every command must work as written.** This is the highest-value ten minutes in this whole document — it is the page your sceptics will actually use, and a command that doesn't work costs you more credibility than having no page at all.

---

## Part 6 — The routine from here

Per release:

1. Do the work per `01_TOOL/START_HERE.md` (scratch copy, syntax-check blocks,
   tests, live run).
2. Add the `## vNNN` entry to `CHANGELOG.md`.
3. `cd 01_TOOL && node dd254_regression.js > TEST_RESULT.txt && python3 make_build_facts.py`
4. `git add -A && git commit -m "vNNN: ..." && git push`
5. Wait for `verify` to go green. **Do not tag a red commit.**
6. `git tag vNNN && git push origin vNNN`

Nothing in the scaffolding hard-codes a version number. `split.py`'s
`newest_build()` is the single place that rule lives, and the workflows,
`verify_pdflib.py` and `newest_build.py` all ask it rather than keeping their
own copy — the same "derive, do not duplicate" discipline your own notes
identify as the fix for every significant bug this project has had.

---

## Two things to think about, not act on today

**GitHub may be blocked at your users' sites.** A fair number of cleared
facilities block `github.com` outright. This doesn't change anything you
build — the repo is still where the review story and the provenance live —
but it changes what you *tell* people. Consider a line in the README saying
the download may need to be fetched from a personal machine, so an FSO who
hits a proxy wall doesn't conclude the tool doesn't exist.

**Repository size.** Each release adds a ~2 MB HTML file to history forever.
Less bad than it sounds: pdf-lib and the two form blobs are contiguous and
unchanging, so git deltas them well and real growth per version is a few
hundred KB. At your release cadence you will not approach any limit. Do not
"solve" this with Git LFS — LFS has real quotas that plain git does not, so
it would convert a non-problem into a metered one.
