/**
 * Traffic Map Component with Leaflet
 */
import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { HeatmapResponse } from '@/types';
import { MAP_CONFIG, HEATMAP_CONFIG } from '@/utils/constants';
import { formatClockTime } from '@/utils/formatters';

// Fix for default marker icon
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const cameraIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#3B82F6"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <circle cx="12" cy="12" r="3" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface TrafficMapProps {
  center: [number, number];
  heatmapData: HeatmapResponse;
  currentMinute?: number;
}

// Heatmap layer component
function HeatmapLayer({ data }: { data: HeatmapResponse }) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    // Check if L.heatLayer is available
    if (typeof (L as any).heatLayer === 'undefined') {
      // Load leaflet.heat dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => {
        createHeatLayer();
      };
      document.head.appendChild(script);
    } else {
      createHeatLayer();
    }

    function createHeatLayer() {
      // Remove existing layer
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      // Create heatmap points
      const points = data.points.map(p => [
        p.lat,
        p.lng,
        p.intensity / (data.max_intensity || 1)
      ]);

      // Create new heat layer
      heatLayerRef.current = (L as any).heatLayer(points, {
        radius: HEATMAP_CONFIG.RADIUS,
        blur: HEATMAP_CONFIG.BLUR,
        maxZoom: HEATMAP_CONFIG.MAX_ZOOM,
        gradient: HEATMAP_CONFIG.GRADIENT,
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, data]);

  return null;
}

// Map center updater
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);

  return null;
}

export default function TrafficMap({ center, heatmapData, currentMinute }: TrafficMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={MAP_CONFIG.DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      {/* Base tile layer */}
      <TileLayer
        url={MAP_CONFIG.TILE_URL}
        attribution={MAP_CONFIG.TILE_ATTRIBUTION}
      />

      {/* Heatmap overlay */}
      <HeatmapLayer data={heatmapData} />

      {/* Camera marker */}
      <Marker position={center} icon={cameraIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-sm text-gray-900">Traffic Camera</h3>
            <p className="text-xs text-gray-600 mt-1">
              Location: {center[0].toFixed(4)}, {center[1].toFixed(4)}
            </p>
            {currentMinute !== undefined && (
              <p className="text-xs text-gray-600">
                Time: {formatClockTime(currentMinute)}
              </p>
            )}
            <p className="text-xs text-traffic-primary mt-1 font-medium">
              YOLOv8 Active
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Update center when it changes */}
      <MapUpdater center={center} />
    </MapContainer>
  );
}
