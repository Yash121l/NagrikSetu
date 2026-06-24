# State And Union Territory Profile Model

## Purpose

Every one of the 28 state and 8 Union Territory pages includes a compact civic profile before lower-level district and local-body coverage is complete. The profile is designed for public exploration: it identifies the jurisdiction, its official portal, current leadership, and a comparable economic indicator without sending the visitor away merely to understand the basics.

## Runtime Contract

`src/data/state-profiles.ts` exports one `StateProfile` for every top-level entry in `src/data/geography.ts`.

Each profile contains:

- capital, government code, LGD state/UT code, and official government portal
- current Chief Minister, or an explicit not-listed explanation
- current Governor, Lieutenant Governor, or Administrator
- latest available per-capita Net State Domestic Product at current prices
- the reporting period and same-period all-India per-capita NNI reference
- source URL, publication date where available, and last-checked date

The profile is separate from `NagrikRecord`. It describes a jurisdiction, while records describe offices, projects, roads, tenders, complaint paths, and source documents within that jurisdiction.

## Economic Meaning

The interface uses the precise RBI term **per-capita NSDP at current prices**. It is a state-level income measure divided by population. It is not a resident's salary, disposable income, household income, or a cost-of-living-adjusted measure.

RBI Table 9 reports the latest available period per jurisdiction. In the current snapshot:

- 33 jurisdictions have a comparable value.
- Values are from 2023-24 or 2024-25 depending on the latest figure reported by RBI.
- Dadra and Nagar Haveli and Daman and Diu, Ladakh, and Lakshadweep are shown as not reported in this table.
- Missing values remain `null`; NagrikSetu does not estimate them.

## Administration Freshness

Office holders are volatile data. The current snapshot was checked on 2026-06-24 against the National Portal of India Who's Who directories:

- Chief Ministers: 31 listed jurisdictions
- Governors: all 28 states
- Lieutenant Governors and Administrators: all 8 Union Territories

Each displayed office holder links to an official destination when the National Portal supplies one. The National Portal list remains the provenance source even when a state profile page is also linked.

## Refresh Procedure

1. Recheck the National Portal state/UT directory for capitals, codes, LGD identifiers, and official portals.
2. Recheck the Chief Minister, Governor, and UT head Who's Who lists.
3. Recheck the latest RBI Handbook Table 9 and select the latest non-missing reporting period for each jurisdiction.
4. Update `lastChecked`, preserve the economic reporting period, and do not replace missing values with estimates.
5. Run `pnpm run typecheck`, `pnpm run test`, and `pnpm run audit:local`.
6. Browser-check one state with a 2024-25 value, one state with a 2023-24 value, and one UT with an unavailable value.

## Primary Sources

- National Portal state and UT directory: https://www.india.gov.in/explore-india/facts-of-india/states-ut-districts
- Chief Ministers: https://www.india.gov.in/directory/whos-who/chief-ministers-of-states-and-union-territories
- Governors: https://www.india.gov.in/directory/whos-who/governors-of-states-and-union-territories
- Lieutenant Governors and Administrators: https://www.india.gov.in/directory/whos-who/lt-governors-and-administrators-of-union-territories
- RBI Table 9: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183
