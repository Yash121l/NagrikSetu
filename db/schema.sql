-- NagrikSetu production persistence baseline.
-- Target: PostgreSQL 16+ with PostGIS and full-text search extensions enabled by the deployment.

create extension if not exists postgis;
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

create table if not exists sources (
  id text primary key,
  name text not null,
  homepage_url text not null check (homepage_url ~ '^https?://'),
  priority text not null check (priority in ('official', 'open-government', 'permissive-third-party')),
  owner text not null,
  geography text not null,
  access_method text not null,
  refresh_cadence text not null,
  requires_auth boolean not null default false,
  automation_mode text not null,
  license_note text not null,
  terms_url text check (terms_url is null or terms_url ~ '^https?://'),
  robots_txt_url text check (robots_txt_url is null or robots_txt_url ~ '^https?://'),
  redistribution text not null check (redistribution in ('link-only', 'metadata-ok', 'dataset-license-required')),
  expected_freshness_days integer not null check (expected_freshness_days > 0),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  notes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists raw_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references sources(id),
  source_url text not null check (source_url ~ '^https?://'),
  fetched_at timestamptz not null,
  content_type text not null,
  content_hash text not null,
  byte_length bigint not null check (byte_length >= 0),
  object_uri text not null,
  manifest jsonb not null,
  parser_version text,
  created_at timestamptz not null default now(),
  unique (source_id, content_hash)
);

create table if not exists source_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references sources(id),
  adapter_name text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  status text not null check (status in ('healthy', 'watch', 'stale', 'not-run')),
  record_count integer not null default 0,
  dedupe_key_count integer not null default 0,
  warning_count integer not null default 0,
  raw_snapshot_id uuid references raw_snapshots(id),
  warnings jsonb not null default '[]'::jsonb
);

create table if not exists civic_records (
  id text primary key,
  kind text not null check (kind in ('office', 'officer', 'project', 'road', 'tender', 'complaint', 'source')),
  title text not null,
  summary text not null,
  department text not null,
  jurisdiction text not null,
  address text,
  phone text,
  email text,
  website text check (website is null or website ~ '^https?://'),
  issue_tags text[] not null default '{}',
  language_tags text[] not null default '{}',
  location geography(point, 4326),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  updated_at date not null,
  provenance jsonb not null,
  payload jsonb not null,
  search_document tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(issue_tags, ' '), '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(department, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(jurisdiction, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'C')
  ) stored,
  created_at timestamptz not null default now()
);

create index if not exists civic_records_kind_idx on civic_records(kind);
create index if not exists civic_records_confidence_idx on civic_records(confidence);
create index if not exists civic_records_location_idx on civic_records using gist(location);
create index if not exists civic_records_search_idx on civic_records using gin(search_document);
create index if not exists civic_records_title_trgm_idx on civic_records using gin(title gin_trgm_ops);

create table if not exists record_dedupe_keys (
  dedupe_key text primary key,
  record_id text not null references civic_records(id) on delete cascade,
  source_id text not null references sources(id),
  created_at timestamptz not null default now()
);

create table if not exists geography_regions (
  id text primary key,
  kind text not null,
  name text not null,
  local_name text,
  slug text[] not null,
  parent_id text references geography_regions(id),
  related_region_ids text[] not null default '{}',
  governance_branch text not null check (governance_branch in ('administrative', 'urban-local-government', 'rural-local-government')),
  data_status text not null check (data_status in ('source-backed-pilot', 'directory-page', 'under-development')),
  local_body_type text,
  center geography(point, 4326),
  facts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (slug)
);

create table if not exists record_regions (
  record_id text not null references civic_records(id) on delete cascade,
  region_id text not null references geography_regions(id) on delete cascade,
  relation text not null default 'primary',
  primary key (record_id, region_id, relation)
);

create table if not exists correction_submissions (
  id text primary key,
  status text not null check (status in ('new', 'triaged', 'source-check-needed', 'accepted', 'rejected', 'duplicate', 'published')),
  record_id text not null references civic_records(id) on delete restrict,
  message text not null,
  language text not null,
  submitted_at timestamptz not null,
  reviewed_at timestamptz,
  reviewer_note text,
  official_source_url text check (official_source_url is null or official_source_url ~ '^https?://'),
  suggested_change jsonb,
  audit_trail jsonb not null default '[]'::jsonb
);
