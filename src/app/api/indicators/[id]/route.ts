import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase();
    const item = await db.getIndicatorById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Indicator not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item, driver: db.name });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase();
    const updates = await req.json();
    const updated = await db.updateIndicator(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Indicator not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, driver: db.name });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase();
    const deleted = await db.deleteIndicator(params.id);

    // Also purge from src/data/indicators.json and indicator_narratives.json
    try {
      const fs = await import('fs');
      const path = await import('path');

      // Purge from indicators.json
      const indFilePath = path.join(process.cwd(), 'src/data/indicators.json');
      const raw = fs.readFileSync(indFilePath, 'utf-8');
      const jsonContent = JSON.parse(raw);
      jsonContent.indicators = jsonContent.indicators.filter((i: any) => i.id !== params.id);
      fs.writeFileSync(indFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8');

      // Purge from indicator_narratives.json
      const narrativeFilePath = path.join(process.cwd(), 'src/data/locales/indicator_narratives.json');
      const rawNarrative = fs.readFileSync(narrativeFilePath, 'utf-8');
      const narrativeJson = JSON.parse(rawNarrative);
      if (narrativeJson[params.id]) {
        delete narrativeJson[params.id];
        fs.writeFileSync(narrativeFilePath, JSON.stringify(narrativeJson, null, 2), 'utf-8');
      }
    } catch (fsErr) {
      console.warn('Failed to purge from file system (expected on serverless):', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: `Indicator '${params.id}' and its associated narratives were successfully removed.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
