# DD254 Interactive v2.0.3 — product name in the release label

18 September 2026. Internal Tool v2.140. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Before | Now |
| --- | --- | --- |
| Window title, form header, review-package release line | An internal codename with the version | "DD254 Interactive" with the version |
| Documentation | The codename in titles and headings | The product name |

## Why

The owner asked that the tool and its documentation carry only the product name.
The release label is shown on screen and printed on every page of a Contracting
Officer review package PDF, so it should name the product a reviewer is using.

## Verification and limits

The regression log for this exact build is in `TEST_RESULT.txt`; counts and hashes
are in `BUILD_FACTS.md`. The existing release-identity checks (the header rendered
from `RELEASE_VERSION`, the title, and a single release literal in the build) and
the review-package release line now expect the product name, as do the build check
and the browser smoke test; a new test checks the header, title and label together.

Run against the v2.0.2 build, the four release-name checks failed there (header and
title, both review packages, the review-package PDF pages, and the new test) and
every other test passed.

Limits: archived builds of earlier releases, their GitHub release assets and the
repository history are unchanged, because published builds are bound to their
attestations. No behaviour changed.
