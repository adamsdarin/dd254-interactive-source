# DD254 Interactive v2.13.0 - contract templates offer what fits

24 October 2026. Internal Tool v2.159. Single HTML file; existing browser storage.

## Changes and user benefit

| Change | Concrete reduction in work | Safeguard |
| --- | --- | --- |
| A contract template records what it is written for | The tool narrows the library instead of the operator remembering | Programme, level and scenario may all be left as Any; a template saved earlier reads as Any on all three |
| A panel listing what fits | The templates that apply are beside the form with Apply, not two clicks away in a repository | Everything else is one link away with a count, never hidden |
| The level is captured from the form | A captured template knows its level without being told | Read from the template first, captured data second, so the two cannot disagree |

## Why

**Standard language already answered this question and contract templates did
not.** Standard language knows each entry's programme, Item 1a level and
scenario and shows only what fits, with the rest one link away. Contract
templates matched on the contract number alone, so an operator with a large
library still had to know which template they wanted before they could ask for
it. The two libraries now answer "does this fit?" the same way, through the
same three keys in the same order.

**The Item 1a level is not the CUI marking.** A template already carried
`data.cls`, which says whether the FORM is marked CUI. That is a different
question from the clearance the work needs, and conflating them would have
hidden templates from the DD-254s they were written for. The level is its own
field.

**Nothing was rebuilt that was working.** The contract repository carries task
orders and their coverage, source provenance with revision tracking, and
duplicate detection - none of which standard language has any equivalent for,
and all of which something depends on. REQ-06's standalone rule is computed
from order coverage. The matching and the panel are layered on top; the
repository is untouched.

**A library may not shrink when a version is installed.** A template with no
programme, no level and no scenario matches everything. That is the same choice
the scenario split made in v2.12.0, for the same reason: deciding on the
operator's behalf is how work written in good faith disappears without anyone
being told.

## Verification

- **1473 assertions, 0 failures** against build `ce0bee7e`; nine are new.
- All five gates pass; the rebuild kit round-trips byte-identically; pdf-lib is
  the unmodified upstream release; both builds pass the native-browser smoke
  test.
- One existing assertion was restated: the panel-section count guard, which
  exists to prove no section was lost when the right-hand panel was split in
  two. It now expects fourteen, with the reason recorded beside the two earlier
  increments.

## Limits

- The panel narrows by programme, Item 1a level and scenario. It does not
  narrow by contract or task-order number - that is what the existing intake
  matching does, and the two are deliberately separate questions.
- There is no mandatory mode for contract templates. Standard language can be
  set to insert itself and block a draft that lacks it; applying a whole
  contract template is a larger act and stays a deliberate one.
- A template's programme still comes from the Security Managers repository
  rather than being typed, which is right, but it means a template with no
  manager has no programme and therefore matches every programme.
