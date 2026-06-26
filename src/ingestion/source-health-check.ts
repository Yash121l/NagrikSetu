import type { SourceCatalogEntry } from "./types";

export type EndpointHealthStatus = "reachable" | "watch" | "blocked";

export interface EndpointHealth {
  url: string;
  status: EndpointHealthStatus;
  httpStatus?: number;
  warning?: string;
}

export interface LiveSourceHealth {
  sourceId: string;
  sourceName: string;
  checkedAt: string;
  homepage: EndpointHealth;
  robots?: EndpointHealth;
  redistribution: SourceCatalogEntry["legal"]["redistribution"];
  licenseNote: string;
  warnings: string[];
}

export interface SourceHealthCheckOptions {
  checkedAt: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function requireHttpUrl(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Source health checks only support HTTP(S) URLs: ${url}`);
  }
}

export function classifyEndpointStatus(httpStatus?: number, errorMessage?: string): EndpointHealthStatus {
  if (errorMessage) return "watch";
  if (httpStatus === undefined) return "watch";
  if (httpStatus === 401 || httpStatus === 403 || httpStatus === 429) return "blocked";
  if (httpStatus >= 200 && httpStatus < 400) return "reachable";
  return "watch";
}

async function checkEndpoint(url: string, options: Required<Pick<SourceHealthCheckOptions, "fetchImpl" | "timeoutMs">>): Promise<EndpointHealth> {
  requireHttpUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await options.fetchImpl(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal
    });
    const status = classifyEndpointStatus(response.status);
    return {
      url,
      status,
      httpStatus: response.status,
      warning: status === "reachable" ? undefined : `HEAD returned HTTP ${response.status}.`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch failure.";
    return {
      url,
      status: classifyEndpointStatus(undefined, message),
      warning: message
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkSource(source: SourceCatalogEntry, options: SourceHealthCheckOptions): Promise<LiveSourceHealth> {
  const resolvedOptions = {
    fetchImpl: options.fetchImpl ?? fetch,
    timeoutMs: options.timeoutMs ?? 8000
  };
  const homepage = await checkEndpoint(source.homepageUrl, resolvedOptions);
  const robots = source.legal.robotsTxtUrl ? await checkEndpoint(source.legal.robotsTxtUrl, resolvedOptions) : undefined;
  const warnings = [
    ...(homepage.warning ? [`Homepage: ${homepage.warning}`] : []),
    ...(robots?.warning ? [`robots.txt: ${robots.warning}`] : []),
    ...(!source.legal.robotsTxtUrl ? ["No robots.txt URL is listed in the source catalog."] : []),
    ...(source.legal.redistribution === "dataset-license-required" ? ["Dataset-level license review is required before reuse."] : [])
  ];

  return {
    sourceId: source.id,
    sourceName: source.name,
    checkedAt: options.checkedAt,
    homepage,
    robots,
    redistribution: source.legal.redistribution,
    licenseNote: source.legal.licenseNote,
    warnings
  };
}

export async function checkSources(sources: SourceCatalogEntry[], options: SourceHealthCheckOptions): Promise<LiveSourceHealth[]> {
  return Promise.all(sources.map((source) => checkSource(source, options)));
}
