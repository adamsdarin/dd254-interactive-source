# DD254 review and change list — v1.10.0

4 September 2026. Reviewed baseline: public release filename v1.9, internal
Tool v2.121. Updated release: v1.10.0, Tool v2.122.

## Assessment

The existing single-file/offline architecture fits the tool's purpose. Its
strongest features include the official XFA export, revision lineage, approval
holds, separate issuance audiences and recoverable template writes. Replacing
the architecture or changing classification rules would add risk without a
clear user benefit. This release concentrates on demonstrated loss-of-work
paths and inconsistent release evidence.

The confidence estimates below are engineering judgments about whether the
owner would want each correction, not statistical measurements.

| Change | Evidence and reason | Confidence |
|---|---|---:|
| Preserve rapid notes on different cards | One shared timer cancelled the previous card's queued value; now per-record values are retained and flushed together. | 99% |
| Back up pending edits | Full Backup previously read stores before the form/template/note timers necessarily completed. | 99% |
| Keep reminders for changes after a snapshot | Download confirmation previously zeroed the entire change count even if edits occurred meanwhile. | 99% |
| Recover an individual failed IndexedDB write | The warning promised an in-tab copy, but that copy existed only for the localStorage path. The new path retains and exports the failed draft. | 99% |
| Refuse an unreadable portfolio backup | A failed getAll previously resolved to an empty list, which could create a falsely reassuring backup. | 99% |
| Correct classification help | Official DD254 instructions, page 1(d), allow a classified form. The software's restriction must not be described as a universal form rule. | 99% |
| Reproduce the demo | make_demo.py referenced a missing v189 demo. The seed is now a tracked source with byte-for-byte parity verification. | 99% |
| Select semantic release numbers | The official selector understood integer versions only; it could select a legacy build over a newer semantic release. | 99% |
| Bind tests to the shipped HTML | Build facts previously accepted a passing count without proving which file was tested. The log now records SHA-256. | 99% |
| Bound test waits and pin dependencies | Public CI timed out in the Holds section; fixed-time dialog sleeps could miss a modal and wait forever. The suite now waits for controls and names any timed-out assertion. | 98% |
| Correct provenance and links | The manifest called the flat derivative an official download; README linked releases to the demo-only repository. | 99% |
| Preserve release bytes across platforms | Git attributes protect HTML and binary PDFs from line-ending conversion; old release bytes remain intact. | 99% |
| Update the manual and document inventory | Maintainer instructions described absent files and obsolete release problems. | 99% |

## Validation

The recorded full regression run, bound to the candidate HTML's SHA-256, is in
[TEST_RESULT.txt](../01_TOOL/TEST_RESULT.txt). Current counts and hashes are in
[BUILD_FACTS.md](../BUILD_FACTS.md). The release requires real-browser smoke
checks (including actual JSON downloads with the latest note), syntax checks, exact demo parity, a byte-identical split/rebuild,
manifest agreement and upstream pdf-lib comparison. Public CI is also required
on the release commit before publishing the production demo.

## Scope and limits

The review did not relax an approval hold, promote an advisory to a mandatory
rule, redesign the form, change the official PDF packet, or modify a source
library. Contract-specific legal or classification judgments remain outside the
software. The application is not approved for classified processing. Existing
browser storage is not migrated silently between file names or origins; users
should back up, open the new version, restore and verify their records.

The lifecycle training is a separate rough-draft deliverable; it is not an
official DoD issuance or an authorization to handle classified information.
