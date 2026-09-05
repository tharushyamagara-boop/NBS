import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import catchmentsGeoJSON from '../data/geojson/nyabarongo_catchment.json';
import sitesGeoJSON from '../data/geojson/intervention_sites.json';

interface CatchmentMapProps {
  locale: 'en' | 'rw';
  themeFilter: string;
  onSelectSite?: (properties: any) => void;
}

export default function CatchmentMap({ locale, themeFilter, onSelectSite }: CatchmentMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const catchmentLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [-1.965, 30.055],
      zoom: 12,
      minZoom: 11,
      maxZoom: 16,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | City of Kigali & RFA',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Render Catchment Polygons
    const catchmentLayer = L.geoJSON(catchmentsGeoJSON as any, {
      style: (feature: any) => ({
        fillColor: feature.properties.color || '#0284c7',
        weight: 2,
        opacity: 0.85,
        color: feature.properties.color || '#0284c7',
        dashArray: '3',
        fillOpacity: 0.18
      }),
      onEachFeature: (feature: any, layer: L.Layer) => {
        layer.on({
          mouseover: (e: any) => {
            e.target.setStyle({ weight: 3, fillOpacity: 0.35 });
          },
          mouseout: (e: any) => {
            catchmentLayer.resetStyle(e.target);
          },
          click: () => {
            onSelectSite({
              name: feature.properties.name,
              name_rw: feature.properties.name_rw,
              district: feature.properties.district,
              area_ha: feature.properties.area_ha,
              type: 'Micro-Catchment Basin',
              fmes_code: 'RFA-FMES-BASIN',
              risk_focus: feature.properties.risk_focus
            });
          }
        });

        const name = locale === 'rw' ? feature.properties.name_rw : feature.properties.name;
        layer.bindTooltip(`<strong>${name}</strong><br/>${feature.properties.district}`, {
          sticky: true,
          className: 'leaflet-custom-tooltip'
        });
      }
    }).addTo(map);

    catchmentLayerRef.current = catchmentLayer;
    mapInstanceRef.current = map;

    // Render initial intervention site markers
    renderMarkers(map, themeFilter);

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when theme filter changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderMarkers(mapInstanceRef.current, themeFilter);
    }
  }, [themeFilter, locale]);

  const renderMarkers = (map: L.Map, filter: string) => {
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const colors: Record<string, string> = {
      climate: '#0284c7',
      biodiversity: '#10b981',
      gesi: '#8b5cf6',
      economy: '#f59e0b'
    };

    (sitesGeoJSON as any).features.forEach((feature: any) => {
      const p = feature.properties;
      if (filter !== 'all' && p.theme !== filter) return;

      const [lng, lat] = feature.geometry.coordinates;
      const color = colors[p.theme] || '#10b981';

      const icon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 14px ${color};
            cursor: pointer;
            transition: transform 0.2s ease;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.on('click', () => {
        onSelectSite(p);
      });

      const siteName = locale === 'rw' ? (p.name_rw || p.name) : p.name;
      marker.bindTooltip(`<strong>${siteName}</strong><br/>${p.district} &bull; ${p.fmes_compartment}`, {
        offset: [0, -10]
      });

      markersRef.current.push(marker);
    });
  };

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />;
}
