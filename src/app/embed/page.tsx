'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import indicatorsData from '@/data/indicators.json';
import { Indicator } from '@/lib/db/types';

export default function EmbedHubPage() {
  const indicators = indicatorsData.indicators as Indicator[];
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('area_restored_ha');
  const [viewMode, setViewMode] = useState<'chart' | 'card' | 'map'>('chart');
  const [lang, setLang] = useState<'en' | 'rw'>('en');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  const activeIndicator = indicators.find((i) => i.id === selectedIndicatorId) || indicators[0];

  const embedUrl = `/embed/indicator/${selectedIndicatorId}?view=${viewMode}&lang=${lang}&theme=${themeMode}`;
  const absoluteEmbedUrl = `https://nbs-455962--nbs-project-7deac.us-central1.hosted.app${embedUrl}`;

  const iframeCode = `<iframe 
  src="${absoluteEmbedUrl}" 
  width="100%" 
  height="450" 
  style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;" 
  title="SUNCASA Kigali - ${activeIndicator.id}"
  loading="lazy"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a111e',
        color: '#f8fafc',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '36px 20px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            ← Back to Public Dashboard
          </Link>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Embed Widget Hub</span>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'inline-block',
              marginBottom: '10px',
            }}
          >
            Interoperability & Civic Sharing
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            SUNCASA Embeddable Indicator Widgets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0, maxWidth: '780px', lineHeight: 1.6 }}>
            Publish live, interactive SUNCASA indicator visualizations directly on partner websites (City of Kigali,
            Rwanda Forestry Authority, IISD, WRI, or news outlets) via a single line of iFrame code.
          </p>
        </div>

        {/* Configuration & Preview Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Controls Column */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              ⚙️ Widget Configuration
            </h2>

            {/* Indicator Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Select Indicator to Embed
              </label>
              <select
                value={selectedIndicatorId}
                onChange={(e) => setSelectedIndicatorId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                {indicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    [{ind.theme.toUpperCase()}] {ind.id.replace(/_/g, ' ')} ({ind.fmes_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Default View Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Default Display Mode
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['chart', 'card', 'map'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: viewMode === m ? '1.5px solid #0284c7' : '1px solid #334155',
                      background: viewMode === m ? '#0284c7' : '#1e293b',
                      color: '#ffffff',
                      textTransform: 'capitalize',
                    }}
                  >
                    {m === 'chart' ? '📊 Chart' : m === 'card' ? '📋 Card' : '🗺️ Map'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Theme Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['en', 'rw'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: lang === l ? '1.5px solid #10b981' : '1px solid #334155',
                        background: lang === l ? '#10b981' : '#1e293b',
                        color: '#ffffff',
                      }}
                    >
                      {l === 'en' ? 'EN' : 'RW'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Theme
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setThemeMode(t)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: themeMode === t ? '1.5px solid #8b5cf6' : '1px solid #334155',
                        background: themeMode === t ? '#8b5cf6' : '#1e293b',
                        color: '#ffffff',
                        textTransform: 'capitalize',
                      }}
                    >
                      {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* iFrame Embed Code Snippet */}
            <div style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>HTML Embed Code</label>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#10b981' : '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {copied ? '✓ Copied to Clipboard!' : '📋 Copy Code'}
                </button>
              </div>
              <textarea
                readOnly
                value={iframeCode}
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#030712',
                  border: '1px solid #1e293b',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>

            {/* Direct URL */}
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Direct Widget URL: </span>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', wordBreak: 'break-all' }}
              >
                {embedUrl} ↗
              </a>
            </div>
          </div>

          {/* Live Preview Column */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                📱 Live Interactive Widget Preview
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>• Real-Time</span>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: '440px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #334155',
                background: themeMode === 'dark' ? '#0b1324' : '#ffffff',
              }}
            >
              <iframe
                src={embedUrl}
                title="SUNCASA Kigali Indicator Embed Preview"
                style={{ width: '100%', height: '100%', minHeight: '440px', border: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
