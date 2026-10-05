"""Generate the reviewable rule catalog from the shipped build.

The tool states a large number of claims about the DD Form 254 and its
authorities, and enforces every one of them. Until now the only way to read
those claims was to read the HTML and the validation code. Twice a claim has
been more specific than its authority supports, each was self-consistent and
enforced, and neither surfaced as a failure - so the residual risk is not a
missing rule but an enforced rule that is wrong. Only a person reading the
claims against the DD Form 254 and its authorities finds those, and that is an
FSO judgement, not an engineering one.

This catalog exists to make that reading possible. It is DERIVED from the build
on every run, never hand-maintained, so it cannot drift from what the tool
actually does. check_documentation.py regenerates it and fails if the committed
copy differs.

Usage:  python 02_DOCS/make_rule_catalog.py [--check]
"""
import html
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '02_DOCS' / 'DD254_Rule_Catalog.md'

spec = importlib.util.spec_from_file_location('split', ROOT / '01_TOOL/rebuild_kit/split.py')
split = importlib.util.module_from_spec(spec)
spec.loader.exec_module(split)

# Authorities the catalog reports a baseline for. The tool cites many more in
# passing; these are the ones its rules are built on.
BASELINE_AUTHORITIES = [
    '32 CFR Part 117 (NISPOM Rule)',
    'DD Form 254 Instructions (APR 2018 form)',
    'DoDM 5220.32 Volume 1',
    'DoDM 5205.07 (SAP)',
    'DoDI 5200.48 (CUI)',
    'DoDM 5105.21 Volume 3 (SCI)',
]

AUTHORITY_RE = re.compile(
    r'32 CFR Part 117|32 CFR \d+\.\d+|DoDM \d+\.\d+(?:-V\d*)?(?:,? Volume \d+)?'
    r'|DoDI \d+\.\d+|DoDD \d+\.\d+[A-Z]?|DD Form 254 Instructions|NISPOM'
    r'|SEAD \d+|DFARS 252\.[\d.\-]+|FAR \d[\d.]*|NSA/CSS Manual [\d\-]+|E\.O\. \d+'
)


