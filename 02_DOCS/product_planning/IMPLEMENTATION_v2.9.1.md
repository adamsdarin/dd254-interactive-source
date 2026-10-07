# PRD implementation update - v2.9.1

The browser-only constraint is unchanged: one downloadable HTML file, the
existing browser database, user-managed backups.

Changed:

- `slRenderPanel` renders from `slPanelState()`, which resolves the programme
  with `slProgramForForm()`, the level with `slLevelForForm()` and the matching
  entries with `slCandidates(program,level,all)` - the same call `slAutoApply`
  makes. It returns `{all,program,level,narrowed,match,others}` so the panel can
  say what it is doing rather than just do it.
- `narrowed` is false unless both a programme and a level are known, and the
  panel then lists everything with a line naming the missing one.
- `window.SL_PANEL_ALL`, toggled by `slPanelShowAll(on)`, opens and closes the
  full list. It is view state, not saved.
- Each row's index is `st.all.indexOf(t)`, the entry's place in the library, not
  its place in the filtered view: `slInsert` takes a library index and a
  filtered one would insert whatever happened to sit at that position.
- Row titles carry `class="sl-name"` so the panel can be asserted on without
  matching the `<b>` tags in its own heading.
- `slLevelName(v)` renders C, S and TS as words for the heading and the rows.

See [release assessment](../RELEASE_ASSESSMENT_v2.9.1.md) and
[prior implementation map](IMPLEMENTATION_v2.9.0.md).
