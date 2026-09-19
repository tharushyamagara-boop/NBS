import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultData from '@/data/social_links.json';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/social_links.json');
    let data = defaultData;

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(raw);
      } catch {
        // fallback to defaultData
      }
    }

    const list = (data.social_links || [])
      .filter((s: any) => s.is_active !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json(
      {
        success: true,
        count: list.length,
        data: list,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}
