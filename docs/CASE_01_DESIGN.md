# Legacy Case 01 Design Reference

The project no longer treats its five scenarios as five independent cases. They are now five consecutive days in one campaign.

The former “Case 01 — The Security Review” has become Day 1. Its current authoritative design is:

- `FIVE_DAY_CAMPAIGN.md` for the complete five-day structure and cross-day consequences;
- `DAY_01_DESIGN.md` for the Nova Bank security-review event and Day 1 routes.

This compatibility file remains temporarily because current prototype content and translation identifiers still use the `case01` namespace. Those technical IDs should be migrated deliberately when the campaign engine is implemented; renaming them prematurely would create unnecessary code and save-data churn.

Do not add new design decisions to this file.
