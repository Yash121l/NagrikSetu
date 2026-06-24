# India Geography And Local Government Model

## Why The Model Has Two Branches

Indian civic information uses overlapping structures. Revenue and administrative units organize land and district records, while rural and urban local governments organize service delivery. NagrikSetu stores the branch explicitly instead of pretending every municipality or panchayat is simply another district child.

## Administrative Branch

```text
India
→ State / Union Territory
→ Division / Region, where used
→ District
→ Sub-division / Sub-district
→ Tehsil / Taluka / Mandal / Circle
→ Village / Town / City
→ Ward / Locality / Mohalla
```

## Rural Local Government Branch

```text
District Panchayat / Zila Parishad
→ Block Panchayat / Panchayat Samiti
→ Gram Panchayat
→ Village or villages
```

A Gram Panchayat and village are not assumed to be one-to-one.

## Urban Local Government Branch

```text
District and city context
→ Urban Local Body
→ Municipal Corporation / Municipality / Town Panchayat / Cantonment Board
→ Ward
→ Locality
```

Urban local bodies can overlap or relate to more than one administrative district. `relatedRegionIds` records these non-tree relationships while `parentId` provides a stable primary browse route.

## Current Directory Scale

- 28 state pages
- 8 Union Territory pages
- 36 total top-level pages
- 36 sourced top-level civic profiles with capitals, administration, official portals, and economic snapshots
- 784 districts represented as national capacity, with detailed district pages added source by source
- 5,045 urban local bodies represented in the schema and national capacity model
- Mumbai pilot pages for two districts, city context, municipal corporation, and ward

The national counts are a supplied snapshot based on the Government of India Local Government Directory. Counts can change as governments create, merge, or remap units.

## Data Status

- `source-backed-pilot` - the page has current normalized records in NagrikSetu.
- `directory-page` - the official top-level page and slug exist; lower records are still being built.
- `under-development` - the structure is supported but source ingestion has not populated the page.

Directory-only pages never invent offices, contacts, or projects.

Top-level state and UT pages are useful before lower-level ingestion is complete because `src/data/state-profiles.ts` supplies a separately sourced jurisdiction profile. See `docs/STATE_PROFILE_MODEL.md` for freshness and economic-field rules.

## Expansion Contract

1. Add or import the location with a stable id, slug, kind, governance branch, and parent or relationship links.
2. Preserve official identifiers once LGD ingestion is connected.
3. Assign normalized records to one or more relevant regions.
4. Keep source provenance on the record, not only on the location page.
5. Run `pnpm run audit:local` and the navigation integrity tests.

## Primary Sources

- Local Government Directory: https://lgdirectory.gov.in/
- National Portal state/UT overview: https://www.india.gov.in/explore-india/facts-of-india/states-ut-districts
