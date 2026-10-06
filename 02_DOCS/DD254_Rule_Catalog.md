# DD254 Interactive - rule catalog

DD254 Interactive v2.8.0 / Tool v2.153. Generated from the shipped build by `02_DOCS/make_rule_catalog.py`; do not edit by hand.

This lists every claim the tool states about the DD Form 254 and enforces. It exists to be read against the form and its authorities by an FSO. The residual risk in this product is not a missing rule but an enforced rule that is wrong, and only that reading finds one.

## Authority baseline

The rules were written against the authorities below. When one is reissued, the claims citing it need re-reading; this section is how that drift becomes visible.

| Authority | Baseline confirmed |
| --- | --- |
| 32 CFR Part 117 (NISPOM Rule) | not yet confirmed against a library release |
| DD Form 254 Instructions (APR 2018 form) | not yet confirmed against a library release |
| DoDM 5220.32 Volume 1 | not yet confirmed against a library release |
| DoDM 5205.07 (SAP) | not yet confirmed against a library release |
| DoDI 5200.48 (CUI) | not yet confirmed against a library release |
| DoDM 5105.21 Volume 3 (SCI) | not yet confirmed against a library release |

"Not yet confirmed" is the honest state: the tool cites these authorities, but no edition or revision date has been checked against an approved library release. Confirming them is a Guidance Watch task, not an engineering one, and this table is where the answer belongs.

## Summary

- 28 access and performance boxes
- 97 stated claims (69 requirements, 28 notes)
- 30 blocking messages, 14 advisory messages
- 14 further messages are assembled from values at run time and are not reproduced here

## Claims stated on each box

### 3a. Original

No claims stated.

### 3b. Revised

No claims stated.

### 3c. Final

- **REQUIREMENT** - Must complete Item 5 with retention dates
- **REQUIREMENT** - Must enter original date in Item 3a
- **NOTE** - For authorized post-contract retention or applicable program continuation

### 10a. COMSEC Information

*Accountable/non-accountable COMSEC and CCI*

- **REQUIREMENT** - If accountable COMSEC will be stored at contractor facility → also check 11h
- **REQUIREMENT** - If COMSEC accessed ONLY at govt facility → check 10a but NOT 11h
- **REQUIREMENT** - If accountable COMSEC needs Defense Courier → also check 11k
- **NOTE** - Subcontracting COMSEC requires prior GCA approval
- **REQUIREMENT** - Add Item 13 guidance: clearance level required, disclosure restrictions, NSA/CSS Manual 3-16 reference  
  Cited: NSA/CSS Manual 3-16

### 10b. Restricted Data

*Access to Restricted Data (RD) required*

- **REQUIREMENT** - MUST be checked if 10c (CNWDI) is checked
- **REQUIREMENT** - Add Item 13: "Access to RESTRICTED DATA requires a final U.S. Government clearance at the appropriate level."

### 10c. Critical Nuclear Weapon Design Information (CNWDI)

*CNWDI access required — automatically requires 10b*

- **REQUIREMENT** - 10b (Restricted Data) is AUTOMATICALLY required when this is checked
- **NOTE** - GCA approval required before granting CNWDI access to a subcontractor
- **REQUIREMENT** - Special briefings and procedures required — note in Item 13

### 10d. Formerly Restricted Data (FRD)

*Access to FRD required*

No claims stated.

### 10e(1). Sensitive Compartmented Information (SCI)

*National Intelligence — SCI access required*

- **REQUIREMENT** - List specific SCI caveats in Item 13 or 14 (DD Form 254 may need to be classified)
- **REQUIREMENT** - GCA must incorporate applicable DNI/DCI Directive requirements
- **REQUIREMENT** - Item 15 MUST identify the Senior Intelligence Officer with exclusive security responsibility
- **NOTE** - DCSA CSO does NOT conduct security reviews for SCI
- **NOTE** - GCA prior approval required before subcontracting SCI access
- **REQUIREMENT** - Coordinate applicable SCI contractual and administrative requirements with the cognizant SCI authority. Do not infer a clause solely from this Item 10 selection.

### 10e(2). Non-SCI Intelligence Information

*National Intelligence — non-SCI access required*

