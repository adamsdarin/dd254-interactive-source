# PRD implementation update - v2.5.0

The original browser-only constraint remains: one downloadable HTML file, the
existing browser database, and user-managed backups. Docker/Kubernetes hosting
remains a separate future phase.

Added, from the FSO and contracting officer roadmap review (owner, 5 October
2026):

- `coPackageIdentity()` gains `trail`, one entry per Item 2 field actually
  filled, and `guides`, the Item 13 citations resolved against the Security
  Classification Guide library with `known` and `stale` flags. Both packages
  render a Contract authority table from them.
- The government package renders Items 16a to 16f with their values or "To be
  completed by the GCA". The prime package does not.

Fixed: the package reported `gv('i2a')||gv('i2b')||gv('i2c')`, a single number,
so a subcontract's own number was hidden behind the prime's.

Not changed: the form, its validation, the exported DD Form 254, and storage.
Items 16 and 17 remain outside the preparer's required set.

The same review also produced the rule catalog, the authority baseline, the
CycloneDX SBOM and the ISSM brief, which are documents rather than product
increments and shipped separately.

See [release assessment](../RELEASE_ASSESSMENT_v2.5.0.md) for behaviour and
limits, and [prior implementation map](IMPLEMENTATION_v2.4.1.md) for earlier
coverage.

Acceptance: both packages show every Item 2 number entered and the guides cited
in Item 13; a form citing no guide says so; the government package lists Items
16a to 16f and the prime package does not; an entered Item 16 field displaces
the placeholder; a blank Item 16 raises no validation error; official and demo
builds pass browser and regression checks.
