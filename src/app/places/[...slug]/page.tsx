import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, ExternalLink, IndianRupee, Landmark, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  geographicRegions,
  indiaDirectoryStats,
  indiaHierarchyModels,
  getRegionAncestors,
  getRegionBySlug,
  getRegionChildren,
  getRelatedRegions,
  getRegionRecords
} from "@/data/geography";
import { getStateProfile } from "@/data/state-profiles";

interface PlacePageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return geographicRegions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) return { title: "Place not found | NagrikSetu" };
  return { title: `${region.name} civic directory | NagrikSetu`, description: region.summary };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();

  const ancestors = getRegionAncestors(region);
  const children = getRegionChildren(region.id);
  const relatedRegions = getRelatedRegions(region);
  const records = getRegionRecords(region);
  const stateProfile = getStateProfile(region.id);

  const childHeading =
    region.kind === "country"
      ? "28 states and 8 Union Territories"
      : region.kind === "state" || region.kind === "union-territory"
        ? "Districts, cities, and local governments"
        : region.kind === "city"
          ? "Urban local governments"
          : "Districts and local areas";

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Search</Link>
          {ancestors.map((ancestor) => (
            <Link href={`/places/${ancestor.slug.join("/")}`} key={ancestor.id}>
              {ancestor.name}
            </Link>
          ))}
          <span aria-current="page">{region.name}</span>
        </nav>

        <header className="place-hero">
          <div>
            <span className="eyebrow">{region.kind.replaceAll("-", " ")} civic directory</span>
            <h1>{region.name}</h1>
            {region.localName ? <strong className="local-name">{region.localName}</strong> : null}
            <p>{region.summary}</p>
          </div>
          <div className="place-hero__metric">
            <span>{records.length}</span>
            <p>current source-backed records in this region and its children</p>
            <small>{region.dataStatus.replaceAll("-", " ")}</small>
          </div>
        </header>

        <section className="place-facts">
          {region.facts.map((fact) => (
            <div key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
          {region.center ? (
            <div>
              <span>Map center</span>
              <strong>
                {region.center.lat.toFixed(4)}, {region.center.lng.toFixed(4)}
              </strong>
            </div>
          ) : null}
          <div>
            <span>Governance branch</span>
            <strong>{region.governanceBranch.replaceAll("-", " ")}</strong>
          </div>
        </section>

        {stateProfile ? (
          <section className="directory-section state-profile">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">State and Union Territory profile</span>
                <h2>Administration and economy at a glance</h2>
              </div>
              <Building2 aria-hidden="true" />
            </div>

            <div className="state-profile__overview">
              <div>
                <span>Capital</span>
                <strong>{stateProfile.capital}</strong>
              </div>
              <div>
                <span>Government code</span>
                <strong>{stateProfile.governmentCode}</strong>
              </div>
              <div>
                <span>LGD state/UT code</span>
                <strong>{stateProfile.lgdCode}</strong>
              </div>
              <a href={stateProfile.officialPortalUrl} rel="noreferrer" target="_blank">
                Official government portal <ExternalLink aria-hidden="true" size={15} />
              </a>
            </div>

            <div className="state-profile__columns">
              <article className="state-profile__section">
                <div className="state-profile__heading">
                  <Landmark aria-hidden="true" size={20} />
                  <div>
                    <span>Current administration</span>
                    <h3>Political and constitutional leadership</h3>
                  </div>
                </div>
                <dl className="profile-fact-list">
                  <div>
                    <dt>{stateProfile.chiefMinister.position}</dt>
                    <dd>
                      {stateProfile.chiefMinister.name ? (
                        <>
                          <strong>{stateProfile.chiefMinister.name}</strong>
                          {stateProfile.chiefMinister.officialUrl ? (
                            <a href={stateProfile.chiefMinister.officialUrl} rel="noreferrer" target="_blank">
                              Official profile <ExternalLink aria-hidden="true" size={14} />
                            </a>
                          ) : null}
                        </>
                      ) : (
                        <span>{stateProfile.chiefMinister.unavailableReason}</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>{stateProfile.constitutionalHead.position}</dt>
                    <dd>
                      <strong>{stateProfile.constitutionalHead.name}</strong>
                      {stateProfile.constitutionalHead.officialUrl ? (
                        <a href={stateProfile.constitutionalHead.officialUrl} rel="noreferrer" target="_blank">
                          Official profile <ExternalLink aria-hidden="true" size={14} />
                        </a>
                      ) : null}
                    </dd>
                  </div>
                </dl>
                <p className="profile-source-note">
                  Checked {stateProfile.chiefMinister.source.lastChecked}. Sources: {" "}
                  <a href={stateProfile.chiefMinister.source.sourceUrl} rel="noreferrer" target="_blank">
                    Chief Ministers
                  </a>
                  {" · "}
                  <a href={stateProfile.constitutionalHead.source.sourceUrl} rel="noreferrer" target="_blank">
                    {stateProfile.constitutionalHead.position === "Governor" ? "Governors" : "UT heads"}
                  </a>
                </p>
              </article>

              <article className="state-profile__section">
                <div className="state-profile__heading">
                  <IndianRupee aria-hidden="true" size={20} />
                  <div>
                    <span>Economic snapshot</span>
                    <h3>Per-capita state income</h3>
                  </div>
                </div>
                {stateProfile.economy.perCapitaNsdpInr !== null ? (
                  <>
                    <div className="economy-value">
                      <strong>
                        ₹{stateProfile.economy.perCapitaNsdpInr.toLocaleString("en-IN")}
                      </strong>
                      <span>per-capita NSDP at current prices · {stateProfile.economy.reportingPeriod}</span>
                    </div>
                    {stateProfile.economy.allIndiaPerCapitaNniInr ? (
                      <div className="economy-comparison">
                        <span>All-India per-capita NNI in the same RBI table</span>
                        <strong>₹{stateProfile.economy.allIndiaPerCapitaNniInr.toLocaleString("en-IN")}</strong>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="economy-unavailable">
                    <strong>Not publicly available in this comparable table</strong>
                    <p>{stateProfile.economy.unavailableReason}</p>
                  </div>
                )}
                <p className="economy-definition">
                  Per-capita NSDP is state income per person, not household income or salary. Values are shown in
                  current prices and should be compared only with the reporting period visible here.
                </p>
                <p className="profile-source-note">
                  RBI table published {stateProfile.economy.source.publishedAt}; checked {stateProfile.economy.source.lastChecked}. {" "}
                  <a href={stateProfile.economy.source.sourceUrl} rel="noreferrer" target="_blank">
                    Review Table 9 <ExternalLink aria-hidden="true" size={13} />
                  </a>
                </p>
              </article>
            </div>

            <p className="state-profile__provenance">
              Stable directory facts use the {stateProfile.profileSource.sourceName}, checked {stateProfile.profileSource.lastChecked}.
              Office holders and economic figures are dated separately because they change on different schedules.
            </p>
          </section>
        ) : null}

        {region.id === "india" ? (
          <>
            <section className="directory-section">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">National directory scale</span>
                  <h2>India location and local-government counts</h2>
                </div>
              </div>
              <div className="national-stats-grid">
                {indiaDirectoryStats.map((stat) => (
                  <div key={stat.label}>
                    <span>{stat.group}</span>
                    <strong>{stat.value.toLocaleString("en-IN")}</strong>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="data-note">
                Counts follow the supplied Local Government Directory summary and may change as states create, merge, or
                remap units. NagrikSetu keeps counts separate from source-backed record coverage.
              </p>
            </section>

            <section className="directory-section">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">Two overlapping systems</span>
                  <h2>How Indian locations are organized</h2>
                </div>
              </div>
              <div className="hierarchy-grid">
                {indiaHierarchyModels.map((model) => (
                  <article key={model.id}>
                    <h3>{model.title}</h3>
                    <ol>
                      {model.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {children.length ? (
          <section className="directory-section">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">Browse deeper</span>
                <h2>{childHeading}</h2>
              </div>
              <MapPin aria-hidden="true" />
            </div>
            <div className="directory-grid directory-grid--places">
              {children.map((child) => (
                <Link className="directory-card" href={`/places/${child.slug.join("/")}`} key={child.id}>
                  <span>{child.kind.replaceAll("-", " ")}</span>
                  <strong>{child.name}</strong>
                  <p>{child.summary}</p>
                  <small>
                    Open {child.kind.replaceAll("-", " ")} <ArrowRight aria-hidden="true" size={14} />
                  </small>
                  <em>{child.dataStatus.replaceAll("-", " ")}</em>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {relatedRegions.length ? (
          <section className="directory-section">
            <div className="section-title-row">
              <div>
                <span className="eyebrow">Overlapping geography and governance</span>
                <h2>Related administrative and local-government areas</h2>
              </div>
            </div>
            <div className="directory-grid directory-grid--places">
              {relatedRegions.map((related) => (
                <Link className="directory-card" href={`/places/${related.slug.join("/")}`} key={related.id}>
                  <span>{related.kind.replaceAll("-", " ")}</span>
                  <strong>{related.name}</strong>
                  <p>{related.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="directory-section">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">On-site public information</span>
              <h2>Records covering {region.name}</h2>
            </div>
            <Landmark aria-hidden="true" />
          </div>
          {records.length ? (
            <div className="directory-grid">
              {records.map((record) => (
                <Link className="directory-card" href={`/records/${record.id}`} key={record.id}>
                  <span>{record.kind}</span>
                  <strong>{record.title}</strong>
                  <p>{record.summary}</p>
                  <small>{record.provenance.sourceName}</small>
                </Link>
              ))}
            </div>
          ) : (
            <div className="data-under-development">
              <strong>Directory page ready</strong>
              <p>
                District, city, sub-district, rural-body, and urban-body records for {region.name} are under structured
                development. No records are invented while official-source ingestion is pending.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
