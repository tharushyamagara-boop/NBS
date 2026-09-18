'use client';

import React, { useState, useEffect } from 'react';
import initialStories from '@/data/landing_stories.json';

export interface StoryContent {
  tag: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  quote: string;
  quoteAuthor: string;
  fullBody: string[];
}

export interface LandingStory {
  id: string;
  tagColor: string;
  en: StoryContent;
  rw: StoryContent;
}

interface CivicStoryCardsProps {
  locale: 'en' | 'rw';
}

export default function CivicStoryCards({ locale }: CivicStoryCardsProps) {
  const [stories, setStories] = useState<LandingStory[]>(initialStories as LandingStory[]);
  const [selectedStory, setSelectedStory] = useState<{ id: string; tagColor: string; content: StoryContent } | null>(null);
  const isRw = locale === 'rw';

  // Live reload from API if admin modified stories
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/landing-stories')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStories(data.data);
        }
      })
      .catch(() => {
        // Fallback gracefully to bundled JSON
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Story-specific telemetry metrics
  const storyMetrics: Record<string, { en: { label: string; val: string }[]; rw: { label: string; val: string }[] }> = {
    'mpazi-flood': {
      en: [
        { label: 'Storm Crest Delay', val: '+45 Minutes' },
        { label: 'Flood Peak Runoff', val: '-28.5% Attenuation' },
        { label: 'Hillside Topsoil Conserved', val: '14,600 Tons / Year' },
      ],
      rw: [
        { label: 'Igihe Amazi Atinda', val: '+Iminota 45' },
        { label: 'Kugabanya Imyuzure', val: '-28.5% y\'Inkukuma' },
        { label: 'Ubutaka Bwafashwe', val: 'Toni 14,600 / Umwaka' },
      ],
    },
    'women-nurseries': {
      en: [
        { label: 'Female Nursery Ownership', val: '61.5% Cooperatives' },
        { label: 'Native Seedlings Supplied', val: '180,000 Markhamia' },
        { label: 'Cooperative Banking Equity', val: '100% Formal Accounts' },
      ],
      rw: [
        { label: 'Amakoperative y\'Abagore', val: '61.5% Byose Hamwe' },
        { label: 'Ingemwe z\'Ibiti Zatanzwe', val: '180,000 z\'Imisave' },
        { label: 'Kwizigamira muri Banki', val: '100% b\'Abanyamuryango' },
      ],
    },
    'youth-gis': {
      en: [
        { label: 'Youth Eco-Stewards Trained', val: '1,120 Technicians' },
        { label: 'Field GPS Boundaries', val: '43 Live Spatial Nodes' },
        { label: 'Drone Orthomosaic Telemetry', val: '2 cm/px Resolution' },
      ],
      rw: [
        { label: 'Urubyiruko Rwahuguwe', val: 'Abatekinisiye 1,120' },
        { label: 'Ibyicaro bya GPS', val: 'Amasangano 43' },
        { label: 'Gupima hakoreshejwe Drone', val: 'Ubuziranenge bwa 2cm/px' },
      ],
    },
  };

  return (
    <section className="civic-stories-section" id="stories-section" style={{ padding: '68px 32px', background: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#e0f2fe', padding: '5px 14px', borderRadius: '20px', display: 'inline-block' }}>
            {isRw ? 'Inkuru 2–3 z\'Ingenzi zishingiye ku Makuru' : '2–3 Curated Data-Driven Stories'}
          </span>
          <h2 className="section-title" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '2.3rem', color: '#0f172a', fontWeight: 600, marginTop: '14px', lineHeight: 1.25 }}>
            {isRw ? 'Inkuru z\'Ibibaya n\'Ibyavuye mu Mirimo ya SUNCASA' : 'Data-Driven Stories of Community Resilience in Kigali'}
          </h2>
          <p className="section-subtitle" style={{ color: '#0f172a', fontSize: '1rem', marginTop: '10px', maxWidth: '780px', margin: '10px auto 0 auto', lineHeight: 1.6 }}>
            {isRw
              ? 'Inkuru zifatika zihuza imirimo yo gusana imisozi n\'imibereho myiza y\'abaturage. Kanda buto ya "Byinshi" kugira ngo usome inkuru yose mu buryo burambuye.'
              : 'Compelling evidence-based narratives linking ecological bio-engineering to flood safety, female cooperative wealth, and youth technology. Click the "More" button on any story to read the full article.'}
          </p>
        </div>

        <div className="civic-stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
          {stories.map((story) => {
            const content = story[locale] || story.en;
            if (!content) return null;

            return (
              <article
                key={story.id}
                className="story-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div>
                  <div className="story-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span
                      className="story-pill"
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0284c7',
                        border: '1px solid #bae6fd',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {content.tag}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 600 }}>
                      ⏱️ 3 min read &bull; {content.date}
                    </span>
                  </div>

                  <h3
                    style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', lineHeight: 1.35, cursor: 'pointer' }}
                    onClick={() => setSelectedStory({ id: story.id, tagColor: story.tagColor, content })}
                    title={isRw ? 'Kanda hano usome inkuru yose' : 'Click to open full article'}
                  >
                    {content.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.6, marginBottom: '18px' }}>
                    {content.summary}
                  </p>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderLeft: '3px solid #0284c7',
                      padding: '12px 14px',
                      borderRadius: '0 8px 8px 0',
                      marginBottom: '20px',
                    }}
                  >
                    <p style={{ fontSize: '0.84rem', fontStyle: 'normal', color: '#0f172a', lineHeight: 1.5, margin: 0 }}>
                      &ldquo;{content.quote}&rdquo;
                    </p>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#0284c7', marginTop: '6px', fontWeight: 600 }}>
                      &mdash; {content.quoteAuthor}
                    </span>
                  </div>
                </div>

                <div
                  className="story-footer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontSize: '0.76rem', color: '#0f172a' }}>
                    🏛️ {content.author}
                  </span>

                  {/* PROMINENT "MORE" BUTTON TO OPEN FULL ARTICLE */}
                  <button
                    type="button"
                    onClick={() => setSelectedStory({ id: story.id, tagColor: story.tagColor, content })}
                    style={{
                      padding: '9px 18px',
                      background: `linear-gradient(135deg, ${story.tagColor} 0%, ${story.tagColor}dd 100%)`,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: `0 2px 8px ${story.tagColor}44`,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{isRw ? '📖 Byinshi' : '📖 More'}</span>
                    <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>&bull; {isRw ? 'Soma Inkuru' : 'Full Article'}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {selectedStory && (
        <div
          className="modal-overlay open"
          onClick={() => setSelectedStory(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                padding: '24px 28px 18px 28px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'sticky',
                top: 0,
                background: '#ffffff',
                zIndex: 2,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedStory.content.tag}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#0f172a' }}>
                    📅 {selectedStory.content.date} &bull; ⏱️ 4 min read
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                  {selectedStory.content.title}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', marginTop: '6px' }}>
                  Reported by <strong>{selectedStory.content.author}</strong> for the SUNCASA Project
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#0f172a',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '16px',
                  flexShrink: 0,
                }}
                title={isRw ? 'Funga' : 'Close Article'}
              >
                &times;
              </button>
            </div>

            {/* Modal Article Body */}
            <div style={{ padding: '28px', color: '#0f172a', fontSize: '0.98rem', lineHeight: 1.75 }}>
              {/* Featured Quote Callout */}
              <div
                style={{
                  background: '#f8fafc',
                  borderLeft: '4px solid #0284c7',
                  padding: '18px 22px',
                  borderRadius: '0 10px 10px 0',
                  marginBottom: '26px',
                }}
              >
                <div style={{ fontSize: '1.05rem', fontStyle: 'normal', color: '#0f172a', lineHeight: 1.6 }}>
                  &ldquo;{selectedStory.content.quote}&rdquo;
                </div>
                <div style={{ fontSize: '0.86rem', color: '#0284c7', marginTop: '8px', fontWeight: 700 }}>
                  &mdash; {selectedStory.content.quoteAuthor}
                </div>
              </div>

              {/* Data-Driven Verified Metrics Strip */}
              {storyMetrics[selectedStory.id] && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    marginBottom: '26px',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    📊 {isRw ? 'Ibipimo n\'Amakuru Yizewe Byavuye mu Mushinga:' : 'Verified Data & Indicator Metrics:'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {(isRw ? storyMetrics[selectedStory.id].rw : storyMetrics[selectedStory.id].en).map((m, mi) => (
                      <div key={mi} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>{m.label}</div>
                        <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Paragraph Article Content */}
              <div className="story-modal-paragraphs" style={{ marginBottom: '28px' }}>
                {Array.isArray(selectedStory.content.fullBody) ? (
                  selectedStory.content.fullBody.map((p, idx) => (
                    <p key={idx} style={{ marginBottom: '16px', color: '#0f172a', lineHeight: 1.75 }}>
                      {p}
                    </p>
                  ))
                ) : (
                  <p style={{ marginBottom: '16px', color: '#0f172a', lineHeight: 1.75 }}>
                    {selectedStory.content.fullBody}
                  </p>
                )}
              </div>

              {/* Official Project Delivery Partner Banner */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                }}
              >
                <strong style={{ fontSize: '0.82rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  {isRw ? 'Ubufatanye bw\'Abafatanyabikorwa:' : 'Project Implementing Partners:'}
                </strong>
                <div style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                  Funded by <strong>Global Affairs Canada</strong> &bull; Jointly led by <strong>IISD</strong> & <strong>WRI</strong> in collaboration with the <strong>City of Kigali</strong> & <strong>Rwanda Forestry Authority (RFA)</strong>.
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  style={{
                    padding: '10px 22px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isRw ? 'Funga Inkuru' : 'Close Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
