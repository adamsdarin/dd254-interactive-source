# PRD implementation update - v2.10.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

Added:

- `TPL_REQ` (`dd254_req_tpl`), the requester repository, with `reqAll`,
  `reqNorm`, `reqKey`, `reqFind`, `reqLookup`, `reqRemember`,
  `reqRecordCompletion` and `reqOfDraft`. `reqLookup` returns `none`, `known`
  (on file, never issued), `one` or `many`; only `one` fills an e-mail.
  Registered in `BK_KINDS` as `req`, so Full Backup carries it.
- `dashPartyPrompt` is the Create DD-254 Workspace dialog: first name, last
  name, e-mail, prime, optional task order, Security Manager, plus Block 2b on
  an Original and Block 2c with `i2c_due` on a Solicitation. Validation is per
  field (`np_<id>_err`); creation is strict, renaming an older record is not,
  so a draft carrying one name or no e-mail can still be renamed.
- `dashIdentity` and `dashPrimaryIdent` read `meta.identity`
  `{prime,order,sub,solicitation}`, falling back to the workspace. The card
  shows the order first with the prime beside it; `dashSearchText` reads the
  requester name and the identifiers.
- `dashIntakeMatch(prime,order)` returns `{hits,level,partial,one,many}` over
  the DD-254 Template Language and Contract Type repositories, normalising with
  trim, case fold and collapsed whitespace. `dashNewDraft` applies `one` before
  writing the typed identifiers, so the operator's values win.
- `dashSecurityManager(rec)` returns the draft snapshot, else a backfill from an
  unambiguous template, else null. `dashDistEmails` gains a `securityManager`
  set; `dashIssueMailMany` claims To as requester, Security Manager, Item 6, 7
  and 8 FSOs, then CC, so dedupe keeps an address on To. `dashDistParties`
  lists the manager below the requestor when addressed; `dashDistDialog` shows
  `#ddSmWarn` when not.

Changed:

- Full Backup `version` 4 to 5. Restore never read the number, so a version-4
  file restores unchanged.
- `dashNameCompose` takes `order` and `solicitation`, and drops a Block 2b
  non-answer (`N/A`, `None`) from the name.
- `dashPartyApply` writes `requester`, `securityManager` and `meta.identity`
  alongside the legacy `requestedBy` and `requestedByName`.

See [release assessment](../RELEASE_ASSESSMENT_v2.10.0.md) and
[prior implementation map](IMPLEMENTATION_v2.9.1.md).
