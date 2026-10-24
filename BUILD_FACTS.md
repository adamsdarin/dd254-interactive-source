# Build facts — generated, do not hand-edit

Produced by `01_TOOL/make_build_facts.py` on 2026-10-23.
The documents stream reads this instead of asking for numbers.

| | |
|---|---|
| **File** | `DD254_Interactive_v2.12.0.HTM` |
| **Tool version** | `2.158` |
| **Size** | 1,736,244 bytes |
| **SHA-256** | `fbbbf4e28b13cb1b383a3259971589360eadbf5100d766f10259c61d86882d65` |
| **Regression assertions** | 1460 |

## Component split

Share is of the shipped file, so it is measured on what actually occupies the
file. The two forms are stored base64-encoded, which is larger than the PDF you
would download; both figures are given so neither is misleading.

| Component | In the file | Decoded | Share of file |
|---|---|---|---|
| pdf-lib (MIT) | 525,667 UTF-8 bytes | — | 30.3% |
| DD Form 254, flat | 0 chars | 0 bytes | 0.0% |
| DD Form 254, dynamic XFA | 83,284 chars | 62,461 bytes | 4.8% |
| **Application code** | **932,609 UTF-8 bytes** | — | **53.7%** |
| Markup and CSS | 194,684 UTF-8 bytes | — | 11.2% |

Not the author's code: **35.1%** of the file.

## Component hashes

```
pdf-lib block (as embedded) 1cd7d1f51f15de482b8e9cb7712539632a0ddefc289aa93fea9f2b145f78c9fb
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
