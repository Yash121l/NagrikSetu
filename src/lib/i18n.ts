export type Locale = "en" | "hi";

export const copy: Record<
  Locale,
  {
    status: string;
    eyebrow: string;
    headline: string;
    subhead: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    filters: Record<string, string>;
    resultsEyebrow: string;
    resultsHeading: string;
    matchesLabel: string;
    noResultsTitle: string;
    noResultsHint: string;
    mapHeading: string;
    coverageHeading: string;
    totalRecordsMetric: string;
    healthySourcesMetric: string;
    officialRecordsMetric: string;
    correctionHeading: string;
    correctionRecordLabel: string;
    correctionMessageLabel: string;
    correctionMessagePlaceholder: string;
    correctionSubmit: string;
    correctionSaving: string;
    correctionSuccess: string;
    correctionError: string;
  }
> = {
  en: {
    status: "India public information navigator",
    eyebrow: "Source-first civic search",
    headline: "Find who is responsible, where to complain, and which public record proves it.",
    subhead:
      "Search offices, roads, tenders, and grievance paths with confidence labels, source links, and a map-first view built for mobile India.",
    searchLabel: "Search public information",
    searchPlaceholder: "Search place, road, office, tender, or issue",
    searchButton: "Search",
    filters: {
      all: "All",
      office: "Offices",
      road: "Roads",
      tender: "Tenders",
      complaint: "Complaints"
    },
    resultsEyebrow: "Live draft",
    resultsHeading: "Results and responsibility chain",
    matchesLabel: "matches",
    noResultsTitle: "No source-backed record matched that query.",
    noResultsHint: "Try road, complaint, tender, Bandra, Mumbai, or CPGRAMS.",
    mapHeading: "Map and source context",
    coverageHeading: "Draft 3 pilot coverage",
    totalRecordsMetric: "normalized records across offices, complaints, roads, tenders, and tracked sources",
    healthySourcesMetric: "healthy source adapter runs in the deterministic ingestion report",
    officialRecordsMetric: "records backed by official-source provenance, with low-confidence records kept labeled",
    correctionHeading: "Correction queue",
    correctionRecordLabel: "Selected record",
    correctionMessageLabel: "Correction or missing detail",
    correctionMessagePlaceholder: "Example: ward contact changed, broken source link, missing officer name",
    correctionSubmit: "Send correction",
    correctionSaving: "Saving...",
    correctionSuccess: "Correction accepted for moderation.",
    correctionError: "Correction could not be saved. Check the fields and try again."
  },
  hi: {
    status: "भारत public information navigator",
    eyebrow: "Source-first civic search",
    headline: "जिम्मेदार विभाग, complaint path, और public record जल्दी खोजें.",
    subhead:
      "Offices, roads, tenders और grievance paths को confidence labels, source links और mobile-first map view के साथ देखें.",
    searchLabel: "Public information search",
    searchPlaceholder: "स्थान, सड़क, कार्यालय, निविदा या समस्या खोजें",
    searchButton: "Search",
    filters: {
      all: "सब",
      office: "Offices",
      road: "Roads",
      tender: "Tenders",
      complaint: "Complaints"
    },
    resultsEyebrow: "Live draft",
    resultsHeading: "Results और responsibility chain",
    matchesLabel: "matches",
    noResultsTitle: "इस query से कोई source-backed record नहीं मिला.",
    noResultsHint: "road, complaint, tender, Bandra, Mumbai, या CPGRAMS try करें.",
    mapHeading: "Map और source context",
    coverageHeading: "Draft 3 pilot coverage",
    totalRecordsMetric: "normalized records across offices, complaints, roads, tenders, and tracked sources",
    healthySourcesMetric: "deterministic ingestion report में healthy source adapter runs",
    officialRecordsMetric: "official-source provenance वाले records, low-confidence labels के साथ",
    correctionHeading: "Correction queue",
    correctionRecordLabel: "Selected record",
    correctionMessageLabel: "Correction या missing detail",
    correctionMessagePlaceholder: "Example: ward contact changed, broken source link, missing officer name",
    correctionSubmit: "Send correction",
    correctionSaving: "Save हो रही है...",
    correctionSuccess: "Correction moderation के लिए accepted.",
    correctionError: "Correction save नहीं हुई. Fields check करके फिर try करें."
  }
};
