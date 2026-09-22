# Build facts — generated, do not hand-edit

Produced by `01_TOOL/make_build_facts.py` on 2026-09-22.
The documents stream reads this instead of asking for numbers.

| | |
|---|---|
| **File** | `DD254_Interactive_v2.1.0.HTM` |
| **Tool version** | `2.141` |
| **Size** | 2,306,587 bytes |
| **SHA-256** | `63d66b93907bece68fc7ead5cbbba1ca2b3cbbfa451dd42b5491bb034dd1c5a4` |
| **Regression assertions** | 1179 |

## Component split

Share is of the shipped file, so it is measured on what actually occupies the
file. The two forms are stored base64-encoded, which is larger than the PDF you
would download; both figures are given so neither is misleading.

| Component | In the file | Decoded | Share of file |
|---|---|---|---|
| pdf-lib (MIT) | 525,667 UTF-8 bytes | — | 22.8% |
| DD Form 254, flat | 738,164 chars | 553,623 bytes | 32.0% |
| DD Form 254, dynamic XFA | 83,284 chars | 62,461 bytes | 3.6% |
| **Application code** | **741,961 UTF-8 bytes** | — | **32.2%** |
| Markup and CSS | 217,511 UTF-8 bytes | — | 9.4% |

Not the author's code: **58.4%** of the file.

## Component hashes

```
pdf-lib block (as embedded) 1cd7d1f51f15de482b8e9cb7712539632a0ddefc289aa93fea9f2b145f78c9fb
DD254_BASE_B64  (decoded)   ff0b984f0a217339904eb037c4c27f344c5dd42804df2d9ed614cca35d025cf0
DD254_XFA_B64   (decoded)   86d380749d592f2a900c695bf651de2ebfb962b2d8b0071b244b90045ff217b1
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
