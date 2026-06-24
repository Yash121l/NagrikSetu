# Audit Log

## 2026-06-23 - Draft 1

- Extracted requirements from `NagrikSetu_Agent_Brief.docx`.
- Verified current package metadata for core frontend dependencies.
- Created working Next.js MVP with typed seed data and API routes.
- Added documentation pack and agent operating notes.
- Added local audit script: `pnpm run audit:local`.
- Passed local audit: lint, typecheck, unit tests, and production build.
- Passed browser QA at desktop 1280px and mobile 390px: app loads, Leaflet renders, search updates results, console is clean, and no horizontal overflow was detected.
- Ran `codex review --uncommitted`; fixed P2 findings for missing provenance fallback links and pnpm CI setup order.

## 2026-06-23 - Draft 2

- Added typed source catalog, ingestion adapter contract, deterministic fixture adapter, zod record schemas, source-health checks, and repository facade.
- Added `pnpm run ingest:demo` and `pnpm run validate:data` for generated normalized artifacts.
- Added `/api/ingestion` and upgraded `/api/sources` to return source health.
- Updated the UI coverage panel from hard-coded Draft 1 metrics to repository-backed Draft 2 metrics.
- Generated 10 normalized records and 5 source-health rows.
- Passed local audit: data validation, lint, typecheck, unit tests, and production build.
- Passed Browser QA: Draft 2 metrics render, Leaflet renders, console is clean, `/api/search` returns source inventory matches, `/api/ingestion` returns normalized records and 5 health rows, and 390px mobile layout has no horizontal overflow.
- Ran `codex review --uncommitted`; fixed P2 findings for `/api/ingestion` timestamp accuracy and malformed-record validation safety.
- Switched ingestion scripts to `node --import tsx` so validation avoids the `tsx` CLI temp-pipe issue seen inside the Codex review sandbox.
- Ran a second `codex review --uncommitted`; fixed P2 duplicate source generation by deduplicating generated catalog source records against legacy seed source URLs.

## 2026-06-23 - Draft 3 Checkpoint 1

- Added English/Hindi pilot UI copy and language switch.
- Added local correction queue validation/persistence in `src/lib/corrections.ts` and wired `/api/feedback` to write moderation queue artifacts.
- Added correction queue tests and expanded the test suite to 10 tests across 3 files.
- Added PWA manifest, SVG app icon, service worker, and offline fallback page.
- Documented pilot operations, correction moderation boundaries, PWA readiness, and remaining public-launch work.
- Passed local audit: data validation, lint, typecheck, unit tests, and production build.
- Passed Browser QA: Hindi switch updates visible copy, correction submission writes a local queue artifact and clears the form, manifest/offline assets respond, console errors are clean, and 390px mobile layout has no horizontal overflow.

## 2026-06-24 - Draft 3 Checkpoint 2

- Added original NagrikSetu SVG bridge wordmark with English and Devanagari identity.
- Added first-party `/records/[id]` detail pages for all 10 normalized records, including full type-specific facts, evidence, map context, official next step, correction intake, and related records.
- Changed search result primary actions to internal NagrikSetu record pages; official portals remain clearly labeled evidence links.
- Added typed India → Maharashtra → Mumbai Suburban District → H/West Ward geography navigation with record roll-ups.
- Added `/directory`, `/sitemap.xml`, and `docs/SITE_MAP.md` for human, crawler, and agent navigation.
- Added navigation, geography-capacity, privacy, and source-label integrity tests; suite now covers 16 tests across 4 files.
- Passed Browser QA for home internal links, BMC complaint detail, district and locality hierarchy, directory counts, shared correction submission, clean console, and 390px detail layout without horizontal overflow.
- Expanded the geography model from a pilot-only tree to overlapping administrative, rural local-government, and urban local-government branches.
- Added directory pages and stable slugs for all 28 states and 8 Union Territories, national LGD-style counts, and Mumbai district/city/municipal-corporation/ward pilot pages.
- Fixed Codex review findings by removing personal contact collection, rejecting legacy contact payloads, and making source/action labels provenance-aware.
- Passed final local audit with 62 generated static pages and 16 tests.
- Passed final Browser QA: India shows 36 top-level cards, 20 national stats, and three hierarchy models; Andhra Pradesh shows transparent under-development status; MCGM rolls up four records and links to two related districts plus H/West Ward; third-party pages use neutral source language; 390px India layout has no horizontal overflow.
- Verified all 54 sitemap-backed public URLs return HTTP 200, including 42 place pages and 10 record pages.

## Pending

- Draft 3 checkpoint 3 adds sourced profiles to all 36 state/UT pages: capital, government and LGD identifiers, official portal, current Chief Minister where listed, Governor/Lieutenant Governor/Administrator, and latest available RBI per-capita NSDP.
- Political fields were checked against the National Portal of India Who's Who on 2026-06-24. Economic values use RBI Table 9 published 2025-08-29 and preserve jurisdiction-specific 2023-24 or 2024-25 reporting periods.
- Passed the full local audit: 10 normalized records, 5 source-health rows, lint, typecheck, 18 tests across 4 files, and a 62-page production build.
- Passed Browser QA on Andhra Pradesh and Ladakh for populated and unavailable economic states, source/freshness labels, clean console, and a 390px layout with no horizontal overflow.
- Verified all 54 sitemap-backed public URLs return HTTP 200 after the profile update.
- Ran CodeRabbit CLI review and resolved all 12 findings, including national related-record ranking, correction-form prop minimization, resilient PWA precaching, readable geography labels, and smaller release-documentation issues.
- Ran a follow-up CodeRabbit CLI review and resolved all 4 findings: in-flight correction state, assistive-technology announcements, outbound URL protocol validation, and normalized department matching.
- A fresh Codex CLI review was attempted but interrupted by the configured account usage limit; the preceding Draft 3 Codex pass completed cleanly before the state-profile extension.
- Add final follow-up review, commit, and push results.
