# Source Inventory

This is the starting source inventory for Draft 1. Expand it before building ingestion.

| Source | URL | Priority | Use | Access Method | Notes |
| --- | --- | --- | --- | --- | --- |
| Open Government Data Platform India | https://data.gov.in/ | Open government | Dataset/API discovery | API, catalog, downloads | Check dataset-level licenses and update dates. |
| Central Public Procurement Portal | https://eprocure.gov.in/eprocure/app | Official | Tender discovery | Portal search, public notices | Preserve source links and closing dates. |
| CPGRAMS / PG Portal | https://pgportal.gov.in/ | Official | Grievance route | Official portal links | Route users to portal; do not proxy private grievance submissions. |
| BMC citizen portal | https://portal.mcgm.gov.in/ | Official | Mumbai municipal complaints and ward routing | Public pages, complaint links | Draft 1 seed for road complaint flow. |
| OpenStreetMap | https://www.openstreetmap.org/ | Permissive third-party | Base map, road/place references | Tiles and OSM-derived data | Attribute OSM and comply with ODbL. |

## Source Intake Checklist

- Confirm whether official API or bulk download exists.
- Read terms, robots.txt, and license.
- Save raw source snapshot metadata.
- Parse into canonical entity shape.
- Record extraction date, source URL, and confidence.
- Add source-health monitoring.
