# Data Model

## Canonical Entities

- Department
- Office
- Officer
- Project
- Road segment or public work
- Tender
- Complaint channel
- Jurisdiction or boundary
- Source record
- Source update event

## Runtime Types

The MVP uses `NagrikRecord` in `src/lib/types.ts`. Every record carries:

- `id`
- `kind`
- `title`
- `summary`
- `department`
- `jurisdiction`
- public contact fields when available
- `issueTags`
- `languageTags`
- optional coordinates
- `confidence`
- `updatedAt`
- `provenance`

## Draft 2 Runtime Validation

Draft 2 adds zod schemas in `src/ingestion/record-schema.ts` and batch validation in `src/ingestion/validator.ts`.

The validation gate checks:

- required provenance and valid source URLs
- unique record ids
- bounded India-focused coordinates
- kind-specific fields such as tender document URLs and complaint portal URLs
- visible warnings for low-confidence records

Generated normalized artifacts are written to `data/normalized/nagrik-records.json` and `data/normalized/source-health.json`.

## Provenance Rules

- `sourceName` and `sourceUrl` are required.
- `lastChecked` is required.
- `licenseNote` is required before reuse.
- Missing public data must be represented as "not publicly available".
- Conflicting public data should become a conflict state, not an overwritten value.
