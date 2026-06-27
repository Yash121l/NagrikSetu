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
  lgd: {
    sourceName: "Local Government Directory",
    sourceUrl: "https://lgdirectory.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use public directory metadata with LGD attribution and extraction dates."
  },
  nationalPortal: {
    sourceName: "National Portal of India",
    sourceUrl: "https://www.india.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use public directory facts with National Portal attribution and last-checked dates."
  },
  rbi: {
    sourceName: "RBI Handbook of Statistics on Indian States",
    sourceUrl: "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183",
    lastChecked: today,
    priority: "official",
    licenseNote: "Preserve RBI publication, table number, reporting period, and last-checked date."
  },
  cppp: {
    sourceName: "Central Public Procurement Portal",
    sourceUrl: "https://eprocure.gov.in/eprocure/app",
    lastChecked: today,
    priority: "official",
    licenseNote: "Link to original tender notices and preserve portal policy caveats."
  },
  pmgsy: {
    sourceName: "Pradhan Mantri Gram Sadak Yojana",
    sourceUrl: "https://pmgsy.nic.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use public road and project metadata with original scheme and report links."
  },
  morth: {
    sourceName: "Ministry of Road Transport and Highways",
    sourceUrl: "https://morth.nic.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use official public notices, reports, and road-sector documents with attribution."
  },
  nhai: {
    sourceName: "National Highways Authority of India",
    sourceUrl: "https://nhai.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Route users to official NHAI channels and preserve source URLs for highway metadata."
  },
  cpgrams: {
    sourceName: "CPGRAMS / PG Portal",
    sourceUrl: "https://pgportal.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Route users to official grievance filing; do not proxy personal submissions."
  },
  railMadad: {
    sourceName: "Rail Madad",
    sourceUrl: "https://railmadad.indianrailways.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Route users to official Rail Madad channels and do not collect passenger grievance details."
  },
  umang: {
    sourceName: "UMANG",
    sourceUrl: "https://web.umang.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use as an official service directory and do not collect user account data."
  },
  egramswaraj: {
    sourceName: "eGramSwaraj",
    sourceUrl: "https://egramswaraj.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use public panchayat profile and planning metadata with source report links."
  },
  bhuvan: {
    sourceName: "Bhuvan",
    sourceUrl: "https://bhuvan.nrsc.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Use public geospatial layers with NRSC attribution and layer-specific terms."
  },
  myBmc: {
    sourceName: "Brihanmumbai Municipal Corporation citizen portal",
    sourceUrl: "https://portal.mcgm.gov.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Public contact and complaint routing data only."
  },
  mcd311: {
    sourceName: "Municipal Corporation of Delhi 311",
    sourceUrl: "https://mcdonline.nic.in/",
    lastChecked: today,
    priority: "official",
    licenseNote: "Collect public civic service routing only and link users to official MCD channels."
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
    id: "project-pmgsy-road-discovery",
    kind: "project",
    title: "PMGSY rural road project discovery",
    summary:
      "Official scheme source for discovering rural road packages, habitation connectivity, project progress, and maintenance context before routing responsibility.",
    department: "Ministry of Rural Development",
    jurisdiction: "India",
    status: "Source connector planned; official project discovery route available",
    budget: "Not publicly available in normalized records yet",
    expectedCompletion: "Varies by project package",
    supervisingOffice: "PMGSY programme authorities and state rural road agencies",
    website: "https://pmgsy.nic.in/",
    issueTags: ["rural road", "PMGSY", "project", "habitation", "maintenance"],
    languageTags: ["en", "hi"],
    confidence: "medium",
    updatedAt: today,
    provenance: sources.pmgsy
  },
  {
    id: "complaint-nhai-highway",
    kind: "complaint",
    title: "National highway complaint and incident route",
    summary:
      "Official NHAI-facing route for national highway issues such as road condition, toll plaza service, incidents, and highway assistance.",
    department: "National Highways Authority of India",
    jurisdiction: "India",
    website: "https://nhai.gov.in/",
    portalUrl: "https://nhai.gov.in/",
    escalation: ["Use the official NHAI route or 1033 channel where applicable", "Keep highway, chainage, toll plaza, and incident details", "Track through the official channel"],
    issueTags: ["national highway", "NHAI", "road complaint", "toll", "incident", "1033"],
    languageTags: ["en", "hi"],
    confidence: "medium",
    updatedAt: today,
    provenance: sources.nhai
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
    id: "complaint-rail-madad",
    kind: "complaint",
    title: "Rail Madad railway grievance route",
    summary:
      "Official Indian Railways route for railway service grievances involving trains, stations, passenger amenities, freight, and railway assistance.",
    department: "Indian Railways",
    jurisdiction: "India",
    website: "https://railmadad.indianrailways.gov.in/",
    portalUrl: "https://railmadad.indianrailways.gov.in/",
    escalation: ["Open the official Rail Madad portal", "Choose the relevant train, station, or service category", "Save the official complaint or reference number"],
    issueTags: ["railway complaint", "train", "station", "passenger grievance", "Rail Madad"],
    languageTags: ["en", "hi"],
    confidence: "high",
    updatedAt: today,
    provenance: sources.railMadad
  },
  {
    id: "complaint-umang-service-discovery",
    kind: "complaint",
    title: "UMANG official service discovery route",
    summary:
      "Official service directory for finding government services and eligible grievance or request flows without NagrikSetu collecting account data.",
    department: "Ministry of Electronics and Information Technology",
    jurisdiction: "India",
    website: "https://web.umang.gov.in/",
    portalUrl: "https://web.umang.gov.in/",
    escalation: ["Search the official UMANG service directory", "Open the responsible department service", "Complete login-only actions on UMANG or the linked official service"],
    issueTags: ["government service", "UMANG", "service directory", "complaint", "application"],
    languageTags: ["en", "hi"],
    confidence: "medium",
    updatedAt: today,
    provenance: sources.umang
  },
  {
    id: "source-egramswaraj-panchayat",
    kind: "source",
    title: "eGramSwaraj panchayat profile and planning source",
    summary:
      "Official rural local-government source for panchayat profiles, planning, and public reporting that can enrich Gram Panchayat pages after LGD import.",
    department: "Ministry of Panchayati Raj",
    jurisdiction: "India",
    website: "https://egramswaraj.gov.in/",
    issueTags: ["panchayat", "rural local body", "Gram Panchayat", "planning", "village"],
    languageTags: ["en", "hi"],
    confidence: "high",
    updatedAt: today,
    provenance: sources.egramswaraj
  },
  {
    id: "source-bhuvan-geospatial",
    kind: "source",
    title: "Bhuvan public geospatial reference",
    summary:
      "Official geospatial platform that can support boundary, base-map, and layer discovery after layer-specific terms are verified.",
    department: "National Remote Sensing Centre",
    jurisdiction: "India",
    website: "https://bhuvan.nrsc.gov.in/",
    issueTags: ["map", "boundary", "geospatial", "Bhuvan", "NRSC"],
    languageTags: ["en"],
    confidence: "medium",
    updatedAt: today,
    provenance: sources.bhuvan
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
    id: "complaint-mcd-civic",
    kind: "complaint",
    title: "Municipal Corporation of Delhi civic complaint route",
    summary:
      "Official Delhi municipal route candidate for civic issues such as sanitation, street lights, roads, drains, and ward-level municipal service routing.",
    department: "Municipal Corporation of Delhi",
    jurisdiction: "Delhi",
    website: "https://mcdonline.nic.in/",
    portalUrl: "https://mcdonline.nic.in/",
    escalation: ["Use the official MCD online route or 311 channel where applicable", "Keep ward, colony, and issue details", "Track using the official complaint reference"],
    issueTags: ["Delhi", "MCD", "311", "civic complaint", "sanitation", "street light", "road"],
    languageTags: ["en", "hi"],
    confidence: "medium",
    updatedAt: today,
    provenance: sources.mcd311
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
