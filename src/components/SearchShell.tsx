"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, FileSearch, Filter, Globe2, Languages, MapPinned, Search } from "lucide-react";
import { Brand } from "@/components/Brand";
import { CorrectionForm } from "@/components/CorrectionForm";
import { EvidencePanel } from "@/components/EvidencePanel";
import { ResultCard } from "@/components/ResultCard";
import { copy, type Locale } from "@/lib/i18n";
import { buildSearchResponse } from "@/lib/search";
import type { EntityKind, NagrikRecord, SearchMatch } from "@/lib/types";
import type { SourceHealth } from "@/ingestion/types";

const NagrikMap = dynamic(() => import("@/components/NagrikMap").then((module) => module.NagrikMap), {
  ssr: false,
  loading: () => <div className="map map--loading">Loading map...</div>
});

const filters: Array<{ label: string; value: EntityKind | "all" }> = [
  { label: "All", value: "all" },
  { label: "Offices", value: "office" },
  { label: "Roads", value: "road" },
  { label: "Tenders", value: "tender" },
  { label: "Complaints", value: "complaint" }
];

interface SearchShellProps {
  initialRecords: NagrikRecord[];
  stats: {
    totalRecords: number;
    officialSourceRecords: number;
    lowConfidenceRecords: number;
  };
  sourceHealth: SourceHealth[];
}

export function SearchShell({ initialRecords, stats, sourceHealth }: SearchShellProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("road complaint Bandra");
  const [filter, setFilter] = useState<EntityKind | "all">("all");
  const [matches, setMatches] = useState<SearchMatch[]>(() => buildSearchResponse("road complaint Bandra").matches);
  const [activeId, setActiveId] = useState(matches[0]?.record.id);
  const t = copy[locale];

  const activeRecord = useMemo(
    () => matches.find((match) => match.record.id === activeId)?.record ?? matches[0]?.record,
    [activeId, matches]
  );

  function runSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const response = buildSearchResponse(query, filter);
    setMatches(response.matches);
    setActiveId(response.matches[0]?.record.id);
  }

  const visibleRecords = matches.length ? matches.map((match) => match.record) : initialRecords;

  return (
    <main>
      <section className="hero">
        <nav className="topbar" aria-label="Primary">
          <Brand inverse />
          <div className="topbar__links">
            <Link href="/places/india">Explore places</Link>
            <Link href="/directory">Directory</Link>
          </div>
          <div className="topbar__status">
            <Globe2 aria-hidden="true" size={17} />
            {t.status}
          </div>
          <div className="language-switch" aria-label="Language">
            <Languages aria-hidden="true" size={17} />
            {(["en", "hi"] as Locale[]).map((item) => (
              <button
                className={locale === item ? "language-switch__button language-switch__button--active" : "language-switch__button"}
                key={item}
                onClick={() => setLocale(item)}
                type="button"
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        <div className="hero__content">
          <div className="hero__copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.headline}</h1>
            <p>{t.subhead}</p>
          </div>

          <form className="search-panel" onSubmit={runSearch}>
            <label htmlFor="search">{t.searchLabel}</label>
            <div className="search-row">
              <Search aria-hidden="true" size={21} />
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
              />
              <button type="submit">{t.searchButton}</button>
            </div>
            <div className="filters" aria-label="Search filters">
              <Filter aria-hidden="true" size={17} />
              {filters.map((item) => (
                <button
                  className={filter === item.value ? "filter filter--active" : "filter"}
                  key={item.value}
                  onClick={() => {
                    setFilter(item.value);
                    const response = buildSearchResponse(query, item.value);
                    setMatches(response.matches);
                    setActiveId(response.matches[0]?.record.id);
                  }}
                  type="button"
                >
                  {t.filters[item.value] ?? item.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <section className="workspace" aria-label="Search results workspace">
        <div className="workspace__main">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t.resultsEyebrow}</span>
              <h2>{t.resultsHeading}</h2>
            </div>
            <span>
              {matches.length} {t.matchesLabel}
            </span>
          </div>
          <div className="results-grid">
            <div className="results-list">
              {matches.length ? (
                matches.map((match) => (
                  <ResultCard
                    active={activeRecord?.id === match.record.id}
                    key={match.record.id}
                    match={match}
                    onSelect={() => setActiveId(match.record.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <FileSearch aria-hidden="true" />
                  <strong>{t.noResultsTitle}</strong>
                  <span>{t.noResultsHint}</span>
                </div>
              )}
            </div>
            <div className="map-panel">
              <div className="map-panel__heading">
                <MapPinned aria-hidden="true" size={19} />
                {t.mapHeading}
              </div>
              <NagrikMap activeId={activeRecord?.id} records={visibleRecords} onSelect={setActiveId} />
              <EvidencePanel record={activeRecord} />
              <CorrectionForm locale={locale} recordId={activeRecord?.id} recordLabel={activeRecord?.title} />
            </div>
          </div>
        </div>

        <aside className="metrics">
          <h2>{t.coverageHeading}</h2>
          <div className="metric">
            <Building2 aria-hidden="true" />
            <span>{stats.totalRecords}</span>
            <p>{t.totalRecordsMetric}</p>
          </div>
          <div className="metric">
            <FileSearch aria-hidden="true" />
            <span>{sourceHealth.filter((source) => source.status === "healthy").length}</span>
            <p>{t.healthySourcesMetric}</p>
          </div>
          <div className="metric">
            <Globe2 aria-hidden="true" />
            <span>{stats.officialSourceRecords}</span>
            <p>{t.officialRecordsMetric}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