def text_of(fragment):
    """Visible text of an HTML fragment, with links reduced to their label."""
    s = re.sub(r'<a\b[^>]*>(.*?)</a>', r'\1', fragment, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(re.sub(r'\s+', ' ', s)).strip()


def links_of(fragment):
    return [html.unescape(h) for h in re.findall(r'<a\b[^>]*href="([^"]+)"', fragment)]


def boxes(src):
    """Every access/performance box, with the claims it states."""
    out = []
    for m in re.finditer(r'<div class="cbi" id="cb([^"]+)"(.*?)\n</div>', src, re.S):
        bid, body = m.group(1), m.group(2)
        label = re.search(r'<div class="ck">(.*?)</div>', body, re.S)
        desc = re.search(r'<div class="cd">(.*?)</div>', body, re.S)
        claims = []
        # The end-of-body case matters: the last claim in every box is followed
        # by nothing, and without it this quietly dropped one claim per box.
        for c in re.finditer(r'<span class="(rr|rn)">(.*?)</span>\s*(?=<span|</div>|$)', body, re.S):
            kind = 'REQUIREMENT' if c.group(1) == 'rr' else 'NOTE'
            frag = c.group(2)
            claims.append({
                'kind': kind,
                'text': text_of(frag),
                'links': links_of(frag),
                'authorities': sorted(set(AUTHORITY_RE.findall(text_of(frag)))),
            })
        out.append({
            'id': bid,
            'label': text_of(label.group(1)) if label else bid,
            'desc': text_of(desc.group(1)) if desc else '',
            'claims': claims,
        })
    return out


def messages(src):
    """Blocking and advisory messages the validator can produce.

    Only literal strings are extracted. A message built from values at run time
    is counted and reported as a gap rather than guessed at, because a catalog
    that invents wording is worse than one that admits what it cannot show.
    """
    out = {}
    for bucket in ('must', 'warns'):
        found = []
        for m in re.finditer(bucket + r"\.push\(\s*'((?:[^'\\]|\\.)*)'\s*\)", src):
            raw = m.group(1).replace("\\'", "'").replace('\\n', ' ')
            raw = re.sub(r'\\u([0-9a-fA-F]{4})', lambda x: chr(int(x.group(1), 16)), raw)
            found.append(text_of(raw))
        out[bucket] = found
        out[bucket + '_computed'] = len(re.findall(bucket + r'\.push\(', src)) - len(found)
    return out


def build_doc():
    build = Path(split.newest_build(ROOT / '01_TOOL'))
    src = build.read_text(encoding='utf-8')
    tool = re.search(r"TOOL_VERSION='([^']+)'", src).group(1)
    release = re.search(r"RELEASE_VERSION='([^']+)'", src).group(1)

    bx = boxes(src)
    # A catalog that silently drops a claim is worse than no catalog: it reads
    # as completeness. Fail loudly instead.
    stated = len(re.findall(r'<span class="(?:rr|rn)">', src))
    captured = sum(len(b['claims']) for b in bx)
    if stated != captured:
        raise SystemExit(
            'rule catalog would omit claims: the build states {0} but {1} were '
            'captured. Fix the parser before publishing.'.format(stated, captured))
    msg = messages(src)
    n_claims = sum(len(b['claims']) for b in bx)
    n_req = sum(1 for b in bx for c in b['claims'] if c['kind'] == 'REQUIREMENT')

    L = []
    A = L.append
    A('# DD254 Interactive - rule catalog')
    A('')
    A('DD254 Interactive v{0} / Tool v{1}. Generated from the shipped build by '
      '`02_DOCS/make_rule_catalog.py`; do not edit by hand.'.format(release, tool))
    A('')
    A('This lists every claim the tool states about the DD Form 254 and enforces. '
      'It exists to be read against the form and its authorities by an FSO. The '
      'residual risk in this product is not a missing rule but an enforced rule '
      'that is wrong, and only that reading finds one.')
    A('')
    A('## Authority baseline')
    A('')
    A('The rules were written against the authorities below. When one is '
      'reissued, the claims citing it need re-reading; this section is how that '
      'drift becomes visible.')
    A('')
    A('| Authority | Baseline confirmed |')
    A('| --- | --- |')
    for a in BASELINE_AUTHORITIES:
        A('| {0} | not yet confirmed against a library release |'.format(a))
    A('')
    A('"Not yet confirmed" is the honest state: the tool cites these authorities, '
      'but no edition or revision date has been checked against an approved '
      'library release. Confirming them is a Guidance Watch task, not an '
      'engineering one, and this table is where the answer belongs.')
    A('')
    A('## Summary')
    A('')
    A('- {0} access and performance boxes'.format(len(bx)))
    A('- {0} stated claims ({1} requirements, {2} notes)'.format(
        n_claims, n_req, n_claims - n_req))
    A('- {0} blocking messages, {1} advisory messages'.format(
        len(set(msg['must'])), len(set(msg['warns']))))
    gap = msg['must_computed'] + msg['warns_computed']
    if gap:
        A('- {0} further messages are assembled from values at run time and are '
          'not reproduced here'.format(gap))
    A('')
    A('## Claims stated on each box')
    A('')
    for b in bx:
        A('### {0}'.format(b['label']))
        if b['desc']:
            A('')
            A('*{0}*'.format(b['desc']))
        A('')
        if not b['claims']:
            A('No claims stated.')
            A('')
            continue
        for c in b['claims']:
            cite = ''
            if c['authorities']:
                cite = '  \n  Cited: ' + ', '.join(c['authorities'])
            A('- **{0}** - {1}{2}'.format(c['kind'], c['text'], cite))
        A('')
    A('## Blocking messages')
    A('')
    A('A draft cannot reach Issued while any of these is outstanding.')
    A('')
    for m in sorted(set(msg['must'])):
        A('- {0}'.format(m))
    A('')
    A('## Advisory messages')
    A('')
    A('Reported, never blocking.')
    A('')
    for m in sorted(set(msg['warns'])):
        A('- {0}'.format(m))
    A('')
    return '\n'.join(L) + '\n'


def main():
    doc = build_doc()
    if '--check' in sys.argv:
        if not OUT.exists():
            print('RULE CATALOG: missing ' + str(OUT))
            return 1
        if OUT.read_text(encoding='utf-8') != doc:
            print('RULE CATALOG: the committed catalog does not match the build. '
                  'Run python 02_DOCS/make_rule_catalog.py')
            return 1
        print('RULE CATALOG: PASS (matches the build)')
        return 0
    OUT.write_text(doc, encoding='utf-8')
    print('wrote ' + str(OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
