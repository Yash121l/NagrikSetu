import { CalendarClock, Database, Languages, LinkIcon } from "lucide-react";
import type { NagrikRecord } from "@/lib/types";

export function EvidencePanel({ record }: { record?: NagrikRecord }) {
  if (!record) {
    return (
      <aside className="evidence-panel">
        <h2>Source evidence</h2>
        <p>Select a result to see provenance, freshness, confidence, and caveats.</p>
      </aside>
    );
  }

  return (
    <aside className="evidence-panel">
      <h2>Source evidence</h2>
      <dl>
        <div>
          <dt>
            <Database aria-hidden="true" size={17} />
            Source
          </dt>
          <dd>{record.provenance.sourceName}</dd>
        </div>
        <div>
          <dt>
            <CalendarClock aria-hidden="true" size={17} />
            Last checked
          </dt>
          <dd>{record.provenance.lastChecked}</dd>
        </div>
        <div>
          <dt>
            <Languages aria-hidden="true" size={17} />
            Languages
          </dt>
          <dd>{record.languageTags.join(", ")}</dd>
        </div>
        <div>
          <dt>
            <LinkIcon aria-hidden="true" size={17} />
            License note
          </dt>
          <dd>{record.provenance.licenseNote}</dd>
        </div>
      </dl>
    </aside>
  );
}
