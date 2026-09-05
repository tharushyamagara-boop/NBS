import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getNarrativeFilePath = () => path.join(process.cwd(), 'src/data/locales/indicator_narratives.json');

function readNarratives(): Record<string, any> {
  const filePath = getNarrativeFilePath();
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeNarratives(data: Record<string, any>) {
  const filePath = getNarrativeFilePath();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const narratives = readNarratives();

    if (id) {
      if (!narratives[id]) {
        return NextResponse.json({ success: false, error: `Narrative for indicator '${id}' not found.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: narratives[id] });
    }

    return NextResponse.json({ success: true, data: narratives });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const narratives = readNarratives();

    if (body.indicatorId && body.narrative) {
      const id = body.indicatorId;
      const incoming = body.narrative;

      narratives[id] = {
        en: {
          ...(narratives[id]?.en || {}),
          ...(incoming.en || {}),
        },
        rw: {
          ...(narratives[id]?.rw || {}),
          ...(incoming.rw || {}),
        },
      };

      writeNarratives(narratives);
      return NextResponse.json({
        success: true,
        data: narratives[id],
        message: `Narrative for indicator '${id}' saved successfully.`,
      });
    } else if (body.narratives && typeof body.narratives === 'object') {
      // Full batch replacement
      const merged = { ...narratives, ...body.narratives };
      writeNarratives(merged);
      return NextResponse.json({
        success: true,
        data: merged,
        message: 'All indicator narratives updated successfully.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: provide indicatorId and narrative object, or narratives dict.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
