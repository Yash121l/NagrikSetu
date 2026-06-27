# Data Acquisition Backlog

This backlog turns the Draft 3 checkpoint 4 audit and research pass into source-first data work. It is intentionally conservative: link-only records are preferred until a source has terms, robots, raw snapshot, parser, dedupe, and human-review coverage.

## Completed Local Fixture Batches

### Batch 1 - National And State Grievance Routes

- ERSS 112 emergency route.
- National Cyber Crime Reporting Portal.
- National Consumer Helpline.
- PM-JAY CGRMS.
- DigiLocker support route.
- eSanjeevani feedback/support route.
- Maharashtra Aaple Sarkar grievance route.
- e-District Delhi service and grievance route.
- Karnataka Janaspandana iPGRS.
- Tamil Nadu Mudhalvarin Mugavari CM Helpline.

### Batch 2 - Services, Identity, Procurement, And Reference Sources

- National Government Services Portal.
- myScheme.
- UIDAI Aadhaar support route.
- Passport Seva service route.
- EPFiGMS EPFO grievance route.
- Tele-MANAS mental-health support route.
- Government e Marketplace public bid discovery.
- Census of India geography and population reference.

## Next Candidate Records

### Public Helplines And Grievance Routes

| Candidate | Kind | Geography | Source | Notes |
| --- | --- | --- | --- | --- |
| Childline 1098 | complaint | India | Official child protection source to verify | Add only after current official owner and route are confirmed. |
| Women helpline 181 | complaint | State/UT or India | State/central official pages | Coverage varies by state; avoid one national claim until verified. |
| Elderline 14567 | complaint | India/state | Official social justice/state pages | Verify state availability and current owner. |
| EPFO contact/office directory | office | India | https://www.epfo.gov.in/ | Public office metadata only. |
| UIDAI enrolment/update center discovery | office/source | India | https://uidai.gov.in/ | Link-only unless structured public dataset is available. |

### Service And Scheme Discovery

| Candidate | Kind | Geography | Source | Notes |
| --- | --- | --- | --- | --- |
| National Government Services Portal category pages | source | India | https://www.india.gov.in/services | Good sitemap/html connector candidate. |
| myScheme scheme pages | source | India | https://www.myscheme.gov.in/ | Keep eligibility answers and applications outside NagrikSetu. |
| UMANG department/service pages | source/complaint | India | https://web.umang.gov.in/ | Many flows require login; link-only by default. |

### Procurement And Projects

| Candidate | Kind | Geography | Source | Notes |
| --- | --- | --- | --- | --- |
| CPPP latest tender notices | tender | India | https://eprocure.gov.in/eprocure/app | Dynamic portal; manual review before parser automation. |
| GeM current bid pages | tender | India | https://bidplus.gem.gov.in/all-bids | Preserve original bid URL, buyer caveats, and closing dates. |
| PMGSY road package reports | road/project | State/district | https://pmgsy.nic.in/ | High-value structured connector after source review. |
| NHAI project/PIU routing | road/office | National highways | https://nhai.gov.in/ | Pair project facts with NHAI link-only complaint route. |

### Local Government And City Pilots

| Candidate | Kind | Geography | Source | Notes |
| --- | --- | --- | --- | --- |
| BMC ward office directory | office | Mumbai | https://portal.mcgm.gov.in/ | Extend existing Mumbai pilot. |
| MCD ward/civic service pages | office/complaint | Delhi | https://mcdonline.nic.in/ | Extend Delhi pilot after source review. |
| BBMP Sahaya/citizen services | complaint | Bengaluru | https://bbmp.gov.in/ | Verify current official route and complaint portal. |
| Greater Chennai Corporation complaint route | complaint | Chennai | https://chennaicorporation.gov.in/ | Verify current official source and service categories. |
| GHMC citizen services | complaint | Hyderabad | https://www.ghmc.gov.in/ | Verify current official source and service categories. |

## Connector Order

1. LGD bulk/report import for geography coverage.
2. National Portal and state portal verification for official portals and service pages.
3. National Government Services Portal and myScheme discovery connectors.
4. CPGRAMS, NCH, EPFiGMS, UIDAI, and Passport route metadata as link-only complaint/service records.
5. CPPP and GeM tender discovery with manual review before publishing.
6. PMGSY and NHAI road/project connectors.
7. BMC, MCD, and one additional city portal for municipal service routing.

## Guardrails

- Do not automate login, captcha, OTP, account, or private grievance flows.
- Do not collect complaint bodies, identity documents, health data, Aadhaar numbers, UAN/PPO numbers, passport files, or personal contact data.
- Preserve `sourceName`, `sourceUrl`, `lastChecked`, `licenseNote`, and confidence on every record.
- Store raw snapshot metadata before parsing and route low-confidence or conflicting facts to moderation.
