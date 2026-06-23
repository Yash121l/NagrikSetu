"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import { Building2, FileSearch, Filter, Globe2, MapPinned, Search } from "lucide-react";
import { EvidencePanel } from "@/components/EvidencePanel";
import { ResultCard } from "@/components/ResultCard";
import { buildSearchResponse } from "@/lib/search";
import type { EntityKind, NagrikRecord, SearchMatch } from "@/lib/types";

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

export function SearchShell({ initialRecords }: { initialRecords: NagrikRecord[] }) {
  const [query, setQuery] = useState("road complaint Bandra");
  const [filter, setFilter] = useState<EntityKind | "all">("all");
  const [matches, setMatches] = useState<SearchMatch[]>(() => buildSearchResponse("road complaint Bandra").matches);
  const [activeId, setActiveId] = useState(matches[0]?.record.id);

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
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              NS
            </span>
            <span>NagrikSetu</span>
          </div>
          <div className="topbar__status">
            <Globe2 aria-hidden="true" size={17} />
            India public information navigator
          </div>
        </nav>

        <div className="hero__content">
          <div className="hero__copy">
            <span className="eyebrow">Source-first civic search</span>
            <h1>Find who is responsible, where to complain, and which public record proves it.</h1>
            <p>
              Search offices, roads, tenders, and grievance paths with confidence labels, source links, and a map-first
              view built for mobile India.
            </p>
          </div>

          <form className="search-panel" onSubmit={runSearch}>
            <label htmlFor="search">Search public information</label>
            <div className="search-row">
              <Search aria-hidden="true" size={21} />
              <input
                id="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try road complaint Bandra, tender, CPGRAMS"
              />
              <button type="submit">Search</button>
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
                  {item.label}
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
              <span className="eyebrow">Live draft</span>
              <h2>Results and responsibility chain</h2>
            </div>
            <span>{matches.length} matches</span>
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
                  <strong>No seed record matched that query.</strong>
                  <span>Try road, complaint, tender, Bandra, Mumbai, or CPGRAMS.</span>
                </div>
              )}
            </div>
            <div className="map-panel">
              <div className="map-panel__heading">
                <MapPinned aria-hidden="true" size={19} />
                Map and source context
              </div>
              <NagrikMap activeId={activeRecord?.id} records={visibleRecords} onSelect={setActiveId} />
              <EvidencePanel record={activeRecord} />
            </div>
          </div>
        </div>

        <aside className="metrics">
          <h2>Draft 1 coverage</h2>
          <div className="metric">
            <Building2 aria-hidden="true" />
            <span>6</span>
            <p>typed seed records across offices, complaints, roads, tenders, and sources</p>
          </div>
          <div className="metric">
            <FileSearch aria-hidden="true" />
            <span>3</span>
            <p>API routes: search, source inventory, and correction feedback stub</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
