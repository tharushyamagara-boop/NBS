'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import catchmentsGeoJSON from '../data/geojson/nyabarongo_catchment.json';
import sitesGeoJSON from '../data/geojson/intervention_sites.json';
import monitoringNodesGeoJSON from '../data/geojson/monitoring_nodes.json';
import { Indicator } from '@/lib/db/types';

interface CatchmentMapProps {
  currentIndicator?: Indicator | null;
  selectedTheme?: string;
  themeFilter?: string;
  height?: string | number;
  locale?: 'en' | 'rw';
  onSelectSite?: (properties: any) => void;
  showControls?: boolean;
  initialZoom?: number;
  showLegend?: boolean;
}

export default function CatchmentMap({
  currentIndicator = null,
  selectedTheme,
  themeFilter,
  height = '520px',
  locale = 'en',
  onSelectSite,
  showControls = true,
  initialZoom = 12,
  showLegend = true,
}: CatchmentMapProps) {
  const activeSelectedTheme = selectedTheme || themeFilter || 'all';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const catchmentLayerRef = useRef<L.GeoJSON | null>(null);
  const specializedLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const gpsLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap options: 'osm' (OpenStreetMap - 100% Free, Zero Key), 'dark' (Carto Dark), 'satellite' (ESRI World Imagery Keyless)
  const [activeBasemap, setActiveBasemap] = useState<'osm' | 'dark' | 'satellite'>('osm');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [legendRange, setLegendRange] = useState<{ min: number; max: number; unit: string; color: string } | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Kigali Lower Nyabarongo Watershed Center Coordinates
  const KIGALI_CENTER: [number, number] = [-1.965, 30.055];

  // Helper to interpolate colors for choropleth
  const getChoroplethColor = (val: number, min: number, max: number, baseColor: string) => {
    if (min === max || isNaN(val)) return baseColor;
    const ratio = Math.max(0, Math.min(1, (val - min) / (max - min)));

    // Theme color palettes
    if (baseColor === '#0284c7') {
      if (ratio > 0.8) return '#0369a1';
      if (ratio > 0.6) return '#0284c7';
      if (ratio > 0.4) return '#38bdf8';
      if (ratio > 0.2) return '#7dd3fc';
      return '#bae6fd';
    } else if (baseColor === '#10b981') {
      if (ratio > 0.8) return '#047857';
      if (ratio > 0.6) return '#10b981';
      if (ratio > 0.4) return '#34d399';
      if (ratio > 0.2) return '#6ee7b7';
      return '#a7f3d0';
    } else if (baseColor === '#8b5cf6') {
      if (ratio > 0.8) return '#6d28d9';
      if (ratio > 0.6) return '#8b5cf6';
      if (ratio > 0.4) return '#a78bfa';
      if (ratio > 0.2) return '#c4b5fd';
      return '#ddd6fe';
    } else if (baseColor === '#f59e0b') {
      if (ratio > 0.8) return '#b45309';
      if (ratio > 0.6) return '#f59e0b';
      if (ratio > 0.4) return '#fbbf24';
      if (ratio > 0.2) return '#fde68a';
      return '#fef3c7';
    } else {
      if (ratio > 0.8) return '#c2410c';
      if (ratio > 0.6) return '#ea580c';
      if (ratio > 0.4) return '#f97316';
      if (ratio > 0.2) return '#fb923c';
      return '#ffedd5';
    }
  };

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: KIGALI_CENTER,
      zoom: initialZoom,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
    });

    // Zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // 100% Free Public Keyless OpenStreetMap Tile Layer
    const osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull; City of Kigali & RFA',
      maxZoom: 19,
    }).addTo(map);
    baseTileLayerRef.current = osmTiles;

    specializedLayerRef.current = L.layerGroup().addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    gpsLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Basemap switch effect - Keyless Public Providers Only
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors &bull; City of Kigali & RFA';

    if (activeBasemap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &bull; City of Kigali & RFA';
    } else if (activeBasemap === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri World Imagery &bull; City of Kigali & RFA';
    }

    const newTiles = L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    baseTileLayerRef.current = newTiles;
  }, [activeBasemap]);

  // Main Layer Rendering & Indicator GPS / Choropleth Logic
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing catchment polygon layer
    if (catchmentLayerRef.current) {
      map.removeLayer(catchmentLayerRef.current);
      catchmentLayerRef.current = null;
    }

    // Clear specialized layers, general markers, and indicator GPS layer
    if (specializedLayerRef.current) specializedLayerRef.current.clearLayers();
    if (markersRef.current) markersRef.current.clearLayers();
    if (gpsLayerRef.current) gpsLayerRef.current.clearLayers();

    // Determine theme and color
    const themeColor =
      currentIndicator?.theme === 'climate'
        ? '#0284c7'
        : currentIndicator?.theme === 'biodiversity'
        ? '#10b981'
        : currentIndicator?.theme === 'gesi'
        ? '#8b5cf6'
        : currentIndicator?.theme === 'economy'
        ? '#f59e0b'
        : '#eb6b23';

    // Calculate indicator min and max for choropleth scale
    let minVal = Infinity;
    let maxVal = -Infinity;
    const indicatorId = currentIndicator?.id || '';

    (catchmentsGeoJSON as any).features.forEach((feat: any) => {
      let val = feat.properties?.indicators?.[indicatorId];
      if (val === undefined && currentIndicator?.site_breakdown) {
        const match = currentIndicator.site_breakdown.find((s) =>
          feat.properties.name.toLowerCase().includes(s.site.toLowerCase().slice(0, 5))
        );
        if (match) val = match.value;
      }
      if (val !== undefined && typeof val === 'number') {
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      }
    });

    if (minVal === Infinity || minVal === maxVal) {
      minVal = 0;
      maxVal = currentIndicator?.current_2025 || 100;
    }

    setLegendRange(
      currentIndicator
        ? {
            min: Math.round(minVal),
            max: Math.round(maxVal),
            unit: currentIndicator.unit,
            color: themeColor,
          }
        : null
    );

    // 1. RENDER CATCHMENT POLYGONS (Choropleth Mode)
    const catchmentLayer = L.geoJSON(catchmentsGeoJSON as any, {
      style: (feature: any) => {
        const p = feature.properties;
        let val = p?.indicators?.[indicatorId];
        if (val === undefined && currentIndicator?.site_breakdown) {
          const match = currentIndicator.site_breakdown.find((s) =>
            p.name.toLowerCase().includes(s.site.toLowerCase().slice(0, 5))
          );
          if (match) val = match.value;
        }

        const fillColor = currentIndicator
          ? getChoroplethColor(Number(val) || 0, minVal, maxVal, themeColor)
          : p.color || '#0284c7';

        return {
          fillColor: fillColor,
          weight: 2,
          opacity: 0.9,
          color: fillColor,
          dashArray: '3',
          fillOpacity: currentIndicator ? 0.45 : 0.22,
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const p = feature.properties;
        const name = locale === 'rw' ? p.name_rw : p.name;
        const val = p?.indicators?.[indicatorId];
        const valFormatted =
          val !== undefined ? `${val.toLocaleString()} ${currentIndicator?.unit || ''}` : null;

        layer.on({
          mouseover: (e: any) => {
            e.target.setStyle({ weight: 3.5, fillOpacity: 0.65 });
          },
          mouseout: (e: any) => {
            catchmentLayer.resetStyle(e.target);
          },
          click: () => {
            const dataPayload = {
              type: 'Micro-Catchment Polygon',
              id: p.id,
              name: p.name,
              name_rw: p.name_rw,
              district: p.district,
              area_km2: p.area_km2,
              flood_risk_level: p.flood_risk_level,
              priority_intervention: p.priority_intervention,
              fmes_compartment: p.fmes_compartment,
              indicatorValue: val,
              unit: currentIndicator?.unit,
              indicatorName: currentIndicator?.id,
            };
            setSelectedFeature(dataPayload);
            if (onSelectSite) onSelectSite(dataPayload);
          },
        });

        // Hover tooltip
        layer.bindTooltip(
          `
            <div style="font-family: Inter, sans-serif; font-size: 0.84rem; padding: 2px 4px;">
              <strong style="color: #0f172a; font-size: 0.92rem;">${name}</strong>
              <div style="color: #64748b; font-size: 0.75rem; margin-top: 2px;">${p.district} &bull; ${p.area_km2} km²</div>
              ${
                valFormatted
                  ? `<div style="margin-top: 5px; font-weight: 800; color: ${themeColor};">${currentIndicator?.id.toUpperCase().replace(/_/g, ' ')}: ${valFormatted}</div>`
                  : `<div style="margin-top: 4px; font-size: 0.75rem; color: #64748b;">${p.flood_risk_level}</div>`
              }
            </div>
          `,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        );
      },
    }).addTo(map);

    catchmentLayerRef.current = catchmentLayer;

    // 2. RENDER DEDICATED GPS COORDINATES FOR THIS INDICATOR (If entered by admin)
    if (gpsLayerRef.current && currentIndicator?.gps_coordinates && currentIndicator.gps_coordinates.length > 0) {
      const boundsArr: L.LatLngExpression[] = [];

      currentIndicator.gps_coordinates.forEach((pt) => {
        if (!pt.lat || !pt.lng) return;
        boundsArr.push([pt.lat, pt.lng]);

        const pinIcon = L.divIcon({
          className: 'indicator-gps-pin',
          html: `
            <div style="
              position: relative;
              width: 38px;
              height: 38px;
              background: ${themeColor};
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 4px 14px rgba(0,0,0,0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: 800;
              font-size: 0.95rem;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              <span>📍</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([pt.lat, pt.lng], { icon: pinIcon });

        const displayName = locale === 'rw' ? pt.name_rw || pt.name : pt.name;

        // Rich Popup with GPS Coordinates and Telemetry
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 240px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.72rem; font-weight: 800; background: ${themeColor}22; color: ${themeColor}; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                GPS Node &bull; ${pt.status || 'Active'}
              </span>
            </div>
            <h4 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">${displayName}</h4>
            <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 8px;">
              ${pt.sector ? `${pt.sector}, ` : ''}${pt.district || 'Kigali'}
            </div>
            <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px;">
              <div style="font-size: 0.72rem; color: #64748b;">Telemetry / Measured Progress</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: ${themeColor};">
                ${pt.value?.toLocaleString()} ${pt.unit || currentIndicator.unit}
              </div>
            </div>
            <div style="font-size: 0.74rem; color: #475569; font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; display: inline-block;">
              🛰️ Lat: ${pt.lat.toFixed(5)}, Lng: ${pt.lng.toFixed(5)}
            </div>
            ${pt.notes ? `<div style="font-size: 0.76rem; color: #64748b; margin-top: 6px; font-style: italic; line-height: 1.4;">${pt.notes}</div>` : ''}
          </div>
        `);

        marker.on('click', () => {
          const payload = {
            type: 'GPS Telemetry Waypoint',
            ...pt,
            indicatorValue: pt.value,
            unit: pt.unit || currentIndicator.unit,
          };
          setSelectedFeature(payload);
          if (onSelectSite) onSelectSite(payload);
        });

        gpsLayerRef.current?.addLayer(marker);
      });

      // Auto-fit bounds to enclose all GPS points for this indicator
      if (boundsArr.length > 0) {
        try {
          const latLngBounds = L.latLngBounds(boundsArr);
          map.fitBounds(latLngBounds, { padding: [40, 40], maxZoom: 14 });
        } catch (e) {
          // Ignore bounds errors
        }
      }
    }

    // 3. RENDER SPECIALIZED GIS NODES (Water Quality, Corridors, Nurseries, Youth Hubs)
    if (specializedLayerRef.current) {
      (monitoringNodesGeoJSON as any).features.forEach((node: any) => {
        const p = node.properties;
        const matchesIndicator = !currentIndicator || p.indicator_id === currentIndicator.id;
        if (!matchesIndicator) return;

        if (node.geometry.type === 'LineString') {
          const latLngs = node.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
          const isRiparian = p.indicator_id === 'riparian_buffer_km';
          const lineColor = isRiparian ? '#06b6d4' : '#ef4444';

          const polyline = L.polyline(latLngs, {
            color: lineColor,
            weight: 6,
            opacity: 0.85,
            dashArray: isRiparian ? undefined : '6, 6',
          });

          polyline.bindTooltip(
            `<strong>${locale === 'rw' ? p.name_rw : p.name}</strong><br/>${p.length_km ? `${p.length_km} km Protected Corridor` : p.status}`,
            { sticky: true }
          );

          polyline.on('click', () => {
            const payload = { type: 'Linear Corridor', ...p };
            setSelectedFeature(payload);
            if (onSelectSite) onSelectSite(payload);
          });

          specializedLayerRef.current?.addLayer(polyline);
        } else if (node.geometry.type === 'Point') {
          const [lng, lat] = node.geometry.coordinates;

          let badgeIcon = '💧';
          let badgeColor = '#0284c7';

          if (p.node_type === 'water_quality_station') {
            badgeIcon = '💧';
            badgeColor = p.wqi_score >= 70 ? '#0284c7' : p.wqi_score >= 50 ? '#f59e0b' : '#ef4444';
          } else if (p.node_type === 'nursery_hub') {
            badgeIcon = '🌱';
            badgeColor = '#10b981';
          } else if (p.node_type === 'youth_gis_hub') {
            badgeIcon = '📡';
            badgeColor = '#8b5cf6';
          } else if (p.node_type === 'training_center') {
            badgeIcon = '🎓';
            badgeColor = '#f59e0b';
          }

          const customIcon = L.divIcon({
            className: 'custom-specialized-pin',
            html: `
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${badgeColor};
                border: 2px solid #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.95rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.45);
                cursor: pointer;
                transition: transform 0.2s ease;
              ">
                ${badgeIcon}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([lat, lng], { icon: customIcon });
          marker.bindTooltip(
            `<strong>${locale === 'rw' ? p.name_rw : p.name}</strong><br/>${p.district} &bull; ${p.fmes_code || p.status}`,
            { offset: [0, -14] }
          );

          marker.on('click', () => {
            const payload = { type: 'Specialized GIS Node', ...p };
            setSelectedFeature(payload);
            if (onSelectSite) onSelectSite(payload);
          });

          specializedLayerRef.current?.addLayer(marker);
        }
      });
    }

    // 4. RENDER GENERAL INTERVENTION SITES (When no indicator-specific GPS points exist)
    if (markersRef.current && (!currentIndicator?.gps_coordinates || currentIndicator.gps_coordinates.length === 0)) {
      const showSiteMarkers =
        !currentIndicator ||
        ['area_restored_ha', 'trees_planted', 'green_jobs_created', 'flood_risk_reduction', 'soil_erosion_prevented'].includes(
          currentIndicator.id
        );

      if (showSiteMarkers) {
        (sitesGeoJSON as any).features.forEach((feature: any) => {
          const p = feature.properties;
          if (activeSelectedTheme !== 'all' && p.theme !== activeSelectedTheme) return;

          const [lng, lat] = feature.geometry.coordinates;

          let bubbleSize = 26;
          if (currentIndicator?.id === 'trees_planted' && p.trees_planted) {
            bubbleSize = Math.max(22, Math.min(42, Math.round(p.trees_planted / 9000)));
          } else if (currentIndicator?.id === 'green_jobs_created' && p.jobs_created) {
            bubbleSize = Math.max(22, Math.min(42, Math.round(p.jobs_created / 450)));
          }

          const pinColor = themeColor;

          const icon = L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="
                width: ${bubbleSize}px;
                height: ${bubbleSize}px;
                background: ${pinColor};
                border: 2.5px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 14px ${pinColor};
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-weight: 800;
                font-size: 0.65rem;
                cursor: pointer;
                transition: transform 0.2s ease;
              ">
                ${
                  currentIndicator?.id === 'trees_planted'
                    ? `${Math.round(p.trees_planted / 1000)}k`
                    : currentIndicator?.id === 'green_jobs_created'
                    ? `${Math.round(p.jobs_created / 1000)}k`
                    : ''
                }
              </div>
            `,
            iconSize: [bubbleSize, bubbleSize],
            iconAnchor: [bubbleSize / 2, bubbleSize / 2],
          });

          const marker = L.marker([lat, lng], { icon });

          const siteName = locale === 'rw' ? p.name_rw || p.name : p.name;
          marker.bindTooltip(
            `
              <div style="font-family: Inter, sans-serif; font-size: 0.84rem;">
                <strong style="color: #0f172a;">${siteName}</strong>
                <div style="color: #64748b; font-size: 0.74rem;">${p.district} &bull; ${p.fmes_compartment}</div>
                <div style="color: ${themeColor}; font-weight: 700; margin-top: 3px;">${p.intervention_type}</div>
              </div>
            `,
            { offset: [0, -12] }
          );

          marker.on('click', () => {
            const payload = {
              type: 'Restoration Site',
              ...p,
              indicatorValue:
                currentIndicator?.id === 'trees_planted'
                  ? p.trees_planted
                  : currentIndicator?.id === 'green_jobs_created'
                  ? p.jobs_created
                  : p.area_ha,
              unit: currentIndicator?.unit || 'ha',
            };
            setSelectedFeature(payload);
            if (onSelectSite) onSelectSite(payload);
          });

          markersRef.current?.addLayer(marker);
        });
      }
    }
  }, [currentIndicator, activeSelectedTheme, locale, onSelectSite]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        background: '#0a111e',
      }}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Basemap Switcher (Keyless OpenStreetMap & Satellite) */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 900,
            display: 'flex',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '5px',
            borderRadius: '8px',
            border: '1px solid #334155',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveBasemap('osm')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeBasemap === 'osm' ? '#0284c7' : 'transparent',
              color: activeBasemap === 'osm' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            🗺️ OpenStreetMap
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('satellite')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeBasemap === 'satellite' ? '#0284c7' : 'transparent',
              color: activeBasemap === 'satellite' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            🛰️ Satellite (ESRI)
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('dark')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeBasemap === 'dark' ? '#0284c7' : 'transparent',
              color: activeBasemap === 'dark' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            🌙 Dark
          </button>
        </div>
      )}

      {/* Floating Dynamic Indicator Legend */}
      {showLegend && legendRange && currentIndicator && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 900,
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '220px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            {currentIndicator.legend_label || 'Indicator Intensity'}
          </div>
          <div style={{ fontSize: '0.86rem', color: '#f8fafc', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentIndicator.unit}
          </div>

          {/* Gradient Color Bar */}
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                height: '10px',
                borderRadius: '5px',
                background: `linear-gradient(to right, rgba(255,255,255,0.15), ${legendRange.color})`,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
              <span>{legendRange.min.toLocaleString()}</span>
              <span>{Math.round((legendRange.min + legendRange.max) / 2).toLocaleString()}</span>
              <span>{legendRange.max.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '8px', borderTop: '1px solid #334155', paddingTop: '6px' }}>
            Lower Nyabarongo Watershed &bull; RFA FMES Verified
          </div>
        </div>
      )}

      {/* Selected Feature Floating Inspection Inspector Card */}
      {selectedFeature && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 900,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '14px 18px',
            maxWidth: '320px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              {selectedFeature.type}
            </span>
            <button
              type="button"
              onClick={() => setSelectedFeature(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <h4 style={{ color: '#ffffff', fontSize: '1rem', margin: '8px 0 2px 0', fontWeight: 700 }}>
            {locale === 'rw' ? selectedFeature.name_rw || selectedFeature.name : selectedFeature.name}
          </h4>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            {selectedFeature.district} &bull; {selectedFeature.fmes_compartment || selectedFeature.fmes_code || 'FMES Layer'}
          </div>

          {selectedFeature.indicatorValue !== undefined && (
            <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Telemetry Metric</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                {selectedFeature.indicatorValue?.toLocaleString()} {selectedFeature.unit || ''}
              </div>
            </div>
          )}

          {selectedFeature.lat !== undefined && selectedFeature.lng !== undefined && (
            <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
              GPS: {selectedFeature.lat.toFixed(5)}, {selectedFeature.lng.toFixed(5)}
            </div>
          )}

          {selectedFeature.notes && (
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.4 }}>
              {selectedFeature.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
