# Security

## Reporting

Use **GitHub → Security → Report a vulnerability** (private disclosure), or
open a public issue if the finding is not sensitive.

This is a personal project maintained by one person. There is no SLA and no
bounty. Expect a first response within a couple of weeks. If something is
genuinely urgent, say so in the title.

## Scope

**In scope** — the application code in `01_TOOL/`:

- anything that causes the tool to make a network request;
- injection of attacker-controlled content into the DOM or into a generated
  PDF, including via an imported template or a loaded save file;
- data written outside the browser's own storage for this origin;
- validation logic that reports a DD-254 as complete when it is not, or
  clears an approval hold that should stand;
- anything in the documented provenance that is **wrong** — see
  [VERIFY.md](VERIFY.md). Documentation that overstates what can be verified
  is a security finding here, not a typo.

**Out of scope:**

- The behaviour of `pdf-lib`. Report those upstream at
  <https://github.com/Hopding/pdf-lib>. That the library is embedded rather
  than linked is a deliberate, documented decision — see
  [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- The DD Form 254 itself, which is a Government document.
- "The HTML file is very large," "it contains base64," or "it contains
  minified JavaScript." All three are true and all three are explained and
  independently verifiable in [VERIFY.md](VERIFY.md). Work through that first;
  if it does not resolve your concern, the gap in *it* is the finding.
- Anything requiring an attacker to already have write access to the user's
  filesystem or browser profile.

## Threat model, stated plainly

The tool is a static HTML file executed locally in the user's own browser. It
has no server, no accounts, no authentication and no network calls. There is
no multi-user boundary to breach and no session to hijack.

That means the realistic risks are narrow, and worth naming:

1. **Supply chain.** The file you run should be the file that was built from
   the source you can read. Addressed by signed build provenance on release
   assets — see [VERIFY.md § 4](VERIFY.md#4-the-file-you-downloaded-is-the-file-described-here).
   This is the risk that actually matters.
2. **Untrusted input.** Imported templates and save files come from elsewhere
   and are parsed by the tool. In scope, above.
3. **Correctness.** A tool that silently mis-states a classification
   requirement does more damage in this domain than most memory-safety bugs
   would. Treated as a security issue here, not merely a defect.

## What is deliberately not defended against

- **The contents of your browser's storage.** The tool saves your work to
  IndexedDB on your own machine, in the clear. Anyone with access to that
  browser profile can read it. That is a property of the design, not a bug.
  Decide accordingly what you put in it — see
  [Intended use](README.md#intended-use).
- **This tool is not accredited for classified processing.** Nothing about
  its construction makes it suitable for that, and no report will change it.
