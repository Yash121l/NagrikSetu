import { AlertTriangle, ExternalLink, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getRecordWarnings } from "@/lib/quality";
import type { SearchMatch } from "@/lib/types";

export function ResultCard({ match, active, onSelect }: { match: SearchMatch; active: boolean; onSelect: () => void }) {
  const { record } = match;
  const warnings = getRecordWarnings(record);
  const sourceHref = record.website ?? record.provenance.sourceUrl;

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
      <a className="source-link" href={sourceHref} target="_blank" rel="noreferrer">
        Open source record <ExternalLink aria-hidden="true" size={15} />
      </a>
    </article>
  );
}
