import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';
import indicatorsData from '@/data/indicators.json';
import indicatorNarratives from '@/data/locales/indicator_narratives.json';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const indicatorId = params.id;
    const db = getDatabase();
    let indicator = await db.getIndicatorById(indicatorId);

    if (!indicator) {
      const fallbackList = (indicatorsData.indicators || []) as any[];
      indicator = fallbackList.find((i) => i.id === indicatorId);
    }

    if (!indicator) {
      return NextResponse.json(
        {
          success: false,
          version: '1.0',
          error: `Indicator with id '${indicatorId}' not found.`,
        },
        {
          status: 404,
          headers: corsHeaders(),
        }
      );
    }

    // Attach localized narratives if available
    const narratives = (indicatorNarratives as Record<string, any>)[indicatorId] || null;

    return NextResponse.json(
      {
        success: true,
        version: '1.0',
        data: {
          ...indicator,
          narratives,
        },
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
