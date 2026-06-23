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

## Draft 1 Types

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

## Provenance Rules

- `sourceName` and `sourceUrl` are required.
- `lastChecked` is required.
- `licenseNote` is required before reuse.
- Missing public data must be represented as "not publicly available".
- Conflicting public data should become a conflict state, not an overwritten value.
