# DD254 Interactive v2.14.1 - the demonstration portfolio has requesters

24 October 2026. Internal Tool v2.161. Single HTML file; existing browser storage.

## What changed

Demonstration data, and one correction to the requester search that the
demonstration data made visible.

| Change | Why it matters |
| --- | --- |
| Every example DD-254 carries the person who requested it | The demo had DD-254s that arrived from nobody, which is not a state the tool can otherwise produce |
| The requester repository is derived from those examples | `Manage → Requesters` opened blank, and the requester search shipped in v2.14.0 had nothing to search |
| One example address is shared by two people | The case the create dialog refuses to guess at is shown, not only tested |
| A name filled in from one address is withdrawn when the address changes | A DD-254 could be created recording a requester who does not use that address |

## The defect, and how it was found

The only reason this was found is that the demonstration build could finally
be driven: pick `p.raman@example.com` and the name fills in, change to the
shared `programme-desk@example.com` and the dialog says *the name is not filled
in* with "Priya Raman" still sitting in the field. Creating the DD-254 there
would have recorded her as the requester at an address she does not use.

The rule was stated as "a typed name is never overwritten", which is right but
incomplete. A name the dialog wrote is the dialog's to withdraw, and it is now
tracked apart from one that was typed. Two assertions hold both halves: what
the tool filled in goes when the address stops identifying one person, and what
the operator typed survives every address including a shared one.

## Why

**A feature that cannot be seen in the demonstration build has not really
shipped.** The requester repository has existed since v2.10.0 and the search
over it since v2.14.0. Neither was visible: the demonstration seed created
twelve drafts with no requester details and never wrote a requester record, so
both screens were empty for anyone evaluating the tool.

**The repository is derived, not written beside the portfolio.** Each person's
`completedCount` is the number of their examples whose status is Issued,
counted from the drafts themselves. A hand-written figure would disagree with
the portfolio the first time either changed, and a demonstration that quietly
contradicts itself is worse than one that shows nothing.

**A shared address is in the data on purpose.** Programme desks are shared, and
the dialog's answer - name everyone at the address, fill in nothing - is a
safeguard worth seeing. Two of the four demonstration requesters answer one
mailbox.

## Verification

- **1490 assertions, 0 failures**; three are new. One asserts the derivation
  rather than the numbers: every example has a requester, the repository holds
  exactly those people, and each count equals that person's Issued examples.
  Two hold the autofill rule, and the first of them fails against v2.14.0.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.

## Limits

- The demonstration seed still leaves an existing repository alone. Opening the
  demo in a browser that already holds requesters keeps them and seeds nothing,
  which is the same rule every other demonstration store follows.
- Four requesters across twelve examples. Enough to show the search, the
  autofill and the shared-address case; not a load test.
