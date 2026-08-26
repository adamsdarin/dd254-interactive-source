#!/usr/bin/env python3
"""Reassemble the tool from parts. Verifies the result against the manifest."""
import io,os,sys,json,hashlib
IN=sys.argv[1] if len(sys.argv)>1 else 'parts'
OUT=sys.argv[2] if len(sys.argv)>2 else 'REBUILT.HTM'
man=json.load(io.open(os.path.join(IN,'manifest.json')))
rd=lambda n: io.open(os.path.join(IN,n),encoding='utf-8').read()
sha=lambda b: hashlib.sha256(b if isinstance(b,bytes) else b.encode('utf-8')).hexdigest()

for n,meta in man['parts'].items():
    got=sha(rd(n))
    print('  %-22s %s'%(n,'unchanged' if got==meta['sha256'] else 'REPLACED (' + got[:16] + '...)'))

out=(rd('04_application.html')
     .replace('@@PDFLIB@@',rd('01_pdflib.js'))
     .replace('@@DD254_BASE_B64@@',rd('02_dd254_flat.b64'))
     .replace('@@DD254_XFA_B64@@',rd('03_dd254_xfa.b64')))
# The manifest authenticates bytes. Text-mode output can rewrite line endings
# on Windows, making an unchanged set of parts fail against the genuine build.
# Encoding once and writing binary keeps the reconstruction platform-neutral.
with io.open(OUT,'wb') as f:
    f.write(out.encode('utf-8'))
final=sha(io.open(OUT,'rb').read())
print('\nrebuilt : %s (%d bytes)'%(OUT,os.path.getsize(OUT)))
print('sha256  :',final)
print('original:',man['sha256'])
print('RESULT  :','byte-identical' if final==man['sha256'] else 'differs (expected if you swapped a part)')
