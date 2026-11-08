export type Permission =
  | 'indicators:create'
  | 'indicators:edit'
  | 'indicators:publish'
  | 'indicators:delete'
  | 'users:manage'
  | 'roles:manage'
  | 'database:configure'
  | 'audit:view';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  is_system_default: boolean;
  color?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  organization: string; // e.g., 'Municipal Planning Department', 'Environmental Monitoring Agency'
  role_id: string;
  status: 'active' | 'suspended';
  created_at: string;
  last_login?: string;
}

export interface AuthSession {
  user: Omit<AdminUser, 'password_hash'>;
  role: Role;
  token: string;
  expires_at: number;
}
