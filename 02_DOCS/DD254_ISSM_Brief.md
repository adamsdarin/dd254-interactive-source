# DD254 Interactive — brief for the ISSM

DD254 Interactive v2.7.1 / Tool v2.151. Two pages, for the officer deciding
whether this file may be opened on a managed workstation.

The longer [security fact sheet](DD254_Tool_Security_Fact_Sheet.md) is written
for a reader who has already decided to look. This answers the four questions
asked before that.

---

## 1. What is it?

One HTML file, about 2.3 MB, opened from the local filesystem in a browser the
workstation already has. It helps a Facility Security Officer prepare, validate
and track DD Form 254 security classification specifications.

It is not an installer, a service, an extension or a packaged application. There
is nothing to deploy and nothing to uninstall: the file is a document that the
browser renders.

## 2. Does it reach the network?

**No, at run time.** The file embeds everything it uses — its code, its styles,
the PDF library that generates the output, and the DD Form 254 itself. It makes
no request in order to load or to run.

Three qualifications, stated plainly:

- The page contains **hyperlinks** to published authorities (eCFR, DoD issuance
  pages, DCSA). They are ordinary links. Nothing is fetched unless a person
  clicks one, and clicking opens the workstation's normal browser navigation.
- **Open e-mail** builds a `mailto:` link and hands it to whatever mail client
  the workstation has registered. The tool does not send mail and has no mail
  transport of its own.
- Opening the file from a **web server or file share** is the reader's choice of
  delivery, not a behaviour of the file.

An egress rule that blocks the browser profile will not stop the tool working.

## 3. Where does the data live?

In the browser profile that opened the file, on that machine:

- **IndexedDB** holds drafts, the audit log and template libraries.
- **localStorage** holds template libraries and settings.

Storage is bound to the file's origin, so a copy of the tool at a different path
or on a different machine sees none of it. Nothing is written outside the browser
profile except files the operator explicitly downloads — a generated PDF, a CSV,
a backup JSON — which land in the normal downloads location.

**There is no server, no account, no synchronisation and no telemetry.** Nothing
leaves the workstation unless a person attaches or sends it.

Two consequences worth stating to the FSO who will use it:

- Clearing site data, resetting the browser profile or reimaging the machine
  destroys the records. The tool's Full Backup exists for this reason.
- A **Full Backup JSON is plain text.** It carries contract numbers, facility
  addresses and FSO e-mail addresses, and should be handled as the working
  material it is. The tool supports UNCLASSIFIED and CUI entries only.

## 4. How is it removed?

Delete the HTML file, then clear site data for its origin in the browser. That is
the whole removal procedure. No registry keys, no services, no profile fragments
elsewhere, no uninstaller.

---

## What can be verified independently

Every published release carries the evidence to check it without trusting this
document:

| Artefact | What it proves |
| --- | --- |
| `SHA256SUMS.txt` | The bytes received are the bytes published |
| Build provenance attestation | The HTML you run was built by the project's own release workflow from the tagged commit; verify with `gh attestation verify` |
| `rebuild_kit.tar.gz` | Splits the file into its parts and rebuilds it **byte-identically**, so the application code can be read on its own |
| `verify_pdflib.py` | The embedded PDF library is byte-identical to the published `pdf-lib@1.17.1` release |
| `DD254_Interactive_SBOM.cdx.json` | CycloneDX component inventory with licences and hashes |
| `DD254_Rule_Catalog.md` | Every rule the tool enforces, in readable form |

The application code is one part of the rebuild kit (`04_application.html`) and
is the only part that needs code review; the remainder is the PDF library and
the Government form.

## Limits this brief does not cover

- **Section 508.** No conformance report from an audit exists. The application
  assigns accessible names to its controls and its selection tiles are keyboard
  operable, but that is a developer's statement about the code, not an
  accessibility conformance report, and it should not be read as one.
- **Classified handling.** The tool supports UNCLASSIFIED and CUI entries only.
  A classified DD Form 254 must be prepared on an approved system. The tool says
  so on the form itself and cannot enforce it.
- **Correctness of the guidance.** A regression suite and a native-browser check
  run on every release, and the rule catalog lists what is enforced. Neither
  makes the tool an authority on classification decisions; the Government
  Contracting Activity's written guidance remains the controlling record.
