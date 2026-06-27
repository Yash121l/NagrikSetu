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
