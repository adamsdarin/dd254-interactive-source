#!/usr/bin/env python3
"""Split the single-file tool into independently sourceable parts."""
import io,re,os,sys,glob,hashlib,base64,json

HERE=os.path.dirname(os.path.abspath(__file__))
TOOL=os.path.dirname(HERE)

def newest_build(where):
    """The shipped build, discovered rather than named.

    manifest.json sat three versions behind the shipped tool because naming
    the build was a manual step and this script defaulted to a version that
    had not been current for eighteen releases. A reviewer following our own
    verification procedure got a hash mismatch on the authentic file, and had
    no way to tell a stale manifest from a tampered one: the check failed on
    the genuine article. Discovery removes the step that was being forgotten.

    Sorted on the version NUMBER, not the filename. A lexical sort puts v99
    above v168 the moment two- and three-digit versions coexist, which would
    silently pin the manifest to an old build — the same failure this
    function exists to prevent, arriving by a quieter route.

    This is the only implementation of the rule. make_build_facts.py loads
    this module and calls it rather than keeping its own copy, so the two
    cannot disagree about which file is "the build" — which is how
    manifest.json came to sit three versions behind.

    The dependency runs one way. Nothing here imports from 01_TOOL, so
    `cd rebuild_kit && python3 split.py` still works with the directory
    handed over on its own.
    """
    found=[f for f in glob.glob(os.path.join(where,'DD254_Interactive_v*.HTM'))
           if 'DEMO' not in os.path.basename(f).upper()]
    if not found: sys.exit('no build found in %s'%where)
    def vnum(p):
        name=os.path.basename(p)
        semantic=re.search(r'_v(\d+(?:\.\d+)+)\.HTM$',name,re.I)
        if semantic:
            return (1,tuple(int(part) for part in semantic.group(1).split('.')))
        legacy=re.search(r'_v(\d+)\.HTM$',name,re.I)
        return (0,(int(legacy.group(1)),)) if legacy else (-1,())
    return max(found,key=vnum)

def split(src,out):
    """Write the parts and return the manifest.

    A function rather than module-level code so make_build_facts.py can call
    it instead of reimplementing it. The two scripts used to parse the same
    build independently and publish overlapping facts about it, and they
    disagreed twice: manifest.json sat three versions stale, and the two
    documents reported different SHA-256 values for the same vendored
    library. Both were the same defect — the file described in two places.

    The dependency runs one way only, parent to kit. Nothing here imports
    make_build_facts.py, because this directory is handed to security
    reviewers on its own and must run with no reference to anything above it.
    """
    os.makedirs(out,exist_ok=True)
    s=io.open(src,encoding='utf-8').read()
    sha=lambda b: hashlib.sha256(b if isinstance(b,bytes) else b.encode('utf-8')).hexdigest()

    man={'source':os.path.basename(src),'sha256':sha(io.open(src,'rb').read()),'parts':{}}
    def emit(name,text,note,binary=None):
        p=os.path.join(out,name)
        io.open(p,'w',encoding='utf-8').write(text)
        man['parts'][name]={'chars':len(text),'sha256':sha(text),'note':note}
        if binary is not None:
            man['parts'][name]['decoded_sha256']=sha(binary)
            man['parts'][name]['decoded_bytes']=len(binary)

    # 1. pdf-lib — the third-party library block
    m=re.search(r'<script\b[^>]*>((?:(?!</script>).)*pdf-lib\.min\.js\.map(?:(?!</script>).)*)</script>',s,re.S)
    assert m,'pdf-lib block not found'
    # Written verbatim. rebuild.py substitutes this file's exact contents back
    # into @@PDFLIB@@, so trimming it would end the byte-identical round-trip.
    emit('01_pdflib.js',m.group(1),'Third-party MIT library. Replace with your own copy of pdf-lib.min.js.')
    s=s[:m.start(1)]+'@@PDFLIB@@'+s[m.end(1):]

    # 2 & 3. the two government forms
    for const,fn in [('DD254_BASE_B64','02_dd254_flat.b64'),('DD254_XFA_B64','03_dd254_xfa.b64')]:
        m=re.search(const+r'\s*=\s*"([A-Za-z0-9+/=]+)"',s)
        assert m,const+' not found'
        b64=m.group(1)
        note=('Flat print-to-PDF derivative of DD Form 254; exact rendering procedure is undocumented. Not a byte-identical Government download.'
              if const=='DD254_BASE_B64' else
              'DD Form 254 dynamic XFA, sourced from esd.whs.mil, base64. Verify against your own official download.')
        emit(fn,b64,note,base64.b64decode(b64))
        s=s[:m.start(1)]+'@@'+const+'@@'+s[m.end(1):]

    # 4. everything else — the part that needs human review
    emit('04_application.html',s,'Application code, markup and CSS. THIS is the part to review.')
    io.open(os.path.join(out,'manifest.json'),'w').write(json.dumps(man,indent=2))
    return man

def report(man,out):
    print('split into %s/'%out)
    for k,v in man['parts'].items():
        print('  %-22s %9d chars  sha256 %s'%(k,v['chars'],v['sha256'][:16]+'...'))
    print('  original sha256:',man['sha256'])

if __name__=='__main__':
    # An explicit build still wins; discovery is only the default. One argument
    # that is not an .HTM file is the output directory, so `split.py parts` works.
    args=sys.argv[1:]
    SRC=None
    if args and args[0].upper().endswith('.HTM'):
        SRC=args.pop(0)
    OUT=args[0] if args else 'parts'
    if SRC is None: SRC=newest_build(TOOL)
    report(split(SRC,OUT),OUT)
