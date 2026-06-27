# Source Inventory

This is the Draft 2 source inventory used by the deterministic ingestion backbone. Expand each row into a live connector before production launch.

| Source | URL | Priority | Use | Access Method | Notes |
| --- | --- | --- | --- | --- | --- |
| Local Government Directory | https://lgdirectory.gov.in/ | Official | Administrative, rural local-government, and urban local-government identifiers | Bulk downloads, public directory reports | Priority backbone for national geography import. |
| National Portal of India | https://www.india.gov.in/ | Official | State/UT facts, official portals, Who's Who references | Public pages, sitemap/change checks | Refresh top-level profiles and official portal links. |
| National Government Services Portal | https://www.india.gov.in/services | Official | Government service discovery | Public pages, sitemap/change checks | Source service routes; applications remain on official portals. |
| Open Government Data Platform India | https://data.gov.in/ | Open government | Dataset/API discovery | API, catalog, downloads | Check dataset-level licenses and update dates. |
| RBI Handbook of Statistics on Indian States | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183 | Official | State/UT economic profile fields | Public publication/table parsing | Preserve table number and reporting period. |
| Central Public Procurement Portal | https://eprocure.gov.in/eprocure/app | Official | Tender discovery | Portal search, public notices | Preserve source links and closing dates. |
| Government e Marketplace bids | https://bidplus.gem.gov.in/all-bids | Official | Bid and reverse-auction discovery | Public pages | Link to original bid pages; review before automating dynamic extraction. |
| Pradhan Mantri Gram Sadak Yojana | https://pmgsy.nic.in/ | Official | Rural road and project discovery | Public reports/pages | Strong candidate for road responsibility and maintenance context. |
| Ministry of Road Transport and Highways | https://morth.nic.in/ | Official | National road policy, reports, and project documents | Public pages/documents | Pair with NHAI for operational routing. |
| National Highways Authority of India | https://nhai.gov.in/ | Official | National highway responsibility and complaint routing | Public pages | Link-only routing for highway complaints and assistance. |
| CPGRAMS / PG Portal | https://pgportal.gov.in/ | Official | Grievance route | Official portal links | Route users to portal; do not proxy private grievance submissions. |
| Rail Madad | https://railmadad.indianrailways.gov.in/ | Official | Railway grievance routing | Official portal links | Link-only routing; do not collect passenger grievance details. |
| UMANG | https://web.umang.gov.in/ | Official | Government service discovery | Public directory, official links | Many actions require login; keep NagrikSetu link-only. |
| National Consumer Helpline | https://consumerhelpline.gov.in/ | Official | Consumer grievance routing | Public pages, official portal links | Link-only routing; do not collect consumer complaint details. |
| National Cyber Crime Reporting Portal | https://cybercrime.gov.in/ | Official | Cybercrime reporting, 1930 route, suspect repository links | Public pages, official portal links | Link-only routing; do not collect cyber incident details. |
| Emergency Response Support System 112 | https://112.gov.in/ | Official | Emergency routing and state ERSS discovery | Public pages | Emergency-only; do not intermediate SOS requests. |
| DigiLocker | https://www.digilocker.gov.in/ | Official | Digital document wallet and support routing | Public pages, official support links | Do not collect identity documents or account data. |
| eSanjeevani | https://esanjeevani.mohfw.gov.in/ | Official | Telemedicine service/support routing | Public pages, official feedback links | Do not collect health or contact data. |
| PM-JAY CGRMS | https://cgrms.pmjay.gov.in/ | Official | PM-JAY grievance filing and tracking route | Public portal link | Link-only routing; do not collect beneficiary details. |
| myScheme | https://www.myscheme.gov.in/ | Official | Government scheme discovery | Public pages | Use for discovery; eligibility answers and applications stay on official portals. |
| UIDAI | https://uidai.gov.in/ | Official | Aadhaar support and contact routing | Public pages, official support links | Do not collect Aadhaar numbers or identity documents. |
| Passport Seva | https://www.passportindia.gov.in/psp | Official | Passport service and support routing | Public pages, official portal links | Do not collect identity documents. |
| EPFiGMS | https://epfigms.gov.in/ | Official | EPFO grievance routing | Public pages, official portal links | Do not collect UAN, PPO, employer, or document details. |
| Tele-MANAS | https://telemanas.mohfw.gov.in/ | Official | Mental-health support routing | Public pages, official helpline links | Do not collect health details. |
| eGramSwaraj | https://egramswaraj.gov.in/ | Official | Panchayat profile and planning metadata | Public reports/pages | Enrich rural local-body pages after LGD import. |
| Bhuvan | https://bhuvan.nrsc.gov.in/ | Official | Geospatial reference and map layers | Public geospatial services | Verify layer-specific terms before reuse. |
| Census of India | https://censusindia.gov.in/ | Official | Census geography and population reference | Public reports/tables | Use publication/table-level attribution and review dataset reuse terms. |
| BMC citizen portal | https://portal.mcgm.gov.in/ | Official | Mumbai municipal complaints and ward routing | Public pages, complaint links | City-pilot source for road complaint flow. |
| Municipal Corporation of Delhi 311 | https://mcdonline.nic.in/ | Official | Delhi municipal complaints and service routing | Public pages, complaint links | Second-city candidate after Mumbai. |
| Maharashtra Aaple Sarkar grievance portal | https://grievances.maharashtra.gov.in/en | Official | Maharashtra state grievance routing | Public portal link | Link-only routing; do not collect complaint content. |
| e-District Delhi | https://edistrict.delhigovt.nic.in/ | Official | Delhi service and grievance routing | Public pages, official portal links | Do not collect application documents. |
| Karnataka Janaspandana iPGRS | https://ipgrs.karnataka.gov.in/ | Official | Karnataka public grievance routing and 1902 helpline | Public pages, official portal links | Link-only routing. |
| Tamil Nadu Mudhalvarin Mugavari CM Helpline | https://cmhelpline.tnega.org/portal/en/home | Official | Tamil Nadu grievance and petition routing | Public pages, official portal links | Link-only routing; do not collect petition details. |
| OpenStreetMap | https://www.openstreetmap.org/ | Permissive third-party | Base map, road/place references | Tiles and OSM-derived data | Attribute OSM and comply with ODbL. |

## Source Intake Checklist

- Confirm whether official API or bulk download exists.
- Read terms, robots.txt, and license.
- Save raw source snapshot metadata.
- Parse into canonical entity shape.
- Record extraction date, source URL, and confidence.
- Add source-health monitoring.
