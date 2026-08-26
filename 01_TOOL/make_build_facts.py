#!/usr/bin/env python3
"""Write the facts the documents stream needs, straight from the shipped build.

Run this after shipping a new version. It is the handover between the two
projects: the tool project produces it, the documents project reads it. Nobody
retypes a hash or an assertion count, so nobody gets one wrong.
"""
import io,re,sys,os,hashlib,base64,datetime

HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.dirname(HERE)

# split.py is loaded here rather than reimplemented. It owns both the rule for
# which file is "the build" and the rule for cutting it into parts, and this
# script uses its answer for both — so the two cannot pick different files or
# publish different component hashes. They previously did exactly that: a
# manifest three versions stale, and two different SHA-256 values for the same
# vendored library.
#
# The dependency is one-directional by design. split.py imports nothing from
# 01_TOOL, because rebuild_kit/ is handed to security reviewers as a
# self-contained directory that has to run on its own.
#
# Importing normally drops a __pycache__ into rebuild_kit/. That directory
# should hold only the four files a reviewer is asked to read; generated
# bytecode sitting in it invites the question of what else is generated.
import importlib.util,tempfile,shutil
_bc=sys.dont_write_bytecode
sys.dont_write_bytecode=True
_spec=importlib.util.spec_from_file_location('dd254_split',os.path.join(HERE,'rebuild_kit','split.py'))
_split=importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_split)
sys.dont_write_bytecode=_bc

BUILD=_split.newest_build(HERE)
s=io.open(BUILD,encoding='utf-8').read()
raw=io.open(BUILD,'rb').read()
sha=lambda b: hashlib.sha256(b if isinstance(b,bytes) else b.encode('utf-8')).hexdigest()

blocks=re.findall(r'<script\b[^>]*>(.*?)</script>',s,re.S|re.I)
pdflib=[b for b in blocks if 'pdf-lib.min.js.map' in b][0]
# Hashed exactly as embedded — do not .strip() it.
#
# This file and rebuild_kit/manifest.json both publish a hash for the same
# vendored library, and they must agree or a reviewer comparing our own two
# documents finds a mismatch on the third-party component and has no way to
# tell which is authoritative. They previously disagreed: this script trimmed
# the block, split.py did not.
#
# The untrimmed basis is the one that is load-bearing, so it wins. split.py
# writes the regex group verbatim to 01_pdflib.js and rebuild.py substitutes
# that file's exact contents back into the @@PDFLIB@@ placeholder. Trim there
# and the surrounding whitespace is lost, the rebuild stops being
# byte-identical, and the kit's whole claim fails. Nothing depends on the
# trimmed value except this line, so this is the side that moves.
def b64(c):
    m=re.search(c+r'\s*=\s*"([A-Za-z0-9+/=]+)"',s); return m.group(1)
flat,xfa=b64('DD254_BASE_B64'),b64('DD254_XFA_B64')
app=sum(len(b) for b in blocks if 'pdf-lib.min.js.map' not in b
        and 'DD254_BASE_B64' not in b and 'DD254_XFA_B64' not in b)
tot=len(raw)
mk=lambda n: '%.1f%%'%(100*n/tot)

# Assertion count comes from an ACTUAL RUN, never from counting declarations in
# the source — a regex over the suite miscounts, and a wrong number in a
# security document is worse than no number. Write the run output to
# 01_TOOL/TEST_RESULT.txt (node dd254_regression.js > TEST_RESULT.txt) first.
res=os.path.join(HERE,'TEST_RESULT.txt')
nass='NOT RUN — see note below'
if os.path.exists(res):
    m=re.search(r'PASS\s+(\d+)\s+FAIL\s+(\d+)',io.open(res,encoding='utf-8').read())
    if m: nass=('%s (with %s failing)'%(m.group(1),m.group(2))) if m.group(2)!='0' else m.group(1)

