'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Indicator } from '@/lib/db/types';

export interface ThemeDef {
  id: string;
  name_en: string;
  name_rw: string;
  color: string;
  icon: string;
}

export const MYPEG_THEMES: ThemeDef[] = [
  {
    id: 'climate',
    name_en: 'Climate Adaptation',
    name_rw: 'Kwirinda Imihindagurikire',
    color: '#0284c7',
    icon: 'cloud-rain',
  },
  {
    id: 'biodiversity',
    name_en: 'Biodiversity Protection',
    name_rw: 'Kubungabunga Urusobe',
    color: '#10b981',
    icon: 'trees',
  },
  {
    id: 'gesi',
    name_en: 'Gender & Inclusion (GESI)',
    name_rw: 'Uburinganire (GESI)',
    color: '#8b5cf6',
    icon: 'users',
  },
  {
    id: 'economy',
    name_en: 'Employment & Economy',
    name_rw: 'Imirimo n\'Ubukungu',
    color: '#f59e0b',
    icon: 'trending-up',
  },
  {
    id: 'mypeg_benchmark',
    name_en: 'Built Environment (MyPeg)',
    name_rw: 'Imiturire (MyPeg)',
    color: '#eb6b23',
    icon: 'building',
  },
];

const TITLE_MAP_EN: Record<string, string> = {
  area_restored_ha: 'Area Restored through NbS (ha)',
  flood_risk_reduction: 'Flash Flood Peak Runoff Reduction',
  soil_erosion_prevented: 'Soil Loss & Sediment Prevented',
  trees_planted: 'Seedlings & Native Trees Planted',
  tree_survival_rate: 'Canopy Cover & Tree Survival Rate',
  riparian_buffer_km: 'Riparian Buffer Zone Protected (km)',
  water_quality_index: 'Surface Water Quality Index',
  women_leadership_catchment: 'Women in Catchment Leadership',
  participants_trained: 'Community & Youth Trained in NbS',
  green_jobs_created: 'Direct Green Jobs Created',
  female_nursery_operators: 'Women-Led Nursery Cooperatives',
  vulnerable_youth_employed: 'Vulnerable Youth Employed',
  building_permit_values: 'Building Permit Values',
  collision_victims: 'Collision Victims',
};

const TITLE_MAP_RW: Record<string, string> = {
  area_restored_ha: 'Hegitari Zasanywe (NbS)',
  flood_risk_reduction: 'Kugabanya Ubukana bw\'Imyuzure',
  soil_erosion_prevented: 'Igitaka n\'Isuri Byakumiwe',
  trees_planted: 'Ingemwe n\'Ibiti Byatewe',
  tree_survival_rate: 'Ijanisha ry\'Ibiti Bikura Neza',
  riparian_buffer_km: 'Inkombe z\'Imigezi Zabungabunzwe',
  water_quality_index: 'Isesengura ry\'Amazi Meza',
  women_leadership_catchment: 'Abagore mu Buyobozi bw\'Ibibaya',
  participants_trained: 'Abaturage Bahuguwe muri NbS',
  green_jobs_created: 'Iminsi y\'Akazi k\'Icyatsi Kahanzwe',
  female_nursery_operators: 'Ubuhumbikiro bw\'Abagore',
  vulnerable_youth_employed: 'Urubyiruko mu Mirimo ya GIS',
  building_permit_values: 'Agaciro k\'Impushya zo Kubaka',
  collision_victims: 'Abagize Impanuka zo mu Muhanda',
};

interface MyPegLeftSidebarProps {
  indicators: Indicator[];
  activeThemeId?: string;
  selectedIndicatorId?: string | null;
  defaultDrawerOpen?: boolean;
  locale?: 'en' | 'rw';
}

