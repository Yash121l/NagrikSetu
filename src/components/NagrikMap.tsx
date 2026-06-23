"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { NagrikRecord } from "@/lib/types";

export function NagrikMap({ records, activeId, onSelect }: { records: NagrikRecord[]; activeId?: string; onSelect: (id: string) => void }) {
  const located = records.filter((record) => record.location);
  const center = located[0]?.location ?? { lat: 22.9734, lng: 78.6569 };

  return (
    <MapContainer className="map" center={[center.lat, center.lng]} zoom={located.length > 1 ? 5 : 11} scrollWheelZoom={false}>
      <TileLayer
        attribution={process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? "Map data © OpenStreetMap contributors"}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {located.map((record) => (
        <CircleMarker
          key={record.id}
          center={[record.location!.lat, record.location!.lng]}
          eventHandlers={{ click: () => onSelect(record.id) }}
          pathOptions={{
            color: record.id === activeId ? "#f97316" : "#0f766e",
            fillColor: record.id === activeId ? "#f97316" : "#14b8a6",
            fillOpacity: 0.78
          }}
          radius={record.id === activeId ? 12 : 8}
        >
          <Popup>
            <strong>{record.title}</strong>
            <br />
            {record.jurisdiction}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
