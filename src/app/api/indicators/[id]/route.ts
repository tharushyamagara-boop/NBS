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
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Indicator not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `Deleted ${params.id}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
