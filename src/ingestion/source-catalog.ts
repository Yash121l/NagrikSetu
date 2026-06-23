import type { SourceCatalogEntry } from "./types";

export const sourceCatalog: SourceCatalogEntry[] = [
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
