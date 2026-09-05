'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Indicator } from '@/lib/db/types';
import indicatorNarratives from '../data/locales/indicator_narratives.json';
import enLocale from '../data/locales/en.json';
import rwLocale from '../data/locales/rw.json';
import { useLocale } from './MyPegAppShell';

// Register all Chart.js controllers and elements (LineController, scales, etc.)
ChartJS.register(...registerables);

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Loading GIS Map Layer...
    </div>
  ),
});

interface MyPegIndicatorChartViewProps {
  indicator: Indicator;
  themeColor?: string;
  locale?: 'en' | 'rw';
  onBackToHero?: () => void;
}

export default function MyPegIndicatorChartView({
  indicator,
  themeColor = '#eb6b23',
  locale: propLocale,
  onBackToHero,
}: MyPegIndicatorChartViewProps) {
  const { locale: contextLocale } = useLocale();
  const locale = propLocale || contextLocale || 'en';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'story' | 'map' | 'sdgs'>('graph');
  const [selectedMapFeature, setSelectedMapFeature] = useState<any>(null);

  const t = locale === 'rw' ? rwLocale : enLocale;

  // Retrieve localized story / narrative
  const narrativeItem = (indicatorNarratives as Record<string, any>)[indicator.id];
  const story = narrativeItem ? (narrativeItem[locale] || narrativeItem.en) : null;

  // Clean indicator title
  const displayTitle = story?.title || indicator.definition
    ? (story?.title || indicator.id.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : indicator.id;

  // Subtitle definition matching Screenshot 2
  const displayDefinition =
    indicator.definition ||
    story?.what_is ||
    `Tracks progress, trends, and catchment distribution for ${displayTitle}.`;

  const legendLabel = indicator.legend_label || (locale === 'rw' ? 'Kigali (Umujyi & Ikibaya)' : 'Winnipeg (City)');

  // Render the exact Chart.js Line Chart seen in Screenshot 2
  useEffect(() => {
    if (activeTab !== 'graph') return;
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const history = indicator.trend_history || [];
    const labels = history.map((h) => h.period);
    const dataValues = history.map((h) => h.value);

    // Blue curve `#1e88e5` matching Screenshot 2
    const lineColor = '#1e88e5';

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: legendLabel,
            data: dataValues,
            borderColor: lineColor,
            backgroundColor: 'transparent',
            borderWidth: 2.6,
            tension: 0.1, // Clean crisp line segments matching Screenshot 2
            pointBackgroundColor: '#ffffff',
            pointBorderColor: lineColor,
            pointBorderWidth: 2.2,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: lineColor,
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              boxWidth: 28,
              boxHeight: 12,
              color: '#334155',
              font: {
                family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                size: 13,
                weight: 'normal',
              },
              usePointStyle: false,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y;
                return ` ${legendLabel}: ${val !== null ? val.toLocaleString() : '--'} ${indicator.unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(226, 232, 240, 0.8)',
              lineWidth: 1,
            },
            ticks: {
              color: '#475569',
              font: {
                family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                size: 11,
              },
              maxRotation: 0,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.8)',
              lineWidth: 1,
            },
            ticks: {
              color: '#475569',
              font: {
                family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                size: 11,
              },
              callback: (value) => {
                if (typeof value === 'number') {
                  return value.toLocaleString();
                }
                return value;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [indicator, legendLabel, activeTab]);

  // CSV Download handler for "Download Graph Data for All Years"
  const handleDownloadCSV = () => {
    const history = indicator.trend_history || [];
    let csvContent = 'Year / Period,Value,Unit,Location\n';
    history.forEach((h) => {
      csvContent += `"${h.period}",${h.value},"${indicator.unit}","${legendLabel}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${indicator.id}_all_years_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mypeg-chart-view-section">
      {/* Top Theme-Colored Accent Line (Screenshot 2) */}
      <div
        className="mypeg-chart-top-accent"
        style={{ backgroundColor: themeColor }}
      />

      <div className="mypeg-chart-content-container">
        {/* Navigation & Breadcrumb Header */}
        <div className="mypeg-chart-header-row">
          <div className="mypeg-chart-theme-pill" style={{ color: themeColor, borderColor: `${themeColor}44` }}>
            {indicator.theme.toUpperCase().replace('_', ' ')} &bull; {indicator.fmes_code}
          </div>
          {onBackToHero && (
            <button
              type="button"
              className="mypeg-btn-back-hero"
              onClick={onBackToHero}
              title="Return to Hero & Overview"
            >
              ← Back to Hero
            </button>
          )}
        </div>

        {/* Large Serif Title (Screenshot 2) */}
        <h1 className="mypeg-chart-title">{displayTitle}</h1>

        {/* Narrative Definition Subtitle (Screenshot 2) */}
        <p className="mypeg-chart-subtitle">{displayDefinition}</p>

        {/* MyPeg Navigation Tabs */}
        <div className="mypeg-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'graph'}
            className={`mypeg-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            📊 {locale === 'rw' ? 'Igishushanyo (Graph)' : 'Graph & Data'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'story'}
            className={`mypeg-tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            📖 {locale === 'rw' ? 'Inkuru y\'Igipimo (The Story)' : 'The Story (3 Questions)'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'map'}
            className={`mypeg-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ {locale === 'rw' ? 'Ikarita ya GIS' : 'Micro-Catchment Map'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sdgs'}
            className={`mypeg-tab-btn ${activeTab === 'sdgs' ? 'active' : ''}`}
            onClick={() => setActiveTab('sdgs')}
          >
            🎯 {locale === 'rw' ? 'Intego za UN (SDGs)' : 'UN SDGs & Metadata'}
          </button>
        </div>

        {/* TAB 1: Graph View (Exact Match to Screenshot 2) */}
        {activeTab === 'graph' && (
          <div className="mypeg-graph-tab-body">
            <div className="mypeg-canvas-wrapper" style={{ height: '440px', position: 'relative', width: '100%' }}>
              <canvas ref={canvasRef} id="mypeg-indicator-line-chart" />
            </div>

            {/* "Download Graph Data for All Years" Centered Link (Screenshot 2) */}
            <div className="mypeg-download-link-wrap">
              <button
                type="button"
                className="mypeg-download-graph-link"
                onClick={handleDownloadCSV}
                title="Download CSV data for all years"
              >
                Download Graph Data for All Years
              </button>
            </div>

            {/* Micro-Catchment Spatial Breakdown Cards */}
            {indicator.site_breakdown && indicator.site_breakdown.length > 0 && (
              <div className="mypeg-breakdown-subgrid">
                <h4 style={{ color: '#334155', marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
                  Spatial & Sector Breakdown
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  {indicator.site_breakdown.map((s, idx) => (
                    <div key={idx} className="mypeg-breakdown-card">
                      <div className="breakdown-card-label">{s.site}</div>
                      <div className="breakdown-card-val" style={{ color: themeColor }}>
                        {s.value.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{indicator.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: The Story (3 Core Questions) */}
        {activeTab === 'story' && (
          <div className="mypeg-story-tab-body">
            <div className="story-question-box">
              <div className="story-question-header">
                <span className="question-number-pill">1</span>
                <h3>{locale === 'rw' ? 'Iki gipimo ni iki kandi gipima iki?' : 'What is this indicator and what does it measure?'}</h3>
              </div>
              <p className="story-answer-text">
                {story?.what_is || displayDefinition}
              </p>
            </div>

            <div className="story-question-box">
              <div className="story-question-header">
                <span className="question-number-pill">2</span>
                <h3>{locale === 'rw' ? 'Kuki iki gipimo gifite akamaro kenshi?' : 'Why does this indicator matter to the community?'}</h3>
              </div>
              <p className="story-answer-text">
                {story?.why_matters ||
                  'High-fidelity monitoring provides citizens, municipal planners, and community leadership with empirical data to verify development outcomes.'}
              </p>
            </div>

            <div className="story-question-box">
              <div className="story-question-header">
                <span className="question-number-pill">3</span>
                <h3>{locale === 'rw' ? 'Ni iki kirimo gukorwa cyangwa twakora?' : 'What is being done and what actions can be taken?'}</h3>
              </div>
              <p className="story-answer-text">
                {story?.what_suncasa ||
                  'Through inter-agency collaboration between the City of Kigali, Rwanda Forestry Authority (RFA), IISD, and WRI, evidence-based investments are directed into high-impact zones.'}
              </p>
            </div>

            {/* Full 5-Part Metadata Standard (RFP Section 4.4) */}
            <div className="story-meta-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 20px', marginTop: '24px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {locale === 'rw' ? 'Amakuru y\'Ububiko bw\'Igipimo (Metadata)' : 'Indicator Metadata & Data Lineage (RFP Standard)'}
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                    {locale === 'rw' ? '1. Inkomoko y\'Amakuru (Data Source)' : '1. Data Source'}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                    {indicator.data_source_citation || story?.source || 'RFA Forest Management Evaluation System (FMES)'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                    {locale === 'rw' ? '2. Urwego Rubishinzwe (Responsible Agency)' : '2. Responsible Data Provider'}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                    {indicator.theme === 'mypeg_benchmark' ? 'City of Winnipeg & Statistics Canada' : 'Rwanda Forestry Authority (RFA) & City of Kigali'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                    {locale === 'rw' ? '3. Igihe Amakuru Yavuguruwe (Latest Update)' : '3. Date of Latest Update'}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                    {indicator.theme === 'mypeg_benchmark' ? 'Annual Archive (2024)' : 'Q2 2025 (Bi-Annual Cycle)'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                    {locale === 'rw' ? '4. Kode ya FMES (System Code)' : '4. FMES Interoperability Code'}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: 700 }}>
                    {indicator.fmes_code} &bull; {indicator.fmes_alignment || 'Forest Evaluation Layer'}
                  </span>
                </div>
              </div>

              {/* 5. Limitations / Caveats */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b91c1c', display: 'block', marginBottom: '2px' }}>
                  {locale === 'rw' ? '5. Imipaka n\'Ibyitonderwa (Limitations & Caveats):' : '5. Methodological Limitations & Caveats:'}
                </span>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {story?.limitations || 'Data reflects verified field audits; micro-catchment spatial variance may apply across distinct elevation zones.'}
                </p>
              </div>

              {indicator.measurement_method && (
                <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#64748b' }}>
                  <strong>{locale === 'rw' ? 'Uburyo bwakoreshejwe:' : 'Measurement Method:'}</strong> {indicator.measurement_method}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Catchment Map View (RFP Spatial Integration) */}
        {activeTab === 'map' && (
          <div className="mypeg-map-tab-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {locale === 'rw' ? 'Ikarita ya GIS y\'Ikibaya n\'Ibyakozwe' : 'Spatial Catchment & Intervention GIS Map'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  {locale === 'rw'
                    ? 'Ikarita igaragaza uko iki gipimo cyifashe mu mirenge no mu mikoki ya Nyabarongo, Yanze, Mpazi, na Mont Kigali.'
                    : 'Interactive micro-catchment choropleth, georeferenced intervention nodes, and FMES spatial alignment across the Lower Nyabarongo watershed.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', color: '#475569', fontWeight: 600 }}>
                  FMES Layer: <strong style={{ color: themeColor }}>{indicator.fmes_code}</strong>
                </span>
              </div>
            </div>

            {/* Interactive Map Container */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <CatchmentMap
                currentIndicator={indicator}
                locale={locale}
                height={520}
                onSelectSite={(props) => setSelectedMapFeature(props)}
              />
            </div>

            {/* Micro-Catchment Spatial Breakdown Table & Selected Inspector */}
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: selectedMapFeature ? '2fr 1fr' : '1fr', gap: '18px' }}>
              {/* Spatial Breakdown Cards */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0' }}>
                  {locale === 'rw' ? 'Ikwirakwizwa mu Mikoki ya Kigali' : 'Micro-Catchment Spatial Breakdown (Field Survey)'}
                </h4>

                {indicator.site_breakdown && indicator.site_breakdown.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {indicator.site_breakdown.map((s, idx) => {
                      const totalVal = indicator.site_breakdown!.reduce((acc, curr) => acc + curr.value, 0);
                      const sharePct = totalVal > 0 ? Math.round((s.value / totalVal) * 100) : 0;
                      return (
                        <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{s.site}</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: themeColor, marginTop: '2px' }}>
                            {s.value.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{indicator.unit}</span>
                          </div>
                          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${sharePct}%`, height: '100%', background: themeColor }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{sharePct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                    Telemetry aggregated across all Lower Nyabarongo operational compartments.
                  </p>
                )}
              </div>

              {/* Selected Feature Card */}
              {selectedMapFeature && (
                <div style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.68rem', background: themeColor, color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedMapFeature.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedMapFeature(null)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0 2px 0', color: '#ffffff' }}>
                    {locale === 'rw' ? selectedMapFeature.name_rw || selectedMapFeature.name : selectedMapFeature.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {selectedMapFeature.district} &bull; {selectedMapFeature.fmes_compartment || selectedMapFeature.fmes_code}
                  </div>

                  {selectedMapFeature.indicatorValue !== undefined && (
                    <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verified Indicator Value</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                        {selectedMapFeature.indicatorValue?.toLocaleString()} {indicator.unit}
                      </div>
                    </div>
                  )}

                  {selectedMapFeature.priority_intervention && (
                    <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: '10px', lineHeight: 1.4 }}>
                      <strong>Intervention:</strong> {selectedMapFeature.priority_intervention}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: UN SDGs & Metadata */}
        {activeTab === 'sdgs' && (
          <div className="mypeg-sdgs-tab-body">
            <h3 style={{ color: '#1e293b', marginBottom: '14px', fontSize: '1.2rem' }}>
              United Nations Sustainable Development Goals (SDGs)
            </h3>
            <div className="sdgs-cards-grid">
              {(indicator.sdgs || [
                {
                  sdg_number: 11,
                  sdg_title: '11. Sustainable Cities & Communities',
                  target_code: '11.3',
                  target_desc: 'Enhance inclusive and sustainable urbanization.',
                  color: '#f99d26',
                },
                {
                  sdg_number: 13,
                  sdg_title: '13. Climate Action',
                  target_code: '13.1',
                  target_desc: 'Strengthen resilience to climate hazards.',
                  color: '#3f7e44',
                },
              ]).map((sdg, idx) => (
                <div key={idx} className="sdg-badge-card" style={{ borderLeftColor: sdg.color }}>
                  <div className="sdg-card-top">
                    <span className="sdg-num-tag" style={{ backgroundColor: sdg.color }}>
                      SDG {sdg.sdg_number}
                    </span>
                    <span className="sdg-target-code">Target {sdg.target_code}</span>
                  </div>
                  <h4 style={{ color: '#0f172a', margin: '8px 0 4px 0', fontSize: '0.98rem' }}>{sdg.sdg_title}</h4>
                  <p style={{ color: '#475569', fontSize: '0.86rem', lineHeight: 1.5 }}>{sdg.target_desc}</p>
                </div>
              ))}
            </div>

            <div className="fmes-interop-box" style={{ marginTop: '24px' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>RFA-FMES Interoperability Alignment</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                Aligned with Rwanda Forestry Authority Forest Management Evaluation System: <strong>{indicator.fmes_alignment}</strong> ({indicator.fmes_code}).
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
