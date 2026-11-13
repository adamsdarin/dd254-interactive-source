# Build facts — generated, do not hand-edit

Produced by `01_TOOL/make_build_facts.py` on 2026-11-13.
The documents stream reads this instead of asking for numbers.

| | |
|---|---|
| **File** | `DD254_Interactive_v2.20.1.HTM` |
| **Tool version** | `2.170` |
| **Size** | 1,801,824 bytes |
| **SHA-256** | `062dfcf958134324a646c33cb6e971750e9cd02a692a63ffc7e81b4d59930c01` |
| **Regression assertions** | 1589 |

## Component split

Share is of the shipped file, so it is measured on what actually occupies the
file. The two forms are stored base64-encoded, which is larger than the PDF you
would download; both figures are given so neither is misleading.

| Component | In the file | Decoded | Share of file |
|---|---|---|---|
| pdf-lib (MIT) | 525,667 UTF-8 bytes | — | 29.2% |
| DD Form 254, flat | 0 chars | 0 bytes | 0.0% |
| DD Form 254, dynamic XFA | 76,004 chars | 57,002 bytes | 4.2% |
| **Application code** | **1,004,850 UTF-8 bytes** | — | **55.8%** |
| Markup and CSS | 195,303 UTF-8 bytes | — | 10.8% |

Not the author's code: **33.4%** of the file.

## Component hashes

```
pdf-lib block (as embedded) 1cd7d1f51f15de482b8e9cb7712539632a0ddefc289aa93fea9f2b145f78c9fb
DD254_XFA_B64   (decoded)   15548b91fa625b015b98221cd3d5933138bf81ad4848d43a34864f886af23d01
```

## If the assertion count says NOT RUN

Run the suite and save its output first, then regenerate:

```
cd 01_TOOL && node dd254_regression.js > TEST_RESULT.txt && python3 make_build_facts.py
```

## What to update in the documents stream

- Security fact sheet — filename, size, SHA-256, assertion count, component table
- Rebuild guide — same
- Rebuild manifest — refreshed automatically by this script; no separate step
- User manual — only if user-visible behaviour changed