- **REQUIREMENT** - Cite protection requirements in Item 13 or 14
- **NOTE** - GCA prior approval required before subcontracting

### 10f. Special Access Program (SAP) Information

*SAP access required — triggers Item 14 YES and Item 15*

- **REQUIREMENT** - Item 14 MUST be YES
- **REQUIREMENT** - Item 15 MUST be completed — identify the inspecting CSO for the SAP
- **NOTE** - GCA approval required before subcontracting
- **REQUIREMENT** - GCA SAP office provides additional security requirements (reference in Item 14)
- **REQUIREMENT** - If DCSA retains SAP cognizance → note in Item 13. If carve-out → Item 15 identifies SAP CSO
- **REQUIREMENT** - Coordinate applicable SAP contractual requirements with the PSM/PSO. DFARS 252.204-7005 is reserved and is not a SAP clause.  
  Cited: DFARS 252.204-7005
- **REQUIREMENT** - SAP addendum required — must list all PIDs and period of performance. Addendum is classified and transmitted separately from this DD Form 254 via PSM/PSO-approved channels. (DoDM 5205.07 §10.1.c)  
  Cited: DoDM 5205.07
- **REQUIREMENT** - Coordinate routing with your PSM or PSO prior to release. (DoDM 5205.07 §10.1)  
  Cited: DoDM 5205.07
- **REQUIREMENT** - Collateral classified information incorporated into this SAP contract must be listed on this form or approved by PSM/PSO before entry. (DoDM 5205.07 §4.4.d)  
  Cited: DoDM 5205.07
- **NOTE** - If this SAP is acknowledged: the DD Form 254 may be unclassified or CUI. If unacknowledged: the form itself may be CUI and the addendum will be classified — consult your PSO on handling. (DoDM 5205.07 §10.1.c)  
  Cited: DoDM 5205.07
- **NOTE** - HVSACO: If any non-SAP contract information carries the HVSACO marking, it must be stored in an accredited SAPF or SCIF and handled via SAP-approved channels only. HVSACO is a control marking, not a classification level. Include HVSACO training in contractor indoctrination. (DoDM 5205.07 §4.1)  
  Cited: DoDM 5205.07
- **REQUIREMENT** - At SAP closeout, coordinate disposition and the termination plan. A final DD Form 254 addresses continued SAP security requirements. Contractor shall not retain SAP information without specific written GCA authorization. (DoDM 5205.07 §10.5)  
  Cited: DoDM 5205.07

### 10g. NATO Information

*Access to NATO classified documents/information required*

- **REQUIREMENT** - List specific NATO levels required in Item 13 or 14
- **REQUIREMENT** - Item 13 must note that special NATO access briefing/debriefing is required
- **NOTE** - GCA prior approval required before subcontracting NATO access
- **NOTE** - SIPRNET access ONLY (no actual NATO info) → do NOT check this box. Instead annotate Item 13 that NATO info is not required but NATO awareness briefing IS required due to SIPRNET access

### 10h. Foreign Government Information (FGI)

*FGI (excluding NATO) required for performance*

- **NOTE** - GCA prior approval required before subcontracting
- **REQUIREMENT** - Requires final U.S. Government clearance at appropriate level

### 10i. ACCM Information

*Alternative Compensatory Control Measures information required*

- **REQUIREMENT** - GCA provides classification guidance separately — do NOT disclose ACCM security plan details in form

### 10j. Controlled Unclassified Information (CUI)

*Only if this classified contract ALSO requires CUI protection*

- **NOTE** - Do NOT check for CUI-only contracts. Only valid when this classified contract also requires CUI.
- **REQUIREMENT** - NISPOM does NOT cover CUI — GCA MUST provide CUI protection guidance in Item 13  
  Cited: NISPOM
- **REQUIREMENT** - DoD Components: refer to DoDI 5200.48. Non-DoD: consult Component policy office  
  Cited: DoDI 5200.48
- **REQUIREMENT** - Review the current DFARS 204.73 provision/clause set, including DFARS 252.204-7012. Its subcontract flow-down applies when performance involves covered defense information or operationally critical support.  
  Cited: DFARS 252.204-7012.

### 10k. Other (specify in Item 13)

*Any other required access not covered by 10a–10j*

- **REQUIREMENT** - Specify type of information in Item 13. Also determine if 11m should be checked.

