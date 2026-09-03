/**
 * SUNCASA Kigali NbS Impact Dashboard - Main Entry Point
 */

import '../css/variables.css';
import '../css/style.css';

import { i18n } from './i18n.js';
import { catchmentMap } from './map.js';
import { indicatorExplorer } from './indicators.js';

import indicatorsData from '../data/indicators.json';
import catchmentsGeoJSON from '../data/geojson/nyabarongo_catchment.json';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize bilingual engine first
  i18n.init();

  // Initialize interactive GIS map
  catchmentMap.init();

  // Initialize indicator explorer & MyPeg storytelling
  indicatorExplorer.init();

  // Setup Export & Interoperability actions
  setupInteroperabilityActions();
  setupBriefExport();
  setupMobileNav();
});

function setupInteroperabilityActions() {
  // Export Indicators JSON
  const btnJson = document.getElementById('btn-export-json');
  if (btnJson) {
    btnJson.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(indicatorsData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'suncasa_kigali_indicators_fmes.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Export Catchment GeoJSON
  const btnGeo = document.getElementById('btn-export-geojson');
  if (btnGeo) {
    btnGeo.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catchmentsGeoJSON, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'kigali_nyabarongo_catchments.geojson');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
}

function setupBriefExport() {
  const btnExport = document.getElementById('btn-export-brief');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.print();
    });
  }
}

function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '74px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(15, 26, 44, 0.98)';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      }
    });
  }
}
