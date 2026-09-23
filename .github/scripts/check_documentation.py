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

print('DOCUMENTATION: PASS (manual versions, published copies and updated guidance)')
