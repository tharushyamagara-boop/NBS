import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getFilePath() {
  return path.join(process.cwd(), 'src/data/collaborators.json');
}

function readData() {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return { collaborators: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return { collaborators: [] };
  }
}

function writeData(data: any) {
  const filePath = getFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/** Normalize stored record to a unified shape for the UI */
function normalize(c: any) {
  return {
    id: c.id,
    name: c.name || '',
    // Support both naming conventions
    url: c.url || c.website_url || '',
    website_url: c.url || c.website_url || '',
    logoUrl: c.logoUrl || c.logo_url || '',
    logo_url: c.logoUrl || c.logo_url || '',
    description: c.description || c.sub_name || '',
    sub_name: c.description || c.sub_name || '',
    icon_emoji: c.icon_emoji || '🤝',
    icon_color: c.icon_color || '#0284c7',
    order: c.order ?? 0,
    is_active: c.is_active !== false,
  };
}

export async function GET() {
  try {
    const data = readData();
    const collaborators = (data.collaborators || []).map(normalize);
    return NextResponse.json({
      success: true,
      collaborators,
      // legacy field name for backward compatibility
      data: collaborators,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept both naming conventions
    const name = body.name;
    const websiteUrl = body.url || body.website_url || '';
    const logoUrl = body.logoUrl || body.logo_url || '';
    const description = body.description || body.sub_name || '';

    if (!name || !websiteUrl) {
      return NextResponse.json(
        { success: false, error: 'Name and website URL are required.' },
        { status: 400 }
      );
    }

    const data = readData();
    const cleanId = body.id
      ? body.id.toLowerCase().replace(/[^a-z0-9]+/g, '_')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30) + '_' + Date.now().toString().slice(-4);

    const newCollab = {
      id: cleanId,
      name: name.trim(),
      url: websiteUrl.trim(),
      website_url: websiteUrl.trim(),
      logoUrl: logoUrl.trim(),
      logo_url: logoUrl.trim(),
      description: description.trim(),
      sub_name: description.trim(),
      icon_emoji: body.icon_emoji || '🤝',
      icon_color: body.icon_color || '#0284c7',
      order: typeof body.order === 'number' ? body.order : data.collaborators.length + 1,
      is_active: body.is_active !== false,
    };

    data.collaborators.push(newCollab);
    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Collaborator '${name}' added successfully.`,
      data: normalize(newCollab),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Collaborator ID is required.' }, { status: 400 });
    }

    const data = readData();
    const idx = data.collaborators.findIndex((c: any) => c.id === id);

    if (idx < 0) {
      return NextResponse.json({ success: false, error: 'Collaborator not found.' }, { status: 404 });
    }

    const existing = data.collaborators[idx];
    const websiteUrl = body.url || body.website_url || existing.url || existing.website_url || '';
    const logoUrl = body.logoUrl || body.logo_url || existing.logoUrl || existing.logo_url || '';
    const description = body.description || body.sub_name || existing.description || existing.sub_name || '';

    data.collaborators[idx] = {
      ...existing,
      name: body.name !== undefined ? body.name.trim() : existing.name,
      url: websiteUrl.trim(),
      website_url: websiteUrl.trim(),
      logoUrl: logoUrl.trim(),
      logo_url: logoUrl.trim(),
      description: description.trim(),
      sub_name: description.trim(),
      icon_emoji: body.icon_emoji !== undefined ? body.icon_emoji : existing.icon_emoji,
      icon_color: body.icon_color !== undefined ? body.icon_color : existing.icon_color,
      order: typeof body.order === 'number' ? body.order : existing.order,
      is_active: body.is_active !== undefined ? body.is_active : existing.is_active,
    };

    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Collaborator '${data.collaborators[idx].name}' updated successfully.`,
      data: normalize(data.collaborators[idx]),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Collaborator ID is required.' }, { status: 400 });
    }

    const data = readData();
    const initialLen = data.collaborators.length;
    data.collaborators = data.collaborators.filter((c: any) => c.id !== id);

    if (data.collaborators.length === initialLen) {
      return NextResponse.json({ success: false, error: 'Collaborator not found.' }, { status: 404 });
    }

    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Collaborator '${id}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
