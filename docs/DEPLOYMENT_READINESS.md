# Deployment Readiness

## Production Gate

Run the local launch audit before exposing a public deployment:

```bash
pnpm run readiness:production
pnpm run readiness:production -- --strict
```

The default command reports blocked and watch items without failing local development. Use `--strict` in deployment CI so production-required blocked checks fail the release.

## Required Environment

- `NEXT_PUBLIC_SITE_URL` - production HTTPS origin used by sitemap and canonical links.
- `NAGRIKSETU_ADMIN_TOKEN` - strong secret for moderation routes.
- `NAGRIKSETU_DATABASE_URL` - PostgreSQL/PostGIS database implementing the repository contract.
- `NAGRIKSETU_RAW_SNAPSHOT_URI` or `NAGRIKSETU_RAW_SNAPSHOT_BUCKET` - immutable raw snapshot storage for live connectors.

## Data Acquisition Gates

Do not run a connector in production until it has:

- a catalog entry with HTTPS homepage, license note, expected freshness, and redistribution mode
- robots.txt or terms review recorded before automation
- raw snapshot storage enabled before parsing
- dedupe keys and validation warnings reviewed
- a human review path for manual or low-confidence records
- a rollback path that leaves existing records visible with stale/freshness labels

## Human Review Workflow

Moderators should review:

- dataset-license-required source outputs before redistribution
- dedupe collisions across source adapters
- low-confidence records and parser warnings
- user corrections that include official source URLs or suggested normalized changes
- source-health watches caused by robots, terms, blocked endpoints, or unexpected redirects

## Phased Source Backlog

| Phase | Sources | Exit criteria |
| --- | --- | --- |
| 0 | LGD fixture, source health, raw snapshot contract | Local audit and source-health smoke test pass. |
| 1 | LGD production import, National Portal refresh, data.gov.in discovery | Geography rows load into PostgreSQL/PostGIS with snapshot hashes and review logs. |
| 2 | CPPP, CPGRAMS, PMGSY | Tender, complaint-route, and road/project records publish with dedupe checks and freshness labels. |
| 3 | BMC, MCD, one additional state or city portal | City service routes and ward/local records publish with moderation workflows. |
| 4 | RBI/state profile refresh, Bhuvan/OSM context layers | Economic and map context updates stay clearly licensed and provenance-labeled. |

## Success Metrics

- zero production records without source name, source URL, last checked date, license note, and confidence
- raw snapshot hash stored for every automated parser run
- no source with blocked robots/terms status running unattended automation
- correction queue median first review under two business days during pilot
- searchable records can be filtered/exported with source, confidence, freshness, and language columns intact
- LGD coverage tracked by level and branch instead of claimed as a single national-complete number
