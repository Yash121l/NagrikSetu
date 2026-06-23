# Cloud Notes

## Target Deployment Shape

- Frontend/API: Next.js on Vercel, Fly.io, Render, or a container platform.
- Database: PostgreSQL with PostGIS.
- Search: OpenSearch, Elasticsearch, or PostgreSQL full-text for early scale.
- Raw archive: S3-compatible object storage.
- Jobs: scheduled worker for source discovery, downloads, parsing, validation, and deduplication.
- Monitoring: source freshness, broken links, crawler failures, and high-volume user searches with no useful answer.

## Environment Variables

- `DATABASE_URL` - future PostgreSQL/PostGIS connection.
- `SEARCH_URL` - future search backend.
- `OBJECT_STORE_BUCKET` - future raw source archive bucket.
- `NEXT_PUBLIC_APP_ENV` - deployment environment label.
- `NEXT_PUBLIC_MAP_ATTRIBUTION` - map attribution string.

## Release Gate

Run:

```bash
pnpm run audit:local
codex review --uncommitted "Review NagrikSetu for correctness, UX, accessibility, security, and maintainability."
```
