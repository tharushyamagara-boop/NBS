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

  return (
    <section className="civic-stories-section" id="stories-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">{isRw ? 'Inkuru z\'Umusaruro' : 'Civic Narratives & Reports'}</div>
          <h2 className="section-title">
            {isRw ? 'Inkuru z\'Ibibaya n\'Ibyavuye mu Mirimo ya SUNCASA' : 'Latest Watershed Stories & Peg-Style Impact Reports'}
          </h2>
          <p className="section-subtitle">
            {isRw
              ? 'Inkuru zifatika zihuza imirimo yo gusana imisozi n\'imibereho y\'abaturage bo mu Mujyi wa Kigali.'
              : 'Indicator-driven narratives demonstrating how ecological bio-engineering, female leadership, and youth technology deliver tangible community well-being in Kigali.'}
          </p>
        </div>

        <div className="civic-stories-grid">
          {stories.map((story) => {
            const content = story[locale] || story.en;
            if (!content) return null;

            return (
              <article key={story.id} className="story-card">
                <div className="story-card-top">
                  <span
                    className="story-pill"
                    style={{ backgroundColor: `${story.tagColor}22`, color: story.tagColor, borderColor: `${story.tagColor}55` }}
                  >
                    {content.tag}
                  </span>
                  <span className="story-date">{content.date}</span>
                </div>

                <h3 className="story-title">{content.title}</h3>
                <p className="story-summary">{content.summary}</p>

                <div className="story-quote-box">
                  <p className="quote-text">{content.quote}</p>
                  <span className="quote-author">&mdash; {content.quoteAuthor}</span>
                </div>

                <div className="story-footer">
                  <span className="story-author-tag">🏛️ {content.author}</span>
                  <button
                    type="button"
                    className="btn-read-story"
                    onClick={() => setSelectedStory({ id: story.id, tagColor: story.tagColor, content })}
                  >
                    {isRw ? 'Soma Inkuru Yose' : 'Read Full Narrative'} &rarr;
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Full Story Modal */}
      {selectedStory && (
        <div className="modal-overlay open" onClick={() => setSelectedStory(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div className="modal-header-text">
                <span
                  className="story-pill"
                  style={{
                    backgroundColor: `${selectedStory.tagColor}22`,
                    color: selectedStory.tagColor,
                    borderColor: `${selectedStory.tagColor}55`,
                    marginBottom: '8px',
                    display: 'inline-block',
                  }}
                >
                  {selectedStory.content.tag} &bull; {selectedStory.content.date}
                </span>
                <h3>{selectedStory.content.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedStory(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="story-modal-quote">
                <p>{selectedStory.content.quote}</p>
                <div className="story-modal-quote-author">&mdash; {selectedStory.content.quoteAuthor}</div>
              </div>

              <div className="story-modal-paragraphs">
                {Array.isArray(selectedStory.content.fullBody) ? (
                  selectedStory.content.fullBody.map((p, idx) => (
                    <p key={idx} style={{ marginBottom: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                      {p}
                    </p>
                  ))
                ) : (
                  <p style={{ marginBottom: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {selectedStory.content.fullBody}
                  </p>
                )}
              </div>

              <div className="story-modal-partner-box">
                <strong>{isRw ? 'Ubufatanye bw\'Abafatanyabikorwa:' : 'Project Delivery Partners:'}</strong>
                <p>Global Affairs Canada &bull; IISD &bull; WRI &bull; City of Kigali &bull; Rwanda Forestry Authority</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
