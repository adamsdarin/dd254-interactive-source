"""Generate the CycloneDX SBOM for the shipped build.

An ISSM or supply-chain reviewer asks what is inside the file. The answer is
already recorded - the rebuild manifest carries a hash for every part and
verify_pdflib.py pins the one third-party library to an upstream release - so
this derives the SBOM from those records rather than restating them by hand.
A hand-written SBOM is a second source of truth that goes stale silently.

The timestamp is pinned, not taken from the clock, so the document is
reproducible: running this twice gives the same bytes, which is what lets
check_documentation.py verify the committed copy.

Usage:  python 02_DOCS/make_sbom.py [--check]
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '02_DOCS' / 'DD254_Interactive_SBOM.cdx.json'
MANIFEST = ROOT / '01_TOOL/rebuild_kit/manifest.json'
VERIFIER = ROOT / '01_TOOL/rebuild_kit/verify_pdflib.py'

spec = importlib.util.spec_from_file_location('split', ROOT / '01_TOOL/rebuild_kit/split.py')
split = importlib.util.module_from_spec(spec)
spec.loader.exec_module(split)

# Pinned so the document is reproducible. Update when the SBOM's own content
# changes materially, not on every build.
TIMESTAMP = '2026-10-05T00:00:00Z'


def const(src, name):
    return re.search(name + r'\s*=\s*"([^"]+)"', src).group(1)


def build_doc():
    build = Path(split.newest_build(ROOT / '01_TOOL'))
    src = build.read_text(encoding='utf-8')
    release = re.search(r"RELEASE_VERSION='([^']+)'", src).group(1)
    tool = re.search(r"TOOL_VERSION='([^']+)'", src).group(1)

    man = json.loads(MANIFEST.read_text(encoding='utf-8'))
    ver = VERIFIER.read_text(encoding='utf-8')
    pdflib_version = const(ver, 'UPSTREAM_VERSION')
    pdflib_sha = const(ver, 'UPSTREAM_SHA256')

    parts = man['parts']

    components = [
        {
            'type': 'library',
            'bom-ref': 'pkg:npm/pdf-lib@' + pdflib_version,
            'name': 'pdf-lib',
            'version': pdflib_version,
            'purl': 'pkg:npm/pdf-lib@' + pdflib_version,
            'description': (
                'PDF generation library, embedded in the single HTML file as '
                'dist/pdf-lib.min.js. Byte-identical to the published npm '
                'release; verify_pdflib.py proves it on every build.'),
            'licenses': [{'license': {'id': 'MIT'}}],
            'hashes': [{'alg': 'SHA-256', 'content': pdflib_sha}],
            'externalReferences': [
                {'type': 'distribution', 'url': 'https://www.npmjs.com/package/pdf-lib'},
                {'type': 'vcs', 'url': 'https://github.com/Hopding/pdf-lib'},
            ],
        },
        {
            'type': 'data',
            'bom-ref': 'dd254-xfa',
            'name': 'DD Form 254 (APR 2018) dynamic XFA',
            'version': 'APR 2018',
            'description': parts['03_dd254_xfa.b64']['note'],
            'licenses': [{'license': {'name': 'U.S. Government work, not subject to copyright'}}],
            'hashes': [{'alg': 'SHA-256',
                        'content': parts['03_dd254_xfa.b64']['decoded_sha256']}],
            'externalReferences': [
                {'type': 'distribution', 'url': 'https://www.esd.whs.mil/Directives/forms/'},
            ],
        },
        {
            'type': 'data',
            'bom-ref': 'dd254-flat',
            'name': 'DD Form 254 flat derivative',
            'version': 'APR 2018',
            'description': parts['02_dd254_flat.b64']['note'],
            'licenses': [{'license': {'name': 'U.S. Government work, not subject to copyright'}}],
            'hashes': [{'alg': 'SHA-256',
                        'content': parts['02_dd254_flat.b64']['decoded_sha256']}],
        },
        {
            'type': 'application',
            'bom-ref': 'dd254-application',
            'name': 'DD254 Interactive application code',
            'version': tool,
            'description': parts['04_application.html']['note'],
            'hashes': [{'alg': 'SHA-256', 'content': parts['04_application.html']['sha256']}],
        },
    ]

    doc = {
        'bomFormat': 'CycloneDX',
        'specVersion': '1.5',
        'version': 1,
        'metadata': {
            'timestamp': TIMESTAMP,
            'component': {
                'type': 'application',
                'bom-ref': 'dd254-interactive',
                'name': 'DD254 Interactive',
                'version': release,
                'description': (
                    'Single-file offline DD Form 254 preparation tool. No '
                    'installer, no network access at run time, no server '
                    'component; data stays in the browser profile that opened '
                    'the file.'),
                'hashes': [{'alg': 'SHA-256', 'content': man['sha256']}],
                'externalReferences': [
                    {'type': 'vcs',
                     'url': 'https://github.com/adamsdarin/dd254-interactive-source'},
                ],
            },
            'properties': [
                {'name': 'dd254:toolVersion', 'value': tool},
                {'name': 'dd254:buildFile', 'value': man['source']},
                {'name': 'dd254:runtimeNetworkAccess', 'value': 'none'},
                {'name': 'dd254:installer', 'value': 'none'},
                {'name': 'dd254:dataLocation',
                 'value': 'browser profile (IndexedDB, localStorage)'},
            ],
        },
        'components': components,
    }
    return json.dumps(doc, indent=2, sort_keys=False) + '\n'


def main():
    doc = build_doc()
    if '--check' in sys.argv:
        if not OUT.exists():
            print('SBOM: missing ' + str(OUT))
            return 1
        if OUT.read_text(encoding='utf-8') != doc:
            print('SBOM: the committed SBOM does not match the build. '
                  'Run python 02_DOCS/make_sbom.py')
            return 1
        print('SBOM: PASS (matches the build)')
        return 0
    OUT.write_text(doc, encoding='utf-8')
    print('wrote ' + str(OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
