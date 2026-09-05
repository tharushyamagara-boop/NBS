'use client';

import React from 'react';
import { Indicator } from '@/lib/db/types';
import indicatorNarratives from '../data/locales/indicator_narratives.json';

interface MyPegThemeNavProps {
  indicators: Indicator[];
  activeTheme: string;
  onSelectTheme: (theme: string) => void;
  selectedIndicatorId: string | null;
  onSelectIndicator: (indicator: Indicator) => void;
  locale: 'en' | 'rw';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MyPegThemeNav({
  indicators,
  activeTheme,
  onSelectTheme,
  selectedIndicatorId,
  onSelectIndicator,
  locale,
  searchQuery,
  onSearchChange,
}: MyPegThemeNavProps) {
  const isRw = locale === 'rw';

  const themes = [
    {
      id: 'all',
      name: isRw ? 'Inkingi Zose' : 'All Themes',
      icon: '🌐',
      color: '#38bdf8',
    },
    {
      id: 'climate',
      name: isRw ? 'Kwirinda Imihindagurikire' : 'Climate Adaptation',
      icon: '🌿',
      color: '#0284c7',
    },
    {
      id: 'biodiversity',
      name: isRw ? 'Urusobe rw\'Ibinyabuzima' : 'Biodiversity Protection',
      icon: '🌳',
      color: '#10b981',
    },
    {
      id: 'gesi',
      name: isRw ? 'Uburinganire (GESI)' : 'Gender & Social Inclusion',
      icon: '⚖️',
      color: '#8b5cf6',
    },
    {
      id: 'economy',
      name: isRw ? 'Ubukungu n\'Imirimo' : 'Employment & Economy',
      icon: '💼',
      color: '#f59e0b',
    },
  ];

  const getNarrativeTitle = (id: string) => {
    const raw = (indicatorNarratives as Record<string, any>)[id];
    if (!raw) return id;
    const localized = raw[locale] || raw.en;
    return localized ? localized.title : id;
  };

  const filtered = indicators.filter((ind) => {
    if (activeTheme !== 'all' && ind.theme !== activeTheme) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = getNarrativeTitle(ind.id).toLowerCase();
      const fmes = ind.fmes_code.toLowerCase();
      const align = ind.fmes_alignment.toLowerCase();
      return title.includes(q) || fmes.includes(q) || align.includes(q);
    }
    return true;
  });

  return (
    <div className="mypeg-nav-container">
      {/* Search & Filter Header */}
      <div className="mypeg-nav-header">
        <div className="mypeg-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            className="mypeg-search-input"
            placeholder={
              isRw
                ? 'Shakisha igipimo, agace, kode ya FMES...'
                : 'Search 11 indicators by keyword, micro-catchment, or FMES code...'
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search indicators"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
            >
              &times;
            </button>
          )}
        </div>

        {/* Theme Pills Navigator */}
        <div className="mypeg-theme-pills-row" role="tablist" aria-label="Theme categories">
          {themes.map((th) => {
            const isActive = activeTheme === th.id;
            const count =
              th.id === 'all'
                ? indicators.length
                : indicators.filter((i) => i.theme === th.id).length;

            return (
              <button
                key={th.id}
                type="button"
                className={`mypeg-theme-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTheme(th.id)}
                style={{
                  '--theme-color': th.color,
                } as any}
                role="tab"
                aria-selected={isActive}
              >
                <span className="theme-chip-icon">{th.icon}</span>
                <span className="theme-chip-label">{th.name}</span>
                <span className="theme-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Click Indicator Ribbon */}
      <div className="mypeg-indicator-ribbon">
        <div className="ribbon-prompt">
          <span className="pulse-dot"></span>
          <span>
            {isRw
              ? 'Kanda ku gipimo hasi kugira ngo kigaragare mu mbonerahamwe ya MyPeg hejuru:'
              : 'Two-Click Navigation: Select an indicator below to load its full MyPeg workspace:'}
          </span>
        </div>

        <div className="mypeg-indicator-list" role="list">
          {filtered.map((ind) => {
            const isSelected = selectedIndicatorId === ind.id;
            const title = getNarrativeTitle(ind.id);
            const pct = Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100));

            const themeColorMap: Record<string, string> = {
              climate: '#0284c7',
              biodiversity: '#10b981',
              gesi: '#8b5cf6',
              economy: '#f59e0b',
            };
            const col = themeColorMap[ind.theme] || '#10b981';

            return (
              <button
                key={ind.id}
                type="button"
                className={`mypeg-indicator-list-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectIndicator(ind)}
                style={{
                  '--item-accent': col,
                } as any}
                role="listitem"
              >
                <div className="item-left">
                  <div className="item-color-bar" style={{ backgroundColor: col }}></div>
                  <div className="item-text-group">
                    <div className="item-meta-row">
                      <span className="fmes-pill mini">{ind.fmes_code}</span>
                      <span className="item-theme-name">{ind.theme}</span>
                    </div>
                    <div className="item-title">{title}</div>
                  </div>
                </div>

                <div className="item-right">
                  <div className="item-metric-val">
                    <strong>{ind.current_2025.toLocaleString()}</strong>
                    <span className="item-metric-unit"> {ind.unit}</span>
                  </div>

                  <div className="item-progress-mini">
                    <div
                      className="item-progress-fill"
                      style={{ width: `${pct}%`, backgroundColor: col }}
                    ></div>
                  </div>
                  <span className="item-pct-label">{pct}%</span>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="no-indicators-found">
              <p>
                {isRw
                  ? 'Nta bipimo bibonetse bihuye n\'ibyo mushakishije.'
                  : 'No indicators found matching your search. Please adjust your query or theme filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
