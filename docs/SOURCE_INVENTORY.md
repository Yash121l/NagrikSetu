# Source Inventory

This is the Draft 2 source inventory used by the deterministic ingestion backbone. Expand each row into a live connector before production launch.

| Source | URL | Priority | Use | Access Method | Notes |
| --- | --- | --- | --- | --- | --- |
| Local Government Directory | https://lgdirectory.gov.in/ | Official | Administrative, rural local-government, and urban local-government identifiers | Bulk downloads, public directory reports | Priority backbone for national geography import. |
| National Portal of India | https://www.india.gov.in/ | Official | State/UT facts, official portals, Who's Who references | Public pages, sitemap/change checks | Refresh top-level profiles and official portal links. |
| Open Government Data Platform India | https://data.gov.in/ | Open government | Dataset/API discovery | API, catalog, downloads | Check dataset-level licenses and update dates. |
| RBI Handbook of Statistics on Indian States | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183 | Official | State/UT economic profile fields | Public publication/table parsing | Preserve table number and reporting period. |
| Central Public Procurement Portal | https://eprocure.gov.in/eprocure/app | Official | Tender discovery | Portal search, public notices | Preserve source links and closing dates. |
| Pradhan Mantri Gram Sadak Yojana | https://pmgsy.nic.in/ | Official | Rural road and project discovery | Public reports/pages | Strong candidate for road responsibility and maintenance context. |
| Ministry of Road Transport and Highways | https://morth.nic.in/ | Official | National road policy, reports, and project documents | Public pages/documents | Pair with NHAI for operational routing. |
| National Highways Authority of India | https://nhai.gov.in/ | Official | National highway responsibility and complaint routing | Public pages | Link-only routing for highway complaints and assistance. |
| CPGRAMS / PG Portal | https://pgportal.gov.in/ | Official | Grievance route | Official portal links | Route users to portal; do not proxy private grievance submissions. |
| Rail Madad | https://railmadad.indianrailways.gov.in/ | Official | Railway grievance routing | Official portal links | Link-only routing; do not collect passenger grievance details. |
| UMANG | https://web.umang.gov.in/ | Official | Government service discovery | Public directory, official links | Many actions require login; keep NagrikSetu link-only. |
| eGramSwaraj | https://egramswaraj.gov.in/ | Official | Panchayat profile and planning metadata | Public reports/pages | Enrich rural local-body pages after LGD import. |
| Bhuvan | https://bhuvan.nrsc.gov.in/ | Official | Geospatial reference and map layers | Public geospatial services | Verify layer-specific terms before reuse. |
| BMC citizen portal | https://portal.mcgm.gov.in/ | Official | Mumbai municipal complaints and ward routing | Public pages, complaint links | City-pilot source for road complaint flow. |
| Municipal Corporation of Delhi 311 | https://mcdonline.nic.in/ | Official | Delhi municipal complaints and service routing | Public pages, complaint links | Second-city candidate after Mumbai. |
| OpenStreetMap | https://www.openstreetmap.org/ | Permissive third-party | Base map, road/place references | Tiles and OSM-derived data | Attribute OSM and comply with ODbL. |

## Source Intake Checklist

- Confirm whether official API or bulk download exists.
- Read terms, robots.txt, and license.
- Save raw source snapshot metadata.
- Parse into canonical entity shape.
- Record extraction date, source URL, and confidence.
- Add source-health monitoring.
