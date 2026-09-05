'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Chart as ChartJS, registerables } from 'chart.js';
import indicatorsData from '@/data/indicators.json';
import indicatorNarratives from '@/data/locales/indicator_narratives.json';
import { Indicator } from '@/lib/db/types';

ChartJS.register(...registerables);

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Loading GIS Map Layer...
    </div>
  ),
});

const THEME_COLORS: Record<string, string> = {
  climate: '#eb6b23',
  biodiversity: '#10b981',
  gesi: '#8b5cf6',
  economy: '#0ea5e9',
};

export default function EmbedIndicatorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;

  const initialView = (searchParams.get('view') as 'chart' | 'card' | 'map') || 'chart';
  const initialLang = (searchParams.get('lang') as 'en' | 'rw') || 'en';
  const themeMode = searchParams.get('theme') === 'dark' ? 'dark' : 'light';

  const [activeView, setActiveView] = useState<'chart' | 'card' | 'map'>(initialView);
  const [locale, setLocale] = useState<'en' | 'rw'>(initialLang);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  const indicator = (indicatorsData.indicators as Indicator[]).find((i) => i.id === id);

  const narrativeItem = (indicatorNarratives as Record<string, any>)[id || ''];
  const story = narrativeItem ? (narrativeItem[locale] || narrativeItem.en) : null;

  const displayTitle = story?.title || (indicator ? indicator.id.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : id);
  const themeColor = indicator ? (THEME_COLORS[indicator.theme] || '#eb6b23') : '#eb6b23';

  // Render Chart when activeView is 'chart'
  useEffect(() => {
    if (activeView !== 'chart' || !indicator || !canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const history = indicator.trend_history || [];
    const labels = history.map((h) => h.period);
    const dataValues = history.map((h) => h.value);

    let gradient: any = 'rgba(2, 132, 199, 0.1)';
    try {
      const g = ctx.createLinearGradient(0, 0, 0, 300);
      g.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
      g.addColorStop(1, 'rgba(2, 132, 199, 0.01)');
      gradient = g;
    } catch {
      // fallback
    }

    const isDark = themeMode === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226, 232, 240, 0.8)';

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: locale === 'rw' ? 'Kigali (Umujyi & Ikibaya)' : 'Kigali (Catchment)',
            data: dataValues,
            borderColor: '#0284c7',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: '#0284c7',
            pointBorderColor: isDark ? '#1e293b' : '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#1e293b',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            callbacks: {
              label: (context) => ` ${context.parsed.y.toLocaleString()} ${indicator.unit}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: (val) => (typeof val === 'number' ? val.toLocaleString() : val),
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
  }, [indicator, activeView, locale, themeMode]);

  if (!indicator) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
        <p style={{ fontWeight: 700 }}>Indicator not found</p>
        <p style={{ fontSize: '0.85rem' }}>ID &quot;{id}&quot; does not exist in Kigali SUNCASA repository.</p>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.round((indicator.current_2025 / indicator.target_2026) * 100));
  const isDark = themeMode === 'dark';
  const bg = isDark ? '#0b1324' : '#ffffff';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const subText = isDark ? '#94a3b8' : '#64748b';
  const border = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div
      style={{
        background: bg,
        color: text,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '16px 20px',
        boxSizing: 'border-box',
        width: '100%',
        minHeight: '100%',
      }}
    >
      {/* Top Accent bar matching indicator theme */}
      <div
        style={{
          height: '4px',
          background: themeColor,
          borderRadius: '4px',
          marginBottom: '12px',
        }}
      />

      {/* Header controls: Title, Theme Tag, View Switcher & Language */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: themeColor,
                textTransform: 'uppercase',
                border: `1px solid ${themeColor}44`,
                padding: '2px 8px',
                borderRadius: '4px',
                background: `${themeColor}15`,
              }}
            >
              {indicator.theme} &bull; {indicator.fmes_code}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#16a34a',
                background: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              {indicator.status}
            </span>
          </div>
          <h2
            style={{
              margin: '2px 0 4px 0',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            {displayTitle}
          </h2>
          <div style={{ fontSize: '0.82rem', color: subText }}>
            {story?.what_is || indicator.definition}
          </div>
        </div>

        {/* View Mode & Language Pill Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              background: isDark ? '#1e293b' : '#f1f5f9',
              borderRadius: '6px',
              padding: '2px',
              border: `1px solid ${border}`,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveView('chart')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: activeView === 'chart' ? (isDark ? '#334155' : '#ffffff') : 'transparent',
                color: activeView === 'chart' ? text : subText,
                boxShadow: activeView === 'chart' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📊 Chart
            </button>
            <button
              type="button"
              onClick={() => setActiveView('card')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: activeView === 'card' ? (isDark ? '#334155' : '#ffffff') : 'transparent',
                color: activeView === 'card' ? text : subText,
                boxShadow: activeView === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📋 Card
            </button>
            <button
              type="button"
              onClick={() => setActiveView('map')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: activeView === 'map' ? (isDark ? '#334155' : '#ffffff') : 'transparent',
                color: activeView === 'map' ? text : subText,
                boxShadow: activeView === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🗺️ Map
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'rw' : 'en')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: isDark ? '#1e293b' : '#f8fafc',
              color: text,
              cursor: 'pointer',
            }}
            title="Toggle Language"
          >
            {locale.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeView === 'chart' && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ height: '260px', position: 'relative', width: '100%' }}>
            <canvas ref={canvasRef} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: `1px solid ${border}`,
              fontSize: '0.78rem',
              color: subText,
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <div>
              <strong>Current:</strong> {indicator.current_2025.toLocaleString()} {indicator.unit} &bull;{' '}
              <strong>2026 Target:</strong> {indicator.target_2026.toLocaleString()} {indicator.unit}
            </div>
            <div>
              <strong>Source:</strong> {indicator.data_source || indicator.data_source_citation || 'City of Kigali & RFA'}
            </div>
          </div>
        </div>
      )}

      {activeView === 'card' && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            borderRadius: '8px',
            border: `1px solid ${border}`,
            background: isDark ? '#141d33' : '#f8fafc',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '12px', borderRadius: '6px', border: `1px solid ${border}` }}>
              <div style={{ fontSize: '0.72rem', color: subText }}>Current (2025)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: themeColor, marginTop: '2px' }}>
                {indicator.current_2025.toLocaleString()}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: subText }}>{indicator.unit}</span>
              </div>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '12px', borderRadius: '6px', border: `1px solid ${border}` }}>
              <div style={{ fontSize: '0.72rem', color: subText }}>2026 Target</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: text, marginTop: '2px' }}>
                {indicator.target_2026.toLocaleString()}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: subText }}>{indicator.unit}</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
              <span>Target Progress</span>
              <strong>{progressPct}%</strong>
            </div>
            <div style={{ height: '8px', width: '100%', background: isDark ? '#334155' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: themeColor, borderRadius: '4px' }} />
            </div>
          </div>

          {indicator.site_breakdown && indicator.site_breakdown.length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: subText, textTransform: 'uppercase', marginBottom: '6px' }}>
                Micro-Catchment Breakdown
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {indicator.site_breakdown.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      background: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${border}`,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    <strong>{s.site}:</strong> {s.value.toLocaleString()} {indicator.unit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'map' && (
        <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${border}` }}>
          <CatchmentMap
            height="320px"
            currentIndicator={indicator}
            locale={locale}
          />
        </div>
      )}

      {/* Embedded Footer Attributions & Deep Link to Kigali Dashboard */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '10px',
          borderTop: `1px solid ${border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          color: subText,
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌿 <strong>SUNCASA Kigali NbS</strong></span>
          <span>&bull;</span>
          <span>City of Kigali & RFA</span>
        </div>
        <Link
          href={`/indicator/${indicator.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0284c7',
            textDecoration: 'none',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          View Full Interactive Report ↗
        </Link>
      </div>
    </div>
  );
}
