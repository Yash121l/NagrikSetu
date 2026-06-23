# NagrikSetu

NagrikSetu is a citizen-first search and navigation layer for public information in India. It helps people answer:

- Who is responsible for this road, office, tender, or civic issue?
- Which public office or officer should I contact?
- Where is the official complaint or grievance path?
- What source proves the answer, and how fresh is it?

## Draft Status

This repository contains Draft 1: a working Next.js MVP with typed seed data, a search API, a map/list UI, provenance labels, confidence labels, source inventory, and documentation for future ingestion agents.

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
pnpm run audit:local
```

## Repository Map

- `src/app` - Next.js app routes and API endpoints.
- `src/components` - Search, result, evidence, and map UI components.
- `src/lib` - Typed civic records, seed data, search logic, and quality helpers.
- `tests` - Unit tests for search behavior.
- `docs` - Product, architecture, data model, ingestion, security, accessibility, roadmap, and audit notes.
- `AGENTS.md`, `agent.md`, `cloud.md`, `CODEX.md` - Agent operating files.

## Current Caveat

Draft 1 uses curated seed records. It does not yet run live crawlers, store data in PostGIS, submit grievances, or claim official completeness.
