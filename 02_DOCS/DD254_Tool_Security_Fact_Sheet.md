# DD254 Interactive — security fact sheet

Codex Astra v2.0.1 / Tool v2.138, 15 September 2026.

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

## Working material

Since v1.14.0 the tool keeps no record of the preparer's working material. The
Source & Validation Log and the Optional supporting records panel were removed:
there is no source log, no uploaded attachment, no review question, requirement
or cost record, no closeout record and no separate review PDF. The tool stores no
uploaded file bytes; its remaining file inputs import drafts, backups and template
data. Drafts saved by earlier versions keep any such material in browser storage
and Full Backup until they are next saved from the form. Since v1.14.1, opening
such a draft first lists that material and offers to export the stored workspace
as a JSON file — including any attached file bytes it holds — before the save
that drops it; the export inherits the handling limits below. Since v1.15.1 a
received fillable DD Form 254 can be imported into a DD-254 Template Language
entry. The PDF is read in memory and not stored; only the template fields and an
audit entry with the file name and SHA-256 are kept. Parsing uses the embedded
pdf-lib and the browser's own XML parser, with no network access. Since v1.15.3
the optional sensitive-terms list is stored in browser local storage only as a
random salt and salted SHA-256 fingerprints of unclassified terms; it is not in
Full Backup, template packs or exports, and match warnings never contain a term.
Fingerprints resist casual reading, not a determined guess of short terms. This release
adds no automatic sending or remote lookup.

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
