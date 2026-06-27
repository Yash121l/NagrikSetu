# PostgreSQL And PostGIS Migration

## Current Boundary

`src/data/repository.ts` is now a facade over `NagrikRepository`. The active implementation is `localRepository`, which reads the deterministic fixture ingestion report. Production should add a `postgresRepository` behind the same contract instead of changing app or API routes.

## Schema

The baseline schema lives in `db/schema.sql` and covers:

- source catalog metadata and license/robots fields
- raw snapshot manifests and content hashes
- source run events with dedupe key counts
- normalized civic records with `jsonb` payloads and generated full-text search vectors
- record dedupe keys
- PostGIS geography regions and record-region mappings
- moderation-ready correction submissions

## Migration Order

1. Provision PostgreSQL 16+ with PostGIS, pg_trgm, and pgcrypto.
2. Apply `db/schema.sql`.
3. Load source catalog rows from `src/ingestion/source-catalog.ts`.
4. Copy raw snapshot manifests from object storage into `raw_snapshots`.
5. Upsert normalized records, dedupe keys, source runs, and geography regions in one transaction per source run.
6. Run search parity checks against `src/lib/search.ts` before routing production traffic to database-backed search.
7. Keep the local repository available for fixture tests and offline development.

## Search Path

The first production search implementation should combine:

- `search_document @@ plainto_tsquery('simple', query)` for typed civic text
- `title gin_trgm_ops` for spelling drift
- confidence and freshness boosts matching current local ranking behavior
- PostGIS filters for map bounds and region rollups

## Review Gates

- Reject records without provenance JSON containing `sourceName`, `sourceUrl`, `lastChecked`, and `licenseNote`.
- Treat dedupe collisions as moderation items, not silent overwrites.
- Keep low-confidence records visible in search responses.
- Preserve raw snapshot hashes before a parser updates normalized records.
- Confirm geography rows have unique slugs and no parent cycles before loading them.
