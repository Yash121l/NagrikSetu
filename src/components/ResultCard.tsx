import Link from "next/link";
import { AlertTriangle, ArrowRight, ExternalLink, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getRecordWarnings } from "@/lib/quality";
import type { SearchMatch } from "@/lib/types";

export function ResultCard({ match, active, onSelect }: { match: SearchMatch; active: boolean; onSelect: () => void }) {
  const { record } = match;
  const warnings = getRecordWarnings(record);
  const sourceHref = record.website ?? record.provenance.sourceUrl;
  const sourceLabel =
    record.provenance.priority === "official"
      ? "Official evidence"
      : record.provenance.priority === "open-government"
        ? "Open-government source"
        : "Third-party source";

  return (
    <article className={`result-card ${active ? "result-card--active" : ""}`}>
      <button className="result-card__button" onClick={onSelect} type="button">
        <span className="result-card__kind">{record.kind}</span>
        <strong>{record.title}</strong>
        <span className={`confidence confidence--${record.confidence}`}>{record.confidence} confidence</span>
      </button>
      <p>{record.summary}</p>
      <div className="meta-grid">
        <span>
          <MapPin aria-hidden="true" size={16} />
          {record.jurisdiction}
        </span>
        {record.phone ? (
          <span>
            <Phone aria-hidden="true" size={16} />
            {record.phone}
          </span>
        ) : null}
        <span>
          <ShieldCheck aria-hidden="true" size={16} />
          {record.provenance.sourceName}
        </span>
      </div>
      {warnings.length > 0 ? (
        <div className="warnings" aria-label="Record warnings">
          <AlertTriangle aria-hidden="true" size={16} />
          <span>{warnings.join(" ")}</span>
        </div>
      ) : null}
      <div className="card-actions">
        <Link className="detail-link" href={`/records/${record.id}`}>
          View NagrikSetu record <ArrowRight aria-hidden="true" size={15} />
        </Link>
        <a className="source-link" href={sourceHref} target="_blank" rel="noreferrer">
          {sourceLabel} <ExternalLink aria-hidden="true" size={15} />
        </a>
      </div>
    </article>
  );
}
