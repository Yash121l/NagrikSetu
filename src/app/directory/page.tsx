import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import {
  geographicRegions,
  getRegionById,
  stateAndUnionTerritoryEntries,
  type GeographicRegion
} from "@/data/geography";
import { getAllRecords } from "@/data/repository";

export const metadata = {
  title: "NagrikSetu directory",
  description: "Browse every current NagrikSetu place and public information record."
};

export default function DirectoryPage() {
  const records = getAllRecords();
  const india = getRegionById("india");
  const topLevelRegions = stateAndUnionTerritoryEntries
    .map((entry) => getRegionById(entry.id))
    .filter((region): region is GeographicRegion => Boolean(region));
  const pilotLowerLevels = geographicRegions.filter(
    (region) => region.id !== "india" && !stateAndUnionTerritoryEntries.some((entry) => entry.id === region.id)
  );
  const stateCount = stateAndUnionTerritoryEntries.filter((entry) => entry.kind === "state").length;
  const unionTerritoryCount = stateAndUnionTerritoryEntries.filter((entry) => entry.kind === "union-territory").length;

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="detail-page">
        <header className="directory-hero">
          <span className="eyebrow">Human-readable site map</span>
          <h1>NagrikSetu directory</h1>
          <p>Browse every place and first-party civic record currently available in the pilot.</p>
          <div className="directory-summary">
            <span>{stateCount} states</span>
            <span>{unionTerritoryCount} Union Territories</span>
            <span>{topLevelRegions.length} top-level pages</span>
            <span>{pilotLowerLevels.length} pilot lower-level pages</span>
          </div>
        </header>

        {india ? (
          <section className="directory-section">
            <h2>National directory</h2>
            <Link className="directory-card directory-card--featured" href={`/places/${india.slug.join("/")}`}>
              <span>{india.kind}</span>
              <strong>{india.name}</strong>
              <p>{india.summary}</p>
            </Link>
          </section>
        ) : null}

        <section className="directory-section">
          <h2>States and Union Territories</h2>
          <div className="directory-grid directory-grid--places">
            {topLevelRegions.map((region) => (
              <Link className="directory-card" href={`/places/${region.slug.join("/")}`} key={region.id}>
                <span>{region.kind.replaceAll("-", " ")}</span>
                <strong>{region.name}</strong>
                <p>{region.summary}</p>
                <small>{region.dataStatus.replaceAll("-", " ")}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="directory-section">
          <h2>Pilot districts, city, local body, and ward</h2>
          <div className="directory-grid directory-grid--places">
            {pilotLowerLevels.map((region) => (
              <Link className="directory-card" href={`/places/${region.slug.join("/")}`} key={region.id}>
                <span>{region.kind.replaceAll("-", " ")}</span>
                <strong>{region.name}</strong>
                <p>{region.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="directory-section">
          <h2>Public information records</h2>
          <div className="directory-grid">
            {records.map((record) => (
              <Link className="directory-card" href={`/records/${record.id}`} key={record.id}>
                <span>{record.kind}</span>
                <strong>{record.title}</strong>
                <p>{record.summary}</p>
                <small>{record.jurisdiction}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
