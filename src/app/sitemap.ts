import type { MetadataRoute } from "next";
import { geographicRegions } from "@/data/geography";
import { getAllRecords } from "@/data/repository";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/directory`, changeFrequency: "weekly", priority: 0.8 }
  ];

  const placeRoutes: MetadataRoute.Sitemap = geographicRegions.map((region) => ({
    url: `${baseUrl}/places/${region.slug.join("/")}`,
    changeFrequency: "weekly",
    priority: region.kind === "country" ? 0.9 : 0.75
  }));

  const recordRoutes: MetadataRoute.Sitemap = getAllRecords().map((record) => ({
    url: `${baseUrl}/records/${record.id}`,
    lastModified: record.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [...staticRoutes, ...placeRoutes, ...recordRoutes];
}
