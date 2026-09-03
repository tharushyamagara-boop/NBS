'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Indicator } from '@/lib/db/types';
import enLocale from '../data/locales/en.json';
import rwLocale from '../data/locales/rw.json';
import indicatorNarratives from '../data/locales/indicator_narratives.json';

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => <div style={{ height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading GIS Catchment Map...</div>
});

export default function Home() {
  const [locale, setLocale] = useState<'en' | 'rw'>('en');
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [activeTheme, setActiveTheme] = useState('all');
  const [spotlightTheme, setSpotlightTheme] = useState('climate');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndicator, setActiveIndicator] = useState<Indicator | null>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [dbDriver, setDbDriver] = useState<string>('Loading...');

  const t = locale === 'rw' ? rwLocale : enLocale;

  const getNarrative = (id: string) => {
    const item = (indicatorNarratives as Record<string, any>)[id];
    if (!item) return null;
    return item[locale] || item.en;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration skipped:', err);
        });
      });
    }

    fetch('/api/indicators')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIndicators(data.data);
          setDbDriver(data.driver);
        }
      })
      .catch(err => console.error('Failed to load indicators:', err));
  }, []);

  const filteredIndicators = indicators.filter(ind => {
    if (activeTheme !== 'all' && ind.theme !== activeTheme) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const narrative = getNarrative(ind.id);
      const title = narrative ? narrative.title.toLowerCase() : ind.id.toLowerCase();
      return title.includes(q) || ind.fmes_code.toLowerCase().includes(q) || ind.theme.toLowerCase().includes(q);
    }
    return true;
  });

  const featuredKPIs = indicators.filter(ind => ind.featured_in_hero);
  const currentThemeInfo = (t.themes as any)[spotlightTheme] || (enLocale.themes as any)[spotlightTheme];

  return (
    <>
      <header className="header" id="main-header">
        <div className="container header-inner">
          <div className="brand-wrapper">
            <div className="brand-logo-badge">SK</div>
            <div className="brand-text">
              <h1>
                <span>SUNCASA Kigali</span>
                <span className="country-pill">APP ROUTER PWA</span>
              </h1>
              <p>{t.brand.subtitle}</p>
            </div>
          </div>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#overview-section" className="nav-link active">{t.nav.overview}</a></li>
              <li><a href="#themes-section" className="nav-link">{t.nav.themes}</a></li>
              <li><a href="#map-section" className="nav-link">{t.nav.map}</a></li>
              <li><a href="#indicators-section" className="nav-link">{t.nav.indicators}</a></li>
              <li><Link href="/admin" className="nav-link" style={{ color: '#38bdf8', fontWeight: 600 }}>⚙️ Admin Portal</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="lang-switcher" role="group" aria-label="Language Selector">
              <button
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                onClick={() => setLocale('en')}
                type="button"
              >
                EN
              </button>
              <button
                className={`lang-btn ${locale === 'rw' ? 'active' : ''}`}
                onClick={() => setLocale('rw')}
                type="button"
              >
                RW
              </button>
            </div>

            <button className="btn-export-brief" onClick={() => window.print()} type="button">
              <span>{t.nav.export}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="overview-section">
          <div className="container">
            <div className="hero-badge-row">
              <div className="badge-pill">
                <span className="pulse-dot"></span>
                <span>{t.hero.badge}</span>
              </div>
              <span className="partner-tag">{t.brand.funder_tag} &bull; <span style={{ color: '#10b981' }}>DB: {dbDriver}</span></span>
            </div>

            <div className="hero-content">
              <h2 className="hero-title">{t.hero.headline}</h2>
              <p className="hero-subtitle">{t.hero.subheadline}</p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#indicators-section" className="btn-export-brief" style={{ padding: '10px 22px', fontSize: '0.95rem' }}>
                  {t.hero.cta_explore} &rarr;
                </a>
                <a href="#map-section" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                  {t.hero.cta_map}
                </a>
              </div>
            </div>

            {/* 4 Hero KPI Cards */}
            <div className="hero-kpis-grid">
              {featuredKPIs.map(ind => {
                const narrative = getNarrative(ind.id);
                const title = narrative ? narrative.title : ind.id;
                const pct = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));
                const colors: any = { climate: '#0284c7', biodiversity: '#10b981', gesi: '#8b5cf6', economy: '#f59e0b' };
                return (
                  <div key={ind.id} className="kpi-card" style={{ '--card-accent': colors[ind.theme] || '#10b981' } as any}>
                    <div className="kpi-header">
                      <span className="kpi-theme-tag">{ind.theme}</span>
                      <span className="fmes-pill">{ind.fmes_code}</span>
                    </div>
                    <div className="kpi-value-row">
                      <span className="kpi-value">{ind.current_2025.toLocaleString()}</span>
                      <span className="kpi-unit">{ind.unit}</span>
                    </div>
                    <div className="kpi-label">{title}</div>
                    <div className="kpi-progress-bar-bg">
                      <div className="kpi-progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="kpi-footer">
                      <span>{pct}% {locale === 'rw' ? "by'intego" : 'of 2026 target'}</span>
                      <span className="kpi-status-badge">&bull; {ind.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Thematic Pillars (MyPeg 3-Questions) */}
        <section className="themes-section" id="themes-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">{t.nav.themes}</div>
              <h2 className="section-title">Strategic Intervention Dimensions</h2>
              <p className="section-subtitle">
                Aligned with SUNCASA's four core communication themes, linking upstream ecological restoration to urban resilience, biodiversity, social equity, and economic opportunities.
              </p>
            </div>

            <div className="theme-nav-pills">
              {['climate', 'biodiversity', 'gesi', 'economy'].map(th => (
                <button
                  key={th}
                  className={`theme-pill-btn ${spotlightTheme === th ? 'active' : ''}`}
                  onClick={() => setSpotlightTheme(th)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{(t.themes as any)[th]?.name || th}</span>
                </button>
              ))}
            </div>

            {currentThemeInfo && (
              <div className="thematic-spotlight">
                <div className="thematic-spotlight-text">
                  <div className="section-tag">{currentThemeInfo.name}</div>
                  <h3>{currentThemeInfo.headline}</h3>
                  <p>{currentThemeInfo.short_desc}</p>
                </div>

                <div className="mypeg-three-questions-box">
                  <div className="question-item">
                    <h4>{locale === 'rw' ? '1. Iki gikorwa ni iki?' : '1. What is this action?'}</h4>
                    <p>{currentThemeInfo.what_is_it}</p>
                  </div>
                  <div className="question-item">
                    <h4>{locale === 'rw' ? '2. Kuki ari ingenzi ku Mujyi wa Kigali?' : '2. Why does it matter for Kigali?'}</h4>
                    <p>{currentThemeInfo.why_it_matters}</p>
                  </div>
                  <div className="question-item">
                    <h4>{locale === 'rw' ? '3. Ni iki SUNCASA iri gukora?' : '3. What is SUNCASA doing?'}</h4>
                    <p>{currentThemeInfo.what_suncasa_does}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Catchment Map Section */}
        <section className="map-section" id="map-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">{t.nav.map}</div>
              <h2 className="section-title">{t.map_section.title}</h2>
              <p className="section-subtitle">{t.map_section.subtitle}</p>
            </div>

            <div className="map-layout">
              <div className="map-viewport-container">
                <CatchmentMap locale={locale} themeFilter="all" onSelectSite={(props) => setSelectedSite(props)} />
              </div>

              <div className="map-site-panel">
                {selectedSite ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="fmes-pill">{selectedSite.fmes_compartment || selectedSite.fmes_code}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#38bdf8' }}>
                      {locale === 'rw' ? (selectedSite.name_rw || selectedSite.name) : selectedSite.name}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '14px' }}>
                      {selectedSite.district} &bull; {selectedSite.type}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                      <div className="ind-metric-box">
                        <div className="metric-label">{locale === 'rw' ? 'Ubuso (Ha)' : 'Area (ha)'}</div>
                        <div className="metric-val">{selectedSite.area_ha || '--'}</div>
                      </div>
                      <div className="ind-metric-box">
                        <div className="metric-label">{locale === 'rw' ? 'Ibiti Byatewe' : 'Trees Planted'}</div>
                        <div className="metric-val" style={{ color: '#10b981' }}>{selectedSite.trees_planted?.toLocaleString() || '--'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8' }}>Click any catchment polygon or marker on the map to inspect intervention details.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Indicators Section */}
        <section className="indicators-section" id="indicators-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">{t.nav.indicators}</div>
              <h2 className="section-title">{t.indicator_explorer.title}</h2>
              <p className="section-subtitle">{t.indicator_explorer.subtitle}</p>
            </div>

            <div className="filter-toolbar">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder={t.indicator_explorer.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="theme-filter-chips">
                {['all', 'climate', 'biodiversity', 'gesi', 'economy'].map(theme => (
                  <button
                    key={theme}
                    className={`filter-chip ${activeTheme === theme ? 'active' : ''}`}
                    onClick={() => setActiveTheme(theme)}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{theme}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="indicators-grid">
              {filteredIndicators.map(ind => {
                const narrative = getNarrative(ind.id);
                const title = narrative ? narrative.title : ind.id;
                const pct = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));

                return (
                  <div key={ind.id} className="indicator-card">
                    <div>
                      <div className="ind-card-top">
                        <span className="fmes-pill">{ind.fmes_code}</span>
                        <span className="ind-status-pill status-on-track">&bull; {ind.status}</span>
                      </div>
                      <h4>{title}</h4>
                    </div>

                    <div>
                      <div className="ind-metrics-row">
                        <div className="ind-metric-box">
                          <div className="metric-label">{locale === 'rw' ? 'Itangiriro' : 'Baseline'}</div>
                          <div className="metric-val">{ind.baseline_2024.toLocaleString()}</div>
                        </div>
                        <div className="ind-metric-box">
                          <div className="metric-label" style={{ color: '#10b981' }}>{locale === 'rw' ? 'Ubu (2025)' : 'Current'}</div>
                          <div className="metric-val" style={{ color: '#10b981' }}>{ind.current_2025.toLocaleString()}</div>
                        </div>
                        <div className="ind-metric-box">
                          <div className="metric-label">{locale === 'rw' ? 'Intego' : 'Target'}</div>
                          <div className="metric-val">{ind.target_2026.toLocaleString()}</div>
                        </div>
                      </div>

                      <button className="btn-open-modal" onClick={() => setActiveIndicator(ind)}>
                        {locale === 'rw' ? 'Sesengura birambuye (MyPeg)' : 'Deep Dive Analysis (MyPeg)'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Modal for MyPeg Storytelling */}
      {activeIndicator && (
        <div className="modal-overlay open" onClick={() => setActiveIndicator(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <span className="fmes-pill" style={{ marginBottom: '6px', display: 'inline-block' }}>
                  {activeIndicator.fmes_code} &bull; {activeIndicator.fmes_alignment}
                </span>
                <h3>{getNarrative(activeIndicator.id)?.title || activeIndicator.id}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveIndicator(null)} type="button">&times;</button>
            </div>

            <div className="modal-body">
              {(() => {
                const n = getNarrative(activeIndicator.id);
                if (!n) return null;
                return (
                  <div className="modal-qa-grid">
                    <div className="modal-qa-card">
                      <h4>{locale === 'rw' ? '1. Iki gipimo gisobanura iki?' : '1. What is this indicator?'}</h4>
                      <p>{n.what_is}</p>
                    </div>
                    <div className="modal-qa-card">
                      <h4>{locale === 'rw' ? '2. Kuki ari ingenzi ku Mujyi wa Kigali?' : '2. Why does it matter for Kigali?'}</h4>
                      <p>{n.why_matters}</p>
                    </div>
                    <div className="modal-qa-card">
                      <h4>{locale === 'rw' ? '3. Ni iki SUNCASA iri gukora?' : '3. What is SUNCASA doing?'}</h4>
                      <p>{n.what_suncasa}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>SUNCASA Kigali NbS Impact Platform (PWA)</strong>
            <p style={{ marginTop: '6px', maxWidth: '600px' }}>{t.footer.about}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>{t.footer.rights}</p>
            <p style={{ marginTop: '6px', fontSize: '0.78rem', color: '#10b981' }}>
              App Router Mode &bull; Connected Driver: {dbDriver} &bull; <Link href="/admin" style={{ color: '#38bdf8' }}>Admin Settings</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
