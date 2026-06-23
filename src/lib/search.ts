import { seedRecords } from "./seed-data";
import type { EntityKind, NagrikRecord, SearchMatch, SearchResponse } from "./types";

const queryWeights: Record<string, number> = {
  title: 8,
  department: 5,
  jurisdiction: 4,
  issueTags: 7,
  summary: 3
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const confidenceBoost = {
  high: 1.2,
  medium: 1,
  low: 0.82
};

function tokenize(query: string) {
  return normalize(query)
    .split(" ")
    .filter((token) => token.length > 1);
}

function fieldScore(fieldValue: string | string[] | undefined, tokens: string[], weight: number) {
  if (!fieldValue) return { score: 0, reason: "" };
  const haystack = normalize(Array.isArray(fieldValue) ? fieldValue.join(" ") : fieldValue);
  const matched = tokens.filter((token) => haystack.includes(token));
  if (matched.length === 0) return { score: 0, reason: "" };

  const score = (matched.length / tokens.length) * weight;
  return { score, reason: `${matched.join(", ")} matched ${weight >= 7 ? "primary" : "supporting"} field` };
}

export function searchRecords(query: string, kind: EntityKind | "all" = "all", records: NagrikRecord[] = seedRecords) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return records
    .filter((record) => kind === "all" || record.kind === kind)
    .map<SearchMatch>((record) => {
      const parts = [
        fieldScore(record.title, tokens, queryWeights.title),
        fieldScore(record.department, tokens, queryWeights.department),
        fieldScore(record.jurisdiction, tokens, queryWeights.jurisdiction),
        fieldScore(record.issueTags, tokens, queryWeights.issueTags),
        fieldScore(record.summary, tokens, queryWeights.summary)
      ];
      const rawScore = parts.reduce((sum, part) => sum + part.score, 0);
      const score = Number((rawScore * confidenceBoost[record.confidence]).toFixed(2));
      const reasons = parts.map((part) => part.reason).filter(Boolean);
      return { record, score, reasons };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title));
}

export function buildSearchResponse(query: string, kind: EntityKind | "all" = "all"): SearchResponse {
  const matches = searchRecords(query, kind).slice(0, 8);

  return {
    query,
    generatedAt: new Date().toISOString(),
    matches,
    caveats: [
      "This MVP uses curated seed records while ingestion connectors are built.",
      "Each result shows source and confidence; low-confidence matches should be verified before action.",
      "NagrikSetu routes users to official portals and does not submit complaints on their behalf."
    ]
  };
}
