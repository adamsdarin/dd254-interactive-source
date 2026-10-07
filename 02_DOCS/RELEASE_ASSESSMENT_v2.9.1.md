# DD254 Interactive v2.9.1 - the Standard Language panel lists what this DD-254 calls for

7 October 2026. Internal Tool v2.155. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| The panel lists the entries written for this programme and Item 1a level | The entry this contract calls for is the one on screen, not the one to find among the rest | "Show all" reaches every other entry, and comes back |
| Each row shows the programme and level it is written for | What the filter is doing is visible, not implied | An entry written for neither says "any programme / any level" |
| Nothing is narrowed until the form can narrow it | A new DD-254 still shows the whole library | The panel says which of the two is missing |

## Why

**A library of standard language is read once per DD-254, and the panel made
that a search.** Every entry was listed on every form, so the preparer read past
everything written for other programmes to reach the one this contract called
for. The two things that decide which entry fits - the programme, from the
template applied to this DD-254, and the Item 1a level - were already being
matched on by the automatic insertion added in v2.9.0. The panel now matches on
the same two, through the same function, so the panel and the insertion cannot
come to disagree about what fits.

**Narrowing is not hiding.** An entry carrying no programme, or written for a
different level, is sometimes exactly the one a particular contract needs. A
panel that could not reach it would be a panel people work around, so the others
are one link away and the link comes back. Before the form says enough to narrow
by, every entry is listed with one line naming what would narrow it - a panel
that looked empty because Item 1a had not been filled in would be worse than one
that is simply long.

**What inserting does is unchanged**, and so is the Settings entry: Optional is
still a library you insert from, Mandatory still inserts the single matching
entry by itself.

## Verification

- 1367 assertions, 0 failures, against build `c5b337d6`.
- The panel was driven through all four states - neither known, programme only,
  both known, and both known with nothing written at that level - and the
  insert button was checked to insert the entry that was clicked rather than
  whatever sits at that position in the library, which a filtered list makes
  easy to get wrong.
- All five release gates pass; the rebuild kit round-trips byte-identically;
  pdf-lib is the unmodified upstream release; the native-browser smoke test
  passes.

## Limits

- The programme comes from the template applied to the DD-254. A form with no
  template applied has no programme, so the panel stays unfiltered however much
  else is filled in.
- Matching is exact on the programme name. Two spellings of one programme are
  two programmes, which is why the programme list is taken from the Security
  Manager templates rather than typed.
