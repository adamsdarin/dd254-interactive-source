"""Fail releases that ship a manual for a different application version."""
from pathlib import Path
import importlib.util
import re
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('split',ROOT/'01_TOOL/rebuild_kit/split.py')
split=importlib.util.module_from_spec(spec);spec.loader.exec_module(split)
build=Path(split.newest_build(ROOT/'01_TOOL'))
version=re.search(r"TOOL_VERSION='([^']+)'",build.read_text(encoding='utf-8')).group(1)
manual=ROOT/'02_DOCS/DD254_Interactive_User_Manual.pdf'
source_copy=ROOT/'02_DOCS/manual_source/DD254_User_Manual.pdf'
assert manual.read_bytes()==source_copy.read_bytes(), 'The two manual PDFs differ'
text='\n'.join(page.extract_text() or '' for page in PdfReader(manual).pages)
text=re.sub(r'\s+',' ',text)
assert f'tool version {version}' in text, 'The manual version differs from the tool'
assert 'Dashboard notes now preserve quick edits' in text
assert 'A DD Form 254 can itself contain classified information' in text
assert 'Only the backed-up changes clear when you confirm' in text
assert 'The flat derivative is not the original Government download' in text
assert 'may only be UNCLASSIFIED or CUI' not in text
assert '\u25a0' not in text, 'Possible missing-font glyph in manual'

# The security fact sheet names the release it describes, and nothing checked it:
# v1.13.0 shipped one labelled v1.12.0 and v2.1.0 shipped one labelled v2.0.3.
release=re.search(r"RELEASE_VERSION='([^']+)'",build.read_text(encoding='utf-8')).group(1)
sheet=(ROOT/'02_DOCS/DD254_Tool_Security_Fact_Sheet.md').read_text(encoding='utf-8')
assert f'DD254 Interactive v{release} / Tool v{version}' in sheet, (
    f'The security fact sheet does not name v{release} / Tool v{version}')

# The rule catalog is generated from the build. A committed copy that no
# longer matches it would be a second statement of what the tool enforces,
# and the whole point of the catalog is that it cannot say something the
# build does not.
rc_spec=importlib.util.spec_from_file_location('rule_catalog',ROOT/'02_DOCS/make_rule_catalog.py')
rule_catalog=importlib.util.module_from_spec(rc_spec);rc_spec.loader.exec_module(rule_catalog)
catalog=ROOT/'02_DOCS/DD254_Rule_Catalog.md'
assert catalog.exists(), 'The rule catalog is missing; run python 02_DOCS/make_rule_catalog.py'
assert catalog.read_text(encoding='utf-8')==rule_catalog.build_doc(), (
    'The rule catalog does not match the build; run python 02_DOCS/make_rule_catalog.py')

# The SBOM is derived from the rebuild manifest and the pdf-lib verifier for
# the same reason: a hand-kept component list goes stale without anyone noticing.
sb_spec=importlib.util.spec_from_file_location('sbom',ROOT/'02_DOCS/make_sbom.py')
sbom=importlib.util.module_from_spec(sb_spec);sb_spec.loader.exec_module(sbom)
bom=ROOT/'02_DOCS/DD254_Interactive_SBOM.cdx.json'
assert bom.exists(), 'The SBOM is missing; run python 02_DOCS/make_sbom.py'
assert bom.read_text(encoding='utf-8')==sbom.build_doc(), (
    'The SBOM does not match the build; run python 02_DOCS/make_sbom.py')

print('DOCUMENTATION: PASS (manual, published copies, guidance, rule catalog and SBOM)')
