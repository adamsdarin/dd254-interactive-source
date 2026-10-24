# DD254 Interactive v2.14.0 - the language is beside the form, in one place

24 October 2026. Internal Tool v2.160. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| The language rail cannot be hidden | The wording a DD-254 may use is in view while it is written, not behind a tab somebody closed once | It narrows on a small screen rather than disappearing, and is still never printed |
| Both libraries left the right-hand panel | One list per library, and it is the one that can insert | The rail carries everything the panel did: the narrowing, the count of what is held back, each entry's opening words |
| Contract language applies from the rail | A whole template goes on from where it is being read | It asks first, by the same path the form's own picker uses |
| Language is "always applies" or "waits for its box" | The clause a contract needs arrives without being hunted for | An always-clause is not withdrawn by unticking a box that never placed it |
| A contract template states its programme, scenario and level on its row | The library can be narrowed on facts instead of on what somebody typed into a name | Each fact has exactly one control; the editor gave two of them up rather than duplicating them |
| The requester e-mail searches the requesters on file | The address in hand finds the person, instead of a name being spelled from memory | A typed name is never overwritten, and a shared address names everyone at it |

## Why

**A control whose only use is hiding what you need is not a feature.** The
language rail was a closable tab and the choice was remembered, so an operator
who closed it once went on issuing DD-254s without ever seeing the wording
their own templates held - and nothing would have told them. There is no tab,
no stored state and nothing to reopen.

**Two lists of one library teach you to trust neither.** Standard language and
the contract templates that fit were rendered in the right-hand panel and again
on the rail. The right-hand copies were the ones that could only look at the
library, so the useful list and the prominent list were different lists. The
right-hand sections are gone and the rail took over the whole job.

**One trigger per clause.** v2.12.0 shipped three things that could suppress
the same Item 13 clause: a checklist at intake, a tick-box called "always
insert", and the Item 10/11 box on the form. A clause that can be switched off
from three places is a clause that quietly fails to appear, which is exactly
what was happening. The box on the form is the trigger; beside each piece of
wording the template says whether that wording waits for its box or belongs in
every DD-254 built from the template. Nothing else decides.

**A fact encoded in a label is a fact nothing can match on.** Contract
templates were named things like "CPFF Research - SECRET (demo)" because the
level had nowhere else to live; it was behind "Edit blocks", two clicks from
the row it described. It is on the row now, beside the programme and the
scenario, in the same four-control shape a standard-language row has had since
v2.12.0. The selects moved rather than being copied, because two controls over
one field is how a template comes to claim two different levels.

**The lookup now runs the way the work does.** An operator holds the request,
and the request has an address on it. Going name to address asked them to spell
a name the repository already knew; going address to name does not.

## Verification

- **1487 assertions, 0 failures** against build `b45d553c`; twenty-two are new.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- Four assertions written for the intake caveat checklist were replaced rather
  than deleted, by assertions for the model that supersedes it, including one
  that fails if any part of the second gate returns.
- Three existing assertions were restated for where their subject now lives:
  the right-hand panel's section count (twelve), the standard-language list
  (read from the rail), and the block-editor control census (a two-option list
  per Item 10/11 key where there was a tick-box).

## Defects found and fixed

- **Per-box template language never fired on a matched template.** A draft
  created from a template matched at intake did not record which template it
  came from, so `ctActiveTpl()` was null and ticking 11d inserted nothing. The
  feature had shipped in v2.12.0 and could not work from the path most DD-254s
  take. Section 136 fails without the fix.
- **The removed contract panel's Apply button would have thrown.** It called
  `ctPickContractType` with one identifier where that function expects an array
  to choose from. The rail uses `ctInsertAll`, the same path the form's picker
  uses.
- **The demo contradicted itself.** Its seed guessed a template's programme
  from the label with `/ALDER/i`, and "Calder Aerospace" contains "alder", so
  the template labelled Programme CEDAR was tagged ALDER. Nothing displayed a
  contract template's programme before this release, so the demo had been
  saying it quietly.

## Limits

- The rail keeps its width at every screen size above 1240px and narrows to
  220px below that. On a genuinely small screen it still takes room the
  facsimile would otherwise have; it is not collapsible, by design.
- Language mode is per Item 10/11 key, not per sentence. A key with several
  paragraphs is one piece of language.
- A shared address is reported, never resolved. The dialog names everyone at
  it and fills nothing in, because choosing between two people silently is the
  failure this avoids.
- **The demo cannot show the requester search.** Its seed creates no requester
  records, and its drafts carry no requester details, so the address list is
  empty there. Nothing in the tool depends on this; it is demonstration data
  that predates the requester repository and was not extended here.
