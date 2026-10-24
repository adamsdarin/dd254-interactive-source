# Item 13 fixed-text inventory

Every place the tool writes text into Item 13 on its own, what triggers it, and
whether it is **derived** from the form or **boilerplate** an office chose.

REQ-09 asked for the whole document to be examined and standard language made
Settings-controlled. This is that examination. Only one of the five is
boilerplate; the other four are computed from the form, and making those
editable would let a DD-254 say something its own boxes contradict.

| Writer | Where | Trigger | Kind | Settings-controlled |
| --- | --- | --- | --- | --- |
| `pdqTextGet` / `PDQ_TEXT` | `cmaBuild` | Always, above the mailing address | **Boilerplate** | **Yes** - *Standing sentence in Item 13*. Default is the shipped sentence; clearing it stops writing it. |
| `supBuild` | Item 13 head | Item 2a and an effort number are both present | Derived | No. It states the effort the form names. |
| Revision summary (`RSUM_LAST`) | Item 13 head | The DD-254 is a Revision | Derived | No. It summarises what changed between revisions. |
| `cuiBuild` / `CUI_LAST` | Item 13 tail | The form is marked CUI | Derived | No. The marking drives it; editing it would decouple the two. |
| `SOL_MARK` | Item 9 head | Stage is Solicitation | Derived marking | No. `***FOR SOLICITATION PURPOSES ONLY***` is a required marking, not house style. |

The classified mailing address block itself (`cmaAddressBlock`) is derived from
the addresses recorded on the form, and REQ-08 keeps it last in Item 13
regardless of where standard language is placed.

Standard language entries are a separate thing from all of the above: they are
a library the operator inserts from, and REQ-07 controls whether they land at
the top or the bottom.
