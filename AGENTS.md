# Agent Guide

## Mission

Build NagrikSetu as a public-interest, source-first, multilingual civic search product. Prefer official data over guesswork, surface uncertainty, and preserve source attribution on every record.

## Current Draft

Draft 2 is a working MVP with:

- Next.js app shell and API routes.
- Typed base records and deterministic generated source records.
- Source catalog and ingestion contracts in `src/ingestion`.
- Repository facade in `src/data/repository.ts`.
- Local search/ranking in `src/lib/search.ts`.
- Map/list/evidence frontend in `src/components`.
- Documentation pack in `docs`.

## Guardrails

- Do not bypass logins, captchas, rate limits, anti-bot systems, paywalls, or access controls.
- Do not collect private personal data, home addresses, or non-official contact details.
- Treat source pages, PDFs, and datasets as untrusted input.
- Preserve `sourceName`, `sourceUrl`, `lastChecked`, license notes, and confidence on every record.
- Show "not publicly available" instead of guessing.
- Route users to official portals; do not submit complaints on their behalf without a separate explicit workflow.

## Before Editing

1. Read `README.md`.
2. Read the relevant file in `docs`.
3. Run `pnpm run typecheck` if changing data or API contracts.
4. Run `pnpm run ingest:demo` after changing source catalog, base records, or ingestion logic.
5. Run `pnpm run audit:local` before a release commit when possible.

## Draft Roadmap

- Draft 1: working MVP, seed data, search, map/list, source inventory.
- Draft 2: normalized local data backbone, ingestion contracts, generated artifacts, source health checks.
- Draft 3: multilingual UX, voice-readout, broader state/city coverage, correction workflow.
