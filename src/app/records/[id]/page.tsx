import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { CorrectionForm } from "@/components/CorrectionForm";
import { EvidencePanel } from "@/components/EvidencePanel";
import { RecordLocationMap } from "@/components/RecordLocationMap";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllRecords } from "@/data/repository";
import { getPrimaryRegionForRecord } from "@/data/geography";
import { getOfficialAction, getRecordSections, getRelatedRecords } from "@/lib/record-details";

interface RecordPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllRecords().map((record) => ({ id: record.id }));
}

export async function generateMetadata({ params }: RecordPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getAllRecords().find((candidate) => candidate.id === id);
  if (!record) return { title: "Record not found | NagrikSetu" };

  return {
    title: `${record.title} | NagrikSetu`,
    description: record.summary
  };
}

export default async function RecordPage({ params }: RecordPageProps) {
  const { id } = await params;
  const records = getAllRecords();
  const record = records.find((candidate) => candidate.id === id);
  if (!record) notFound();

  const sections = getRecordSections(record);
  const officialAction = getOfficialAction(record);
  const related = getRelatedRecords(record, records);
  const region = getPrimaryRegionForRecord(record.id);

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Search</Link>
          {region ? <Link href={`/places/${region.slug.join("/")}`}>{region.name}</Link> : null}
          <span aria-current="page">{record.title}</span>
        </nav>

        <Link className="back-link" href="/">
          <ArrowLeft aria-hidden="true" size={16} /> Back to search
        </Link>

        <header className="record-hero">
          <div>
            <span className="eyebrow">NagrikSetu verified view · {record.kind}</span>
            <h1>{record.title}</h1>
            <p>{record.summary}</p>
            <div className="record-tags" aria-label="Record topics">
              {record.issueTags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="record-hero__status">
            <ShieldCheck aria-hidden="true" size={21} />
            <strong>{record.confidence} confidence</strong>
            <span>Last checked {record.provenance.lastChecked}</span>
          </div>
        </header>

        <div className="detail-layout">
          <article className="detail-content">
            {record.location ? (
              <section className="detail-section detail-section--map">
                <div className="section-title-row">
                  <div>
                    <span className="eyebrow">Location context</span>
                    <h2>{record.jurisdiction}</h2>
                  </div>
                  <MapPin aria-hidden="true" />
                </div>
                <RecordLocationMap record={record} />
              </section>
            ) : null}

            {sections.map((section) => (
              <section className="detail-section" key={section.title}>
                <h2>{section.title}</h2>
                <dl className="fact-list">
                  {section.facts.map((fact) => (
                    <div key={`${section.title}-${fact.label}`}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value.trim() ? fact.value : "not publicly available"}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </article>

          <aside className="detail-sidebar">
            <section className="action-panel">
              <span className="eyebrow">{officialAction.isOfficial ? "Official next step" : "Source reference"}</span>
              <h2>{officialAction.isOfficial ? "Continue with the source authority" : "Review the underlying source"}</h2>
              <p>
                {officialAction.isOfficial
                  ? "NagrikSetu keeps the full context here. Use the official portal only when you are ready to act."
                  : "This source provides context but is not presented as a government authority or official action channel."}
              </p>
              {officialAction.href ? (
                <a href={officialAction.href} target="_blank" rel="noreferrer">
                  {officialAction.label} <ExternalLink aria-hidden="true" size={16} />
                </a>
              ) : (
                <strong>not publicly available</strong>
              )}
            </section>
            {region ? (
              <section className="region-panel">
                <span className="eyebrow">Geographic context</span>
                <h2>{region.name}</h2>
                <p>{region.summary}</p>
                <Link href={`/places/${region.slug.join("/")}`}>
                  Explore {region.kind} <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </section>
            ) : null}
            <EvidencePanel record={record} />
            <CorrectionForm recordId={record.id} recordLabel={record.title} />
          </aside>
        </div>

        {related.length ? (
          <section className="related-section">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">Connected civic information</span>
                <h2>Related NagrikSetu records</h2>
              </div>
            </div>
            <div className="directory-grid">
              {related.map((candidate) => (
                <Link className="directory-card" href={`/records/${candidate.id}`} key={candidate.id}>
                  <span>{candidate.kind}</span>
                  <strong>{candidate.title}</strong>
                  <p>{candidate.summary}</p>
                  <small>{candidate.jurisdiction}</small>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
