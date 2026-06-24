import type { NagrikRecord } from "@/lib/types";

export interface RecordFact {
  label: string;
  value: string;
}

export interface RecordSection {
  title: string;
  facts: RecordFact[];
}

const optionalFact = (label: string, value?: string): RecordFact[] => (value ? [{ label, value }] : []);

function toSafeExternalHref(...candidates: Array<string | undefined>) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
    } catch {
      // Try the next sourced candidate.
    }
  }
  return null;
}

export function getRecordSections(record: NagrikRecord): RecordSection[] {
  const overview: RecordSection = {
    title: "Responsibility overview",
    facts: [
      { label: "Department", value: record.department },
      { label: "Jurisdiction", value: record.jurisdiction },
      { label: "Record type", value: record.kind },
      { label: "Confidence", value: `${record.confidence} confidence` },
      { label: "Record updated", value: record.updatedAt }
    ]
  };

  if (record.kind === "office") {
    return [
      overview,
      {
        title: "Office and services",
        facts: [
          ...optionalFact("Address", record.address),
          ...optionalFact("Phone", record.phone),
          ...optionalFact("Email", record.email),
          ...optionalFact("Parent office", record.parentOffice),
          { label: "Services", value: record.services.join(", ") }
        ]
      }
    ];
  }

  if (record.kind === "tender") {
    return [
      overview,
      {
        title: "Tender details",
        facts: [
          { label: "Tender number", value: record.tenderNumber },
          { label: "Closing date", value: record.closingDate },
          ...optionalFact("Estimated value", record.estimatedValue)
        ]
      }
    ];
  }

  if (record.kind === "complaint") {
    return [
      overview,
      {
        title: "Complaint and escalation path",
        facts: record.escalation.map((step, index) => ({ label: `Step ${index + 1}`, value: step }))
      }
    ];
  }

  if (record.kind === "project" || record.kind === "road") {
    return [
      overview,
      {
        title: "Public work details",
        facts: [
          { label: "Status", value: record.status },
          { label: "Supervising office", value: record.supervisingOffice },
          ...optionalFact("Contractor", record.contractor),
          ...optionalFact("Budget", record.budget),
          ...optionalFact("Expected completion", record.expectedCompletion)
        ]
      }
    ];
  }

  return [
    overview,
    {
      title: "Source coverage",
      facts: [
        { label: "Source priority", value: record.provenance.priority },
        { label: "Tracked topics", value: record.issueTags.join(", ") },
        { label: "Available languages", value: record.languageTags.join(", ") }
      ]
    }
  ];
}

export function getOfficialAction(record: NagrikRecord) {
  const isOfficial = record.provenance.priority === "official";
  if (record.kind === "complaint") {
    return {
      label: "Continue to official complaint portal",
      href: toSafeExternalHref(record.portalUrl, record.provenance.sourceUrl),
      isOfficial
    };
  }
  if (record.kind === "tender") {
    return {
      label: "Open official tender document",
      href: toSafeExternalHref(record.documentUrl, record.provenance.sourceUrl),
      isOfficial
    };
  }
  return {
    label: isOfficial ? "Open official source" : "Open underlying source",
    href: toSafeExternalHref(record.website, record.provenance.sourceUrl),
    isOfficial
  };
}

export function getRelatedRecords(record: NagrikRecord, records: NagrikRecord[]) {
  const tags = new Set(record.issueTags.map((tag) => tag.toLowerCase()));
  const jurisdiction = record.jurisdiction.trim().toLowerCase();
  const department = record.department.trim().toLowerCase();

  return records
    .filter((candidate) => candidate.id !== record.id)
    .map((candidate) => ({
      record: candidate,
      score:
        candidate.issueTags.filter((tag) => tags.has(tag.toLowerCase())).length * 2 +
        (candidate.department.trim().toLowerCase() === department ? 2 : 0) +
        (candidate.jurisdiction.trim().toLowerCase() === jurisdiction ? 1 : 0)
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .slice(0, 4)
    .map((candidate) => candidate.record);
}
