'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Indicator } from '@/lib/db/types';
import IndicatorTrendChart from './IndicatorTrendChart';
import indicatorNarratives from '../data/locales/indicator_narratives.json';

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
      Loading GIS Catchment Map...
    </div>
  ),
});

interface MyPegIndicatorWorkspaceProps {
  indicator: Indicator;
  locale: 'en' | 'rw';
  onClose?: () => void;
  isModal?: boolean;
}

export default function MyPegIndicatorWorkspace({
  indicator,
  locale,
  onClose,
  isModal = false,
}: MyPegIndicatorWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'graphs' | 'map' | 'sdgs'>('description');
  const [selectedMapSite, setSelectedMapSite] = useState<any>(null);

  const isRw = locale === 'rw';

  // Get localized narrative
  const rawNarratives = indicatorNarratives as Record<string, any>;
  const itemNarrative = rawNarratives[indicator.id] || {};
  const narrative = itemNarrative[locale] || itemNarrative.en || {
    title: indicator.id,
    what_is: 'Data description pending...',
    why_matters: 'Civic significance pending...',
    what_suncasa: 'Project actions pending...',
    limitations: 'Measurement notes pending...',
    source: indicator.fmes_alignment,
  };

  const themeColors: Record<string, string> = {
    climate: '#0284c7',
    biodiversity: '#10b981',
    gesi: '#8b5cf6',
    economy: '#f59e0b',
  };

  const themeColor = themeColors[indicator.theme] || '#10b981';
  const pct = Math.min(100, Math.round((indicator.current_2025 / indicator.target_2026) * 100));

  // GeoJSON download
  const handleDownloadGeoJSON = () => {
    import('../data/geojson/intervention_sites.json').then((sites) => {
      const filteredFeatures = sites.features.filter(
        (f: any) => f.properties.theme === indicator.theme
      );
      const data = {
        type: 'FeatureCollection',
        indicator_id: indicator.id,
        theme: indicator.theme,
        features: filteredFeatures.length > 0 ? filteredFeatures : sites.features,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suncasa-${indicator.id}-catchments.geojson`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // JSON download
  const handleDownloadJSON = () => {
    const data = {
      indicator: indicator,
      narrative: narrative,
      exported_at: new Date().toISOString(),
      initiative: 'SUNCASA Kigali Nature-Based Solutions',
      funder: 'Global Affairs Canada',
      partners: ['IISD', 'WRI', 'City of Kigali', 'Rwanda Forestry Authority'],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suncasa-${indicator.id}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`mypeg-workspace ${isModal ? 'as-modal' : ''}`}>
      {/* Workspace Header Inspired by MyPeg */}
      <div className="mypeg-ws-header" style={{ borderTop: `4px solid ${themeColor}` }}>
        <div className="mypeg-ws-title-bar">
          <div className="mypeg-ws-meta">
            <span className="mypeg-theme-pill" style={{ backgroundColor: themeColor }}>
              {indicator.theme.toUpperCase()}
            </span>
            <span className="fmes-pill">{indicator.fmes_code}</span>
            <span className="ind-status-pill status-on-track">● {indicator.status}</span>
          </div>

          <div className="mypeg-ws-heading-row">
            <h2>{narrative.title || indicator.id}</h2>
            {isModal && onClose && (
              <button
                type="button"
                className="mypeg-ws-close-btn"
                onClick={onClose}
                aria-label="Close indicator workspace"
              >
                &times;
              </button>
            )}
          </div>

          <p className="mypeg-ws-alignment-text">
            <strong>{isRw ? 'Guhuza na Sisitemu ya RFA:' : 'RFA FMES Alignment:'}</strong> {indicator.fmes_alignment}
          </p>
        </div>

        {/* 4 MyPeg Signature Tabs */}
        <div className="mypeg-ws-tabs" role="tablist" aria-label="Indicator views">
          <button
            type="button"
            className={`mypeg-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            role="tab"
            aria-selected={activeTab === 'description'}
            style={{ '--active-color': themeColor } as any}
          >
            <span className="tab-icon">📖</span>
            <span>{isRw ? 'Ibisobanuro n\'Inkuru' : 'Description & Narrative'}</span>
          </button>

          <button
            type="button"
            className={`mypeg-tab-btn ${activeTab === 'graphs' ? 'active' : ''}`}
            onClick={() => setActiveTab('graphs')}
            role="tab"
            aria-selected={activeTab === 'graphs'}
            style={{ '--active-color': themeColor } as any}
          >
            <span className="tab-icon">📈</span>
            <span>{isRw ? 'Imbonerahamwe n\'Iterambere' : 'Graphs & Trends'}</span>
          </button>

          <button
            type="button"
            className={`mypeg-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
            role="tab"
            aria-selected={activeTab === 'map'}
            style={{ '--active-color': themeColor } as any}
          >
            <span className="tab-icon">🗺️</span>
            <span>{isRw ? 'Ikarita y\'Ibibaya' : 'Catchment Map'}</span>
          </button>

          <button
            type="button"
            className={`mypeg-tab-btn ${activeTab === 'sdgs' ? 'active' : ''}`}
            onClick={() => setActiveTab('sdgs')}
            role="tab"
            aria-selected={activeTab === 'sdgs'}
            style={{ '--active-color': themeColor } as any}
          >
            <span className="tab-icon">🎯</span>
            <span>{isRw ? 'Intego z\'Isi (UN SDGs)' : 'UN SDGs Alignment'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Body */}
      <div className="mypeg-ws-body">
        {/* TAB 1: DESCRIPTION / 3-TIER CIVIC STORY */}
        {activeTab === 'description' && (
          <div className="mypeg-tab-content description-tab">
            <div className="mypeg-story-grid">
              {/* Question 1: What is this indicator? */}
              <div className="mypeg-story-card highlight">
                <div className="story-card-number" style={{ background: themeColor }}>1</div>
                <div className="story-card-body">
                  <h4>{isRw ? '1. Iki gipimo gisobanura iki?' : '1. What is this indicator?'}</h4>
                  <p>{narrative.what_is}</p>
                </div>
              </div>

              {/* Question 2: Why does it matter for Kigali? */}
              <div className="mypeg-story-card highlight">
                <div className="story-card-number" style={{ background: themeColor }}>2</div>
                <div className="story-card-body">
                  <h4>{isRw ? '2. Kuki ari ingenzi ku Mujyi wa Kigali?' : '2. Why does this matter for Kigali?'}</h4>
                  <p>{narrative.why_matters}</p>
                </div>
              </div>

              {/* Question 3: What is SUNCASA doing? */}
              <div className="mypeg-story-card highlight">
                <div className="story-card-number" style={{ background: themeColor }}>3</div>
                <div className="story-card-body">
                  <h4>{isRw ? '3. Ni iki SUNCASA iri gukora?' : '3. What is SUNCASA doing?'}</h4>
                  <p>{narrative.what_suncasa}</p>
                </div>
              </div>
            </div>

            {/* Measurement & Methodology Box */}
            <div className="mypeg-methodology-strip">
              <div className="methodology-item">
                <h5>{isRw ? 'Uburyo bupimwamo n\'Imbogamizi' : 'Measurement Methodology & Limitations'}</h5>
                <p>{narrative.limitations || indicator.measurement_method || 'Verified through RFA silvicultural audits and digital GIS monitoring.'}</p>
              </div>

              <div className="methodology-item">
                <h5>{isRw ? 'Inkomoko y\'Amakuru' : 'Data Source & Verification'}</h5>
                <p>{narrative.source || indicator.data_source_citation || 'Rwanda Forestry Authority (RFA) & City of Kigali'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRAPHS & TRENDS */}
        {activeTab === 'graphs' && (
          <div className="mypeg-tab-content graphs-tab">
            <IndicatorTrendChart indicator={indicator} themeColor={themeColor} locale={locale} />
          </div>
        )}

        {/* TAB 3: CATCHMENT MAP & GEOGRAPHY */}
        {activeTab === 'map' && (
          <div className="mypeg-tab-content map-tab">
            <div className="mypeg-map-layout">
              <div className="mypeg-map-canvas-wrapper" style={{ height: '380px', borderRadius: '12px', overflow: 'hidden' }}>
                <CatchmentMap
                  locale={locale}
                  themeFilter={indicator.theme}
                  onSelectSite={(props) => setSelectedMapSite(props)}
                />
              </div>

              <div className="mypeg-map-info-card">
                <h4>{isRw ? 'Ibisobanuro by\'Agace' : 'Active Catchment Details'}</h4>
                {selectedMapSite ? (
                  <div className="site-details-compact">
                    <h5>{isRw ? (selectedMapSite.name_rw || selectedMapSite.name) : selectedMapSite.name}</h5>
                    <p className="site-district-label">
                      {selectedMapSite.district} &bull; {selectedMapSite.fmes_compartment || selectedMapSite.fmes_code}
                    </p>
                    <div className="site-mini-metrics">
                      {selectedMapSite.area_ha && (
                        <div>
                          <span>{isRw ? 'Ubuso:' : 'Area:'}</span>
                          <strong>{selectedMapSite.area_ha} ha</strong>
                        </div>
                      )}
                      {selectedMapSite.trees_planted && (
                        <div>
                          <span>{isRw ? 'Ibiti:' : 'Trees:'}</span>
                          <strong>{selectedMapSite.trees_planted.toLocaleString()}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="map-empty-hint">
                    {isRw
                      ? 'Kanda ku kadomo cyangwa agace k\'amazi ku ikarita kugira ngo ubone amakuru yako.'
                      : 'Click any site pin or micro-catchment on the map to inspect intervention details.'}
                  </p>
                )}

                <div className="map-actions-row">
                  <button
                    type="button"
                    className="mypeg-btn-dl"
                    onClick={handleDownloadGeoJSON}
                  >
                    🗺️ {isRw ? 'Kuramo Ikarita (GeoJSON)' : 'Download Geography (GeoJSON)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UN SUSTAINABLE DEVELOPMENT GOALS (SDGS) */}
        {activeTab === 'sdgs' && (
          <div className="mypeg-tab-content sdgs-tab">
            <div className="mypeg-sdgs-header">
              <h3>{isRw ? 'Guhuza n\'Intego z\'Isi (UN SDGs)' : 'United Nations Sustainable Development Goals'}</h3>
              <p>
                {isRw
                  ? 'Iki gipimo cyo gusana ikibaya cya Nyabarongo gishyigikira intego z\'iterambere rirambye zashyizweho n\'Umuryango w\'Abibumbye.'
                  : 'How Kigali\'s watershed restoration directly contributes to global targets under the United Nations 2030 Agenda.'}
              </p>
            </div>

            <div className="sdg-cards-grid">
              {(indicator.sdgs || [
                {
                  sdg_number: 15,
                  sdg_title: '15. Life on Land',
                  target_code: '15.2',
                  target_desc: 'Promote the implementation of sustainable management of all types of forests and halt deforestation.',
                  color: '#56c02b',
                },
                {
                  sdg_number: 13,
                  sdg_title: '13. Climate Action',
                  target_code: '13.1',
                  target_desc: 'Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters.',
                  color: '#3f7e44',
                },
              ]).map((sdg) => (
                <div
                  key={sdg.sdg_number}
                  className="sdg-card"
                  style={{ borderLeft: `6px solid ${sdg.color}` }}
                >
                  <div className="sdg-card-header">
                    <div className="sdg-number-badge" style={{ backgroundColor: sdg.color }}>
                      SDG {sdg.sdg_number}
                    </div>
                    <h4>{sdg.sdg_title}</h4>
                  </div>
                  <div className="sdg-target-box">
                    <span className="target-code-tag" style={{ color: sdg.color }}>
                      {isRw ? 'Intego' : 'Target'} {sdg.target_code}
                    </span>
                    <p>{sdg.target_desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Workspace Footer: Open Access Download Bar */}
      <div className="mypeg-ws-footer">
        <div className="open-data-badge">
          <span>🔓 {isRw ? 'Amakuru Afunguye kuri Bose (Open Data)' : 'Open Data Architecture (IISD / RFA FMES)'}</span>
        </div>

        <div className="mypeg-ws-footer-actions">
          <button
            type="button"
            className="btn-download-outline"
            onClick={handleDownloadGeoJSON}
          >
            📥 {isRw ? 'Kuramo GeoJSON' : 'Download Geography'}
          </button>
          <button
            type="button"
            className="btn-download-outline"
            onClick={handleDownloadJSON}
          >
            📊 {isRw ? 'Kuramo JSON' : 'Download Data'}
          </button>
          {isModal && onClose && (
            <button
              type="button"
              className="btn-export-brief"
              onClick={onClose}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {isRw ? 'Funga' : 'Close Workspace'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
