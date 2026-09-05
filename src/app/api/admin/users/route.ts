import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AdminUser, Role } from '@/lib/auth/rbacTypes';

const USERS_FILE = path.join(process.cwd(), 'src/data/auth/users.json');
const ROLES_FILE = path.join(process.cwd(), 'src/data/auth/roles.json');

function getUsers(): AdminUser[] {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveUsers(users: AdminUser[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function getRoles(): Role[] {
  try {
    const raw = fs.readFileSync(ROLES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// GET: List all users with stripped password and associated role data
export async function GET() {
  try {
    const users = getUsers();
    const roles = getRoles();

    const safeUsers = users.map((u) => {
      const { password_hash, ...safe } = u;
      const userRole = roles.find((r) => r.id === u.role_id);
      return {
        ...safe,
        role: userRole || { id: u.role_id, name: 'Unknown Role', permissions: [] },
      };
    });

    return NextResponse.json({
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new user and assign/delegate role
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, organization, role_id } = body;

    if (!name || !email || !password || !role_id) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and role_id are required.' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const emailLower = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === emailLower)) {
      return NextResponse.json(
        { success: false, error: `A user with email '${email}' already exists.` },
        { status: 400 }
      );
    }

    const roles = getRoles();
    const roleExists = roles.some((r) => r.id === role_id);
    if (!roleExists) {
      return NextResponse.json(
        { success: false, error: `Role '${role_id}' does not exist.` },
        { status: 400 }
      );
    }

    const newUser: AdminUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: emailLower,
      password_hash: password,
      organization: organization || 'SUNCASA Partner Agency',
      role_id,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password_hash, ...safeCreated } = newUser;
    const assignedRole = roles.find((r) => r.id === role_id);

    return NextResponse.json(
      {
        success: true,
        data: { ...safeCreated, role: assignedRole },
        message: `User '${name}' created with role '${assignedRole?.name}'.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update user role or status (Active / Suspended)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, role_id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    // Protect primary super admin
    if (users[userIndex].email === 'admin@suncasa.rw' && status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'The primary Super Administrator cannot be suspended.' },
        { status: 400 }
      );
    }

    if (role_id) {
      const roles = getRoles();
      if (!roles.some((r) => r.id === role_id)) {
        return NextResponse.json({ success: false, error: 'Invalid role_id.' }, { status: 400 });
      }
      users[userIndex].role_id = role_id;
    }

    if (status && ['active', 'suspended'].includes(status)) {
      users[userIndex].status = status;
    }

    saveUsers(users);

    const { password_hash, ...safeUpdated } = users[userIndex];
    return NextResponse.json({
      success: true,
      data: safeUpdated,
      message: `User '${safeUpdated.name}' updated successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a user
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const users = getUsers();
    const targetUser = users.find((u) => u.id === id);

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    if (targetUser.email === 'admin@suncasa.rw') {
      return NextResponse.json(
        { success: false, error: 'The primary Super Administrator cannot be deleted.' },
        { status: 400 }
      );
    }

    const filtered = users.filter((u) => u.id !== id);
    saveUsers(filtered);

    return NextResponse.json({
      success: true,
      message: `User '${targetUser.name}' removed successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
