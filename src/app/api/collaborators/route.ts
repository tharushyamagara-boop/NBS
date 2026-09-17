import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultCollaborators from '@/data/collaborators.json';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/collaborators.json');
    let data = defaultCollaborators;

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(raw);
      } catch (e) {
        // fallback to imported
      }
    }

    const list = (data.collaborators || [])
      .filter((c: any) => c.is_active !== false)
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
      { success: false, error: error.message || 'Failed to fetch collaborators' },
      { status: 500 }
    );
  }
}
