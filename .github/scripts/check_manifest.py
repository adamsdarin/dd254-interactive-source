#!/usr/bin/env python3
"""Fail the build when the published facts no longer describe the build.

This check exists because of a specific incident. manifest.json sat three
versions behind the shipped tool. A reviewer following the project's own
verification procedure got a hash mismatch -- on the authentic file -- and had
no way to distinguish a stale manifest from a tampered one. The check failed
on the genuine article, which is the worst possible outcome for a document
whose entire purpose is establishing trust.

split.py's newest_build() removed the manual step that caused it. This removes
the possibility of shipping without running it.

Three things are checked:
  1. rebuild_kit/manifest.json equals what split.py derives from the build now.
  2. BUILD_FACTS.md's volatile values match the build now.
  3. The parts reassemble into the build byte-for-byte.

BUILD_FACTS.md is compared field by field rather than by regenerating and
diffing, because it stamps its own generation date -- a whole-file diff would
fail every day for a reason that has nothing to do with correctness.
"""
import os, re, io, sys, json, hashlib, tempfile, subprocess, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOOL = os.path.join(ROOT, "01_TOOL")
KIT = os.path.join(TOOL, "rebuild_kit")

saved, sys.dont_write_bytecode = sys.dont_write_bytecode, True
spec = importlib.util.spec_from_file_location("dd254_split", os.path.join(KIT, "split.py"))
split = importlib.util.module_from_spec(spec)
spec.loader.exec_module(split)
sys.dont_write_bytecode = saved

problems = []
build = split.newest_build(TOOL)
name = os.path.basename(build)
raw = io.open(build, "rb").read()
build_sha = hashlib.sha256(raw).hexdigest()
print("build: %s  (%d bytes, sha256 %s)" % (name, len(raw), build_sha))

# ---------------------------------------------------------------- 1. manifest
with tempfile.TemporaryDirectory() as tmp:
    fresh = split.split(build, tmp)
    committed_path = os.path.join(KIT, "manifest.json")
    if not os.path.exists(committed_path):
        problems.append("rebuild_kit/manifest.json is missing")
    else:
        committed = json.load(io.open(committed_path))
        if committed != fresh:
            if committed.get("source") != fresh.get("source"):
                problems.append(
                    "manifest.json describes %r but the build is %r -- "
                    "run 01_TOOL/make_build_facts.py"
                    % (committed.get("source"), fresh.get("source")))
            else:
                problems.append("manifest.json disagrees with the build; "
                                "run 01_TOOL/make_build_facts.py")
            for k in sorted(set(list(committed.get("parts", {})) +
                                list(fresh.get("parts", {})))):
                a = committed.get("parts", {}).get(k, {}).get("sha256")
                b = fresh.get("parts", {}).get(k, {}).get("sha256")
                if a != b:
                    problems.append("  part %s: manifest %s / actual %s"
                                    % (k, (a or "absent")[:16], (b or "absent")[:16]))
        else:
            print("manifest.json  : matches the build")

    # ------------------------------------------------------------ 3. round-trip
    r = subprocess.run([sys.executable, os.path.join(KIT, "rebuild.py"),
                        tmp, os.path.join(tmp, "REBUILT.HTM")],
                       capture_output=True, text=True, cwd=tmp)
    rebuilt = os.path.join(tmp, "REBUILT.HTM")
    if r.returncode != 0 or not os.path.exists(rebuilt):
        problems.append("rebuild.py failed:\n" + (r.stderr or r.stdout)[:1500])
    else:
        got = hashlib.sha256(io.open(rebuilt, "rb").read()).hexdigest()
        if got != build_sha:
            problems.append("round-trip is not byte-identical: rebuilt %s vs build %s"
                            % (got[:16], build_sha[:16]))
        else:
            print("round-trip     : byte-identical")

# ------------------------------------------------------------- 2. BUILD_FACTS
facts_path = os.path.join(ROOT, "BUILD_FACTS.md")
if not os.path.exists(facts_path):
    problems.append("BUILD_FACTS.md is missing -- run 01_TOOL/make_build_facts.py")
else:
    facts = io.open(facts_path, encoding="utf-8").read()
    if name not in facts:
        problems.append("BUILD_FACTS.md does not name the current build (%s) -- "
                        "run 01_TOOL/make_build_facts.py" % name)
    if build_sha not in facts:
        problems.append("BUILD_FACTS.md does not carry the current SHA-256 -- "
                        "run 01_TOOL/make_build_facts.py")
    if "{:,}".format(len(raw)) not in facts and str(len(raw)) not in facts:
        problems.append("BUILD_FACTS.md does not carry the current byte size -- "
                        "run 01_TOOL/make_build_facts.py")
    # Match the assertion-count table row specifically. A bare search for
    # "NOT RUN" also hits the prose section that explains what to do when the
    # count says NOT RUN, and reports a healthy build as broken.
    row = re.search(r'\|\s*\*{0,2}Regression assertions\*{0,2}\s*\|([^|\n]*)\|', facts)
    if row is None:
        problems.append("BUILD_FACTS.md has no regression assertion row")
    elif "NOT RUN" in row.group(1).upper():
        problems.append("BUILD_FACTS.md reports the test suite as NOT RUN -- "
                        "run the suite and regenerate")
    result_path=os.path.join(TOOL,'TEST_RESULT.txt')
    recorded=io.open(result_path,encoding='utf-8').read() if os.path.exists(result_path) else ''
    tested=re.search(r'(?m)^BUILD_SHA256 ([a-f0-9]{64})$',recorded)
    result=re.search(r'PASS\s+(\d+)\s+FAIL\s+(\d+)',recorded)
    if not tested or tested.group(1)!=build_sha:
        problems.append('TEST_RESULT.txt was not recorded against the current build')
    if not result or result.group(2)!='0':
        problems.append('TEST_RESULT.txt has no successful regression summary')
    elif row and row.group(1).strip()!=result.group(1):
        problems.append('BUILD_FACTS.md assertion count disagrees with TEST_RESULT.txt')
    version=re.search(r"TOOL_VERSION='([^']+)'",raw.decode('utf-8'))
    if not version or ('| **Tool version** | `'+version.group(1)+'` |') not in facts:
        problems.append('BUILD_FACTS.md tool version disagrees with the build')
    if not problems:
        print("BUILD_FACTS.md : matches the build")

print("")
if problems:
    print("RESULT: published facts do not describe the build\n")
    for p in problems:
        print("  - %s" % p)
    print("\nA reviewer following VERIFY.md would get a mismatch on the genuine")
    print("file. Regenerate before shipping:")
    print("    cd 01_TOOL && node dd254_regression.js > TEST_RESULT.txt && python3 make_build_facts.py")
    sys.exit(1)

print("RESULT: manifest, BUILD_FACTS.md and the build all agree")
