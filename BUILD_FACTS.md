# Build facts — generated, do not hand-edit

Produced by `01_TOOL/make_build_facts.py` on 2026-11-11.
The documents stream reads this instead of asking for numbers.

| | |
|---|---|
| **File** | `DD254_Interactive_v2.19.0.HTM` |
| **Tool version** | `2.168` |
| **Size** | 1,788,689 bytes |
| **SHA-256** | `b206a6d2f736a849a2f102fa8be628524b81fe8ab5d3c6ef3029baa8e168a6c8` |
| **Regression assertions** | 1568 |

## Component split

Share is of the shipped file, so it is measured on what actually occupies the
file. The two forms are stored base64-encoded, which is larger than the PDF you
would download; both figures are given so neither is misleading.

| Component | In the file | Decoded | Share of file |
|---|---|---|---|
| pdf-lib (MIT) | 525,667 UTF-8 bytes | — | 29.4% |
| DD Form 254, flat | 0 chars | 0 bytes | 0.0% |
| DD Form 254, dynamic XFA | 76,004 chars | 57,002 bytes | 4.2% |
| **Application code** | **991,715 UTF-8 bytes** | — | **55.4%** |
| Markup and CSS | 195,303 UTF-8 bytes | — | 10.9% |

Not the author's code: **33.6%** of the file.

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
