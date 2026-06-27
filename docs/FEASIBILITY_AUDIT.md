# Feasibility Audit

## Direction

NagrikSetu is moving toward a source-first civic search and routing product for India. The strongest product shape is not a complaint-filing proxy. It is a public-interest index that answers: which government body is responsible, what official source proves it, what public route should a citizen use next, and how fresh or uncertain the answer is.

That direction is feasible and useful because Indian public information is fragmented across national, state, district, municipal, procurement, grievance, and scheme portals. A careful source-first index can reduce search time for citizens, journalists, researchers, civic groups, and local operators without collecting private grievance data.

## Product Usefulness

- Citizens get faster routing to official complaint, tender, road, and office sources.
- Journalists and researchers get provenance-preserving records with freshness labels.
- Civic teams get reusable geography, source-health, and correction workflows.
- Governments and operators can see stale or broken public information without NagrikSetu pretending to be the authority.

The product becomes less useful if it claims completeness too early, mixes unofficial and official facts without labels, or stores personal grievance details. The current design avoids those traps.

## Feasibility By Data Class

| Data class | Feasibility | Best source path | Notes |
| --- | --- | --- | --- |
| State and Union Territory profiles | High | National Portal, RBI, official state portals | Already implemented; volatile office holders need scheduled review. |
| Geography and local bodies | High | Local Government Directory bulk data | Highest-value next import because it creates the national browse backbone. |
| Central grievance routing | High | CPGRAMS, UMANG, department portals | Link-only routing; never collect grievance text or user account data. |
| Railway and national highway complaint routing | Medium-high | Rail Madad, NHAI, MoRTH | Useful national records; dynamic details need source monitoring. |
| Tenders | Medium | CPPP and state procurement portals | Good public value, but dedupe and closing-date handling are important. |
| Road and public works projects | Medium | PMGSY, MoRTH, state PWDs, municipal works portals | Coverage varies widely by state and city. |
| City civic complaints and wards | Medium | Municipal portals, ward pages, 311 systems where public | High citizen value but city-by-city schemas differ. |
| Boundaries and maps | Medium | LGD identifiers, Bhuvan layers, OSM as third-party context | Official boundaries require layer-specific terms; OSM cannot prove responsibility. |
| Officer-level records | Medium-low | Official directories only | Keep public office roles, avoid private contact details. |

## Risks

- Source terms vary by dataset and portal. Every connector must store license notes and extraction metadata.
- Dynamic portals may add captchas or require sessions. Those routes should degrade to link-only records.
- Indian administrative hierarchies are overlapping. LGD imports must preserve administrative, rural, and urban branches separately.
- "Complete data" is not realistic in one pass. Completeness should be measured per source, jurisdiction, entity kind, and freshness period.

## Recommendation

Proceed. The project is feasible as a public civic search index if expansion happens in this order:

1. Import LGD geography and identifiers.
2. Add source-health monitoring and raw snapshot storage.
3. Add live source adapters for one national bulk source, one tender source, one central grievance route, and two city civic portals.
4. Move normalized records and corrections to PostgreSQL/PostGIS with moderation workflow.
5. Expand state by state, preserving source attribution and confidence rather than claiming national completeness.
