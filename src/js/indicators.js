/**
 * SUNCASA Kigali Indicator Explorer & MyPeg 3-Tier Storytelling Engine
 */

import indicatorsData from '../data/indicators.json';
import { i18n } from './i18n.js';
import { chartManager } from './charts.js';

class IndicatorExplorer {
  constructor() {
    this.data = indicatorsData;
    this.currentTheme = 'all';
    this.searchQuery = '';
    this.activeIndicator = null;
  }

  init() {
    this.renderHeroKPIs();
    this.renderThematicSpotlight('climate');
    this.renderIndicators();
    this.setupEventListeners();

    window.addEventListener('suncasa:localeChanged', () => {
      this.renderHeroKPIs();
      this.renderThematicSpotlight(this.currentTheme === 'all' ? 'climate' : this.currentTheme);
      this.renderIndicators();
      if (this.activeIndicator) {
        this.openModal(this.activeIndicator.id);
      }
    });
  }

  setupEventListeners() {
    // Search bar input
    const searchInput = document.getElementById('indicator-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderIndicators();
      });
    }

    // Indicator filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        filterChips.forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentTheme = e.currentTarget.getAttribute('data-theme');
        this.renderIndicators();
      });
    });

    // Theme spotlight pill tabs
    const themePillBtns = document.querySelectorAll('.theme-pill-btn');
    themePillBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        themePillBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const theme = e.currentTarget.getAttribute('data-theme');
        this.renderThematicSpotlight(theme);
      });
    });

    // Modal close button
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('indicator-modal-overlay');
    if (modalCloseBtn && modalOverlay) {
      modalCloseBtn.addEventListener('click', () => this.closeModal());
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal();
      });
    }
  }

  renderHeroKPIs() {
    const isRw = i18n.currentLocale === 'rw';
    const heroGrid = document.getElementById('hero-kpis-grid');
    if (!heroGrid) return;

    const featured = this.data.indicators.filter(ind => ind.featured_in_hero);
    heroGrid.innerHTML = featured.map(ind => {
      const narrative = i18n.getNarrative(ind.id);
      const title = narrative ? narrative.title : ind.id;
      const pctProgress = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));

      const colors = {
        climate: '#0284c7',
        biodiversity: '#10b981',
        gesi: '#8b5cf6',
        economy: '#f59e0b'
      };
      const accent = colors[ind.theme] || '#10b981';

      return `
        <div class="kpi-card" style="--card-accent: ${accent};">
          <div class="kpi-header">
            <span class="kpi-theme-tag">${ind.theme}</span>
            <span class="fmes-pill">${ind.fmes_code}</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${ind.current_2025.toLocaleString()}</span>
            <span class="kpi-unit">${ind.unit}</span>
          </div>
          <div class="kpi-label">${title}</div>
          <div class="kpi-progress-bar-bg">
            <div class="kpi-progress-bar-fill" style="width: ${pctProgress}%;"></div>
          </div>
          <div class="kpi-footer">
            <span>${pctProgress}% ${isRw ? 'by\'intego' : 'of 2026 target'}</span>
            <span class="kpi-status-badge">&bull; ${ind.status.replace('-', ' ')}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderThematicSpotlight(themeKey) {
    const spotlightContainer = document.getElementById('thematic-spotlight-box');
    if (!spotlightContainer) return;

    const isRw = i18n.currentLocale === 'rw';
    const themeInfo = i18n.locales[i18n.currentLocale]?.themes?.[themeKey] || i18n.locales.en.themes[themeKey];
    if (!themeInfo) return;

    const glowColors = {
      climate: 'rgba(2, 132, 199, 0.25)',
      biodiversity: 'rgba(16, 185, 129, 0.25)',
      gesi: 'rgba(139, 92, 246, 0.25)',
      economy: 'rgba(245, 158, 11, 0.25)'
    };

    spotlightContainer.style.setProperty('--spotlight-glow', glowColors[themeKey] || 'rgba(16, 185, 129, 0.25)');

    spotlightContainer.innerHTML = `
      <div class="thematic-spotlight-text">
        <div class="section-tag">${themeInfo.name}</div>
        <h3>${themeInfo.headline}</h3>
        <p>${themeInfo.short_desc}</p>
        <div style="display: flex; gap: 12px;">
          <button class="btn-secondary" onclick="document.getElementById('indicators-section').scrollIntoView({behavior: 'smooth'})">
            ${isRw ? 'Reba Ibipimo by\'iyi nkingi' : 'Explore Theme Indicators'} &darr;
          </button>
        </div>
      </div>

      <div class="mypeg-three-questions-box">
        <div class="question-item">
          <h4>${isRw ? '1. Iki gikorwa ni iki?' : '1. What is this action?'}</h4>
          <p>${themeInfo.what_is_it}</p>
        </div>
        <div class="question-item">
          <h4>${isRw ? '2. Kuki ari ingenzi ku Mujyi wa Kigali?' : '2. Why does it matter for Kigali?'}</h4>
          <p>${themeInfo.why_it_matters}</p>
        </div>
        <div class="question-item">
          <h4>${isRw ? '3. Ni iki SUNCASA iri gukora?' : '3. What is SUNCASA doing?'}</h4>
          <p>${themeInfo.what_suncasa_does}</p>
        </div>
      </div>
    `;
  }

  renderIndicators() {
    const grid = document.getElementById('indicators-grid');
    if (!grid) return;

    const isRw = i18n.currentLocale === 'rw';

    const filtered = this.data.indicators.filter(ind => {
      // Theme filter
      if (this.currentTheme !== 'all' && ind.theme !== this.currentTheme) {
        return false;
      }
      // Search query filter
      if (this.searchQuery) {
        const narrative = i18n.getNarrative(ind.id);
        const title = narrative ? narrative.title.toLowerCase() : '';
        const fmes = ind.fmes_code.toLowerCase();
        const theme = ind.theme.toLowerCase();
        const matches = title.includes(this.searchQuery) || fmes.includes(this.searchQuery) || theme.includes(this.searchQuery);
        if (!matches) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p>${isRw ? 'Nta bipimo bibonetse bihuye n\'ibyo mushakishije.' : 'No indicators found matching your filter criteria.'}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(ind => {
      const narrative = i18n.getNarrative(ind.id);
      const title = narrative ? narrative.title : ind.id;
      const pctProgress = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));

      const statusClass = ind.status === 'exceeded' ? 'status-exceeded' : 'status-on-track';
      const statusText = ind.status === 'exceeded' ? (isRw ? 'Byarenze Intego' : 'Exceeded Target') : (isRw ? 'Biri ku Murongo' : 'On Track');

      return `
        <div class="indicator-card" data-indicator-id="${ind.id}">
          <div>
            <div class="ind-card-top">
              <span class="fmes-pill">${ind.fmes_code}</span>
              <span class="ind-status-pill ${statusClass}">&bull; ${statusText}</span>
            </div>
            <h4>${title}</h4>
          </div>

          <div>
            <div class="ind-metrics-row">
              <div class="ind-metric-box">
                <div class="metric-label">${isRw ? 'Itangiriro (2024)' : 'Baseline'}</div>
                <div class="metric-val">${ind.baseline_2024.toLocaleString()}</div>
              </div>
              <div class="ind-metric-box">
                <div class="metric-label" style="color: var(--color-emerald-400);">${isRw ? 'Ubu (2025)' : 'Current'}</div>
                <div class="metric-val" style="color: var(--color-emerald-400);">${ind.current_2025.toLocaleString()}</div>
              </div>
              <div class="ind-metric-box">
                <div class="metric-label">${isRw ? 'Intego (2026)' : 'Target'}</div>
                <div class="metric-val">${ind.target_2026.toLocaleString()}</div>
              </div>
            </div>

            <div class="ind-progress-container">
              <div class="ind-progress-labels">
                <span>${isRw ? 'Intambwe y\'Umusaruro' : 'Target Trajectory'}</span>
                <span style="font-weight: 700; color: var(--text-primary);">${pctProgress}%</span>
              </div>
              <div class="kpi-progress-bar-bg">
                <div class="kpi-progress-bar-fill" style="width: ${pctProgress}%;"></div>
              </div>
            </div>

            <button class="btn-open-modal" data-id="${ind.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              ${isRw ? 'Sesengura birambuye (MyPeg)' : 'Deep Dive Analysis (MyPeg)'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to deep dive buttons
    grid.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openModal(id);
      });
    });
  }

  openModal(indicatorId) {
    const indicator = this.data.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;

    this.activeIndicator = indicator;
    const isRw = i18n.currentLocale === 'rw';
    const narrative = i18n.getNarrative(indicator.id);

    const titleEl = document.getElementById('modal-title');
    const fmesPillEl = document.getElementById('modal-fmes-pill');
    const qaContainer = document.getElementById('modal-qa-container');
    const tableContainer = document.getElementById('modal-sites-table');
    const metaContainer = document.getElementById('modal-meta-container');
    const modalOverlay = document.getElementById('indicator-modal-overlay');

    if (titleEl) titleEl.textContent = narrative ? narrative.title : indicator.id;
    if (fmesPillEl) fmesPillEl.textContent = `${indicator.fmes_code} &bull; ${indicator.fmes_alignment}`;

    if (qaContainer && narrative) {
      qaContainer.innerHTML = `
        <div class="modal-qa-card">
          <h4>${isRw ? '1. Iki gipimo gisobanura iki?' : '1. What is this indicator?'}</h4>
          <p>${narrative.what_is}</p>
        </div>
        <div class="modal-qa-card">
          <h4>${isRw ? '2. Kuki ari ingenzi ku Mujyi wa Kigali?' : '2. Why does it matter for Kigali?'}</h4>
          <p>${narrative.why_matters}</p>
        </div>
        <div class="modal-qa-card">
          <h4>${isRw ? '3. Ni iki SUNCASA iri gukora?' : '3. What is SUNCASA doing?'}</h4>
          <p>${narrative.what_suncasa}</p>
        </div>
      `;
    }

    if (tableContainer && indicator.site_breakdown) {
      tableContainer.innerHTML = `
        <table class="site-breakdown-table">
          <thead>
            <tr>
              <th>${isRw ? 'Ikibaya cy\'Amazi / Ahantu' : 'Micro-Catchment / Intervention Zone'}</th>
              <th style="text-align: right;">${isRw ? 'Umusaruro Wagezweho' : 'Recorded Value'} (${indicator.unit})</th>
            </tr>
          </thead>
          <tbody>
            ${indicator.site_breakdown.map(row => `
              <tr>
                <td style="font-weight: 500;">${row.site}</td>
                <td style="text-align: right; font-weight: 700; color: var(--color-emerald-400);">${row.value.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (metaContainer) {
      metaContainer.innerHTML = `
        <div>
          <strong>${isRw ? 'Kode ya FMES:' : 'RFA FMES Alignment:'}</strong> ${indicator.fmes_code}
        </div>
        <div>
          <strong>${isRw ? 'Igipimo:' : 'Unit of Measurement:'}</strong> ${indicator.unit}
        </div>
        <div>
          <strong>${isRw ? 'Inkomoko:' : 'Verification Source:'}</strong> SUNCASA M&E Framework & RFA Field Audits
        </div>
      `;
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Render interactive chart
    setTimeout(() => {
      chartManager.renderModalTrendChart('modal-trend-canvas', indicator, isRw);
    }, 50);
  }

  closeModal() {
    const modalOverlay = document.getElementById('indicator-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      chartManager.destroy();
      this.activeIndicator = null;
    }
  }
}

export const indicatorExplorer = new IndicatorExplorer();
