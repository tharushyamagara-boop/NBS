import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultData from '@/data/social_links.json';

function getFilePath() {
  return path.join(process.cwd(), 'src/data/social_links.json');
}

function readData() {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return JSON.parse(JSON.stringify(defaultData));
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return JSON.parse(JSON.stringify(defaultData));
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

function normalize(s: any) {
  return {
    id: s.id,
    name: s.name || '',
    icon: s.icon || '🔗',
    bg_color: s.bg_color || '#0284c7',
    text_color: s.text_color || '#ffffff',
    share_type: s.share_type || 'template', // 'template' | 'email' | 'copy'
    url_template: s.url_template || '',
    is_active: s.is_active !== false,
    order: s.order ?? 0,
  };
}

export async function GET() {
  try {
    const data = readData();
    const socialLinks = (data.social_links || []).map(normalize).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return NextResponse.json({
      success: true,
      count: socialLinks.length,
      social_links: socialLinks,
      data: socialLinks,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name ? body.name.trim() : '';
    if (!name) {
      return NextResponse.json({ success: false, error: 'Platform name is required.' }, { status: 400 });
    }

    const data = readData();
    if (!Array.isArray(data.social_links)) {
      data.social_links = [];
    }

    const cleanId = body.id
      ? body.id.toLowerCase().replace(/[^a-z0-9_]+/g, '_')
      : name.toLowerCase().replace(/[^a-z0-9_]+/g, '_').substring(0, 24) + '_' + Date.now().toString().slice(-4);

    // Check if ID already exists
    if (data.social_links.some((s: any) => s.id === cleanId)) {
      return NextResponse.json({ success: false, error: `A platform with ID '${cleanId}' already exists.` }, { status: 409 });
    }

    const newLink = {
      id: cleanId,
      name,
      icon: body.icon ? body.icon.trim() : '🔗',
      bg_color: body.bg_color || '#0284c7',
      text_color: body.text_color || '#ffffff',
      share_type: body.share_type || 'template',
      url_template: body.url_template ? body.url_template.trim() : '',
      is_active: body.is_active !== false,
      order: typeof body.order === 'number' ? body.order : data.social_links.length + 1,
    };

    data.social_links.push(newLink);
    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Social platform '${name}' added successfully.`,
      data: normalize(newLink),
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
      return NextResponse.json({ success: false, error: 'Platform ID is required.' }, { status: 400 });
    }

    const data = readData();
    if (!Array.isArray(data.social_links)) {
      data.social_links = [];
    }

    const idx = data.social_links.findIndex((s: any) => s.id === id);
    if (idx < 0) {
      return NextResponse.json({ success: false, error: 'Social platform not found.' }, { status: 404 });
    }

    const existing = data.social_links[idx];
    data.social_links[idx] = {
      ...existing,
      name: body.name !== undefined ? body.name.trim() : existing.name,
      icon: body.icon !== undefined ? body.icon.trim() : existing.icon,
      bg_color: body.bg_color !== undefined ? body.bg_color : existing.bg_color,
      text_color: body.text_color !== undefined ? body.text_color : existing.text_color,
      share_type: body.share_type !== undefined ? body.share_type : existing.share_type,
      url_template: body.url_template !== undefined ? body.url_template.trim() : existing.url_template,
      order: typeof body.order === 'number' ? body.order : existing.order,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : existing.is_active,
    };

    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Social platform '${data.social_links[idx].name}' updated successfully.`,
      data: normalize(data.social_links[idx]),
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
      return NextResponse.json({ success: false, error: 'Platform ID is required.' }, { status: 400 });
    }

    const data = readData();
    if (!Array.isArray(data.social_links)) {
      data.social_links = [];
    }

    const initialLen = data.social_links.length;
    data.social_links = data.social_links.filter((s: any) => s.id !== id);

    if (data.social_links.length === initialLen) {
      return NextResponse.json({ success: false, error: 'Social platform not found.' }, { status: 404 });
    }

    writeData(data);

    return NextResponse.json({
      success: true,
      message: `Social platform '${id}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
