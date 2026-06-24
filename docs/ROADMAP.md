# Roadmap

## Draft 1 - Working MVP

- Search by office, road, tender, source, or complaint issue.
- Map/list experience.
- Source evidence panel.
- Confidence and caveat language.
- Agent-friendly documentation and CI.

## Draft 2 - Data Backbone

- Typed source catalog.
- Ingestion adapter contract.
- Deterministic fixture adapters for official-source flows.
- Runtime validation and source-health reporting.
- Generated normalized artifacts for agents and future database imports.

## Draft 3 - Public Pilot

### Shipped Through Checkpoint 3

- Hindi/English pilot interface.
- Correction queue with moderation-ready artifacts.
- PWA install support and offline fallback.
- First-party detail pages for every normalized record.
- Country, state, district, and locality navigation.
- Directory pages for all 28 states and 8 Union Territories.
- Schema capacity for districts, sub-districts, rural bodies, 5,045 urban local bodies, wards, and localities.
- Human directory and machine-readable sitemap.
- Sourced civic profiles for all 28 states and 8 Union Territories, including current administration, official portals, government/LGD codes, and latest available RBI per-capita NSDP.

### Remaining Platform Work

- One city, one state, and one central tender source with live ingestion.
- LGD-backed import for all districts, sub-districts, villages, panchayats, and urban local bodies.
- PostgreSQL/PostGIS persistence and migration path.
- Source inventory admin workflow.
- Freshness and broken-link monitoring.
- Automated refresh and change review for state administration and economy snapshots.
- Voice/readout experiments.
- Deployment hardening and observability.

## Draft 4 - National Expansion

- Multi-state source coverage.
- Road/public works project matching.
- Tender award linkage.
- Researcher exports with licenses and caveats.
