"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Building2,
  Columns3,
  Download,
  FileSearch,
  Filter,
  Globe2,
  Languages,
  LayoutList,
  MapPinned,
  Search,
  Table2
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { CorrectionForm } from "@/components/CorrectionForm";
import { EvidencePanel } from "@/components/EvidencePanel";
import { ResultCard } from "@/components/ResultCard";
import { copy, type Locale } from "@/lib/i18n";
import { buildSearchResponse } from "@/lib/search";
import {
  applyWorkspaceControls,
  defaultWorkspaceFilters,
  getFreshnessStatus,
  getWorkspaceFilterOptions
} from "@/lib/workspace";
import { toSafeExternalHref } from "@/lib/urls";
import type {
  EntityKind,
  NagrikRecord,
  SearchMatch,
  WorkspaceFilters,
  WorkspaceSortKey,
  WorkspaceViewMode
} from "@/lib/types";
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
  const [submittedQuery, setSubmittedQuery] = useState("road complaint Bandra");
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>("cards");
  const [workspaceFilters, setWorkspaceFilters] = useState<WorkspaceFilters>(defaultWorkspaceFilters);
  const [matches, setMatches] = useState<SearchMatch[]>(() =>
    buildSearchResponse("road complaint Bandra", "all", { limit: 100 }).matches
  );
  const [activeId, setActiveId] = useState(matches[0]?.record.id);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const t = copy[locale];
  const filterOptions = useMemo(() => getWorkspaceFilterOptions(initialRecords), [initialRecords]);
  const controlledMatches = useMemo(
    () => applyWorkspaceControls(matches, workspaceFilters),
    [matches, workspaceFilters]
  );

  const activeRecord = useMemo(
    () => controlledMatches.find((match) => match.record.id === activeId)?.record ?? controlledMatches[0]?.record,
    [activeId, controlledMatches]
  );
  const comparisonRecords = useMemo(() => {
    return compareIds
      .map((id) => controlledMatches.find((match) => match.record.id === id)?.record)
      .filter((record): record is NagrikRecord => Boolean(record));
  }, [compareIds, controlledMatches]);

  function runSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    applySearch(query, workspaceFilters);
  }

  function applySearch(nextQuery: string, nextFilters: WorkspaceFilters) {
    const response = buildSearchResponse(nextQuery, nextFilters.kind, { filters: nextFilters, limit: 100 });
    setMatches(response.matches);
    setActiveId(response.matches[0]?.record.id);
    setSubmittedQuery(nextQuery);
    setCompareIds([]);
  }

  function updateFilters(next: Partial<WorkspaceFilters>) {
    setWorkspaceFilters((current) => ({ ...current, ...next }));
    setCompareIds([]);
  }

  function sortBy(sortKey: WorkspaceSortKey) {
    setWorkspaceFilters((current) => ({
      ...current,
      sortBy: sortKey,
      sortDirection: current.sortBy === sortKey && current.sortDirection === "desc" ? "asc" : "desc"
    }));
  }

  function toggleCompare(recordId: string) {
    setCompareIds((current) => {
      if (current.includes(recordId)) return current.filter((id) => id !== recordId);
      return current.length >= 4 ? current : [...current, recordId];
    });
  }

  const exportParams = new URLSearchParams({
    q: submittedQuery,
    kind: workspaceFilters.kind,
    confidence: workspaceFilters.confidence,
    sourcePriority: workspaceFilters.sourcePriority,
    freshness: workspaceFilters.freshness,
    location: workspaceFilters.location,
    language: workspaceFilters.language,
    department: workspaceFilters.department,
    sortBy: workspaceFilters.sortBy,
    sortDirection: workspaceFilters.sortDirection
  });
  const visibleRecords = controlledMatches.map((match) => match.record);

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
                  className={workspaceFilters.kind === item.value ? "filter filter--active" : "filter"}
                  key={item.value}
                  onClick={() => {
                    const nextFilters = { ...workspaceFilters, kind: item.value };
                    setWorkspaceFilters(nextFilters);
                    applySearch(query, nextFilters);
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
              {controlledMatches.length} {t.matchesLabel}
            </span>
          </div>

          <div className="workspace-controls" aria-label="Data workspace controls">
            <div className="view-switch" aria-label="Result view">
              <button
                className={viewMode === "cards" ? "view-switch__button view-switch__button--active" : "view-switch__button"}
                onClick={() => setViewMode("cards")}
                type="button"
              >
                <LayoutList aria-hidden="true" size={16} /> Cards
              </button>
              <button
                className={viewMode === "table" ? "view-switch__button view-switch__button--active" : "view-switch__button"}
                onClick={() => setViewMode("table")}
                type="button"
              >
                <Table2 aria-hidden="true" size={16} /> Table
              </button>
            </div>
            <label>
              Confidence
              <select
                value={workspaceFilters.confidence}
                onChange={(event) => updateFilters({ confidence: event.target.value as WorkspaceFilters["confidence"] })}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label>
              Source
              <select
                value={workspaceFilters.sourcePriority}
                onChange={(event) => updateFilters({ sourcePriority: event.target.value as WorkspaceFilters["sourcePriority"] })}
              >
                <option value="all">All sources</option>
                <option value="official">Official</option>
                <option value="open-government">Open government</option>
                <option value="permissive-third-party">Third party</option>
              </select>
            </label>
            <label>
              Freshness
              <select
                value={workspaceFilters.freshness}
                onChange={(event) => updateFilters({ freshness: event.target.value as WorkspaceFilters["freshness"] })}
              >
                <option value="all">All</option>
                <option value="fresh">Fresh</option>
                <option value="stale">Stale</option>
              </select>
            </label>
            <label>
              Location
              <select
                value={workspaceFilters.location}
                onChange={(event) => updateFilters({ location: event.target.value as WorkspaceFilters["location"] })}
              >
                <option value="all">All</option>
                <option value="with-location">Has coordinates</option>
                <option value="missing-location">Missing coordinates</option>
              </select>
            </label>
            <label>
              Language
              <select value={workspaceFilters.language} onChange={(event) => updateFilters({ language: event.target.value })}>
                <option value="all">All</option>
                {filterOptions.languages.map((language) => (
                  <option value={language} key={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>
            <label className="workspace-controls__wide">
              Department
              <select value={workspaceFilters.department} onChange={(event) => updateFilters({ department: event.target.value })}>
                <option value="all">All departments</option>
                {filterOptions.departments.map((department) => (
                  <option value={department} key={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <div className="export-actions" aria-label="Export filtered records">
              <a href={`/api/export?${exportParams.toString()}&format=csv`}>
                <Download aria-hidden="true" size={16} /> CSV
              </a>
              <a href={`/api/export?${exportParams.toString()}&format=json`}>
                <Download aria-hidden="true" size={16} /> JSON
              </a>
            </div>
          </div>

          <div className="results-grid">
            <div className={viewMode === "table" ? "results-list results-list--table" : "results-list"}>
              {controlledMatches.length > 0 && viewMode === "cards" ? (
                controlledMatches.map((match) => (
                  <ResultCard
                    active={activeRecord?.id === match.record.id}
                    key={match.record.id}
                    match={match}
                    onSelect={() => setActiveId(match.record.id)}
                  />
                ))
              ) : null}
              {controlledMatches.length > 0 && viewMode === "table" ? (
                <div className="records-table-wrap">
                  <table className="records-table">
                    <caption>
                      <Columns3 aria-hidden="true" size={16} /> Source-preserving records table. Select up to 4 rows to compare.
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Compare</th>
                        {[
                          ["title", "Record"],
                          ["kind", "Kind"],
                          ["jurisdiction", "Jurisdiction"],
                          ["department", "Department"],
                          ["confidence", "Confidence"],
                          ["lastChecked", "Last checked"],
                          ["updatedAt", "Updated"],
                          ["relevance", "Score"]
                        ].map(([key, label]) => (
                          <th
                            aria-sort={
                              workspaceFilters.sortBy === key
                                ? workspaceFilters.sortDirection === "asc"
                                  ? "ascending"
                                  : "descending"
                                : "none"
                            }
                            scope="col"
                            key={key}
                          >
                            <button onClick={() => sortBy(key as WorkspaceSortKey)} type="button">
                              {label} <ArrowUpDown aria-hidden="true" size={14} />
                            </button>
                          </th>
                        ))}
                        <th scope="col">Source</th>
                        <th scope="col">Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {controlledMatches.map((match) => {
                        const { record } = match;
                        const sourceHref = toSafeExternalHref(record.website, record.provenance.sourceUrl);
                        return (
                          <tr className={activeRecord?.id === record.id ? "records-table__active" : ""} key={record.id}>
                            <td>
                              <input
                                aria-label={`Compare ${record.title}`}
                                checked={compareIds.includes(record.id)}
                                disabled={!compareIds.includes(record.id) && compareIds.length >= 4}
                                onChange={() => toggleCompare(record.id)}
                                type="checkbox"
                              />
                            </td>
                            <td>
                              <button className="table-record-button" onClick={() => setActiveId(record.id)} type="button">
                                {record.title}
                              </button>
                              <small>{record.summary}</small>
                            </td>
                            <td>{record.kind}</td>
                            <td>{record.jurisdiction}</td>
                            <td>{record.department}</td>
                            <td>
                              <span className={`confidence confidence--${record.confidence}`}>{record.confidence}</span>
                            </td>
                            <td>
                              {record.provenance.lastChecked}
                              <small>{getFreshnessStatus(record)}</small>
                            </td>
                            <td>{record.updatedAt}</td>
                            <td>{match.score}</td>
                            <td>
                              {record.provenance.sourceName}
                              <small>{record.provenance.priority}</small>
                            </td>
                            <td>
                              {sourceHref ? (
                                <a href={sourceHref} target="_blank" rel="noreferrer">
                                  Open source
                                </a>
                              ) : (
                                "not publicly available"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : controlledMatches.length === 0 ? (
                <div className="empty-state">
                  <FileSearch aria-hidden="true" />
                  <strong>{t.noResultsTitle}</strong>
                  <span>{t.noResultsHint}</span>
                </div>
              ) : null}
              {comparisonRecords.length ? (
                <div className="comparison-panel" aria-label="Selected record comparison">
                  <div className="comparison-panel__heading">
                    <strong>Compare selected records</strong>
                    <button onClick={() => setCompareIds([])} type="button">Clear</button>
                  </div>
                  <div className="comparison-grid">
                    {comparisonRecords.map((record) => (
                      <article key={record.id}>
                        <span>{record.kind}</span>
                        <strong>{record.title}</strong>
                        <dl>
                          <div><dt>Jurisdiction</dt><dd>{record.jurisdiction}</dd></div>
                          <div><dt>Department</dt><dd>{record.department}</dd></div>
                          <div><dt>Confidence</dt><dd>{record.confidence}</dd></div>
                          <div><dt>Last checked</dt><dd>{record.provenance.lastChecked}</dd></div>
                          <div><dt>Source</dt><dd>{record.provenance.sourceName}</dd></div>
                        </dl>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
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
