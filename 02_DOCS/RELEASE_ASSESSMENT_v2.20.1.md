# DD254 Interactive v2.20.1 - a solicitation is named for its solicitation number

13 November 2026. Internal Tool v2.170. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A solicitation's name carries its solicitation number | Two solicitations under one contract can be told apart on the dashboard | An Original's name is unchanged |
| Existing solicitations gain the number once | The dashboard is consistent without renaming by hand | Only a name the tool itself wrote is touched |

## Why

**The names were built on two different patterns.** An Original reads
requester, contract, subcontract number. A solicitation read requester,
contract, and the word "Solicitation" - its number was used only when there was
no contract number, so with one present it vanished from the name and two
solicitations under the same contract were indistinguishable. The number now
sits where the subcontract number sits on an Original.

**Existing records are brought into line, carefully.** A title is a name a
person may change, so nothing is parsed or guessed: a solicitation is retitled
only when its title is exactly what the previous rule would have composed from
its own stored identifiers. Anything else - a hand-chosen name, a copy, an
Original - is left as it is. It runs on the recount every update already
triggers, once per record.

## Verification

- **1589 assertions, 0 failures**; six are new.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- A solicitation renamed by hand keeps its name; use the pencil to recompose it.
- The separators are unchanged: the requester is set off by a dash and the
  numbers after the contract by a middle dot, as on an Original.
