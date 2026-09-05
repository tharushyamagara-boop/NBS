import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getKeysFilePath() {
  return path.join(process.cwd(), 'src/data/auth/api_keys.json');
}

function readKeys() {
  const filePath = getKeysFilePath();
  if (!fs.existsSync(filePath)) {
    return { keys: [] };
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(content);
  } catch {
    return { keys: [] };
  }
}

function writeKeys(data: any) {
  const filePath = getKeysFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const data = readKeys();
    return NextResponse.json({
      success: true,
      keys: data.keys || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to read API keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, permissions } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Partner or client organization name is required' },
        { status: 400 }
      );
    }

    const data = readKeys();
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const generatedKey = `suncasa-partner-${randomHex}`;

    const newKeyRecord = {
      id: `key-${Date.now()}`,
      name,
      key: generatedKey,
      created_at: new Date().toISOString().split('T')[0],
      status: 'Active',
      permissions: Array.isArray(permissions) && permissions.length > 0 ? permissions : ['ingest:indicators', 'read:telemetry'],
      last_used: 'Never',
    };

    data.keys.unshift(newKeyRecord);
    writeKeys(data);

    return NextResponse.json({
      success: true,
      message: 'API Key generated successfully',
      key: newKeyRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create API key' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Key id is required' }, { status: 400 });
    }

    const data = readKeys();
    const initialLen = data.keys.length;
    data.keys = data.keys.filter((k: any) => k.id !== id);

    if (data.keys.length === initialLen) {
      return NextResponse.json({ success: false, error: 'API key not found' }, { status: 404 });
    }

    writeKeys(data);
    return NextResponse.json({ success: true, message: 'API key revoked and purged.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to delete key' }, { status: 500 });
  }
}
