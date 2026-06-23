# NagrikSetu

NagrikSetu is a citizen-first search and navigation layer for public information in India. It helps people answer:

- Who is responsible for this road, office, tender, or civic issue?
- Which public office or officer should I contact?
- Where is the official complaint or grievance path?
- What source proves the answer, and how fresh is it?

## Draft Status

This repository contains Draft 2: a working Next.js MVP plus a deterministic data backbone with typed source catalog, fixture ingestion adapters, validation, source-health reporting, generated normalized artifacts, and documentation for future ingestion agents.

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
pnpm run validate:data
pnpm run audit:local
```

## Repository Map

- `src/app` - Next.js app routes and API endpoints.
- `src/components` - Search, result, evidence, and map UI components.
- `src/lib` - Typed civic records, deterministic base records, search logic, and quality helpers.
- `src/ingestion` - Source catalog, adapter contracts, validation, and deterministic ingestion report.
- `src/data` - Repository facade used by the app and APIs.
- `scripts` - Executable agent utilities such as the demo ingestion generator.
- `data/normalized` - Generated Draft 2 normalized records and source-health snapshots.
- `tests` - Unit tests for search behavior.
- `docs` - Product, architecture, data model, ingestion, security, accessibility, roadmap, and audit notes.
- `AGENTS.md`, `agent.md`, `cloud.md`, `CODEX.md` - Agent operating files.

## Current Caveat

Draft 2 uses deterministic fixture adapters. It does not yet run live crawlers, store data in PostGIS, submit grievances, or claim official completeness.
