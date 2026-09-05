import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/adapter';
import fs from 'fs';
import path from 'path';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function validateApiKey(req: NextRequest): { valid: boolean; keyInfo?: any; error?: string } {
  const apiKeyHeader = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!apiKeyHeader) {
    return { valid: false, error: 'Missing x-api-key or Authorization header.' };
  }

  try {
    const keysPath = path.join(process.cwd(), 'src/data/auth/api_keys.json');
    if (!fs.existsSync(keysPath)) {
      return { valid: false, error: 'API key authorization registry not configured.' };
    }
    const rawKeys = fs.readFileSync(keysPath, 'utf-8');
    const parsed = JSON.parse(rawKeys);
    const keyRecord = (parsed.keys || []).find((k: any) => k.key === apiKeyHeader && k.status === 'Active');

    if (!keyRecord) {
      return { valid: false, error: 'Invalid or revoked API key.' };
    }

    return { valid: true, keyInfo: keyRecord };
  } catch (err: any) {
    return { valid: false, error: `Authentication verification error: ${err.message}` };
  }
}

export async function POST(req: NextRequest) {
  const auth = validateApiKey(req);
  if (!auth.valid) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error || 'Unauthorized',
      },
      {
        status: 401,
        headers: corsHeaders(),
      }
    );
  }

  try {
    const body = await req.json();
    const db = getDatabase();

    // Body can be a single indicator payload or a batch array under "updates" or "data"
    let itemsToProcess: any[] = [];
    if (Array.isArray(body)) {
      itemsToProcess = body;
    } else if (Array.isArray(body.updates)) {
      itemsToProcess = body.updates;
    } else if (Array.isArray(body.data)) {
      itemsToProcess = body.data;
    } else if (body.indicator_id || body.id) {
      itemsToProcess = [body];
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payload structure. Expected an indicator object or an array under "updates".',
        },
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    // Read current indicators from disk for synchronous persistence
    const indFilePath = path.join(process.cwd(), 'src/data/indicators.json');
    let diskData: any = { indicators: [] };
    if (fs.existsSync(indFilePath)) {
      try {
        diskData = JSON.parse(fs.readFileSync(indFilePath, 'utf-8'));
      } catch (err) {
        console.warn('Error reading indicators.json:', err);
      }
    }

    const updatedIds: string[] = [];

    for (const item of itemsToProcess) {
      const id = item.indicator_id || item.id;
      if (!id) continue;

      // Find if exists
      const existing = await db.getIndicatorById(id);
      
      // Determine update payload
      const updates: any = {};
      if (typeof item.current_2025 === 'number') updates.current_2025 = item.current_2025;
      if (typeof item.target_2026 === 'number') updates.target_2026 = item.target_2026;
      if (item.unit) updates.unit = item.unit;
      if (item.status) updates.status = item.status;
      if (item.definition) updates.definition = item.definition;
      if (item.data_source) updates.data_source = item.data_source;
      if (item.last_updated) updates.last_updated = item.last_updated;
      if (item.fmes_code) updates.fmes_code = item.fmes_code;
      if (item.legend_label) updates.legend_label = item.legend_label;

      // New readings / telemetry appending to trend_history
      if (Array.isArray(item.trend_history)) {
        updates.trend_history = item.trend_history;
      } else if (item.new_reading && item.new_reading.period && typeof item.new_reading.value === 'number') {
        const currentTrends = existing?.trend_history || [];
        const existingIdx = currentTrends.findIndex((t: any) => t.period === item.new_reading.period);
        if (existingIdx >= 0) {
          currentTrends[existingIdx] = item.new_reading;
        } else {
          currentTrends.push(item.new_reading);
        }
        updates.trend_history = currentTrends;
        updates.current_2025 = item.new_reading.value;
      }

      // Site breakdown updates
      if (Array.isArray(item.site_breakdown)) {
        updates.site_breakdown = item.site_breakdown;
      }

      // GPS points updates
      if (Array.isArray(item.gps_points)) {
        updates.gps_points = item.gps_points;
      }

      // Apply to database adapter
      if (existing) {
        await db.updateIndicator(id, updates);
      } else {
        // Create indicator if all necessary fields are provided
        const newRecord = {
          id,
          theme: item.theme || 'climate',
          fmes_code: item.fmes_code || 'FMES-EXT',
          current_2025: item.current_2025 || 0,
          target_2026: item.target_2026 || 100,
          unit: item.unit || 'Units',
          status: item.status || 'Good Progress',
          definition: item.definition || 'External data ingested via SUNCASA Open Ingest API',
          data_source: item.data_source || auth.keyInfo?.name || 'External API',
          last_updated: item.last_updated || new Date().toISOString().split('T')[0],
          trend_history: item.trend_history || [],
          site_breakdown: item.site_breakdown || [],
          gps_points: item.gps_points || [],
          ...updates,
        };
        await db.createIndicator(newRecord);
      }

      // Sync to disk data
      const diskIdx = diskData.indicators.findIndex((i: any) => i.id === id);
      if (diskIdx >= 0) {
        diskData.indicators[diskIdx] = {
          ...diskData.indicators[diskIdx],
          ...updates,
          last_updated: updates.last_updated || new Date().toISOString().split('T')[0],
        };
      } else {
        diskData.indicators.push({
          id,
          theme: item.theme || 'climate',
          fmes_code: item.fmes_code || 'FMES-EXT',
          current_2025: item.current_2025 || 0,
          target_2026: item.target_2026 || 100,
          unit: item.unit || 'Units',
          status: item.status || 'Good Progress',
          definition: item.definition || 'External data ingested via SUNCASA Open Ingest API',
          data_source: item.data_source || auth.keyInfo?.name || 'External API',
          last_updated: item.last_updated || new Date().toISOString().split('T')[0],
          trend_history: item.trend_history || [],
          site_breakdown: item.site_breakdown || [],
          gps_points: item.gps_points || [],
          ...updates,
        });
      }

      updatedIds.push(id);
    }

    // Write back to src/data/indicators.json
    try {
      fs.writeFileSync(indFilePath, JSON.stringify(diskData, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Failed to sync ingested indicators to disk:', fsErr);
    }

    // Audit log update
    try {
      const keysPath = path.join(process.cwd(), 'src/data/auth/api_keys.json');
      if (fs.existsSync(keysPath)) {
        const rawKeys = fs.readFileSync(keysPath, 'utf-8');
        const parsed = JSON.parse(rawKeys);
        const kIdx = (parsed.keys || []).findIndex((k: any) => k.key === auth.keyInfo.key);
        if (kIdx >= 0) {
          parsed.keys[kIdx].last_used = new Date().toISOString().split('T')[0];
          fs.writeFileSync(keysPath, JSON.stringify(parsed, null, 2), 'utf-8');
        }
      }
    } catch (auditErr) {
      console.warn('Failed to update API key last_used timestamp:', auditErr);
    }

    return NextResponse.json(
      {
        success: true,
        version: '1.0',
        processed_count: updatedIds.length,
        updated_indicators: updatedIds,
        authenticated_client: auth.keyInfo.name,
        timestamp: new Date().toISOString(),
        message: `Successfully ingested and synced ${updatedIds.length} indicator update(s).`,
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
        error: error.message || 'Error processing ingestion payload.',
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