ver=re.search(r"TOOL_VERSION='([^']+)'",s)
out=f"""# Build facts — generated, do not hand-edit

Produced by `01_TOOL/make_build_facts.py` on {datetime.date.today().isoformat()}.
The documents stream reads this instead of asking for numbers.

| | |
|---|---|
| **File** | `{os.path.basename(BUILD)}` |
| **Tool version** | `{ver.group(1) if ver else '?'}` |
| **Size** | {tot:,} bytes |
| **SHA-256** | `{sha(raw)}` |
| **Regression assertions** | {nass} |

## Component split

Share is of the shipped file, so it is measured on what actually occupies the
file. The two forms are stored base64-encoded, which is larger than the PDF you
would download; both figures are given so neither is misleading.

| Component | In the file | Decoded | Share of file |
|---|---|---|---|
| pdf-lib (MIT) | {len(pdflib):,} chars | — | {mk(len(pdflib))} |
| DD Form 254, flat | {len(flat):,} chars | {len(base64.b64decode(flat)):,} bytes | {mk(len(flat))} |
| DD Form 254, dynamic XFA | {len(xfa):,} chars | {len(base64.b64decode(xfa)):,} bytes | {mk(len(xfa))} |
| **Application code** | **{app:,} chars** | — | **{mk(app)}** |
| Markup and CSS | {tot-len(pdflib)-len(flat)-len(xfa)-app:,} chars | — | {mk(tot-len(pdflib)-len(flat)-len(xfa)-app)} |

Not the author's code: **{mk(len(pdflib)+len(flat)+len(xfa))}** of the file.

## Component hashes

```
pdf-lib block (as embedded) {sha(pdflib)}
DD254_BASE_B64  (decoded)   {sha(base64.b64decode(flat))}
DD254_XFA_B64   (decoded)   {sha(base64.b64decode(xfa))}
```

## If the assertion count says NOT RUN

Run the suite and save its output first, then regenerate:

```
cd 01_TOOL && node dd254_regression.js > TEST_RESULT.txt && python3 make_build_facts.py
```

## What to update in the documents stream

- Security fact sheet — filename, size, SHA-256, assertion count, component table
- Rebuild guide — same
- Rebuild manifest — refreshed automatically by this script; no separate step
- User manual — only if user-visible behaviour changed
"""
p=os.path.join(ROOT,'BUILD_FACTS.md')
io.open(p,'w',encoding='utf-8').write(out)
print('wrote',p)

# ── the rebuild manifest, from the same build, in the same run ──────────────
#
# split.py's own function is called rather than its logic copied. Copying is
# the defect being removed: these two scripts each parsed the build and
# published overlapping facts about it, and they disagreed twice — a manifest
# three versions stale, and two different SHA-256 values for the same vendored
# library. Regenerating both here means version, size and component hashes
# come from one read of one file and cannot drift apart between runs.
#
# The import is deliberately one-directional. split.py must never import
# anything from 01_TOOL: the rebuild kit is shipped to security reviewers as a
# self-contained directory and has to run on its own.
#
# parts/ is ~2 MB of scratch. It goes to a temp directory and only
# manifest.json is kept, so a regeneration leaves no debris in the tree.
_tmp=tempfile.mkdtemp(prefix='dd254_split_')
try:
    _man=_split.split(BUILD,_tmp)
    _dst=os.path.join(HERE,'rebuild_kit','manifest.json')
    shutil.copyfile(os.path.join(_tmp,'manifest.json'),_dst)
    print('wrote',_dst)
finally:
    shutil.rmtree(_tmp,ignore_errors=True)

print('build :',os.path.basename(BUILD))
print('sha256:',sha(raw))
if _man['sha256']!=sha(raw):
    sys.exit('manifest and facts disagree on the build hash — refusing to leave both in place')

# ── every shipped version must have a change note ───────────────────────────
#
# Enforced here rather than written down as a convention, because a convention
# is what manifest.json had and it drifted three versions behind. This script
# already runs on every ship and already knows which version it is describing,
# so it is the one place that can notice the omission at the moment it happens
# rather than months later.
#
# The facts and the manifest are written first and deliberately left in place:
# they are derived from the build and are correct whether or not anyone wrote
# a change note. Only the exit code fails, so the omission is loud without
# leaving stale artifacts behind.
_ver=re.search(r'_v(\d+)\.HTM$',os.path.basename(BUILD),re.I)
_ver=_ver.group(1) if _ver else None
_log=os.path.join(HERE,'CHANGELOG.md')
if _ver:
    _txt=io.open(_log,encoding='utf-8').read() if os.path.exists(_log) else ''
    # An entry is a heading for this version, not a passing mention: the
    # summary table lists every version and would satisfy a looser check
    # while the version that actually shipped went undescribed.
    # The version token has to END here. \b would have accepted "## v170-DRAFT"
    # — a word boundary sits between "0" and "-" — so a heading that was still
    # being written would have satisfied the check.
    if not re.search(r'(?m)^##\s+v%s(?=\s|$)'%_ver,_txt):
        sys.exit('CHANGELOG.md has no "## v%s" entry — every change to the HTML '
                 'needs a change note. BUILD_FACTS.md and manifest.json were '
                 'regenerated; add the entry and re-run.'%_ver)
    print('changelog: v%s entry present'%_ver)
