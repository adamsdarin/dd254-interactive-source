"""Exercise release selection and parity without modifying shipped files."""
import importlib.util
from pathlib import Path
import tempfile
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('split',ROOT/'01_TOOL/rebuild_kit/split.py')
split=importlib.util.module_from_spec(spec);spec.loader.exec_module(split)
with tempfile.TemporaryDirectory() as tmp:
    for version in ('99','195','1.9','1.10.0','1.2'):
        (Path(tmp)/f'DD254_Interactive_v{version}.HTM').write_text('fixture')
    (Path(tmp)/'DD254_Interactive_v99.99_DEMO.HTM').write_text('fixture')
    assert Path(split.newest_build(tmp)).name=='DD254_Interactive_v1.10.0.HTM'
subprocess.run([sys.executable,str(ROOT/'make_demo.py'),'--check'],cwd=ROOT,check=True)
print('RELEASE TOOLS: PASS (semantic ordering, legacy preservation, demo parity)')
