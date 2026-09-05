import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';
import fs from 'fs';
import path from 'path';

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

    // Persist updates synchronously to src/data/indicators.json
    try {
      const indFilePath = path.join(process.cwd(), 'src/data/indicators.json');
      if (fs.existsSync(indFilePath)) {
        const raw = fs.readFileSync(indFilePath, 'utf-8');
        const jsonContent = JSON.parse(raw);
        if (Array.isArray(jsonContent.indicators)) {
          const idx = jsonContent.indicators.findIndex((i: any) => i.id === params.id);
          if (idx >= 0) {
            jsonContent.indicators[idx] = {
              ...jsonContent.indicators[idx],
              ...updates,
            };
            fs.writeFileSync(indFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8');
          }
        }
      }
    } catch (fsErr) {
      console.warn('Failed to sync indicators.json file on disk:', fsErr);
    }

    return NextResponse.json({ success: true, data: updated, driver: db.name, message: 'Indicator updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return PATCH(req, context);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase();
    const deleted = await db.deleteIndicator(params.id);

    // Also purge from src/data/indicators.json and indicator_narratives.json
    try {
      // Purge from indicators.json
      const indFilePath = path.join(process.cwd(), 'src/data/indicators.json');
      if (fs.existsSync(indFilePath)) {
        const raw = fs.readFileSync(indFilePath, 'utf-8');
        const jsonContent = JSON.parse(raw);
        jsonContent.indicators = jsonContent.indicators.filter((i: any) => i.id !== params.id);
        fs.writeFileSync(indFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8');
      }

      // Purge from indicator_narratives.json
      const narrativeFilePath = path.join(process.cwd(), 'src/data/locales/indicator_narratives.json');
      if (fs.existsSync(narrativeFilePath)) {
        const rawNarrative = fs.readFileSync(narrativeFilePath, 'utf-8');
        const narrativeJson = JSON.parse(rawNarrative);
        if (narrativeJson[params.id]) {
          delete narrativeJson[params.id];
          fs.writeFileSync(narrativeFilePath, JSON.stringify(narrativeJson, null, 2), 'utf-8');
        }
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
