import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AdminUser, Role, AuthSession } from '@/lib/auth/rbacTypes';

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

function getRoles(): Role[] {
  try {
    const raw = fs.readFileSync(ROLES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'This user account has been suspended by an administrator.' },
        { status: 403 }
      );
    }

    const roles = getRoles();
    const role = roles.find((r) => r.id === user.role_id) || roles[0];

    // Update last_login timestamp
    user.last_login = new Date().toISOString();
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch (e) {
      // Non-fatal if fs write fails in serverless env
    }

    const { password_hash, ...safeUser } = user;
    const session: AuthSession = {
      user: safeUser,
      role,
      token: `suncasa_jwt_${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`,
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    return NextResponse.json({
      success: true,
      data: session,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
