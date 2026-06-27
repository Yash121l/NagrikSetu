import type { SourceCatalogEntry } from "./types";

export const sourceCatalog: SourceCatalogEntry[] = [
  {
    id: "lgd-india",
    name: "Local Government Directory",
    homepageUrl: "https://lgdirectory.gov.in/",
    priority: "official",
    owner: "Ministry of Panchayati Raj",
    geography: "India",
    entityKinds: ["source", "office"],
    access: {
      method: "bulk-download",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public directory downloads for identifiers and hierarchy; preserve LGD attribution and extraction dates.",
      robotsTxtUrl: "https://lgdirectory.gov.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes:
      "Primary backbone for state, district, sub-district, block, village, panchayat, and urban local body identifiers."
  },
  {
    id: "national-portal-india",
    name: "National Portal of India",
    homepageUrl: "https://www.india.gov.in/",
    priority: "official",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["source", "office", "officer", "complaint"],
    access: {
      method: "sitemap",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public directory facts with attribution to the National Portal and preserve last-checked dates.",
      robotsTxtUrl: "https://www.india.gov.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes:
      "Best national starting point for states, districts, official portals, and Who's Who references before checking state sources."
  },
  {
    id: "data-gov-in",
    name: "Open Government Data Platform India",
    homepageUrl: "https://data.gov.in/",
    priority: "open-government",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["source", "office", "project"],
    access: {
      method: "api",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use dataset-level licenses and attribution before redistribution.",
      robotsTxtUrl: "https://data.gov.in/robots.txt",
      redistribution: "dataset-license-required"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Primary catalog for ministry datasets, APIs, documents, and visualizations."
  },
  {
    id: "rbi-handbook-state-statistics",
    name: "RBI Handbook of Statistics on Indian States",
    homepageUrl: "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183",
    priority: "official",
    owner: "Reserve Bank of India",
    geography: "India",
    entityKinds: ["source"],
    access: {
      method: "document-parse",
      refreshCadence: "quarterly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Preserve RBI publication, table number, reporting period, and last-checked date for economic facts.",
      termsUrl: "https://www.rbi.org.in/Scripts/Disclaimer.aspx",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 120,
      confidence: "high"
    },
    notes: "Current source for per-capita NSDP and all-India comparison fields on state and UT pages."
  },
  {
    id: "cppp-eprocure",
    name: "Central Public Procurement Portal",
    homepageUrl: "https://eprocure.gov.in/eprocure/app",
    priority: "official",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["tender", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "daily",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Preserve original tender notice links and portal policy caveats.",
      robotsTxtUrl: "https://eprocure.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 2,
      confidence: "high"
    },
    notes: "Use official search, closing-date pages, or published notices before browser automation."
  },
  {
    id: "pmgsy",
    name: "Pradhan Mantri Gram Sadak Yojana",
    homepageUrl: "https://pmgsy.nic.in/",
    priority: "official",
    owner: "Ministry of Rural Development",
    geography: "India",
    entityKinds: ["project", "road", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public project and road metadata with original scheme and report links.",
      robotsTxtUrl: "https://pmgsy.nic.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "High-value rural road source for package, work, habitation, and maintenance responsibility discovery."
  },
  {
    id: "morth",
    name: "Ministry of Road Transport and Highways",
    homepageUrl: "https://morth.nic.in/",
    priority: "official",
    owner: "Ministry of Road Transport and Highways",
    geography: "India",
    entityKinds: ["office", "project", "road", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use official public notices, reports, and road-sector documents with attribution and source dates.",
      robotsTxtUrl: "https://morth.nic.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "National highway policy, reports, and ministry contacts; pair with NHAI for operational routing."
  },
  {
    id: "nhai",
    name: "National Highways Authority of India",
    homepageUrl: "https://nhai.gov.in/",
    priority: "official",
    owner: "National Highways Authority of India",
    geography: "India",
    entityKinds: ["office", "project", "road", "complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Link users to official NHAI routes and preserve source URLs for highway complaint metadata.",
      robotsTxtUrl: "https://nhai.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Operational source for national highway responsibility, toll, incident, and helpline routing."
  },
  {
    id: "cpgrams-pgportal",
    name: "CPGRAMS / PG Portal",
    homepageUrl: "https://pgportal.gov.in/",
    priority: "official",
    owner: "Department of Administrative Reforms and Public Grievances",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route users to official filing and tracking; never proxy private grievance content in Draft 2.",
      robotsTxtUrl: "https://pgportal.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Public route metadata is safe; user grievance details are private and out of scope."
  },
  {
    id: "rail-madad",
    name: "Rail Madad",
    homepageUrl: "https://railmadad.indianrailways.gov.in/",
    priority: "official",
    owner: "Indian Railways",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route passengers to official Rail Madad channels; do not collect or proxy passenger grievance details.",
      robotsTxtUrl: "https://railmadad.indianrailways.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Useful cross-country grievance route for railway station, train, freight, and passenger service issues."
  },
  {
    id: "umang",
    name: "UMANG",
    homepageUrl: "https://web.umang.gov.in/",
    priority: "official",
    owner: "Ministry of Electronics and Information Technology",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Use as an official service directory and deep-link users to services; do not collect user account data.",
      robotsTxtUrl: "https://web.umang.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "High-value official service discovery layer, but many actions require user login and must remain out of scope."
  },
  {
    id: "national-consumer-helpline",
    name: "National Consumer Helpline",
    homepageUrl: "https://consumerhelpline.gov.in/",
    priority: "official",
    owner: "Department of Consumer Affairs",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route consumers to official NCH channels; do not collect consumer grievance details.",
      robotsTxtUrl: "https://consumerhelpline.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "National consumer grievance route with web, mobile app, WhatsApp, UMANG, SMS, and helpline channels."
  },
  {
    id: "cybercrime-portal",
    name: "National Cyber Crime Reporting Portal",
    homepageUrl: "https://cybercrime.gov.in/",
    priority: "official",
    owner: "Ministry of Home Affairs",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route users to official cybercrime reporting and 1930 channels; do not collect incident details.",
      robotsTxtUrl: "https://cybercrime.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Official cybercrime complaint, tracking, suspect repository, and awareness route operated under MHA/I4C."
  },
  {
    id: "erss-112",
    name: "Emergency Response Support System 112",
    homepageUrl: "https://112.gov.in/",
    priority: "official",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route emergencies to the official 112 system; do not intermediate emergency requests.",
      robotsTxtUrl: "https://112.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Pan-India emergency response route for police, fire, medical, women safety, and child protection situations."
  },
  {
    id: "digilocker",
    name: "DigiLocker",
    homepageUrl: "https://www.digilocker.gov.in/",
    priority: "official",
    owner: "National e-Governance Division",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Link users to official DigiLocker account and support flows; do not collect identity documents.",
      robotsTxtUrl: "https://www.digilocker.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Official digital document wallet and support route; document handling must stay on DigiLocker."
  },
  {
    id: "esanjeevani",
    name: "eSanjeevani",
    homepageUrl: "https://esanjeevani.mohfw.gov.in/",
    priority: "official",
    owner: "Ministry of Health and Family Welfare",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Link to official telemedicine and feedback paths; do not collect health or contact data.",
      robotsTxtUrl: "https://esanjeevani.mohfw.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "Official telemedicine service; privacy policy makes account and health data out of NagrikSetu scope."
  },
  {
    id: "pmjay-cgrms",
    name: "PM-JAY Central Grievance Redressal Management System",
    homepageUrl: "https://cgrms.pmjay.gov.in/",
    priority: "official",
    owner: "National Health Authority",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route PM-JAY grievances to the official CGRMS portal; do not collect beneficiary details.",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "Official PM-JAY grievance and tracking route; OTP and beneficiary details remain on the source portal."
  },
  {
    id: "national-services-portal",
    name: "National Government Services Portal",
    homepageUrl: "https://www.india.gov.in/services",
    priority: "official",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["source"],
    access: {
      method: "sitemap",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public service-directory metadata with National Portal attribution and source dates.",
      robotsTxtUrl: "https://www.india.gov.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Official service directory for discovering central, state, district, and local government service pages."
  },
  {
    id: "myscheme",
    name: "myScheme",
    homepageUrl: "https://www.myscheme.gov.in/",
    priority: "official",
    owner: "Government of India",
    geography: "India",
    entityKinds: ["source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use as a scheme discovery route; eligibility and applications remain on official portals.",
      robotsTxtUrl: "https://www.myscheme.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "National scheme discovery source; useful for service search, not for collecting eligibility answers inside NagrikSetu."
  },
  {
    id: "uidai",
    name: "Unique Identification Authority of India",
    homepageUrl: "https://uidai.gov.in/",
    priority: "official",
    owner: "Unique Identification Authority of India",
    geography: "India",
    entityKinds: ["complaint", "office", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route Aadhaar support to official UIDAI channels; do not collect identity or Aadhaar data.",
      robotsTxtUrl: "https://uidai.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Official Aadhaar support and contact source, including the 1947 helpline and enrolment/update center discovery."
  },
  {
    id: "passport-seva",
    name: "Passport Seva",
    homepageUrl: "https://www.passportindia.gov.in/psp",
    priority: "official",
    owner: "Ministry of External Affairs",
    geography: "India",
    entityKinds: ["complaint", "office", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route passport services to the official MEA portal; do not collect identity documents.",
      robotsTxtUrl: "https://www.passportindia.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Official passport service route for application, login, status, and Passport Seva Kendra discovery."
  },
  {
    id: "epfigms",
    name: "EPF i Grievance Management System",
    homepageUrl: "https://epfigms.gov.in/",
    priority: "official",
    owner: "Employees' Provident Fund Organisation",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route EPFO grievances to official EPFiGMS; do not collect UAN, PPO, or employer details.",
      robotsTxtUrl: "https://epfigms.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Official EPFO grievance portal for PF members, pensioners, employers, and related follow-up actions."
  },
  {
    id: "tele-manas",
    name: "Tele-MANAS",
    homepageUrl: "https://telemanas.mohfw.gov.in/",
    priority: "official",
    owner: "Ministry of Health and Family Welfare",
    geography: "India",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route mental-health support to official Tele-MANAS channels; do not collect health data.",
      robotsTxtUrl: "https://telemanas.mohfw.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "National tele-mental health support route; keep all personal support interactions on official channels."
  },
  {
    id: "gem-bids",
    name: "Government e Marketplace bids",
    homepageUrl: "https://bidplus.gem.gov.in/all-bids",
    priority: "official",
    owner: "Government e Marketplace",
    geography: "India",
    entityKinds: ["tender", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "daily",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Link to original GeM bid pages and preserve buyer-published notice caveats.",
      robotsTxtUrl: "https://bidplus.gem.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 2,
      confidence: "high"
    },
    notes: "Official public bid and reverse-auction discovery route; dynamic bid extraction should be reviewed before automation."
  },
  {
    id: "census-india",
    name: "Census of India",
    homepageUrl: "https://censusindia.gov.in/",
    priority: "official",
    owner: "Office of the Registrar General and Census Commissioner, India",
    geography: "India",
    entityKinds: ["source"],
    access: {
      method: "document-parse",
      refreshCadence: "quarterly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Use Census geography and population references with publication and table-level attribution.",
      robotsTxtUrl: "https://censusindia.gov.in/robots.txt",
      redistribution: "dataset-license-required"
    },
    quality: {
      expectedFreshnessDays: 120,
      confidence: "medium"
    },
    notes: "Official geography and population reference to pair with LGD identifiers; table-level licensing should be reviewed."
  },
  {
    id: "egramswaraj",
    name: "eGramSwaraj",
    homepageUrl: "https://egramswaraj.gov.in/",
    priority: "official",
    owner: "Ministry of Panchayati Raj",
    geography: "India",
    entityKinds: ["office", "project", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public panchayat planning and profile metadata with source report links and extraction dates.",
      robotsTxtUrl: "https://egramswaraj.gov.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "high"
    },
    notes: "Rural local-government profile and planning source to enrich Gram Panchayat pages after LGD import."
  },
  {
    id: "bhuvan",
    name: "Bhuvan",
    homepageUrl: "https://bhuvan.nrsc.gov.in/",
    priority: "official",
    owner: "National Remote Sensing Centre",
    geography: "India",
    entityKinds: ["road", "source"],
    access: {
      method: "geospatial-service",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Use public geospatial services with NRSC attribution and layer-specific usage notes.",
      robotsTxtUrl: "https://bhuvan.nrsc.gov.in/robots.txt",
      redistribution: "dataset-license-required"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "Potential official geospatial reference for boundaries and map overlays; verify layer terms before reuse."
  },
  {
    id: "bmc-citizen-portal",
    name: "Brihanmumbai Municipal Corporation citizen portal",
    homepageUrl: "https://portal.mcgm.gov.in/",
    priority: "official",
    owner: "Brihanmumbai Municipal Corporation",
    geography: "Mumbai, Maharashtra",
    entityKinds: ["office", "complaint", "road", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "Collect public office/contact/routing metadata only; link users to official complaint forms.",
      robotsTxtUrl: "https://portal.mcgm.gov.in/robots.txt",
      redistribution: "metadata-ok"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "medium"
    },
    notes: "Draft 2 city-pilot source for ward routing and road complaint experience."
  },
  {
    id: "mcd-311",
    name: "Municipal Corporation of Delhi 311",
    homepageUrl: "https://mcdonline.nic.in/",
    priority: "official",
    owner: "Municipal Corporation of Delhi",
    geography: "Delhi",
    entityKinds: ["complaint", "office", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Collect public civic service routing only; link users to official MCD channels for complaint submission.",
      robotsTxtUrl: "https://mcdonline.nic.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "medium"
    },
    notes: "Second city candidate after Mumbai for ward and civic complaint routing."
  },
  {
    id: "maharashtra-aaple-sarkar",
    name: "Maharashtra Aaple Sarkar grievance portal",
    homepageUrl: "https://grievances.maharashtra.gov.in/en",
    priority: "official",
    owner: "Government of Maharashtra",
    geography: "Maharashtra",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route state grievances to official Aaple Sarkar channels; do not collect complaint content.",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "State grievance route for Maharashtra and district administration complaints."
  },
  {
    id: "delhi-edistrict",
    name: "e-District Delhi",
    homepageUrl: "https://edistrict.delhigovt.nic.in/",
    priority: "official",
    owner: "Government of NCT of Delhi",
    geography: "Delhi",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Use public service and grievance routing metadata; do not collect application documents.",
      robotsTxtUrl: "https://edistrict.delhigovt.nic.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Delhi service and grievance route for certificates, welfare services, grievance tracking, and sub-division lookup."
  },
  {
    id: "karnataka-janaspandana",
    name: "Karnataka Janaspandana iPGRS",
    homepageUrl: "https://ipgrs.karnataka.gov.in/",
    priority: "official",
    owner: "Government of Karnataka",
    geography: "Karnataka",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route Karnataka public grievances to official iPGRS and 1902 channels only.",
      robotsTxtUrl: "https://ipgrs.karnataka.gov.in/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "Integrated public grievance redressal system for Karnataka, including the 1902 helpline."
  },
  {
    id: "tamil-nadu-cm-helpline",
    name: "Tamil Nadu Mudhalvarin Mugavari CM Helpline",
    homepageUrl: "https://cmhelpline.tnega.org/portal/en/home",
    priority: "official",
    owner: "Government of Tamil Nadu",
    geography: "Tamil Nadu",
    entityKinds: ["complaint", "source"],
    access: {
      method: "html-public-page",
      refreshCadence: "weekly",
      requiresAuth: false,
      automationMode: "manual-review-required"
    },
    legal: {
      licenseNote: "Route Tamil Nadu grievances to official CM Helpline channels; do not collect petition details.",
      robotsTxtUrl: "https://cmhelpline.tnega.org/robots.txt",
      redistribution: "link-only"
    },
    quality: {
      expectedFreshnessDays: 14,
      confidence: "high"
    },
    notes: "State grievance and petition route for Tamil Nadu, with online filing and tracking."
  },
  {
    id: "openstreetmap",
    name: "OpenStreetMap",
    homepageUrl: "https://www.openstreetmap.org/",
    priority: "permissive-third-party",
    owner: "OpenStreetMap contributors",
    geography: "Global",
    entityKinds: ["road", "source"],
    access: {
      method: "bulk-download",
      refreshCadence: "monthly",
      requiresAuth: false,
      automationMode: "official-first"
    },
    legal: {
      licenseNote: "OpenStreetMap data is available under ODbL with attribution.",
      termsUrl: "https://www.openstreetmap.org/copyright",
      redistribution: "dataset-license-required"
    },
    quality: {
      expectedFreshnessDays: 45,
      confidence: "medium"
    },
    notes: "Use for base map and road/place references, not as sole proof of government responsibility."
  }
];

export function getSourceById(sourceId: string) {
  return sourceCatalog.find((source) => source.id === sourceId);
}
