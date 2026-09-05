import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';
import indicatorsData from '@/data/indicators.json';

// CORS response helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const themeFilter = searchParams.get('theme');
    const statusFilter = searchParams.get('status');
    const fmesCode = searchParams.get('fmes_code');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const db = getDatabase();
    let indicators = await db.getIndicators();

    const fallbackList = (indicatorsData.indicators || []) as any[];
    if (!indicators || indicators.length < fallbackList.length) {
      indicators = fallbackList;
    }

    let filtered = [...indicators];

    if (themeFilter) {
      filtered = filtered.filter((i) => i.theme?.toLowerCase() === themeFilter.toLowerCase());
    }

    if (statusFilter) {
      filtered = filtered.filter((i) => i.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (fmesCode) {
      filtered = filtered.filter((i) => i.fmes_code?.toLowerCase() === fmesCode.toLowerCase());
    }

    const total = filtered.length;
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return NextResponse.json(
      {
        success: true,
        version: '1.0',
        count: filtered.length,
        total,
        data: filtered,
        metadata: {
          project: 'SUNCASA Kigali NbS Monitoring & Evaluation Dashboard',
          organization: 'City of Kigali & Rwanda Forestry Authority',
          technical_partners: ['WRI', 'IISD', 'PEG Winnipeg'],
          license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
          documentation_url: '/admin#interoperability',
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        version: '1.0',
        error: error.message || 'Internal server error',
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
