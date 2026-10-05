# PRD implementation update - v2.7.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Fixed:

- `buildCtSelect` now reads the order store as well as the template store. Each
  own-coverage order becomes an option whose value is the `ioId` of the template
  bound to it, grouped under "Task orders with their own DD-254"; that template
  is suppressed from the plain template list so it appears once. An order with
  no resolvable source is rendered disabled and labelled "source needs review".
  The search filter matches order text as well as template text.
- Item 11j's rule text cites the DD Form 254 Instructions, Item 11j(1), and
  states the full obligation it imposes. DoDD 5205.02E is retained as the OPSEC
  programme directive with a note that it is not the source of the Item 14
  requirement. No validation behaviour changed.
- `browser_smoke.js` keeps Chrome's stderr and reports it, with the browser path
  and sandbox state, when the DevTools port never appears. `DD254_BROWSER_PATH`
  overrides the browser; `DD254_BROWSER_CI=1` adds `--no-sandbox` and
  `--disable-dev-shm-usage`. `verify.yml` and `release.yml` set it.

See [release assessment](../RELEASE_ASSESSMENT_v2.7.1.md) and
[prior implementation map](IMPLEMENTATION_v2.7.0.md).

Acceptance: an own-coverage order appears in the picker under its order number
and resolves to its bound template; that template is not listed twice; an order
awaiting review is shown and not selectable; the picker searches orders by
number; Item 11j cites the form instructions; the harness names the browser and
the sandbox state when it cannot start one; official and demo builds pass
browser and regression checks.
