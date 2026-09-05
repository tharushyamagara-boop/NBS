'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import indicatorsData from '@/data/indicators.json';
import { Indicator } from '@/lib/db/types';
import MyPegLeftSidebar, { MYPEG_THEMES } from './MyPegLeftSidebar';
import SocialShareRail from './SocialShareRail';

interface LocaleContextType {
  locale: 'en' | 'rw';
  setLocale: (l: 'en' | 'rw') => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

interface MyPegAppShellProps {
  children: React.ReactNode;
}

export default function MyPegAppShell({ children }: MyPegAppShellProps) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'en' | 'rw'>('en');
  const indicators = indicatorsData.indicators as Indicator[];

  // Determine active indicator from pathname (e.g. /indicator/area_restored_ha)
  const currentIndicatorId = pathname.startsWith('/indicator/')
    ? pathname.replace('/indicator/', '')
    : null;

  const currentIndicator = currentIndicatorId
    ? indicators.find((ind) => ind.id === currentIndicatorId)
    : null;

  // Active theme defaults to indicator's theme or 'climate' (first SUNCASA theme)
  const activeThemeId = currentIndicator ? currentIndicator.theme : 'climate';

  // Drawer defaults to open on home page (Screenshot 1), or closed on indicator page (Screenshot 2)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(pathname === '/');

  // Purge any old stale service worker cache and unregister service workers
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    }
  }, []);

  // If on admin route, render clean standalone layout without public rails
  if (pathname.startsWith('/admin')) {
    return (
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <div className="admin-root-container" style={{ minHeight: '100vh', background: '#0a111e', width: '100%' }}>
          {children}
        </div>
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div className="mypeg-root-app-shell">
        {/* 1. Left Sticky Navigation Rail & Expandable Theme Drawer */}
        <MyPegLeftSidebar
          indicators={indicators}
          activeThemeId={activeThemeId}
          selectedIndicatorId={currentIndicatorId || 'area_restored_ha'}
          defaultDrawerOpen={drawerOpen}
          locale={locale}
        />

        {/* 2. Top Header / App Bar (Public - No Admin Link) */}
        <header className="mypeg-top-bar" id="mypeg-top-nav">
          <div className="mypeg-top-bar-left">
            <Link href="/" className="mypeg-badge-sk" title="Return to Home">
              SK
            </Link>
            <div className="mypeg-top-bar-title">
              <Link href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>
                SUNCASA Kigali
              </Link>
              <span className="mypeg-top-bar-sub">
                {locale === 'rw' ? 'Ibisubizo Kamere (NbS) & MyPeg' : 'Nature-Based Solutions & MyPeg Architecture'}
              </span>
            </div>
          </div>

          {/* View Switcher Navigation */}
          <div className="mypeg-view-switcher-group" role="group" aria-label="Dashboard View Switcher">
            <Link
              href="/"
              className={`mypeg-view-btn ${pathname === '/' ? 'active' : ''}`}
              title="Screenshot 1: Hero View with Left Menus"
            >
              🖼️ {locale === 'rw' ? 'Ahabanza (Hero)' : 'Screenshot 1: Hero View'}
            </Link>
            <Link
              href="/indicator/area_restored_ha"
              className={`mypeg-view-btn ${pathname.includes('/indicator/area_restored_ha') ? 'active' : ''}`}
              title="Kigali Hectares Restored Indicator Page"
            >
              🌱 {locale === 'rw' ? 'Hegitari Zasanywe' : 'Hectares Restored'}
            </Link>
            <Link
              href="/indicator/building_permit_values"
              className={`mypeg-view-btn ${pathname.includes('/indicator/building_permit_values') ? 'active' : ''}`}
              title="Screenshot 2: Building Permit Values Benchmark"
            >
              📊 {locale === 'rw' ? 'MyPeg Imbonerahamwe' : 'Screenshot 2: Chart View'}
            </Link>
          </div>

          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="lang-switcher" role="group" aria-label="Language Selector">
              <button
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                onClick={() => setLocale('en')}
                type="button"
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
              <button
                className={`lang-btn ${locale === 'rw' ? 'active' : ''}`}
                onClick={() => setLocale('rw')}
                type="button"
                aria-pressed={locale === 'rw'}
              >
                RW
              </button>
            </div>
          </div>
        </header>

        {/* 3. Main Page Content (Offset 58px for Left Rail) */}
        <div className="mypeg-main-viewport">
          {children}
        </div>

        {/* 4. Floating Social Share Rail (Right Edge) */}
        <SocialShareRail />
      </div>
    </LocaleContext.Provider>
  );
}
