"""Build the demo from the current official HTML and the tracked fictitious seed."""
from pathlib import Path
import importlib.util
import sys

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('dd254_split', ROOT / '01_TOOL/rebuild_kit/split.py')
split = importlib.util.module_from_spec(spec)
spec.loader.exec_module(split)

def build_demo(check=False):
    official = Path(split.newest_build(ROOT / '01_TOOL'))
    output = official.with_name(official.stem + '_DEMO.HTM')
    payload = official.read_bytes() + (ROOT / '01_TOOL/demo_seed.html').read_bytes()
    if check:
        if not output.exists() or output.read_bytes() != payload:
            raise SystemExit('Demo does not match the current official build and demo_seed.html')
        print('Demo parity verified:', output.name)
    else:
        output.write_bytes(payload)
        print('Built', output.name, len(payload), 'bytes')
    return output

if __name__ == '__main__':
    build_demo('--check' in sys.argv)
