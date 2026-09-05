# DD254 Interactive — security fact sheet

Release v1.10.0 / Tool v2.122, 4 September 2026.

This is an offline, single-user drafting aid. The official HTML embeds its
JavaScript, PDF library and form assets. It uses local browser storage and
downloads files at the operator's request. It has no telemetry, application
server, account service or remote data store. Prepared e-mail opens the user's
mail client; the operator reviews recipients and sends the message.

## What to verify

The current filename, byte size, SHA-256, passing regression count, component
sizes and component hashes are generated in [BUILD_FACTS.md](../BUILD_FACTS.md).
The [manifest](../01_TOOL/rebuild_kit/manifest.json) is derived from the same
HTML. [VERIFY.md](../VERIFY.md) gives the checks, including the byte-identical
split/rebuild and the comparison of pdf-lib with its upstream release.

The dynamic XFA form is sourced from the Government's DD Form 254. The flat PDF
is a print-to-PDF derivative whose precise rendering procedure is undocumented.
It is retained as an internal legacy test oracle, not presented as an exact
Government download. The official user-facing export uses the dynamic form.

## Storage and recovery

Drafts and templates use IndexedDB with a localStorage fallback. Full Backup
contains templates, drafts and audit history. Draft/template contents and audit
history have separate integrity hashes. Hashes detect accidental alteration;
they do not authenticate the person who supplied an imported backup.

The tool raises a persistent warning if a draft cannot be stored. Failed
individual IndexedDB writes keep an emergency copy in the current tab that can
be included in Full Backup. That copy disappears when the tab closes. Full
Backup includes pending form, template and note edits, refuses an unreadable
draft store, and preserves the reminder for changes made after its snapshot.
The download confirmation is the operator's report, not proof from the browser
that a file exists on disk.

## Boundaries

- No accreditation for classified processing. Never enter classified content
  or attach classified material. An actual DD Form 254 may itself be classified;
  prepare it on an approved system.
- CUI use depends on the organization's authorized environment and contract.
  The application does not encrypt browser storage or exported files.
- Validation and workflow states do not certify a DD Form 254 or replace GCA,
  contracting, CSA or other approval authority.
- An offline copy does not automatically update. Export a Full Backup before
  moving to a new file or browser origin, then restore and verify it.
- A green regression run establishes tested behavior, not a security assessment
  of every possible browser, imported file or contractual fact pattern.

Report vulnerabilities using [SECURITY.md](../SECURITY.md).