export default function MyPegLeftSidebar({
  indicators,
  activeThemeId: initialThemeId = 'climate',
  selectedIndicatorId = null,
  defaultDrawerOpen = true,
  locale = 'en',
}: MyPegLeftSidebarProps) {
  const pathname = usePathname();
  const [activeThemeId, setActiveThemeId] = useState<string>(initialThemeId);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(defaultDrawerOpen);

  useEffect(() => {
    setActiveThemeId(initialThemeId);
  }, [initialThemeId]);

  const activeTheme = MYPEG_THEMES.find((t) => t.id === activeThemeId) || MYPEG_THEMES[0];
  const themeName = locale === 'rw' ? activeTheme.name_rw : activeTheme.name_en;

  // Indicators belonging to active theme
  const themeIndicators = indicators.filter((ind) => ind.theme === activeTheme.id);

  // Render SVG icons matching the theme
  const renderThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'cloud-rain':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 10.5C3.12 10.5 2 11.62 2 13s1.12 2.5 2.5 2.5h.7c.07.78.39 1.5.9 2.07l1.41-1.41c-.32-.38-.51-.87-.51-1.41 0-1.2.9-2.18 2.07-2.24l.43-.02.1-.42C9.9 10.74 11.08 9.5 12.5 9.5c1.47 0 2.69 1.15 2.89 2.61l.07.5.49.12c1.3.32 2.25 1.5 2.25 2.87 0 1.66-1.34 3-3 3h-.7l1.41 1.41c.4-.38.71-.85.89-1.41h1.4c2.48 0 4.5-2.02 4.5-4.5 0-2.34-1.78-4.26-4.08-4.47C18.15 6.91 15.58 5 12.5 5c-3.19 0-5.83 2.05-6.66 5.03-.43-.02-.87-.03-1.34-.03zM8 19v3h2v-3H8zm4 0v3h2v-3h-2zm4 0v3h2v-3h-2z" />
          </svg>
        );
      case 'trees':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 6l-3.5 5h2L9 16h4v4h2v-4h4l-3.5-5h2L14 6zm-7 4l-3 4.5h1.7L3 18h3v3h2v-3h3l-2.7-3.5H10L7 10z" />
          </svg>
        );
      case 'users':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        );
      case 'trending-up':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
        );
      case 'building':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 21V9l4-2v14H4zm6 0V3l8 4v14h-8zm10 0v-8l-2-1v9h2z" />
          </svg>
        );
      default:
        return <span>●</span>;
    }
  };

  // Helper for dual indicator badges inside drawer
  const renderDualIcon = (dualIcon?: string) => {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginRight: '10px',
          opacity: 0.9,
          flexShrink: 0,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 21V9l4-2v14H4zm6 0V3l8 4v14h-8zm10 0v-8l-2-1v9h2z" />
        </svg>

        {dualIcon === 'dollar' && (
          <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>$</span>
        )}
        {dualIcon === 'leaf' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>
        )}
        {dualIcon === 'tree' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L6 11h3l-4 7h6v4h2v-4h6l-4-7h3L12 2z" />
          </svg>
        )}
        {dualIcon === 'users' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <aside className="mypeg-left-nav-container" aria-label="MyPeg Theme Navigation">
      {/* 1. Vertical Icon Strip (Fixed to far left, 58px width) */}
      <nav className="mypeg-icon-rail">
        {MYPEG_THEMES.map((theme) => {
          const isActive = activeThemeId === theme.id;
          const currentThemeName = locale === 'rw' ? theme.name_rw : theme.name_en;

          return (
            <button
              key={theme.id}
              type="button"
              className={`mypeg-rail-btn ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: theme.color,
                color: '#ffffff',
              }}
              onClick={() => {
                if (activeThemeId === theme.id && drawerOpen) {
                  setDrawerOpen(false);
                } else {
                  setActiveThemeId(theme.id);
                  setDrawerOpen(true);
                }
              }}
              title={currentThemeName}
              aria-label={currentThemeName}
              aria-expanded={isActive && drawerOpen}
            >
              <div className="mypeg-rail-icon-wrap">
                {renderThemeIcon(theme.icon)}
              </div>
              <span className="mypeg-rail-label">{currentThemeName}</span>
            </button>
          );
        })}

        {/* Home / Hero Link at bottom */}
        <Link
          href="/"
          className="mypeg-rail-home-btn"
          title={locale === 'rw' ? 'Ahabanza (Home)' : 'Return to Home'}
          aria-label="Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {locale === 'rw' ? 'Ahabanza' : 'Home'}
          </span>
        </Link>
      </nav>

      {/* 2. Expanding Theme Flyout Drawer (Adjacent to rail, takes active theme color) */}
      {drawerOpen && (
        <div
          className="mypeg-theme-drawer"
          style={{
            backgroundColor: activeTheme.color,
            color: '#ffffff',
          }}
          role="region"
          aria-label={`${themeName} indicators`}
        >
          {/* Drawer Header */}
          <div className="mypeg-drawer-header">
            <h3 className="mypeg-drawer-title">{themeName}</h3>
            <button
              type="button"
              className="mypeg-drawer-close-btn"
              onClick={() => setDrawerOpen(false)}
              title="Close menu"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* List of Indicators as Real Next.js Links to Separate Pages */}
          <ul className="mypeg-drawer-list">
            {themeIndicators.map((ind) => {
              const isSelected = selectedIndicatorId === ind.id || pathname === `/indicator/${ind.id}`;
              const titleMap = locale === 'rw' ? TITLE_MAP_RW : TITLE_MAP_EN;
              const title = titleMap[ind.id] || ind.id.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

              return (
                <li key={ind.id} className="mypeg-drawer-item-wrap">
                  <Link
                    href={`/indicator/${ind.id}`}
                    className={`mypeg-drawer-item-btn ${isSelected ? 'active-selected' : ''}`}
                    title={`View ${title} page`}
                  >
                    {renderDualIcon(ind.dual_icon)}
                    <span className="mypeg-drawer-item-text">{title}</span>
                  </Link>
                </li>
              );
            })}

            {themeIndicators.length === 0 && (
              <li style={{ padding: '20px 16px', fontSize: '0.88rem', opacity: 0.85 }}>
                {locale === 'rw' ? 'Nta bipimo biraboneka muri iki cyiciro.' : 'No indicators currently in this category.'}
              </li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}