### 11a. Have access to classified information ONLY at another contractor's facility or a government activity

*"ONLY" is the key word — applicable ONLY if there is NO access or storage required at contractor's own facility.*

- **REQUIREMENT** - Item 1b MUST be "None" or "N/A" — contractor stores nothing classified at their facility
- **REQUIREMENT** - Item 8a MUST be completed — identify where contractor WILL have access
- **REQUIREMENT** - If performance location is a cleared contractor site → Items 8b AND 8c must also be completed
- **NOTE** - CANNOT check with: 11b, 11c, 11d, 11h, 11i, or 11k
- **REQUIREMENT** - DFARS 252.204-7003 is prescribed in all DoD solicitations and contracts and preserves Government personnel control of their work products.  
  Cited: DFARS 252.204-7003

### 11b. Receive and store classified documents ONLY

*"ONLY" is the key word — contractor receives classified documents for reference only. NO generation or derivative classification at contractor facility.*

- **REQUIREMENT** - Item 1b MUST be completed at the appropriate classification level
- **NOTE** - CANNOT check with: 11a, 11c, 11d, 11h, 11i, or 11k

### 11c. Receive, store, AND generate classified information or material

*Contractor will receive and/or derivatively classify information. Requires security classification guidance from GCA/prime.*

- **REQUIREMENT** - Item 1b MUST be completed at the appropriate classification level
- **NOTE** - CANNOT check with: 11a or 11b
- **REQUIREMENT** - Item 13 must reference the security classification guide(s) to be used
- **REQUIREMENT** - If SIPRNET/JWICS/cloud access required → document in Item 13 including the approval authority
- **REQUIREMENT** - If volume/configuration requires specialized storage → contact DCSA CSO to verify capacity
- **REQUIREMENT** - Review FAR 52.227-10 if classified patent applications may arise. Item 11c does not by itself establish export-control clause applicability.  
  Cited: FAR 52.227

### 11d. Fabricate, modify, or store classified hardware

*Contractor will fabricate or use hardware containing classified material at their own cleared facility.*

- **REQUIREMENT** - Item 1b MUST be completed at the appropriate classification level
- **NOTE** - CANNOT check with: 11a or 11b
- **REQUIREMENT** - Contact DCSA CSO to verify approved storage capacity and correct mailing/shipping address for classified hardware
- **REQUIREMENT** - Item 13 should describe nature/extent of storage: Will Restricted or Closed Areas be required? Hardware dimensions? Open storage needed?
- **REQUIREMENT** - If SIPRNET/JWICS access required → document in Item 13 including the approval authority

### 11e. Perform services ONLY

*Contractor performs a service only — not expected to produce a deliverable (e.g., guard services, maintenance, janitorial in classified areas).*

- **REQUIREMENT** - If services don't apply to a specific contract (e.g., guard/maintenance across multiple contracts) → enter "Multiple Contracts" in Item 2a and explain in Item 13
- **REQUIREMENT** - Item 13 must describe the services and provide appropriate security classification guidance. Examples: guard services, equipment maintenance, janitorial in classified areas, graphic arts/reproduction
- **REQUIREMENT** - Review clause: DFARS 252.239-7001 Information Assurance Contractor Training and Certification — if IA functions are performed  
  Cited: DFARS 252.239-7001

### 11f. Have access to U.S. classified information OUTSIDE the U.S., Puerto Rico, U.S. Possessions, and Trust Territories

- **REQUIREMENT** - Item 13 MUST identify the U.S. activity, city, and country where overseas performance occurs
- **REQUIREMENT** - Item 18d (distribution to U.S. Activity Responsible for Overseas Security Administration) must be checked
- **REQUIREMENT** - Provide copy of DD Form 254 to the appropriate DCSA field office (find at dcsa.mil/mc/ctp/locations/)
- **REQUIREMENT** - Review clauses: FAR 52.225-19 Contractor Personnel in Designated Operational Area  DFARS 252.225-7040 Contractor Personnel Authorized to Accompany U.S. Armed Forces  
  Cited: DFARS 252.225-7040, FAR 52.225

### 11g. Be authorized to use DTIC or other secondary distribution center

*Contractor authorized to obtain classified documents from Defense Technical Information Center.*

