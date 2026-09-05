import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Role, Permission } from '@/lib/auth/rbacTypes';

const ROLES_FILE = path.join(process.cwd(), 'src/data/auth/roles.json');

function getRoles(): Role[] {
  try {
    const raw = fs.readFileSync(ROLES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveRoles(roles: Role[]) {
  fs.writeFileSync(ROLES_FILE, JSON.stringify(roles, null, 2), 'utf-8');
}

// GET: List all roles
export async function GET() {
  try {
    const roles = getRoles();
    return NextResponse.json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a custom role with selected permissions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, permissions, color } = body;

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: 'Role name and permissions array are required.' },
        { status: 400 }
      );
    }

    const roles = getRoles();
    const roleId = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (roles.some((r) => r.id === roleId)) {
      return NextResponse.json(
        { success: false, error: `A role with identifier '${roleId}' already exists.` },
        { status: 400 }
      );
    }

    const newRole: Role = {
      id: roleId,
      name: name.trim(),
      description: description || 'Custom delegated role for SUNCASA dashboard.',
      permissions: permissions as Permission[],
      is_system_default: false,
      color: color || '#0284c7',
      created_at: new Date().toISOString(),
    };

    roles.push(newRole);
    saveRoles(roles);

    return NextResponse.json(
      {
        success: true,
        data: newRole,
        message: `Role '${newRole.name}' created successfully.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a custom role
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Role ID is required.' }, { status: 400 });
    }

    const roles = getRoles();
    const targetRole = roles.find((r) => r.id === id);

    if (!targetRole) {
      return NextResponse.json({ success: false, error: 'Role not found.' }, { status: 404 });
    }

    if (targetRole.is_system_default) {
      return NextResponse.json(
        { success: false, error: 'System default roles cannot be deleted.' },
        { status: 400 }
      );
    }

    const filtered = roles.filter((r) => r.id !== id);
    saveRoles(filtered);

    return NextResponse.json({
      success: true,
      message: `Role '${targetRole.name}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
