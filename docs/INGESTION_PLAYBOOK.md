# Ingestion Playbook

## Priority Order

1. Official API access and bulk downloads.
2. Public datasets, CSV, XLSX, PDFs, and HTML tables.
3. Sitemap/RSS/change detection.
4. Controlled browser automation for dynamic public pages.
5. Scraping only when permitted and after no better source exists.

## Standard Adapter Contract

Each adapter should return:

- raw source metadata
- normalized records
- validation warnings
- dedupe keys
- freshness timestamp
- license and attribution notes

## Validation Checks

- Required provenance exists.
- Public-contact data is official-facing only.
- Coordinates are valid and within expected jurisdiction.
- Dates parse and preserve source timezone when known.
- Low-confidence entity matches remain labeled.

## Draft 2 Implementation Plan

- Add `packages/ingestion` or `src/ingestion`.
- Add source adapters for data.gov.in, CPPP, CPGRAMS route metadata, and one city portal.
- Store raw snapshots in object storage or `data/raw` for local development.
- Store normalized records in PostgreSQL/PostGIS.
- Add source freshness and broken-link checks.
