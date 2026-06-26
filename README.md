# NagrikSetu

NagrikSetu is a citizen-first search and navigation layer for public information in India. It helps people answer:

- Who is responsible for this road, office, tender, or civic issue?
- Which public office or officer should I contact?
- Where is the official complaint or grievance path?
- What source proves the answer, and how fresh is it?

## Draft Status

This repository contains Draft 3 checkpoint 3 (`0.3.0`): a working Next.js civic information product with deterministic data backbone, first-party record detail pages, all 28 state and 8 UT pages, sourced state administration and economic profiles, extensible administrative/rural/urban local-government navigation, typed source catalog, validation, source-health reporting, Hindi/English pilot UI, privacy-limited correction queue, PWA metadata, generated normalized artifacts, and documentation for future agents.

## Quick Start

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run ingest:demo
pnpm run ingest:lgd
pnpm run source-health:local
pnpm run readiness:production
pnpm run validate:data
pnpm run audit:local
```

## Repository Map

- `src/app` - Next.js app routes and API endpoints.
- `src/components` - Search, result, evidence, and map UI components.
- `src/lib` - Typed civic records, deterministic base records, search logic, and quality helpers.
- `src/ingestion` - Source catalog, adapter contracts, validation, and deterministic ingestion report.
- `src/data` - Repository facade used by the app and APIs.
- `db/schema.sql` - PostgreSQL/PostGIS persistence baseline for production migration.
- `src/data/geography.ts` - All 28 states, 8 UTs, national counts, and extensible administrative/rural/urban local-government hierarchy.
- `src/data/state-profiles.ts` - Sourced capitals, government identifiers, current administration, and per-capita NSDP snapshots for all 36 top-level jurisdictions.
- `scripts` - Executable agent utilities such as the demo ingestion generator.
- `data/normalized` - Generated Draft 2 normalized records and source-health snapshots.
- `tests` - Unit tests for search behavior.
- `docs` - Product, architecture, data model, ingestion, security, accessibility, roadmap, and audit notes.
- `AGENTS.md`, `agent.md`, `cloud.md`, `CODEX.md` - Agent operating files.
- `public` - PWA icon, service worker, and offline fallback.
- `docs/SITE_MAP.md` - Public route and geography information architecture.
- `docs/GEOGRAPHY_MODEL.md` - India administrative and local-government hierarchy contract.
- `docs/STATE_PROFILE_MODEL.md` - State/UT profile provenance, economic definitions, and refresh procedure.
- `docs/FEASIBILITY_AUDIT.md` - Direction, usefulness, feasibility, and source-class risk assessment.
- `docs/AUTOMATED_INGESTION_PLAN.md` - Connector tiers, automation guardrails, and first live-ingestion backlog.
- `docs/POSTGRES_MIGRATION.md` - Repository-contract migration plan for moving fixture-backed reads to PostgreSQL/PostGIS.
- `docs/DEPLOYMENT_READINESS.md` - Production environment, connector gate, source-review, and phased rollout checklist.

## Current Caveat

Draft 3 checkpoint 4 start uses deterministic fixture adapters, a dated state-profile snapshot, and a local file-backed correction queue. It expands the official source registry and first-pass national route records, but does not yet run live crawlers, store data in PostGIS, submit grievances, or claim official completeness.
