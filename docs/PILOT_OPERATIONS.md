# Pilot Operations

## Draft 3 Checkpoint 3

This checkpoint prepares NagrikSetu for controlled public-pilot testing without claiming production completeness.

## Correction Intake

- The selected search result can receive a correction or missing-detail report.
- `src/app/api/feedback/route.ts` validates the payload and calls `src/lib/corrections.ts`.
- Local queue files are written to `data/corrections/*.json`.
- Queue files are ignored by Git and correction intake does not collect personal contact details.
- A moderator must verify each correction against official sources before records change.

## PWA Readiness

- `src/app/manifest.ts` exposes install metadata.
- `public/sw.js` caches the shell and returns `public/offline.html` for offline navigation.
- API responses are not cached for offline mutation or sync in this checkpoint.

## Before Public Launch

- Replace file-backed corrections with an authenticated moderation database.
- Add abuse controls, retention policy, and operator audit trail.
- Add live source connectors and source freshness monitors.
- Run screen-reader QA on search, map/list selection, language switch, and correction submission.
