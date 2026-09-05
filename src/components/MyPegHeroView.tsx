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
  const [mapTheme, setMapTheme] = useState<string>('all');
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

      {/* 2B. Thematic Communication Pillars (RFP Mandated Thematic Structure) */}
      <section style={{ padding: '64px 32px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }} id="thematic-pillars-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '42px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#e0f2fe', padding: '5px 14px', borderRadius: '20px', display: 'inline-block' }}>
              {locale === 'rw' ? 'Inkingi z\'Ubutumwa n\'Ibisubizo Kamere' : 'Thematic Communication Pillars'}
            </span>
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '2.3rem', color: '#0f172a', fontWeight: 600, marginTop: '14px', lineHeight: 1.25 }}>
              {locale === 'rw' ? 'Inkingi Enye z\'Imiyoborere y\'Ikibaya cya Nyabarongo' : 'Four Narrative Pillars of Kigali’s NbS Strategy'}
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', marginTop: '10px', maxWidth: '780px', margin: '10px auto 0 auto', lineHeight: 1.6 }}>
              {locale === 'rw'
                ? 'Iyi mbonerahamwe yubatse ku nkingi enye z\'ingenzi zigaragaza ibyihutirwa mu bufatanye n\'abafatanyabikorwa. Buri nkingi ishyigikiwe n\'ubutumwa bwihariye n\'ibipimo byizewe.'
                : 'The SUNCASA dashboard is organized around four narrative themes reflecting stakeholder priorities and the Kigali roadmap. Each theme serves as a communication pillar supported by key messages and verified indicator datasets.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
            {[
              {
                id: 'climate',
                name_en: 'Climate Adaptation',
                name_rw: 'Kwirinda Imihindagurikire',
                icon: '🌧️',
                color: '#0284c7',
                bgGradient: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
                keyMessage_en: 'Mitigating catastrophic flood risks, stabilizing volcanic hillsides, and buffering informal downstream settlements against peak storm runoff.',
                keyMessage_rw: 'Kugabanya inkangu zikomeye, kurinda imyuzure yangiza ibikorwa remezo, no gufata amazi ku misozi mbere y\'uko agera mu bibaya.',
                indicators: [
                  { id: 'area_restored_ha', label_en: 'Hectares Restored', label_rw: 'Hegitari Zasanywe', value: '985 ha' },
                  { id: 'flood_risk_reduction', label_en: 'Flood Peak Reduction', label_rw: 'Kugabanya Imyuzure', value: '28.5%' },
                  { id: 'soil_erosion_prevented', label_en: 'Topsoil Conserved', label_rw: 'Ubutaka Bwafashwe', value: '14,600 t/yr' },
                ],
                exploreLink: '/indicator/area_restored_ha',
              },
              {
                id: 'biodiversity',
                name_en: 'Biodiversity Protection',
                name_rw: 'Kubungabunga Urusobe',
                icon: '🌱',
                color: '#10b981',
                bgGradient: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                keyMessage_en: 'Rehabilitating indigenous flora, enforcing 30m riparian river buffers, and safeguarding water quality for the Yanze intake.',
                keyMessage_rw: 'Kugarura ibiti gakondo by\'u Rwanda, kurinda metero 30 z\'inkombe za Nyabarongo, no kubungabunga amazi y\'uruganda rwa Yanze.',
                indicators: [
                  { id: 'trees_planted', label_en: 'Native Trees Planted', label_rw: 'Ibiti Gakondo Byatewe', value: '842,000' },
                  { id: 'tree_survival_rate', label_en: 'Survival Rate', label_rw: 'Ikigero cy\'Ubuzima', value: '84.5%' },
                  { id: 'riparian_buffer_km', label_en: 'Riparian Buffer Restored', label_rw: 'Inkombe Zasigasiriwe', value: '32.8 km' },
                  { id: 'water_quality_index', label_en: 'Water Quality Index', label_rw: 'Ubuziranenge bw\'Amazi', value: '68.5 / 100' },
                ],
                exploreLink: '/indicator/trees_planted',
              },
              {
                id: 'gesi',
                name_en: 'Gender Equality & Social Inclusion',
                name_rw: 'Uburinganire (GESI)',
                icon: '⚖️',
                color: '#8b5cf6',
                bgGradient: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
                keyMessage_en: 'Centering women and youth in climate governance, nursery enterprise ownership, and high-tech digital geospatial telemetry.',
                keyMessage_rw: 'Gushyira abagore ku ruhembo rw\'ubuyobozi bw\'amazi, guha urubyiruko akazi ka GIS, no kuzamura ingo zikennye.',
                indicators: [
                  { id: 'women_leadership_catchment', label_en: 'Women in Leadership', label_rw: 'Abagore mu Buyobozi', value: '54.2%' },
                  { id: 'participants_trained', label_en: 'Certified Eco-Stewards', label_rw: 'Abahuguwe ku Bidukikije', value: '2,840' },
                ],
                exploreLink: '/indicator/women_leadership_catchment',
              },
              {
                id: 'economy',
                name_en: 'Employment & Economy',
                name_rw: 'Imirimo n\'Ubukungu',
                icon: '💼',
                color: '#f59e0b',
                bgGradient: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
                keyMessage_en: 'Generating dignified green employment, boosting smallholder agroforestry crop yields, and spurring cooperative nursery revenues.',
                keyMessage_rw: 'Guhanga imirimo yishyuwe y\'icyatsi, guteza imbere abahinzi b\'amaterasi y\'imbuto, no kwinjiza amafaranga mu buhumbikiro.',
                indicators: [
                  { id: 'green_jobs_created', label_en: 'Green Workdays Created', label_rw: 'Iminsi y\'Akazi y\'Icyatsi', value: '98,500' },
                  { id: 'female_nursery_operators', label_en: 'Women-Led Nurseries', label_rw: 'Ubuhumbikiro bw\'Abagore', value: '61.5%' },
                  { id: 'vulnerable_youth_employed', label_en: 'Youth Employed', label_rw: 'Urubyiruko Rwashakishirijwe Akazi', value: '1,120' },
                ],
                exploreLink: '/indicator/green_jobs_created',
              },
            ].map((pillar) => (
              <div
                key={pillar.id}
                style={{
                  background: pillar.bgGradient,
                  borderRadius: '14px',
                  border: `1.5px solid ${pillar.color}26`,
                  padding: '26px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.75rem' }}>{pillar.icon}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: pillar.color, background: `${pillar.color}18`, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      PILLAR &bull; {pillar.id}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    {locale === 'rw' ? pillar.name_rw : pillar.name_en}
                  </h3>

                  <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, background: '#ffffff', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${pillar.color}`, marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: pillar.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      {locale === 'rw' ? 'Ubutumwa bw\'Ingenzi' : 'Key Message'}
                    </div>
                    {locale === 'rw' ? pillar.keyMessage_rw : pillar.keyMessage_en}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                      {locale === 'rw' ? 'Ibipimo Bishyigikiye iyi Nkingi:' : 'Supporting Indicators:'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pillar.indicators.map((ind) => (
                        <Link
                          key={ind.id}
                          href={`/indicator/${ind.id}`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: '#ffffff',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            textDecoration: 'none',
                            fontSize: '0.82rem',
                            color: '#1e293b',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            {locale === 'rw' ? ind.label_rw : ind.label_en}
                          </span>
                          <span style={{ fontWeight: 800, color: pillar.color, fontSize: '0.84rem' }}>
                            {ind.value} &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                  <Link
                    href={pillar.exploreLink}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: pillar.color,
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: `0 2px 6px ${pillar.color}33`,
                    }}
                  >
                    {locale === 'rw' ? 'Suzuma Iyi Nkingi' : `Explore ${pillar.name_en}`} &rarr;
                  </Link>
                </div>
              </div>
            ))}
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

          {/* Interactive Theme Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[
              { id: 'all', label_en: 'All Themes & Sites', label_rw: 'Imishinga Yose', icon: '🌐', color: '#0284c7' },
              { id: 'climate', label_en: 'Climate Adaptation', label_rw: 'Kwirinda Imihindagurikire', icon: '🌧️', color: '#0284c7' },
              { id: 'biodiversity', label_en: 'Biodiversity Protection', label_rw: 'Kubungabunga Urusobe', icon: '🌱', color: '#10b981' },
              { id: 'gesi', label_en: 'Gender & Inclusion', label_rw: 'Uburinganire (GESI)', icon: '👥', color: '#8b5cf6' },
              { id: 'economy', label_en: 'Employment & Economy', label_rw: 'Imirimo n\'Ubukungu', icon: '📈', color: '#f59e0b' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setMapTheme(th.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  border: `1.5px solid ${mapTheme === th.id ? th.color : '#e2e8f0'}`,
                  background: mapTheme === th.id ? th.color : '#ffffff',
                  color: mapTheme === th.id ? '#ffffff' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: mapTheme === th.id ? `0 2px 8px ${th.color}44` : 'none',
                }}
              >
                <span>{th.icon}</span>
                <span>{locale === 'rw' ? th.label_rw : th.label_en}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedSite ? '2fr 1fr' : '1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <CatchmentMap
                locale={locale}
                selectedTheme={mapTheme}
                height={520}
                onSelectSite={(props) => setSelectedSite(props)}
              />
            </div>

            {selectedSite && (
              <div style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {selectedSite.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSite(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '12px 0 4px 0', fontWeight: 700 }}>
                  {locale === 'rw' ? selectedSite.name_rw || selectedSite.name : selectedSite.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
                  <strong>{locale === 'rw' ? 'Akarere:' : 'District:'}</strong> {selectedSite.district} &bull; {selectedSite.fmes_compartment || selectedSite.fmes_code || 'FMES Layer'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedSite.area_km2 ? 'Catchment Area' : 'Intervention Area'}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                      {selectedSite.area_km2 ? `${selectedSite.area_km2} km²` : selectedSite.area_ha ? `${selectedSite.area_ha} ha` : '--'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Trees / Target Metric</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                      {selectedSite.trees_planted ? selectedSite.trees_planted.toLocaleString() : selectedSite.indicatorValue ? selectedSite.indicatorValue.toLocaleString() : '--'}
                    </div>
                  </div>
                </div>

                {selectedSite.priority_intervention && (
                  <div style={{ marginTop: '14px', fontSize: '0.82rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.4 }}>
                    <strong>Intervention:</strong> {selectedSite.priority_intervention}
                  </div>
                )}

                {/* Direct Link to Indicator Page */}
                <div style={{ marginTop: '18px' }}>
                  <Link
                    href="/indicator/area_restored_ha"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '9px 14px',
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {locale === 'rw' ? 'Reba Amakuru Arambuye y\'Igipimo' : 'Explore Detailed Indicator Spatial View'} &rarr;
                  </Link>
                </div>
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
