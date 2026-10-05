# Implementation update - v2.3.0

The delivery remains one offline HTML file with the existing journaled browser
database. No service or runtime dependency is added.

`dd254_contract_orders` holds two record types: `order` identities and immutable
`source` versions. Orders keep prime, number, actual type, source mode, a shared
version ID and an optional outgoing draft ID. A source version stores a stable
template ID and one snapshot of its metadata, manager and language. Reusing the
same source body reuses that saved version instead of duplicating its wording.

`ctOrderMigrate` indexes legacy order-specific template metadata idempotently.
`ctOrderCreate` refuses a duplicate prime/number identity and reports confirmed
storage success. `ctOrderBind` records explicit source selection.
`ctOrderReview` flags changed or removed sources and newer dated/revised sources.
Earlier source versions remain readable after repository changes.

`ctOrderStart` saves an Original workspace from the chosen version. Its
`ctSource` provenance snapshot travels with collect/apply, draft save/open,
revision spawning and JSON/backup paths. The outgoing order-specific checkbox
is independent of the received source mode. The form shows the source name,
revision and date; a later repository edit does not reapply template language.
An already-linked order opens its existing draft. A missing draft is recreated
only after the selected source is still valid for new workflow creation.

`ctRepoRender` renders only the current prime and source/order pages, using the
same source-row renderer as the existing editor. Search and filters operate on
the full collection. Warning recalculation retains active inputs and inline
comparison panels. Duplicate scans keep representative links for each matching
signature so all matching rows are flagged without quadratic pair expansion.

Full Backup and template packs include the new store, with the order library
defaulting off during shared-pack import. DD254-language JSON also carries it;
CSV carries source rows and their order type/explicit outgoing selection only.
Natural prime/number identity merges independently assigned order IDs, and an
immutable source-version ID with conflicting content is refused before import.
The existing journal, storage-failure warning and read-only tab guards apply.

Regression and native-browser checks cover source reuse, order duplication,
prime versus own language, independent outgoing selection, source changes,
existing workflow preservation, save/open, migration, exports and paging.
