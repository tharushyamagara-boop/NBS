import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'src/data/landing_stories.json');

function readStories() {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeStories(stories: any[]) {
  const filePath = getFilePath();
  fs.writeFileSync(filePath, JSON.stringify(stories, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  try {
    const stories = readStories();
    return NextResponse.json({ success: true, data: stories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let currentStories = readStories();

    if (Array.isArray(body.stories)) {
      // Full list replacement
      currentStories = body.stories;
      writeStories(currentStories);
      return NextResponse.json({ success: true, data: currentStories, message: 'All stories updated.' });
    } else if (body.story && body.story.id) {
      // Single story upsert
      const incoming = body.story;
      const idx = currentStories.findIndex((s: any) => s.id === incoming.id);
      if (idx >= 0) {
        currentStories[idx] = { ...currentStories[idx], ...incoming };
      } else {
        currentStories.push(incoming);
      }
      writeStories(currentStories);
      return NextResponse.json({ success: true, data: currentStories[idx >= 0 ? idx : currentStories.length - 1], message: 'Story updated successfully.' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid payload: provide stories array or story object' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const story = body.story || body;
    if (!story.id) {
      return NextResponse.json({ success: false, error: 'Story ID is required' }, { status: 400 });
    }

    const currentStories = readStories();
    const existingIndex = currentStories.findIndex((s: any) => s.id === story.id);
    if (existingIndex >= 0) {
      return NextResponse.json({ success: false, error: `Story with ID '${story.id}' already exists.` }, { status: 409 });
    }

    currentStories.push(story);
    writeStories(currentStories);
    return NextResponse.json({ success: true, data: story, message: 'New story created successfully.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Story ID is required' }, { status: 400 });
    }

    const currentStories = readStories();
    const filtered = currentStories.filter((s: any) => s.id !== id);
    if (filtered.length === currentStories.length) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 });
    }

    writeStories(filtered);
    return NextResponse.json({ success: true, message: `Story '${id}' removed successfully.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
