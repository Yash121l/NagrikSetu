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
- Schema capacity for districts, sub-districts, rural bodies, 5,052 urban local bodies, wards, and localities.
- Human directory and machine-readable sitemap.
- Sourced civic profiles for all 28 states and 8 Union Territories, including current administration, official portals, government/LGD codes, and latest available RBI per-capita NSDP.

### Remaining Platform Work

- One city, one state, one national geography source, one road/project source, and one central tender source with live ingestion.
- LGD-backed import for all districts, sub-districts, villages, panchayats, and urban local bodies.
- PostgreSQL/PostGIS persistence and migration path.
- Source inventory admin workflow.
- Freshness and broken-link monitoring.
- Database-backed repository implementation against the PostgreSQL/PostGIS schema baseline.
- Automated refresh and change review for state administration and economy snapshots.
- Voice/readout experiments.
- Deployment hardening and observability.

### Checkpoint 4 Start

- Expanded the tracked source registry from the initial pilot set into a national expansion inventory covering LGD, National Portal, RBI, PMGSY, MoRTH, NHAI, Rail Madad, UMANG, eGramSwaraj, Bhuvan, BMC, MCD, CPPP, CPGRAMS, data.gov.in, and OSM.
- Added first-pass national complaint/project records for NHAI, Rail Madad, UMANG, PMGSY, and MCD.
- Added the first data-population batch for official national service/grievance routes and four state grievance portals: ERSS 112, National Cyber Crime Reporting Portal, National Consumer Helpline, DigiLocker, eSanjeevani, PM-JAY CGRMS, Maharashtra Aaple Sarkar, e-District Delhi, Karnataka Janaspandana, and Tamil Nadu CM Helpline.
- Added a second data-population batch and acquisition backlog for National Government Services Portal, myScheme, UIDAI, Passport Seva, EPFiGMS, Tele-MANAS, GeM bids, and Census of India.
- Added feasibility and automated-ingestion planning docs for connector development, raw snapshot storage, source-health monitoring, and future PostgreSQL/PostGIS migration.
- Added the repository contract and PostgreSQL/PostGIS schema baseline for production persistence.
- Added a production-readiness audit and deployment checklist covering environment gates, source legal review, human moderation, raw snapshots, and phased source rollout.

## Draft 4 - National Expansion

- Multi-state source coverage.
- Road/public works project matching.
- Tender award linkage.
- Researcher exports with licenses and caveats.
