'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MyPegRadialEmblem from './MyPegRadialEmblem';
import CivicStoryCards from './CivicStoryCards';
import indicatorsData from '@/data/indicators.json';
import { Indicator } from '@/lib/db/types';

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Loading GIS Catchment Map...
    </div>
  ),
});

interface MyPegHeroViewProps {
  onSelectIndicator?: (indicatorId: string) => void;
  locale?: 'en' | 'rw';
}

export default function MyPegHeroView({
  onSelectIndicator,
  locale = 'en',
}: MyPegHeroViewProps) {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const indicators = indicatorsData.indicators as Indicator[];

  const scrollToOverview = () => {
    const el = document.getElementById('suncasa-overview-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Primary Headline KPIs (RFP Section 7.1)
  const headlineKpiIds = [
    'area_restored_ha',
    'trees_planted',
    'women_leadership_catchment',
    'green_jobs_created',
  ];
  const headlineKPIs = headlineKpiIds
    .map((id) => indicators.find((i) => i.id === id))
    .filter(Boolean) as Indicator[];

  const themeColors: Record<string, string> = {
    climate: '#0284c7',
    biodiversity: '#10b981',
    gesi: '#8b5cf6',
    economy: '#f59e0b',
  };

  return (
    <div className="mypeg-hero-page-wrapper">
      {/* 1. Full-Screen Visual Hero Section (Matches Screenshot 1) */}
      <section
        className="mypeg-visual-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.58)), url('/images/mypeg_hero_bg.jpg')`,
        }}
      >
        <div className="mypeg-hero-center-content">
          {/* Central 12-Arrow Inward-Pointing Radial Wheel */}
          <div className="mypeg-emblem-wrap">
            <MyPegRadialEmblem size={240} />
          </div>

          {/* Primary Tagline */}
          <h1 className="mypeg-hero-tagline">
            TRACKING PROGRESS. INSPIRING ACTION.
          </h1>

          {/* Downward Scroll Button */}
          <button
            type="button"
            className="mypeg-hero-scroll-btn"
            onClick={scrollToOverview}
            title={locale === 'rw' ? 'Komeza hasi' : 'Scroll down to overview'}
            aria-label="Scroll down"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 2. SUNCASA Kigali Overview & 4 Headline Theme KPIs (RFP Section 7.1) */}
      <section className="suncasa-overview-section" id="suncasa-overview-section" style={{ padding: '60px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              {locale === 'rw' ? 'Ibisubizo Kamere i Kigali' : 'Nature-Based Solutions in Kigali'}
            </span>
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '2.2rem',
                color: '#1e293b',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {locale === 'rw'
                ? 'Gusana Ikibaya cya Nyabarongo yo Hasi'
                : 'Restoring Kigali’s Lower Nyabarongo Watershed'}
            </h2>
            <p style={{ marginTop: '14px', fontSize: '1.02rem', color: '#64748b', lineHeight: 1.6 }}>
              {locale === 'rw'
                ? 'Gahunda ya SUNCASA iterwa inkunga na Global Affairs Canada, ikayoborwa na IISD na WRI ku bufatanye n\'Umujyi wa Kigali na RFA. Igamije guca amaterasi, gutera amashyamba gakondo, no kurinda inkombe z\'imigezi kugira ngo Kigali irindwe imyuzure ikabije n\'isuri.'
                : 'Led by IISD and WRI and funded by Global Affairs Canada with the City of Kigali and Rwanda Forestry Authority (RFA), SUNCASA implements Nature-based Solutions (NbS)—including hillside terracing, native tree afforestation, and riparian buffer protection—to reduce flood and erosion risks while generating inclusive green jobs.'}
            </p>
          </div>

          {/* 4 Headline KPIs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {headlineKPIs.map((ind) => {
              const col = themeColors[ind.theme] || '#0284c7';
              const pct = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));

              return (
                <div
                  key={ind.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: col, textTransform: 'uppercase' }}>
                        {ind.theme}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {ind.fmes_code}
                      </span>
                    </div>

                    <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                      {ind.current_2025.toLocaleString()}
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginLeft: '6px' }}>
                        {ind.unit}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#334155', marginTop: '8px', minHeight: '44px' }}>
                      {ind.definition}
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: col, transition: 'width 0.4s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                      <span>{pct}% {locale === 'rw' ? "by'intego" : 'of 2026 Target'}</span>
                      <span style={{ fontWeight: 600, color: col }}>&bull; {ind.status}</span>
                    </div>

                    <Link
                      href={`/indicator/${ind.id}`}
                      style={{
                        display: 'block',
                        marginTop: '14px',
                        textAlign: 'center',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {locale === 'rw' ? 'Fungura Isesengura' : 'View Indicator Page'} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Interactive GIS Micro-Catchment Map Section (RFP Section 7.1 & 7.3) */}
      <section style={{ padding: '60px 32px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {locale === 'rw' ? 'Ikarita ya GIS' : 'Spatial Intervention Map'}
            </span>
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '2.1rem', color: '#1e293b', fontWeight: 500, marginTop: '6px' }}>
              {locale === 'rw' ? 'Ahakorerwa Imirimo mu Kibaya cya Nyabarongo' : 'SUNCASA Intervention Sites in Kigali'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.96rem', marginTop: '8px', maxWidth: '700px', margin: '8px auto 0 auto' }}>
              {locale === 'rw'
                ? 'Kanda ku bimenyetso biri ku ikarita kugira ngo urebe amakuru y\'ubuso bw\'amashyamba n\'ibiti byatewe mu mikoki ya Yanze, Mpazi, na Mont Kigali.'
                : 'Click any site marker on the map to inspect intervention attributes, hectares restored, seedlings planted, and flood risk mitigation focus.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedSite ? '2fr 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <CatchmentMap
                locale={locale}
                themeFilter="all"
                onSelectSite={(props) => setSelectedSite(props)}
              />
            </div>

            {selectedSite && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px' }}>
                <span style={{ fontSize: '0.74rem', background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {selectedSite.type}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '10px 0 4px 0' }}>
                  {locale === 'rw' ? selectedSite.name_rw || selectedSite.name : selectedSite.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                  <strong>{locale === 'rw' ? 'Akarere:' : 'District:'}</strong> {selectedSite.district}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Area (ha)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{selectedSite.area_ha || '--'}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Trees Planted</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>
                      {selectedSite.trees_planted ? selectedSite.trees_planted.toLocaleString() : '--'}
                    </div>
                  </div>
                </div>

                {selectedSite.risk_focus && (
                  <div style={{ marginTop: '14px', fontSize: '0.85rem', color: '#334155', background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>Risk Focus:</strong> {selectedSite.risk_focus}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 3 Curated Data-Driven Civic Stories (RFP Section 7.1 & Section 8) */}
      <CivicStoryCards locale={locale} />

      {/* 5. Latest Updates Section (Matches Screenshot 1) */}
      <section className="mypeg-latest-updates-section" id="latest-updates-section">
        <div className="mypeg-updates-container">
          <h2 className="mypeg-updates-heading">Latest Updates</h2>

          <div className="mypeg-updates-grid">
            {/* Update Card 1: Climate Adaptation */}
            <article className="mypeg-update-card">
              <div className="update-card-tag" style={{ backgroundColor: '#0284c7' }}>
                CLIMATE ADAPTATION
              </div>
              <h3 className="update-card-title">
                985 Hectares Restored Across Yanze & Mount Kigali Slopes
              </h3>
              <p className="update-card-excerpt">
                Progressive slope terracing and vegetative check-dams achieved 65% of the 2026 milestone,
                mitigating mudslides and delaying torrential stormwater runoff across urban catchments.
              </p>
              <div className="update-card-footer">
                <span className="update-card-date">September 2025</span>
                <Link href="/indicator/area_restored_ha" className="update-card-link">
                  View Indicator Page &rarr;
                </Link>
              </div>
            </article>

            {/* Update Card 2: Biodiversity Protection */}
            <article className="mypeg-update-card">
              <div className="update-card-tag" style={{ backgroundColor: '#10b981' }}>
                BIODIVERSITY PROTECTION
              </div>
              <h3 className="update-card-title">
                Over 842,000 Certified Native Seedlings Planted in Priority Belts
              </h3>
              <p className="update-card-excerpt">
                Native agroforestry trees and 32.8 km of continuous riparian buffer strips were
                established along the Lower Nyabarongo riverbank, safeguarding freshwater biodiversity.
              </p>
              <div className="update-card-footer">
                <span className="update-card-date">August 2025</span>
                <Link href="/indicator/trees_planted" className="update-card-link">
                  View Indicator Page &rarr;
                </Link>
              </div>
            </article>

            {/* Update Card 3: GESI */}
            <article className="mypeg-update-card">
              <div className="update-card-tag" style={{ backgroundColor: '#8b5cf6' }}>
                GENDER & INCLUSION
              </div>
              <h3 className="update-card-title">
                Women Exceed 54% of Executive Watershed Leadership Roles
              </h3>
              <p className="update-card-excerpt">
                Participatory community committees across Nyarugenge and Gasabo sectors surpassed target
                thresholds, ensuring equitable leadership in climate resilience planning and nursery operations.
              </p>
              <div className="update-card-footer">
                <span className="update-card-date">July 2025</span>
                <Link href="/indicator/women_leadership_catchment" className="update-card-link">
                  View Indicator Page &rarr;
                </Link>
              </div>
            </article>
          </div>

          {/* Quick Action Benchmark Banner */}
          <div className="mypeg-explore-banner">
            <div>
              <h4>Explore Canadian MyPeg Comparative Benchmark</h4>
              <p>
                Access the original Winnipeg benchmark dataset that inspired SUNCASA’s indicator-driven
                civic communication architecture.
              </p>
            </div>
            <Link
              href="/indicator/building_permit_values"
              className="btn-open-screenshot-chart"
            >
              📊 Open Building Permit Values Chart (Screenshot 2)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
