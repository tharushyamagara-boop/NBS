import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';

export async function GET() {
  try {
    const rawData = (await import('@/data/indicators.json')).default || (await import('@/data/indicators.json'));
    const localList = rawData.indicators || [];
    const db = getDatabase();
    let indicators = await db.getIndicators();
    if (!indicators || indicators.length < localList.length) {
      indicators = localList;
    }
    return NextResponse.json({
      success: true,
      count: indicators.length,
      data: indicators,
      driver: db.name
    });
  } catch (error: any) {
    const rawData = (await import('@/data/indicators.json')).default || (await import('@/data/indicators.json'));
    const fallbackList = rawData.indicators || [];
    return NextResponse.json({
      success: true,
      count: fallbackList.length,
      data: fallbackList,
      driver: 'Local Fallback'
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDatabase();
    const body = await req.json();
    const { indicator, narrative_en, narrative_rw } = body;

    const indData = indicator || body;

    if (!indData.id || !indData.theme) {
      return NextResponse.json(
        { success: false, error: 'Missing required indicator fields (id, theme).' },
        { status: 400 }
      );
    }

    // 1. Create in active database adapter
    let created;
    try {
      created = await db.createIndicator(indData);
    } catch (dbErr: any) {
      // If already exists in memory adapter, continue to ensure file sync
      created = indData;
    }

    // 2. Persist directly to src/data/indicators.json
    try {
      const fs = await import('fs');
      const path = await import('path');
      const indFilePath = path.join(process.cwd(), 'src/data/indicators.json');
      const raw = fs.readFileSync(indFilePath, 'utf-8');
      const jsonContent = JSON.parse(raw);

      const existsIdx = jsonContent.indicators.findIndex((i: any) => i.id === indData.id);
      if (existsIdx >= 0) {
        jsonContent.indicators[existsIdx] = indData;
      } else {
        jsonContent.indicators.push(indData);
      }

      fs.writeFileSync(indFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8');

      // 3. Persist narratives if provided
      if (narrative_en || narrative_rw) {
        const narrativeFilePath = path.join(process.cwd(), 'src/data/locales/indicator_narratives.json');
        const rawNarrative = fs.readFileSync(narrativeFilePath, 'utf-8');
        const narrativeJson = JSON.parse(rawNarrative);

        narrativeJson[indData.id] = {
          en: narrative_en || {
            title: indData.definition,
            what_is: indData.definition,
            why_matters: 'Monitored under SUNCASA Kigali framework.',
            what_suncasa: 'SUNCASA implements and monitors this intervention.',
            limitations: 'Verified via field audits.',
            source: indData.data_source_citation || 'RFA / City of Kigali',
          },
          rw: narrative_rw || {
            title: indData.definition,
            what_is: indData.definition,
            why_matters: 'Iki gipimo gifasha kumenya iterambere rya NbS.',
            what_suncasa: 'SUNCASA ikorana n\'Umujyi wa Kigali na RFA.',
            limitations: 'Bigenzurwa mu mirimo yo mu kibaya.',
            source: indData.data_source_citation || 'RFA / Umujyi wa Kigali',
          },
        };

        fs.writeFileSync(narrativeFilePath, JSON.stringify(narrativeJson, null, 2), 'utf-8');
      }
    } catch (fsErr) {
      console.warn('Failed to persist to file system (expected on read-only serverless):', fsErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: `Indicator '${indData.id}' published successfully to public dashboard.`,
        driver: db.name,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