- **REQUIREMENT** - Sponsoring GCA must submit DD Form 1540 to DTIC on contractor's behalf. For subs, prime submits with GCA certifying need-to-know.

### 11h. Require a COMSEC account

*Contractor must store accountable COMSEC material at their cleared facility.*

- **REQUIREMENT** - If checked → Item 10a (COMSEC) MUST also be checked
- **NOTE** - CANNOT check with 11a (access elsewhere only) — COMSEC accounts are at the contractor facility
- **NOTE** - CANNOT check with 11b (receive/store only)
- **NOTE** - Do NOT check for non-accountable COMSEC material only (non-accountable = not tracked in CMCS)
- **REQUIREMENT** - Accountable COMSEC includes: COMSEC key, CCI, STE, in-process items describing cryptographic logic
- **REQUIREMENT** - Review clause: DFARS 252.239-7016 Telecommunications Security Equipment, Devices, Techniques, and Services  
  Cited: DFARS 252.239-7016

### 11i. Have a TEMPEST requirement

*GCA-specified TEMPEST requirements for contractor within the U.S.*

- **REQUIREMENT** - Item 14 MUST be YES — TEMPEST is above NISPOM baseline  
  Cited: NISPOM
- **REQUIREMENT** - GCA must have identified TEMPEST requirements in writing by contract BEFORE imposing them on the contractor
- **REQUIREMENT** - GCA must separately advise DCSA of contract TEMPEST requirements
- **NOTE** - CANNOT check with 11a (access elsewhere only)
- **NOTE** - Prime contractors may NOT impose TEMPEST requirements on subcontractors without GCA approval
- **REQUIREMENT** - Contract clause required: DFARS 252.239-7000 Protection Against Compromising Emanations  
  Cited: DFARS 252.239-7000

### 11j. Have Operations Security (OPSEC) requirements

*Additional OPSEC protection/countermeasures beyond NISPOM baseline required.*

- **REQUIREMENT** - Item 14 MUST be YES
- **REQUIREMENT** - Contractor must be provided with a copy of the system/command/unit OPSEC requirements or plan — include in Item 13 or as attachment
- **REQUIREMENT** - Item 13 must identify pertinent contract clauses and provide OPSEC guidance
- **NOTE** - Prime contractors may NOT impose OPSEC requirements on subcontractors without GCA approval
- **REQUIREMENT** - Item 14 must be YES, with the additional requirements stated there or in an attachment; identify the pertinent contract clauses and add clarifying guidance to Item 13 — DD Form 254 Instructions, Item 11j(1)  
  Cited: DD Form 254 Instructions
- **NOTE** - OPSEC requirements are additional to the NISPOM and apply when the GCA determines extra safeguards are essential for the contract. The DoD OPSEC programme itself is DoDD 5205.02E; it is not what obliges Item 14 — that is the form instructions.  
  Cited: DoDD 5205.02E, NISPOM

### 11k. Be authorized to use Defense Courier Service

- **REQUIREMENT** - GCA must have ALREADY obtained written approval from USTRANSCOM Defense Courier Division (TCJ3-C), Scott AFB, IL before checking this box
- **NOTE** - CANNOT check with 11a (access elsewhere only)
- **NOTE** - CANNOT check with 11b (receive/store only)
- **NOTE** - Prime cannot authorize subcontractor to use Defense Couriers without GCA prior approval

### 11l. Receive, store, or generate CUI

*Controlled Unclassified Information in context of a classified contract*

- **NOTE** - Do NOT check for contracts that ONLY require CUI (no classified). Only valid when Item 10j is also checked AND 11a/b/c/d is also checked establishing classified access.
- **REQUIREMENT** - NISPOM does NOT cover CUI — GCA MUST provide CUI protection guidance in Item 13  
  Cited: NISPOM

### 11m. Other (specify in Item 13)

*Additional performance requirements not covered by 11a–11l. Commonly used when contractor performs services AND generates classified (instead of checking both 11c and 11e).*

- **REQUIREMENT** - Item 13 must describe the additional requirements
- **REQUIREMENT** - Also determine if 10k (Other) should be marked

## Blocking messages

A draft cannot reach Issued while any of these is outstanding.

