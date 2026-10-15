
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

type RouteMapProps = {
  geometry?: RouteGeometry | null;
  origin?: string;
  destination?: string;
  theme: "light" | "dark";
};

function MapViewport({
  positions,
}: {
  positions: LatLngExpression[];
}) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 1) {
      const bounds = positions as LatLngBoundsExpression;
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 7 });
    } else if (positions.length === 1) {
      map.setView(positions[0], 6);
    }
  }, [map, positions]);

  return null;
}

function MapSizeInvalidator() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false, debounceMoveend: true });
    });

    resizeObserver.observe(container);

    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [map]);

  return null;
}

export default function RouteMap({
  geometry,
  origin,
  destination,
  theme,
}: RouteMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const positions = useMemo<LatLngExpression[]>(() => {
    if (!geometry || geometry.type !== "LineString") return [];

    return geometry.coordinates.map(([longitude, latitude]) => [
      latitude,
      longitude,
    ]);
  }, [geometry]);

  const initialCenter: LatLngExpression = [50.5, 10.5];

  if (!mounted) {
    return (
      <div className={`route-map-loading theme-${theme}`}>
        <span>Preparing map...</span>
      </div>
    );
  }

  return (
    <div className={`route-map theme-${theme}`}>
      <MapContainer
        center={initialCenter}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        scrollWheelZoom
        className="route-leaflet"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
          maxZoom={19}
        />

        <MapSizeInvalidator />

        {positions.length > 1 && (
          <>
            <Polyline
              positions={positions}
              pathOptions={{
                color: theme === "dark" ? "#55dbc0" : "#168477",
                weight: 8,
                opacity: 0.18,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={positions}
              pathOptions={{
                color: theme === "dark" ? "#55dbc0" : "#168477",
                weight: 4,
                opacity: 0.98,
                lineCap: "round",
                lineJoin: "round",
              }}
            />

            <CircleMarker
              center={positions[0]}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#168477",
                fillOpacity: 1,
              }}
            />

            <CircleMarker
              center={positions[positions.length - 1]}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#4b77bc",
                fillOpacity: 1,
              }}
            />

            <MapViewport positions={positions} />
          </>
        )}
      </MapContainer>

      <div className="route-map-overlay">
        <span className="route-map-indicator" />
        {positions.length > 1 ? "Calculated route" : "Awaiting route"}
      </div>

      {positions.length > 1 && (
        <div className="route-map-endpoints">
          <div>
            <span className="endpoint-dot start" />
            <span>{origin || "Origin"}</span>
          </div>
          <div>
            <span className="endpoint-dot end" />
            <span>{destination || "Destination"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
