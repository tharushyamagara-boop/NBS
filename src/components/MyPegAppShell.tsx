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

  // Drawer starts closed by default, opening only on explicit theme click
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Close mobile dropdown menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile dropdown menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
        <div className="admin-root-container" style={{ minHeight: '100vh', background: '#ffffff', width: '100%' }}>
          {children}
        </div>
      </LocaleContext.Provider>
    );
  }

  // If on embed route, render clean standalone embed container without header/sidebar/footer
  if (pathname.startsWith('/embed')) {
    return (
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <div className="mypeg-embed-standalone-root" style={{ minHeight: '100%', background: '#ffffff', width: '100%', margin: 0, padding: 0 }}>
          {children}
        </div>
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div className="mypeg-root-app-shell">
        {/* 1. Top Header / App Bar (Spans Full Width at Level 0) */}
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
                {locale === 'rw' ? 'Ibisubizo Kamere (NbS)' : 'Nature-Based Solutions'}
              </span>
            </div>
          </div>

          {/* View Switcher Navigation - Desktop Only */}
          <div className="mypeg-view-switcher-group desktop-only" role="group" aria-label="Dashboard View Switcher">
            <Link
              href="/"
              className={`mypeg-view-btn ${pathname === '/' ? 'active' : ''}`}
              title="Overview"
            >
              {locale === 'rw' ? 'Ahabanza' : 'Overview'}
            </Link>
            <Link
              href="/indicator/area_restored_ha"
              className={`mypeg-view-btn ${pathname.includes('/indicator/area_restored_ha') ? 'active' : ''}`}
              title="Kigali Hectares Restored Indicator Page"
            >
              {locale === 'rw' ? 'Hegitari Zasanywe' : 'Hectares Restored'}
            </Link>
            <Link
              href="/indicator/trees_planted"
              className={`mypeg-view-btn ${pathname.includes('/indicator/trees_planted') ? 'active' : ''}`}
              title="Kigali Seedlings & Trees Planted Indicator Page"
            >
              {locale === 'rw' ? 'Ibiti Byatewe' : 'Trees Planted'}
            </Link>
          </div>

          {/* Right Controls: Language Switcher & Mobile Menu Hamburger Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mypeg-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Collapsible Menu Backdrop */}
        {mobileMenuOpen && (
          <div
            className="mypeg-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.45)',
              zIndex: 1040,
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Mobile Dropdown Collapsible Menu */}
        {mobileMenuOpen && (
          <div className="mypeg-mobile-dropdown-menu" id="mypeg-mobile-menu">
            <div className="mypeg-mobile-nav-links">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`mypeg-mobile-nav-item ${pathname === '/' ? 'active' : ''}`}
              >
                <span>{locale === 'rw' ? 'Ahabanza (Overview)' : 'Overview Dashboard'}</span>
              </Link>
              <Link
                href="/indicator/area_restored_ha"
                onClick={() => setMobileMenuOpen(false)}
                className={`mypeg-mobile-nav-item ${pathname.includes('/indicator/area_restored_ha') ? 'active' : ''}`}
              >
                <span>{locale === 'rw' ? 'Hegitari Zasanywe (Restoration)' : 'Hectares Restored'}</span>
              </Link>
              <Link
                href="/indicator/trees_planted"
                onClick={() => setMobileMenuOpen(false)}
                className={`mypeg-mobile-nav-item ${pathname.includes('/indicator/trees_planted') ? 'active' : ''}`}
              >
                <span>{locale === 'rw' ? 'Ibiti Byatewe (Trees Planted)' : 'Trees Planted'}</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mypeg-mobile-nav-item admin-link"
              >
                <span>{locale === 'rw' ? 'Ubuyobozi (Admin Portal)' : 'Admin Console'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. Left Sticky Navigation Rail & Expandable Theme Drawer (Starts BELOW Header) */}
        <MyPegLeftSidebar
          indicators={indicators}
          activeThemeId={activeThemeId}
          selectedIndicatorId={currentIndicatorId || 'area_restored_ha'}
          defaultDrawerOpen={drawerOpen}
          locale={locale}
        />

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
