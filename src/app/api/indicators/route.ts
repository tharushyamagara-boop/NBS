import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';

export async function GET() {
  try {
    const db = getDatabase();
    const indicators = await db.getIndicators();
    return NextResponse.json({ success: true, count: indicators.length, data: indicators, driver: db.name });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDatabase();
    const body = await req.json();
    if (!body.id || !body.theme) {
      return NextResponse.json({ success: false, error: 'Missing required indicator fields (id, theme).' }, { status: 400 });
    }
    const created = await db.createIndicator(body);
    return NextResponse.json({ success: true, data: created, driver: db.name }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
