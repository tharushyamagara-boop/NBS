/**
 * SUNCASA Kigali Geospatial GIS Map (Lower Nyabarongo Watershed)
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import catchmentsGeoJSON from '../data/geojson/nyabarongo_catchment.json';
import sitesGeoJSON from '../data/geojson/intervention_sites.json';
import { i18n } from './i18n.js';

class CatchmentMap {
  constructor() {
    this.map = null;
    this.catchmentLayer = null;
    this.sitesLayer = null;
    this.currentThemeFilter = 'all';
    this.selectedSite = null;
    this.markers = [];
  }

  init() {
    const mapEl = document.getElementById('gis-map');
    if (!mapEl) return;

    // Center on Kigali & Lower Nyabarongo Watershed
    this.map = L.map('gis-map', {
      center: [-1.965, 30.055],
      zoom: 12,
      minZoom: 11,
      maxZoom: 16,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // CartoDB Dark Matter tile layer (modern, elegant, high contrast)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | City of Kigali & RFA',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this.renderCatchments();
    this.renderSites();
    this.setupFilterControls();

    // Select the first site by default for inspection panel
    if (sitesGeoJSON.features.length > 0) {
      this.updateInspectionPanel(sitesGeoJSON.features[0].properties);
    }

    // Re-render when language changes
    window.addEventListener('suncasa:localeChanged', () => {
      this.refreshLanguage();
    });
  }

  renderCatchments() {
    this.catchmentLayer = L.geoJSON(catchmentsGeoJSON, {
      style: (feature) => {
        return {
          fillColor: feature.properties.color || '#0284c7',
          weight: 2,
          opacity: 0.85,
          color: feature.properties.color || '#0284c7',
          dashArray: '3',
          fillOpacity: 0.18
        };
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 3,
              fillOpacity: 0.35
            });
          },
          mouseout: (e) => {
            this.catchmentLayer.resetStyle(e.target);
          },
          click: () => {
            this.updateCatchmentInspection(feature.properties);
          }
        });

        // Popup
        const name = i18n.currentLocale === 'rw' ? feature.properties.name_rw : feature.properties.name;
        layer.bindTooltip(`<strong>${name}</strong><br/>${feature.properties.district}`, {
          sticky: true,
          className: 'leaflet-custom-tooltip'
        });
      }
    }).addTo(this.map);
  }

  createCustomIcon(theme) {
    const colors = {
      climate: '#0284c7',
      biodiversity: '#10b981',
      gesi: '#8b5cf6',
      economy: '#f59e0b'
    };
    const color = colors[theme] || '#10b981';

    return L.divIcon({
      className: 'suncasa-map-marker',
      html: `
        <div style="
          width: 22px;
          height: 22px;
          background: ${color};
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px ${color};
          cursor: pointer;
          transition: transform 0.2s ease;
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  }

  renderSites() {
    if (this.sitesLayer) {
      this.map.removeLayer(this.sitesLayer);
    }
    this.markers = [];

    const filteredFeatures = sitesGeoJSON.features.filter(feat => {
      if (this.currentThemeFilter === 'all') return true;
      return feat.properties.theme === this.currentThemeFilter;
    });

    this.sitesLayer = L.geoJSON({
      type: 'FeatureCollection',
      features: filteredFeatures
    }, {
      pointToLayer: (feature, latlng) => {
        const marker = L.marker(latlng, {
          icon: this.createCustomIcon(feature.properties.theme)
        });
        marker.on('click', () => {
          this.updateInspectionPanel(feature.properties);
        });
        this.markers.push(marker);
        return marker;
      }
    }).addTo(this.map);
  }

  setupFilterControls() {
    const filterBtns = document.querySelectorAll('.map-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentThemeFilter = e.currentTarget.getAttribute('data-theme');
        this.renderSites();
      });
    });
  }

  updateInspectionPanel(props) {
    this.selectedSite = props;
    const isRw = i18n.currentLocale === 'rw';
    const name = isRw && props.name_rw ? props.name_rw : props.name;

    const panel = document.getElementById('map-inspection-content');
    if (!panel) return;

    panel.innerHTML = `
      <div class="site-panel-header">
        <div class="site-district-tag">${props.district} &bull; ${props.sector}</div>
        <h3>${name}</h3>
        <span class="fmes-pill" style="margin-top: 6px; display: inline-block;">${props.fmes_compartment}</span>
      </div>

      <div class="site-panel-stats">
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Ubuso (Hegitari)' : 'Restored Area'}</div>
          <div class="site-stat-val" style="color: #34d399;">${props.area_ha} ha</div>
        </div>
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Ingemwe zatewe' : 'Seedlings Planted'}</div>
          <div class="site-stat-val" style="color: #38bdf8;">${props.trees_planted.toLocaleString()}</div>
        </div>
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Imirimo y\'Icyatsi' : 'Green Jobs'}</div>
          <div class="site-stat-val" style="color: #fbbf24;">${props.jobs_created.toLocaleString()}</div>
        </div>
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Abagore (%)' : 'Women In Team'}</div>
          <div class="site-stat-val" style="color: #c084fc;">${props.female_participation_pct}%</div>
        </div>
      </div>

      <div class="site-detail-row">
        <div class="site-detail-label">${isRw ? 'Ubwoko bw\'Igikorwa' : 'Intervention Category'}</div>
        <div class="site-detail-text" style="font-weight: 600;">${props.intervention_type}</div>
      </div>

      <div class="site-detail-row">
        <div class="site-detail-label">${isRw ? 'Amoko y\'Ibiti byatewe' : 'Key Species Planted'}</div>
        <div class="site-detail-text" style="font-style: italic; font-size: 0.84rem;">${props.primary_species}</div>
      </div>

      <div class="site-detail-row">
        <div class="site-detail-label">${isRw ? 'Uburyo bihagaze' : 'Field Operations Status'}</div>
        <div class="site-detail-text" style="color: #34d399; font-weight: 600;">&bull; ${props.status}</div>
      </div>

      <div class="site-detail-row">
        <div class="site-detail-label">${isRw ? 'Ubuyobozi bw\'Igikorwa' : 'Lead Implementing Partner'}</div>
        <div class="site-detail-text">${props.lead_implementer}</div>
      </div>
    `;
  }

  updateCatchmentInspection(props) {
    const isRw = i18n.currentLocale === 'rw';
    const name = isRw && props.name_rw ? props.name_rw : props.name;

    const panel = document.getElementById('map-inspection-content');
    if (!panel) return;

    panel.innerHTML = `
      <div class="site-panel-header">
        <div class="site-district-tag">${props.district}</div>
        <h3>${name}</h3>
        <span class="fmes-pill" style="margin-top: 6px; display: inline-block;">${props.id.toUpperCase()}</span>
      </div>

      <div class="site-panel-stats">
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Ubuso bw\'Ikibaya' : 'Catchment Area'}</div>
          <div class="site-stat-val" style="color: #38bdf8;">${props.area_km2} km²</div>
        </div>
        <div class="site-stat-box">
          <div class="site-stat-label">${isRw ? 'Ibyago by\'Imyuzure' : 'Flood Vulnerability'}</div>
          <div class="site-stat-val" style="color: #f87171; font-size: 0.95rem;">${props.flood_risk_level}</div>
        </div>
      </div>

      <div class="site-detail-row">
        <div class="site-detail-label">${isRw ? 'Igikorwa cy\'Ubujyanama gishyigikiwe' : 'Target Nature-Based Solution'}</div>
        <div class="site-detail-text" style="font-weight: 600; color: #34d399;">${props.priority_intervention}</div>
      </div>

      <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 14px;">
        ${isRw ? 'Kanda ku kadomo k\'ibara kuri iyi karita kugira ngo urebe amakuru y\'ahantu nyaho hatewe ibiti n\'amaterasi.' : 'Click on any circular marker within this catchment to view specific site-level planting and employment data.'}
      </p>
    `;
  }

  refreshLanguage() {
    if (this.selectedSite) {
      this.updateInspectionPanel(this.selectedSite);
    }
  }
}

export const catchmentMap = new CatchmentMap();
