'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Indicator } from '@/lib/db/types';
import { Role, AdminUser, AuthSession, Permission } from '@/lib/auth/rbacTypes';

export default function AdminPortalPage() {
  // Authentication & Session State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authEmail, setAuthEmail] = useState('admin@suncasa.rw');
  const [authPassword, setAuthPassword] = useState('SuncasaKigali2025!');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'indicators' | 'builder' | 'rbac' | 'database'>('indicators');

  // Indicators State
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Users & Roles State (RBAC)
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRbac, setLoadingRbac] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserOrg, setNewUserOrg] = useState('Rwanda Forestry Authority (RFA)');
  const [newUserRoleId, setNewUserRoleId] = useState('theme_editor');

  // New Custom Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#0284c7');
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([
    'indicators:create',
    'indicators:edit',
  ]);

  // Indicator Builder Form State
  const [builderId, setBuilderId] = useState('');
  const [builderTheme, setBuilderTheme] = useState('climate');
  const [builderTitleEn, setBuilderTitleEn] = useState('');
  const [builderTitleRw, setBuilderTitleRw] = useState('');
  const [builderDef, setBuilderDef] = useState('');
  const [builderUnit, setBuilderUnit] = useState('Hectares (ha)');
  const [builderBaseline, setBuilderBaseline] = useState<number>(100);
  const [builderCurrent, setBuilderCurrent] = useState<number>(650);
  const [builderTarget, setBuilderTarget] = useState<number>(1000);
  const [builderStatus, setBuilderStatus] = useState<'on-track' | 'exceeded' | 'needs-acceleration'>('on-track');
  const [builderFmesCode, setBuilderFmesCode] = useState('RFA-FMES-NEW-01');
  const [builderFmesAlign, setBuilderFmesAlign] = useState('Forest Evaluation Layer');
  const [builderDualIcon, setBuilderDualIcon] = useState('tree');
  const [builderLegendLabel, setBuilderLegendLabel] = useState('Lower Nyabarongo Watershed');
  const [builderSource, setBuilderSource] = useState('Rwanda Forestry Authority (RFA) & SUNCASA');
  const [builderProvider, setBuilderProvider] = useState('Rwanda Forestry Authority (RFA)');
  const [builderLimitations, setBuilderLimitations] = useState('Bi-annual field ground-truthing and spatial survey.');
  const [builderMethod, setBuilderMethod] = useState('GPS compartment polygon audits and drone aerial telemetry.');
  const [builderSdgNumber, setBuilderSdgNumber] = useState(13);
  const [builderSdgTarget, setBuilderSdgTarget] = useState('13.1');

  // Trend history points
  const [builderPoints, setBuilderPoints] = useState([
    { period: '2024 Q1', value: 100 },
    { period: '2024 Q2', value: 240 },
    { period: '2024 Q3', value: 380 },
    { period: '2024 Q4', value: 510 },
    { period: '2025 Q1', value: 650 },
  ]);

  // Spatial breakdown points
  const [builderSites, setBuilderSites] = useState([
    { site: 'Yanze Micro-Catchment', value: 280 },
    { site: 'Mount Kigali Slopes', value: 210 },
    { site: 'Mpazi Ravine Corridor', value: 95 },
    { site: 'Nyabugogo Wetland Buffer', value: 65 },
  ]);

  // 3-Question Stories
  const [builderStoryWhatEn, setBuilderStoryWhatEn] = useState('');
  const [builderStoryWhyEn, setBuilderStoryWhyEn] = useState('');
  const [builderStoryActionEn, setBuilderStoryActionEn] = useState('');

  // Database settings state
  const [driver, setDriver] = useState('memory');
  const [driverName, setDriverName] = useState('In-Memory / Local JSON');
  const [inHouseUrl, setInHouseUrl] = useState('http://localhost:8000/api/v1');
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('suncasa_admin_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.expires_at > Date.now()) {
          setSession(parsed);
        } else {
          localStorage.removeItem('suncasa_admin_session');
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (session) {
      fetchIndicators();
      fetchRbacData();
      fetchDbConfig();
    }
  }, [session]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        localStorage.setItem('suncasa_admin_session', JSON.stringify(data.data));
        setStatusMessage(data.message || 'Authenticated successfully.');
      } else {
        setAuthError(data.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Network error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('suncasa_admin_session');
  };

  const fetchIndicators = async () => {
    setLoadingIndicators(true);
    try {
      const res = await fetch('/api/indicators');
      const data = await res.json();
      if (data.success) {
        setIndicators(data.data);
      }
    } catch (err) {
      console.error('Failed to load indicators', err);
    } finally {
      setLoadingIndicators(false);
    }
  };

  const fetchRbacData = async () => {
    setLoadingRbac(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
      ]);
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      if (usersData.success) setUsers(usersData.data);
      if (rolesData.success) setRoles(rolesData.data);
    } catch (err) {
      console.error('Failed to load RBAC data', err);
    } finally {
      setLoadingRbac(false);
    }
  };

  const fetchDbConfig = async () => {
    try {
      const res = await fetch('/api/db-config');
      const data = await res.json();
      if (data.success) {
        setDriver(data.activeDriver);
        setDriverName(data.adapterName);
      }
    } catch (err) {
      console.error('Failed to load DB config', err);
    }
  };

  // Build & Publish Indicator Handler
  const handleBuildAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!builderId || !builderDef) {
      alert('Please provide an Indicator ID and Definition.');
      return;
    }

    const cleanId = builderId
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const changePct = builderBaseline > 0
      ? Number((((builderCurrent - builderBaseline) / builderBaseline) * 100).toFixed(1))
      : 100;

    const newIndicatorPayload: Indicator = {
      id: cleanId,
      theme: builderTheme,
      fmes_code: builderFmesCode,
      fmes_alignment: builderFmesAlign,
      unit: builderUnit,
      baseline_2024: Number(builderBaseline),
      current_2025: Number(builderCurrent),
      target_2026: Number(builderTarget),
      change_pct: changePct,
      status: builderStatus,
      priority_rank: indicators.length + 1,
      featured_in_hero: false,
      dual_icon: builderDualIcon,
      legend_label: builderLegendLabel,
      definition: builderDef,
      trend_history: builderPoints,
      site_breakdown: builderSites,
      measurement_method: builderMethod,
      data_source_citation: builderSource,
      sdgs: [
        {
          sdg_number: builderSdgNumber,
          sdg_title: `SDG ${builderSdgNumber}. Action & Resilience`,
          target_code: builderSdgTarget,
          target_desc: `SUNCASA verified impact target aligned with UN SDG ${builderSdgNumber}.`,
          color: '#10b981',
        },
      ],
    };

    const narrativeEn = {
      title: builderTitleEn || builderDef,
      what_is: builderStoryWhatEn || builderDef,
      why_matters: builderStoryWhyEn || 'Crucial for Kigali micro-catchment climate resilience and hydrological balance.',
      what_suncasa: builderStoryActionEn || 'SUNCASA collaborates with RFA, City of Kigali, and community cooperatives.',
      limitations: builderLimitations,
      source: builderSource,
    };

    const narrativeRw = {
      title: builderTitleRw || builderTitleEn || builderDef,
      what_is: builderDef,
      why_matters: 'Iki gipimo gifasha kumenya iterambere ryo kubungabunga ibidukikije mu kibaya cya Nyabarongo.',
      what_suncasa: 'SUNCASA ifatanya n\'Umujyi wa Kigali na RFA gushyira mu bikorwa ibisubizo kamere.',
      limitations: builderLimitations,
      source: builderSource,
    };

    try {
      setStatusMessage(`Building and publishing indicator '${cleanId}' to public dashboard...`);
      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicator: newIndicatorPayload,
          narrative_en: narrativeEn,
          narrative_rw: narrativeRw,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully published '${cleanId}' to public dashboard!`);
        fetchIndicators();
        setActiveTab('indicators');
        // Reset ID
        setBuilderId('');
      } else {
        setStatusMessage(`Error publishing indicator: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  // Remove Indicator Handler
  const handleDeleteIndicator = async (id: string, title: string) => {
    const confirm = window.confirm(
      `Are you sure you want to permanently delete indicator '${id}' (${title})?\n\nThis will remove the indicator and all its associated data, time-series, narratives, and spatial breakdowns from the public portal.`
    );
    if (!confirm) return;

    try {
      setStatusMessage(`Removing indicator '${id}'...`);
      const res = await fetch(`/api/indicators/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message || `Successfully removed '${id}' from public dashboard.`);
        setIndicators((prev) => prev.filter((i) => i.id !== id));
      } else {
        setStatusMessage(`Failed to delete: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error deleting: ${err.message}`);
    }
  };

  // Create User & Delegate Role Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          organization: newUserOrg,
          role_id: newUserRoleId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setShowCreateUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        fetchRbacData();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create Custom Role Handler
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoleName,
          description: newRoleDesc,
          permissions: newRolePermissions,
          color: newRoleColor,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setShowCreateRoleModal(false);
        setNewRoleName('');
        setNewRoleDesc('');
        fetchRbacData();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle User Active / Suspended
  const handleToggleUserStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        fetchRbacData();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove user '${userName}'?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        fetchRbacData();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update / Assign User Role (Add or remove Super Admin)
  const handleUpdateUserRole = async (userId: string, newRoleId: string) => {
    try {
      setStatusMessage(`Updating role for user...`);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message || 'User role updated successfully.');
        fetchRbacData();
      } else {
        alert(data.error || 'Failed to update role.');
        setStatusMessage(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Switch Database Driver
  const handleSwitchDriver = async (newDriver: string) => {
    try {
      setStatusMessage(`Switching database to ${newDriver}...`);
      const body: any = { driver: newDriver };
      if (newDriver === 'inhouse') body.inHouseUrl = inHouseUrl;
      if (newDriver === 'firestore') {
        body.firebaseConfig = { apiKey: firebaseApiKey, projectId: firebaseProjectId };
      }
      const res = await fetch('/api/db-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setDriver(data.activeDriver);
        setDriverName(data.adapterName);
        setStatusMessage(`Successfully connected to ${data.adapterName}`);
        fetchIndicators();
      } else {
        setStatusMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  // Filter indicators
  const filteredIndicators = indicators.filter((ind) => {
    const matchesSearch =
      ind.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ind.definition && ind.definition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ind.fmes_code && ind.fmes_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTheme = themeFilter === 'all' || ind.theme === themeFilter;
    return matchesSearch && matchesTheme;
  });

  // -------------------------------------------------------------
  // 1. UN-AUTHENTICATED STATE: SLEEK LOGIN VIEW
  // -------------------------------------------------------------
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top, #1e293b 0%, #0a111e 100%)', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '36px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284c7, #10b981)', color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)' }}>
              SK
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>
              SUNCASA Kigali Portal
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
              Authorized Administration & Indicator Management Console
            </p>
          </div>

          {authError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '20px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Admin Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@suncasa.rw"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', color: '#ffffff', fontSize: '0.92rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Secure Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', color: '#ffffff', fontSize: '0.92rem', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{ width: '100%', marginTop: '8px', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }}
            >
              {authLoading ? 'Verifying Credentials...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Pre-configured Super Admin:{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('admin@suncasa.rw');
                  setAuthPassword('SuncasaKigali2025!');
                }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 600, padding: 0, textDecoration: 'underline' }}
              >
                Fill Credentials
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED STATE: FULL ADMIN PORTAL
  // -------------------------------------------------------------
  const canCreate = session.role.permissions.includes('indicators:create');
  const canDelete = session.role.permissions.includes('indicators:delete');
  const canManageUsers = session.role.permissions.includes('users:manage');
  const canConfigureDb = session.role.permissions.includes('database:configure');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a111e', color: '#f8fafc', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER BAR (Spans Full Width Edge-to-Edge at Level 0)  */}
      {/* ------------------------------------------------------------- */}
      <header
        style={{
          width: '100%',
          height: '60px',
          minHeight: '60px',
          boxSizing: 'border-box',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 3px 8px rgba(2, 132, 199, 0.3)',
            }}
          >
            SK
          </div>
          <div>
            <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>SUNCASA Admin Portal</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', border: '1px solid rgba(2, 132, 199, 0.4)' }}>
                Kigali NbS
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Impact Monitoring & Indicator Governance Console
            </div>
          </div>
        </div>

        {/* Top Header Right: User Badge, Public Preview & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '5px 12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #334155', borderRadius: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: session.role.color || '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {session.user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {session.user.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                {session.role.name}
              </div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🌐</span>
            <span>Public Portal ↗</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. BODY WORKSPACE (Left Bar Starts BELOW Header, Content)     */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)' }}>
        {/* ADMIN LEFT SIDEBAR MENU - Starts at level below header (top: 60px) */}
        <aside
          style={{
            width: '270px',
            backgroundColor: '#0f172a',
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: '60px', /* Starts at level BELOW header */
            height: 'calc(100vh - 60px)',
            zIndex: 40,
            flexShrink: 0,
            boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
          }}
        >
          <div>
            {/* Sidebar Section Title */}
            <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Administration Menu
              </div>
            </div>

          {/* Navigation Menu */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('indicators')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                background: activeTab === 'indicators' ? '#0284c7' : 'transparent',
                color: activeTab === 'indicators' ? '#ffffff' : '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>📋</span>
                <span>Indicator Catalogue</span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: activeTab === 'indicators' ? 'rgba(255,255,255,0.2)' : '#1e293b',
                  color: activeTab === 'indicators' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                }}
              >
                {indicators.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                background: activeTab === 'builder' ? '#0284c7' : 'transparent',
                color: activeTab === 'builder' ? '#ffffff' : '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>🛠️</span>
                <span>Indicator Builder</span>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#10b981',
                  color: '#000000',
                  fontWeight: 800,
                }}
              >
                BUILD
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rbac')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                background: activeTab === 'rbac' ? '#0284c7' : 'transparent',
                color: activeTab === 'rbac' ? '#ffffff' : '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>👥</span>
                <span>Roles & Delegation</span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: activeTab === 'rbac' ? 'rgba(255,255,255,0.2)' : '#1e293b',
                  color: activeTab === 'rbac' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                }}
              >
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('database')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                background: activeTab === 'database' ? '#0284c7' : 'transparent',
                color: activeTab === 'database' ? '#ffffff' : '#94a3b8',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>⚙️</span>
              <span>DB & FMES Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions in Sidebar */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '6px',
              background: '#1e293b',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #334155',
            }}
          >
            🌐 Preview Public Portal ↗
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN WORKSPACE AREA (Right of Left Sidebar)                   */}
      {/* ------------------------------------------------------------- */}
      <div style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top Breadcrumb Header Bar */}
        <header
          style={{
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
            padding: '16px 36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div>
            <span style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Admin Console &rsaquo;
            </span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2px 0 0 0', color: '#f8fafc' }}>
              {activeTab === 'indicators' && 'Indicator Catalogue & Removal'}
              {activeTab === 'builder' && 'Indicator Builder & Live Publisher'}
              {activeTab === 'rbac' && 'Role-Based Access Control & User Delegation'}
              {activeTab === 'database' && 'Database Configuration & Interoperability'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'indicators' && canCreate && (
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#10b981',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                + Build New Indicator
              </button>
            )}
          </div>
        </header>

        {/* Notification Toast */}
        {statusMessage && (
          <div style={{ margin: '16px 36px 0 36px', padding: '12px 20px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid #0284c7', color: '#38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{statusMessage}</span>
            <button type="button" onClick={() => setStatusMessage('')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700 }}>✕</button>
          </div>
        )}

        {/* Main Content Body */}
        <main style={{ padding: '28px 36px 60px 36px', maxWidth: '1400px', width: '100%' }}>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: INDICATOR CATALOGUE & REMOVAL                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'indicators' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Published Indicators Catalogue</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  Manage live indicators published on the public SUNCASA portal, inspect targets, or remove indicators.
                </p>
              </div>

              {canCreate && (
                <button
                  type="button"
                  onClick={() => setActiveTab('builder')}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: '#10b981', color: '#000000', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>+</span> Build New Indicator
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search indicator by title, ID, or FMES code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              />
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              >
                <option value="all">All Themes</option>
                <option value="climate">Climate Adaptation</option>
                <option value="biodiversity">Biodiversity Protection</option>
                <option value="gesi">Gender & Inclusion (GESI)</option>
                <option value="economy">Employment & Economy</option>
                <option value="mypeg_benchmark">MyPeg Benchmark</option>
              </select>
            </div>

            {/* Indicator Table */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '14px 16px' }}>Theme</th>
                    <th style={{ padding: '14px 16px' }}>Indicator ID & Definition</th>
                    <th style={{ padding: '14px 16px' }}>FMES Code</th>
                    <th style={{ padding: '14px 16px' }}>2025 Progress / 2026 Target</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicators.map((ind) => {
                    const themeColorMap: Record<string, string> = {
                      climate: '#0284c7',
                      biodiversity: '#10b981',
                      gesi: '#8b5cf6',
                      economy: '#f59e0b',
                      mypeg_benchmark: '#eb6b23',
                    };
                    const col = themeColorMap[ind.theme] || '#0284c7';
                    const pct = ind.target_2026 > 0 ? Math.min(100, Math.round((ind.current_2025 / ind.target_2026) * 100)) : 100;

                    return (
                      <tr key={ind.id} style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${col}22`, color: col, textTransform: 'uppercase' }}>
                            {ind.theme.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                            {ind.id}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                            {ind.definition}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <code style={{ fontSize: '0.76rem', background: '#1e293b', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>
                            {ind.fmes_code}
                          </code>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', fontWeight: 700 }}>
                            <span>{ind.current_2025.toLocaleString()}</span>
                            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>/ {ind.target_2026.toLocaleString()} {ind.unit}</span>
                          </div>
                          <div style={{ width: '120px', height: '6px', background: '#334155', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: col }} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.76rem', color: ind.status === 'on-track' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                            &bull; {ind.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <Link
                              href={`/indicator/${ind.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ padding: '6px 12px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Public View ↗
                            </Link>

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteIndicator(ind.id, ind.definition || ind.id)}
                                style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredIndicators.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                        No indicators matching your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: INDICATOR BUILDER & PUBLISHER                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'builder' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Build & Publish New Indicator</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                Author a new Nature-Based Solutions indicator with quarterly time-series, spatial breakdowns, bilingual narratives, and publish it directly to the public portal.
              </p>
            </div>

            <form onSubmit={handleBuildAndPublish} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              {/* Left Column: Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 1. Basic Metadata Card */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#38bdf8' }}>
                    1. Core Attributes & Theme
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Communication Theme
                      </label>
                      <select
                        value={builderTheme}
                        onChange={(e) => setBuilderTheme(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      >
                        <option value="climate">Climate Adaptation (#0284c7)</option>
                        <option value="biodiversity">Biodiversity Protection (#10b981)</option>
                        <option value="gesi">Gender & Social Inclusion (#8b5cf6)</option>
                        <option value="economy">Employment & Economy (#f59e0b)</option>
                        <option value="mypeg_benchmark">Built Environment Benchmark (#eb6b23)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Indicator Identifier (Slug ID)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. wetland_buffer_restored"
                        value={builderId}
                        onChange={(e) => setBuilderId(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Display Title (English)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wetland Buffer Area Restored"
                        value={builderTitleEn}
                        onChange={(e) => setBuilderTitleEn(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Display Title (Kinyarwanda)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ubuso bw'Ibishingwe Bwasanywe"
                        value={builderTitleRw}
                        onChange={(e) => setBuilderTitleRw(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Definition & Purpose Subtitle
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Concise, plain-language description for non-expert citizens..."
                      value={builderDef}
                      onChange={(e) => setBuilderDef(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Unit</label>
                      <input
                        type="text"
                        value={builderUnit}
                        onChange={(e) => setBuilderUnit(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.84rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>2024 Baseline</label>
                      <input
                        type="number"
                        value={builderBaseline}
                        onChange={(e) => setBuilderBaseline(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.84rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>2025 Current</label>
                      <input
                        type="number"
                        value={builderCurrent}
                        onChange={(e) => setBuilderCurrent(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.84rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>2026 Target</label>
                      <input
                        type="number"
                        value={builderTarget}
                        onChange={(e) => setBuilderTarget(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. RFA-FMES & Metadata Card */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#10b981' }}>
                    2. RFA-FMES Interoperability & Lineage (5-Part Standard)
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        FMES System Code
                      </label>
                      <input
                        type="text"
                        value={builderFmesCode}
                        onChange={(e) => setBuilderFmesCode(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Responsible Agency
                      </label>
                      <input
                        type="text"
                        value={builderProvider}
                        onChange={(e) => setBuilderProvider(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Data Source Citation
                    </label>
                    <input
                      type="text"
                      value={builderSource}
                      onChange={(e) => setBuilderSource(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Methodological Limitations & Caveats
                    </label>
                    <input
                      type="text"
                      value={builderLimitations}
                      onChange={(e) => setBuilderLimitations(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {/* 3. The Story (3 Questions) Card */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#f59e0b' }}>
                    3. The Story (3 Core Questions)
                  </h3>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                      Question 1: What is this indicator and what does it measure?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Explains what the metric represents..."
                      value={builderStoryWhatEn}
                      onChange={(e) => setBuilderStoryWhatEn(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                      Question 2: Why does it matter for Kigali's climate resilience?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Explains why this matters for erosion, floods, or community welfare..."
                      value={builderStoryWhyEn}
                      onChange={(e) => setBuilderStoryWhyEn(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                      Question 3: What is SUNCASA doing with the City and RFA?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Highlights specific nature-based interventions..."
                      value={builderStoryActionEn}
                      onChange={(e) => setBuilderStoryActionEn(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Preview & Publish Card */}
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', position: 'sticky', top: '90px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
                    Indicator Publication Summary
                  </h3>

                  <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target URL</div>
                    <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
                      /indicator/{builderId || '[slug_id]'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '20px' }}>
                    <div>Theme: <strong>{builderTheme}</strong></div>
                    <div>FMES Code: <strong>{builderFmesCode}</strong></div>
                    <div>2025 Current: <strong>{builderCurrent} {builderUnit}</strong></div>
                    <div>2026 Target: <strong>{builderTarget} {builderUnit}</strong></div>
                    <div>Time-Series: <strong>{builderPoints.length} quarterly points</strong></div>
                    <div>Spatial Sites: <strong>{builderSites.length} catchment zones</strong></div>
                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                  >
                    🚀 Build & Publish to Public Dashboard
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: ROLES & USER DELEGATION (RBAC)                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'rbac' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Role-Based Access Control & User Delegation</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  Create administrative users, assign delegated roles, and customize permission sets across partner institutions.
                </p>
              </div>

              {canManageUsers && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateRoleModal(true)}
                    style={{ padding: '9px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Add Custom Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateUserModal(true)}
                    style={{ padding: '9px 16px', borderRadius: '8px', background: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '0.86rem', border: 'none', cursor: 'pointer' }}
                  >
                    + Create User & Delegate
                  </button>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', marginBottom: '36px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Active Delegated Users ({users.length})</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '12px 16px' }}>User Name & Email</th>
                    <th style={{ padding: '12px 16px' }}>Partner Organization</th>
                    <th style={{ padding: '12px 16px' }}>Assigned Role</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const userRole = roles.find((r) => r.id === u.role_id) || u.role;
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                          {u.organization || 'SUNCASA Directorate'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={u.role_id}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            title="Click to assign a different role to this user"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: '#1e293b',
                              border: `1px solid ${userRole?.color || '#38bdf8'}`,
                              color: userRole?.color || '#ffffff',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                                {r.id === 'super_admin' ? '⭐ Super Administrator' : r.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: u.status === 'active' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
                            &bull; {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {canManageUsers && (
                            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                              {u.role_id !== 'super_admin' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateUserRole(u.id, 'super_admin')}
                                  title="Add/Promote user as Super Administrator"
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid #ef4444',
                                    color: '#fca5a5',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  ⭐ Make Super Admin
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirm = window.confirm(`Remove '${u.name}' as Super Administrator and assign Theme Content Editor role?`);
                                    if (confirm) handleUpdateUserRole(u.id, 'theme_editor');
                                  }}
                                  title="Remove Super Administrator privileges and reassign role"
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    border: '1px solid #f59e0b',
                                    color: '#fcd34d',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Revoke Super Admin
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.status === 'active' ? 'Suspend access' : 'Activate access'}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '4px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#94a3b8',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                }}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                title="Permanently delete user"
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '4px',
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#fca5a5',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Roles Grid */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Configured Roles ({roles.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
                {roles.map((r) => (
                  <div key={r.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: r.color || '#0284c7', fontSize: '0.94rem' }}>
                        {r.name}
                      </span>
                      {r.is_system_default && (
                        <span style={{ fontSize: '0.68rem', background: '#1e293b', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
                          SYSTEM DEFAULT
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                      {r.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {r.permissions.map((p, idx) => (
                        <span key={idx} style={{ fontSize: '0.7rem', background: '#1e293b', color: '#cbd5e1', padding: '2px 6px', borderRadius: '3px' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: DATABASE CONFIGURATION & INTEROPERABILITY              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'database' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Database Drivers & Interoperability</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                Select and configure the active persistence driver, or export RFA-FMES compliant data layers.
              </p>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Active Adapter: <span style={{ color: '#38bdf8' }}>{driverName}</span></h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '4px 0 0 0' }}>Switch storage backend instantly without restarting services.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleSwitchDriver('memory')}
                    style={{ padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', background: driver === 'memory' ? '#10b981' : '#1e293b', color: driver === 'memory' ? '#000' : '#fff', border: 'none', fontWeight: 600 }}
                  >
                    In-Memory / JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchDriver('firestore')}
                    style={{ padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', background: driver === 'firestore' ? '#10b981' : '#1e293b', color: driver === 'firestore' ? '#000' : '#fff', border: 'none', fontWeight: 600 }}
                  >
                    Google Firestore
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE USER & DELEGATE ROLE                            */}
      {/* ------------------------------------------------------------- */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Create User & Delegate Role</h3>
              <button type="button" onClick={() => setShowCreateUserModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Pierre Nshimiyimana"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.nshimiyimana@rfa.gov.rw"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Partner Organization / Agency</label>
                <input
                  type="text"
                  required
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Initial Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Assigned Delegated Role</label>
                <select
                  value={newUserRoleId}
                  onChange={(e) => setNewUserRoleId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id === 'super_admin' ? '⭐ Super Administrator (Full Unrestricted Authority)' : r.name} ({r.description.slice(0, 45)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Super Admin Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px' }}>
                <input
                  type="checkbox"
                  id="grant_super_admin"
                  checked={newUserRoleId === 'super_admin'}
                  onChange={(e) => setNewUserRoleId(e.target.checked ? 'super_admin' : 'theme_editor')}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="grant_super_admin" style={{ fontSize: '0.82rem', color: '#fca5a5', fontWeight: 600, cursor: 'pointer' }}>
                  ⭐ Grant Unrestricted Super Administrator Privileges
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create User & Delegate Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE CUSTOM ROLE                                     */}
      {/* ------------------------------------------------------------- */}
      {showCreateRoleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Custom Delegated Role</h3>
              <button type="button" onClick={() => setShowCreateRoleModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateRole} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yanze Basin Coordinator"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Description</label>
                <input
                  type="text"
                  placeholder="Role scope and authority..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'indicators:create', label: 'Create Indicators' },
                    { id: 'indicators:edit', label: 'Edit Indicators' },
                    { id: 'indicators:publish', label: 'Publish Indicators' },
                    { id: 'indicators:delete', label: 'Delete Indicators' },
                    { id: 'users:manage', label: 'Manage Users' },
                    { id: 'roles:manage', label: 'Manage Roles' },
                    { id: 'database:configure', label: 'Configure DB' },
                    { id: 'audit:view', label: 'View Audit Logs' },
                  ].map((perm) => (
                    <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newRolePermissions.includes(perm.id as Permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRolePermissions([...newRolePermissions, perm.id as Permission]);
                          } else {
                            setNewRolePermissions(newRolePermissions.filter((p) => p !== perm.id));
                          }
                        }}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
