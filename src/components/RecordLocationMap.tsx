"use client";

import dynamic from "next/dynamic";
import type { NagrikRecord } from "@/lib/types";

const NagrikMap = dynamic(() => import("@/components/NagrikMap").then((module) => module.NagrikMap), {
  ssr: false,
  loading: () => <div className="map map--loading">Loading map...</div>
});

export function RecordLocationMap({ record }: { record: NagrikRecord }) {
  if (!record.location) return <p className="map map--unavailable">not publicly available</p>;
  return <NagrikMap activeId={record.id} onSelect={() => undefined} records={[record]} />;
}
