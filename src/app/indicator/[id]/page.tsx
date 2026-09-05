'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import indicatorsData from '@/data/indicators.json';
import { Indicator } from '@/lib/db/types';
import { MYPEG_THEMES } from '@/components/MyPegLeftSidebar';
import MyPegIndicatorChartView from '@/components/MyPegIndicatorChartView';
import CollaboratorsFooter from '@/components/CollaboratorsFooter';
import { useLocale } from '@/components/MyPegAppShell';

export default function IndicatorPage() {
  const params = useParams();
  const id = params?.id as string;
  const { locale } = useLocale();

  const indicator = (indicatorsData.indicators as Indicator[]).find((i) => i.id === id);

  if (!indicator) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#ffffff', minHeight: '80vh' }}>
        <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Indicator Not Found</h2>
        <p style={{ marginTop: '14px', color: '#64748b' }}>
          The requested indicator &quot;{id}&quot; could not be located in the dataset.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '24px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 600,
          }}
        >
          &larr; Return to Home Overview
        </Link>
      </div>
    );
  }

  const activeTheme = MYPEG_THEMES.find((t) => t.id === indicator.theme) || MYPEG_THEMES[0];

  return (
    <>
      {/* Screenshot 2 Exact Replica: Top accent line, serif title, definition, blue line graph, all years, download link */}
      <MyPegIndicatorChartView
        indicator={indicator}
        themeColor={activeTheme.color}
        locale={locale}
      />

      {/* Collaborators Dark Footer (Screenshot 2 Bottom) */}
      <CollaboratorsFooter />
    </>
  );
}
