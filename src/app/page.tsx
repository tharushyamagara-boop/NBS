'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MyPegHeroView from '@/components/MyPegHeroView';
import CollaboratorsFooter from '@/components/CollaboratorsFooter';
import { useLocale } from '@/components/MyPegAppShell';

export default function Home() {
  const router = useRouter();
  const { locale } = useLocale();

  const handleSelectIndicator = (indicatorId: string) => {
    router.push(`/indicator/${indicatorId}`);
  };

  return (
    <>
      {/* Screenshot 1 Exact Replica: Hero with river background, radial emblem, tagline, scroll, latest updates */}
      <MyPegHeroView
        onSelectIndicator={handleSelectIndicator}
        locale={locale}
      />

      {/* Collaborators Dark Footer */}
      <CollaboratorsFooter />
    </>
  );
}

