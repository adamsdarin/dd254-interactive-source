# PRD implementation update — v2.11.0

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups. No server, no network, no
accounts.

Added:

- `dashDistRequired(rec)` — the recipients a DD-254 has to reach, each row
  carrying `applies` and its addresses. Returns `{rows, applies, missing,
  addrs}`. Rows: requestor; Item 7 FSO, applying when Item 7 names a facility
  or carries an address; one row per performance location that names anything,
  labelled by location; the cognizant security office; Block 18f, applying when
  the box is ticked. It is the single source of truth for the single-issuance
  gate, the bulk gate and the mail builder.
- `DIST_ROLES` (`securityManager`, `fsoPrime`) with `distRoleKeys`,
  `distRolesGet`, `distRolesSet`, `distRoleOn`, `distRoleToggle` and
  `distCcNames`, over one key (`dd254_dist_cc`). The role keys are
  `dashDistEmails`' own keys, so the CC builder looks each up by name and there
  is no second table. `distRolesSet` is the only thing that decides validity: an
  unknown key in storage is dropped.
- `DIST_CC_ALWAYS` (`fsoManual`, `managers`) — addresses the operator typed, or
  clicked "Add to CC" for, on this DD-254. Always copied, never a setting. The
  first cut made them roles and the live-browser smoke test caught it: an
  explicit click a global preference can discard does nothing at all.
- A `roles` branch in `settingsRender` and a `distCc` row in `SETTINGS_DEFS`,
  stating the fixed To line above the checkboxes so the panel explains the
  whole rule rather than half of it.
- `settingsExport` / `settingsImport`, and `payload.settings` in `fullBackup`,
  placed outside the checksummed body beside `audit`. Restore offers them
  behind a confirm naming the CC list.

Changed:

- `dashIssueMailMany` — To is `dashDistRequired(rec).addrs`; CC is the enabled
  roles only. Claim order still deduplicates, so To wins.
- `dashSetStatus` and `dashBulkIssue` — a missing required recipient is a hard
  stop, logged as `issue-blocked-no-recipient`, checked before the hold and
  NISS prompts.
- `dashDistParties` — the Security Manager row appears only when the manager is
  copied; `dashDistDialog`'s `#ddSmWarn` likewise.
- Both issuance dialogs now state the current rule and name the copied roles.
- Full Backup `version` stays 5: settings ride outside the checksummed body, so
  no schema change was needed.

See [release assessment](../RELEASE_ASSESSMENT_v2.11.0.md) and
[prior implementation map](IMPLEMENTATION_v2.10.0.md).