- COLLATERAL INFO: List any non-SAP classified material incorporated into this SAP contract on this DD Form 254 or obtain PSM/PSO approval before entry. (DoDM 5205.07 §4.4.d)
- IR&D + SAP: Establishing document (IR&D authority letter or bailment agreement) must be in place before this DD Form 254 applies. Provide it, this form, and all SCG guidance to the contractor.
- IR&D + SAP: GCA and GAM written permission required before SAP information is used in this IR&D effort. (DoDM 5205.07 §10.4.a)
- IR&D + SAP: Item 14 must reference the GCA/GAM written permission and describe the IR&D authority scope.
- Item 14: Government Approval set YES — explanatory text required.
- Item 14: MUST be YES when 10f (SAP) is checked.
- Item 15: MUST be completed when 10f (SAP) is checked — identify the inspecting CSO/SAP CSO.
- Item 15: Supplemental information set YES — explanatory text required.
- Item 16: GCA name required.
- Item 17a: Certifying Official name required.
- Item 17b: Certifying Official title required.
- Item 17d: AAC required.
- Item 17e: Enter the prime contractor CAGE code (subcontract forms only).
- Item 18b: Check "Subcontractor FSO" — required distribution on subcontract DD Forms 254.
- Item 1a: Facility Clearance Level (FCL) required.
- Item 1b: Safeguarding level required.
- Item 2a: Prime contract number MUST be filled when 2b (subcontract) is used.
- Item 2a: Prime contract number required.
- Item 3: Select Original (3a), Revised (3b), or Final (3c).
- Item 3a: Original date required — it continues to show on every revision and the Final.
- Item 3b: Revision number must be a whole number in sequence (1, 2, 3…).
- Item 3b: Revision number required.
- Item 6a: Contractor name and address required.
- Item 6b: CAGE code required.
- Item 6c: Cognizant Security Office (CSO) required.
- Item 8: 11a checked — location where contractor has access must be identified.
- Item 9: Description of classified work/reason for access required.
- SAP + OVERSEAS: All SAP transmission outside the SAPF must use PSM/PSO-approved SAP channels. Document approved methods in Item 13. (DoDM 5205.07 §4.5)
- SAP ADDENDUM: Prepare a classified SAP addendum identifying all PIDs and the period of performance. Route through PSM/PSO. (DoDM 5205.07 §10.1.c)
- SAP SUBCONTRACT: Subcontractor authorized representative must sign this DD Form 254 before any classified access is granted. No signature block is provided on the form — record how the signature was obtained. (DoDM 5205.07 §10.1.d)

## Advisory messages

Reported, never blocking.

- 10a COMSEC: If accountable COMSEC at contractor facility, also check 11h. If ONLY at govt facility, 11h is not needed — confirm which applies.
- 10g NATO: Item 13 must note NATO access briefing/debriefing is required
- 11e + 11b: Not recommended; must explain in Item 13 if both kept
- 11e + 11c: Recommend using 11m instead of 11e; must explain in Item 13 if both kept
- 11e + 11d: Recommend using 11m instead of 11e; must explain in Item 13 if both kept
- Item 11a: Ensure Item 8a identifies where contractor will access classified info
- Item 11f: Ensure Item 13 identifies U.S. activity, city, and country of overseas performance
- Item 11l: Should only be checked when Item 10j is also checked
- Item 18d: Should be checked for overseas access (11f)
- Item 3b Revised: Confirm reason is a valid one — classification guidance change, security requirement change, or contractor location change (not option year exercise or POC-only update)
- Item 3b Revised: Must be incorporated into the contract by modification
- Item 9: Unclassified description is required
- SAP subcontract: this DD Form 254 is not complete until the subcontractor’s authorized representative signs it. DoDM 5205.07 §10.1.d does not name a block, and the form provides no subcontractor signature field — capture the signature by the method your programme accepts (a signed copy, an addendum, or a separate written acknowledgement) and record which. Do not grant access to SAP or classified information until you hold it.
- This contract involves CUI (Item 10j/11l, a CUI designation, a distribution statement or an LDC). Item 13 must carry the GCA’s CUI protection guidance. The form marking stays UNCLASSIFIED unless the content of this form is itself CUI — naming CUI categories does not make the form CUI.

