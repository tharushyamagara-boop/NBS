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
    if (!body.id || !body.theme) {
      return NextResponse.json({ success: false, error: 'Missing required indicator fields (id, theme).' }, { status: 400 });
    }
    const created = await db.createIndicator(body);
    return NextResponse.json({ success: true, data: created, driver: db.name }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
