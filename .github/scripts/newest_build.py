#!/usr/bin/env python3
"""Print the path of the shipped build (or the demo, with --demo).

Workflows need to name the current build. Hard-coding a version in a workflow
file is the same manual step that let manifest.json sit three versions stale,
arriving by a different route -- so the workflows ask split.py, which is the
one place that rule lives.
"""
import os, sys, glob, re, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOOL = os.path.join(ROOT, "01_TOOL")

if "--demo" in sys.argv:
    # The mirror of newest_build()'s rule, for the file it deliberately
    # excludes. Sorted on the version NUMBER: a lexical sort puts v99 above
    # v168 the moment two- and three-digit versions coexist.
    found = [f for f in glob.glob(os.path.join(TOOL, "DD254_Interactive_v*.HTM"))
             if "DEMO" in os.path.basename(f).upper()]
    if not found:
        sys.exit("no demo build found in %s" % TOOL)
    vnum = lambda p: int(re.search(r'_v(\d+)_DEMO\.HTM$', os.path.basename(p), re.I).group(1))
    print(max(found, key=vnum))
else:
    saved, sys.dont_write_bytecode = sys.dont_write_bytecode, True
    spec = importlib.util.spec_from_file_location(
        "dd254_split", os.path.join(TOOL, "rebuild_kit", "split.py"))
    split = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(split)
    sys.dont_write_bytecode = saved
    print(split.newest_build(TOOL))
