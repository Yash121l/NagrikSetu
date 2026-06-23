import type { NagrikRecord, Provenance } from "./types";

const today = "2026-06-23";

const sources = {
  dataGov: {
    sourceName: "Open Government Data Platform India",
    sourceUrl: "https://data.gov.in/",
    lastChecked: today,
    priority: "open-government",
    licenseNote: "Use dataset-level licenses and attribution before redistribution."
  },
  cppp: {
    sourceName: "Central Public Procurement Portal",
    sourceUrl: "https://eprocure.gov.in/eprocure/app",
    lastChecked: today,
    priority: "official",
    licenseNote: "Link to original tender notices and preserve portal policy caveats."
  },
  cpgrams: {
    sourceName: "CPGRAMS / PG Portal",
    sourceUrl: "https://pgportal.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Route users to official grievance filing; do not proxy personal submissions."
  },
  myBmc: {
    sourceName: "Brihanmumbai Municipal Corporation citizen portal",
    sourceUrl: "https://portal.mcgm.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Public contact and complaint routing data only."
  },
  osm: {
    sourceName: "OpenStreetMap",
    sourceUrl: "https://www.openstreetmap.org/",
    lastChecked: today,
    priority: "permissive-third-party",
    licenseNote: "OpenStreetMap data is available under ODbL with attribution."
  }
} satisfies Record<string, Provenance>;

export const sourceInventory = Object.values(sources);

export const seedRecords: NagrikRecord[] = [
  {
    id: "office-bmc-roads-hw",
    kind: "office",
    title: "BMC Roads and Traffic Department - H/West Ward",
    summary:
      "First-contact civic office for local road, traffic, and ward-level public works issues in Bandra West, Khar West, and Santacruz West.",
    department: "Brihanmumbai Municipal Corporation",
    jurisdiction: "Mumbai, H/West Ward",
    address: "H/West Ward Office, Bandra West, Mumbai, Maharashtra",
    phone: "1916",
    website: "https://portal.mcgm.gov.in/",
    issueTags: ["road complaint", "pothole", "ward office", "traffic", "municipal works"],
    languageTags: ["en", "hi", "mr"],
    services: ["Road complaint intake", "Ward-level routing", "Citizen facilitation center"],
    parentOffice: "Brihanmumbai Municipal Corporation Headquarters",
    location: { lat: 19.0607, lng: 72.8362 },
    confidence: "medium",
    updatedAt: today,
    provenance: sources.myBmc
  },
  {
    id: "complaint-bmc-civic",
    kind: "complaint",
    title: "BMC civic complaint registration",
    summary:
      "Use for municipal issues such as roads, drainage, solid waste, street lighting, and ward-level civic services in Mumbai.",
    department: "Brihanmumbai Municipal Corporation",
    jurisdiction: "Mumbai",
    phone: "1916",
    website: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlcomplaintreg?guest_user=english",
    portalUrl: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlcomplaintreg?guest_user=english",
    escalation: ["Register complaint", "Track complaint number", "Visit nearest CFC", "Escalate to ward office"],
    issueTags: ["complaint", "road", "drainage", "street light", "solid waste"],
    languageTags: ["en", "hi", "mr"],
    location: { lat: 18.9388, lng: 72.8354 },
    confidence: "high",
    updatedAt: today,
    provenance: sources.myBmc
  },
  {
    id: "tender-cppp-roadworks",
    kind: "tender",
    title: "Central public procurement tender search",
    summary:
      "Search central government and participating organization tenders by location, organization, closing date, and work classification.",
    department: "Government of India",
    jurisdiction: "India",
    tenderNumber: "CPPP-SEARCH",
    closingDate: "Varies by notice",
    documentUrl: "https://eprocure.gov.in/eprocure/app",
    website: "https://eprocure.gov.in/eprocure/app",
    issueTags: ["tender", "procurement", "road works", "civil works", "closing date"],
    languageTags: ["en", "hi"],
    confidence: "high",
    updatedAt: today,
    provenance: sources.cppp
  },
  {
    id: "complaint-cpgrams",
    kind: "complaint",
    title: "CPGRAMS central grievance route",
    summary:
      "Centralized grievance route for public grievances involving central ministries, departments, and routed state organizations.",
    department: "Department of Administrative Reforms and Public Grievances",
    jurisdiction: "India",
    website: "https://pgportal.gov.in/",
    portalUrl: "https://pgportal.gov.in/",
    escalation: ["Lodge grievance on official portal", "Save registration number", "Track response", "Appeal if eligible"],
    issueTags: ["central grievance", "escalation", "ministry", "department", "complaint"],
    languageTags: ["en", "hi"],
    confidence: "high",
    updatedAt: today,
    provenance: sources.cpgrams
  },
  {
    id: "road-demo-linking-road",
    kind: "road",
    title: "Linking Road responsibility lookup - demo record",
    summary:
      "Demonstrates how NagrikSetu should present a road lookup when exact project records are incomplete: show nearest office, complaint route, and confidence.",
    department: "Brihanmumbai Municipal Corporation",
    jurisdiction: "Mumbai, Bandra/Khar/Santacruz",
    contractor: "Not publicly available in current public data",
    status: "Responsibility chain available; project package pending source ingestion",
    expectedCompletion: "Not publicly available",
    supervisingOffice: "BMC H/West Ward and Roads Department",
    issueTags: ["Linking Road", "road work", "contractor", "defect liability", "maintenance"],
    languageTags: ["en", "hi", "mr"],
    location: { lat: 19.069, lng: 72.833 },
    confidence: "low",
    updatedAt: today,
    provenance: sources.osm
  },
  {
    id: "source-data-gov-india",
    kind: "source",
    title: "data.gov.in source discovery",
    summary:
      "Single-point open-government portal for datasets, APIs, documents, and visualizations published by Indian ministries and departments.",
    department: "Government of India",
    jurisdiction: "India",
    website: "https://data.gov.in/",
    issueTags: ["open data", "api", "dataset", "source inventory"],
    languageTags: ["en"],
    confidence: "high",
    updatedAt: today,
    provenance: sources.dataGov
  }
];
