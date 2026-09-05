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
  const [activeTab, setActiveTab] = useState<
    'indicators' | 'builder' | 'landing_stories' | 'indicator_stories' | 'rbac' | 'database'
  >('indicators');

  // Indicators State
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Indicator Modal State
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [showEditIndicatorModal, setShowEditIndicatorModal] = useState(false);
  const [savingIndicator, setSavingIndicator] = useState(false);

  // Landing Page Stories State
  const [landingStories, setLandingStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyLocaleTab, setStoryLocaleTab] = useState<'en' | 'rw'>('en');
  const [savingStory, setSavingStory] = useState(false);

  // Indicator Stories (3 Questions Narrative) State
  const [narrativesMap, setNarrativesMap] = useState<Record<string, any>>({});
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string>('area_restored_ha');
  const [loadingNarratives, setLoadingNarratives] = useState(false);
  const [narrativeLocaleTab, setNarrativeLocaleTab] = useState<'en' | 'rw'>('en');
  const [savingNarrative, setSavingNarrative] = useState(false);
  const [currentNarrativeForm, setCurrentNarrativeForm] = useState<any>({
    en: { title: '', what_is: '', why_matters: '', what_suncasa: '', limitations: '', source: '' },
    rw: { title: '', what_is: '', why_matters: '', what_suncasa: '', limitations: '', source: '' },
  });

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

  // 3-Question Stories for builder
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
      fetchLandingStories();
      fetchNarratives();
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

  const fetchLandingStories = async () => {
    setLoadingStories(true);
    try {
      const res = await fetch('/api/admin/landing-stories');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLandingStories(data.data);
      }
    } catch (err) {
      console.error('Failed to load landing stories', err);
    } finally {
      setLoadingStories(false);
    }
  };

  const fetchNarratives = async () => {
    setLoadingNarratives(true);
    try {
      const res = await fetch('/api/admin/indicator-stories');
      const data = await res.json();
      if (data.success && data.data) {
        setNarrativesMap(data.data);
      }
    } catch (err) {
      console.error('Failed to load indicator narratives', err);
    } finally {
      setLoadingNarratives(false);
    }
  };

  // Sync currentNarrativeForm whenever selectedNarrativeId or narrativesMap changes
  useEffect(() => {
    if (selectedNarrativeId && narrativesMap[selectedNarrativeId]) {
      const item = narrativesMap[selectedNarrativeId];
      setCurrentNarrativeForm({
        en: {
          title: item.en?.title || '',
          what_is: item.en?.what_is || '',
          why_matters: item.en?.why_matters || '',
          what_suncasa: item.en?.what_suncasa || '',
          limitations: item.en?.limitations || '',
          source: item.en?.source || '',
        },
        rw: {
          title: item.rw?.title || '',
          what_is: item.rw?.what_is || '',
          why_matters: item.rw?.why_matters || '',
          what_suncasa: item.rw?.what_suncasa || '',
          limitations: item.rw?.limitations || '',
          source: item.rw?.source || '',
        },
      });
    } else if (selectedNarrativeId) {
      const ind = indicators.find((i) => i.id === selectedNarrativeId);
      setCurrentNarrativeForm({
        en: {
          title: ind?.definition || selectedNarrativeId,
          what_is: '',
          why_matters: '',
          what_suncasa: '',
          limitations: '',
          source: ind?.data_source_citation || '',
        },
        rw: {
          title: ind?.definition || selectedNarrativeId,
          what_is: '',
          why_matters: '',
          what_suncasa: '',
          limitations: '',
          source: ind?.data_source_citation || '',
        },
      });
    }
  }, [selectedNarrativeId, narrativesMap, indicators]);

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

    const changePct =
      builderBaseline > 0
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

    const newNarrativePayload = {
      en: {
        title: builderTitleEn || builderDef,
        what_is: builderStoryWhatEn || `Measures ${builderDef.toLowerCase()} across Kigali catchments.`,
        why_matters: builderStoryWhyEn || 'Crucial for climate resilience, flood mitigation, and urban well-being.',
        what_suncasa: builderStoryActionEn || 'SUNCASA delivers nature-based solutions with the City of Kigali and RFA.',
        limitations: builderLimitations,
        source: builderSource,
      },
      rw: {
        title: builderTitleRw || builderDef,
        what_is: `Bipima ${builderDef.toLowerCase()} mu bibaya by'amazi bya Kigali.`,
        why_matters: 'Ingirakamaro mu guhangana n\'imihindagurikire y\'ikirere no kurinda imyuzure n\'isuri.',
        what_suncasa: 'SUNCASA ifatanya n\'Umujyi wa Kigali na RFA mu gushyira mu bikorwa ibisubizo kamere.',
        limitations: builderLimitations,
        source: builderSource,
      },
    };

    try {
      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicator: newIndicatorPayload,
          narrative: newNarrativePayload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Indicator '${cleanId}' successfully built, published, and synced with RFA-FMES!`);
        fetchIndicators();
        fetchNarratives();
        setActiveTab('indicators');
        // Reset builder form
        setBuilderId('');
        setBuilderDef('');
        setBuilderTitleEn('');
        setBuilderTitleRw('');
      } else {
        alert(data.error || 'Failed to publish indicator.');
      }
    } catch (err: any) {
      alert(err.message || 'Error publishing indicator.');
    }
  };

  // Open Edit Indicator Modal
  const handleOpenEditIndicator = (indicator: Indicator) => {
    setEditingIndicator({ ...indicator });
    setShowEditIndicatorModal(true);
  };

  // Save Edited Indicator
  const handleSaveIndicator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndicator) return;
    setSavingIndicator(true);

    try {
      const changePct =
        editingIndicator.baseline_2024 > 0
          ? Number(
              (
                ((editingIndicator.current_2025 - editingIndicator.baseline_2024) /
                  editingIndicator.baseline_2024) *
                100
              ).toFixed(1)
            )
          : 0;

      const payload = {
        ...editingIndicator,
        change_pct: changePct,
      };

      const res = await fetch(`/api/indicators/${editingIndicator.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Indicator '${editingIndicator.id}' updated and saved successfully.`);
        setIndicators((prev) =>
          prev.map((ind) => (ind.id === editingIndicator.id ? { ...ind, ...payload } : ind))
        );
        setShowEditIndicatorModal(false);
      } else {
        alert(data.error || 'Failed to update indicator.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving indicator.');
    } finally {
      setSavingIndicator(false);
    }
  };

  // Delete Indicator Handler
  const handleDeleteIndicator = async (id: string, definition: string) => {
    if (
      !confirm(
        `Are you sure you want to delete indicator "${id}" (${definition})?\n\nThis will remove it from the public dashboard, API, and associated bilingual narratives.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/indicators/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message || `Indicator '${id}' removed.`);
        fetchIndicators();
        fetchNarratives();
      } else {
        alert(data.error || 'Failed to delete indicator.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting indicator.');
    } finally {
      setDeletingId(null);
    }
  };

  // Landing Story Handlers
  const handleOpenEditStory = (story: any) => {
    setEditingStory(JSON.parse(JSON.stringify(story)));
    setStoryLocaleTab('en');
    setShowStoryModal(true);
  };

  const handleOpenCreateStory = () => {
    setEditingStory({
      id: `story-${Date.now().toString().slice(-6)}`,
      tagColor: '#0284c7',
      en: {
        tag: 'Climate Resilience',
        title: '',
        date: '2025',
        author: 'SUNCASA Field Mission',
        summary: '',
        quote: '',
        quoteAuthor: '',
        fullBody: [''],
      },
      rw: {
        tag: 'Kurwanya Imyuzure',
        title: '',
        date: '2025',
        author: 'Ubunyamabanga bwa SUNCASA',
        summary: '',
        quote: '',
        quoteAuthor: '',
        fullBody: [''],
      },
    });
    setStoryLocaleTab('en');
    setShowStoryModal(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory || !editingStory.id) return;
    setSavingStory(true);

    try {
      const res = await fetch('/api/admin/landing-stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: editingStory }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Landing story '${editingStory.id}' saved successfully.`);
        await fetchLandingStories();
        setShowStoryModal(false);
      } else {
        alert(data.error || 'Failed to save landing story.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving landing story.');
    } finally {
      setSavingStory(false);
    }
  };

  const handleDeleteStory = async (storyId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the landing story: "${title}" (${storyId})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/landing-stories?id=${encodeURIComponent(storyId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Landing story '${storyId}' removed.`);
        await fetchLandingStories();
      } else {
        alert(data.error || 'Failed to remove landing story.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting story.');
    }
  };

  // Indicator Narrative Save Handler
  const handleSaveNarrative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNarrativeId) return;
    setSavingNarrative(true);

    try {
      const res = await fetch('/api/admin/indicator-stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicatorId: selectedNarrativeId,
          narrative: currentNarrativeForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Indicator stories and 3 core questions for '${selectedNarrativeId}' saved successfully.`);
        setNarrativesMap((prev) => ({
          ...prev,
          [selectedNarrativeId]: currentNarrativeForm,
        }));
      } else {
        alert(data.error || 'Failed to save indicator stories.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving indicator narrative.');
    } finally {
      setSavingNarrative(false);
    }
  };

  // Create User Handler
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
          roleId: newUserRoleId,
          organization: newUserOrg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`User '${newUserName}' created with role '${newUserRoleId}'.`);
        fetchRbacData();
        setShowCreateUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating user');
    }
  };

  // Create Role Handler
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleId = newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: roleId,
          name: newRoleName,
          description: newRoleDesc,
          color: newRoleColor,
          permissions: newRolePermissions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Role '${newRoleName}' created successfully.`);
        fetchRbacData();
        setShowCreateRoleModal(false);
        setNewRoleName('');
        setNewRoleDesc('');
      } else {
        alert(data.error || 'Failed to create role');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating role');
    }
  };

  // Filtered indicators
  const filteredIndicators = indicators.filter((ind) => {
    const matchesSearch =
      ind.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.fmes_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = themeFilter === 'all' || ind.theme === themeFilter;
    return matchesSearch && matchesTheme;
  });

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED STATE: LOGIN SCREEN
  // -------------------------------------------------------------
  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a111e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
          color: '#f8fafc',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px auto',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.4)',
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>🛡️</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              SUNCASA Admin Portal
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0 }}>
              Kigali NbS Impact Monitoring Governance Console
            </p>
          </div>

          {authError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
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
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
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
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              }}
            >
              {authLoading ? 'Verifying Credentials...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {/* Pre-configured Super Admin Hint */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Pre-configured Super Admin:{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('admin@suncasa.rw');
                  setAuthPassword('SuncasaKigali2025!');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0,
                  textDecoration: 'underline',
                }}
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
              Impact Monitoring & Content Governance Console
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
            top: '60px',
            height: 'calc(100vh - 60px)',
            zIndex: 40,
            flexShrink: 0,
            boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
          }}
        >
          <div>
            <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Administration Menu
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* 1. Indicator Catalogue */}
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

              {/* 2. Indicator Builder */}
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

              {/* 3. Landing Stories */}
              <button
                type="button"
                onClick={() => setActiveTab('landing_stories')}
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
                  background: activeTab === 'landing_stories' ? '#0284c7' : 'transparent',
                  color: activeTab === 'landing_stories' ? '#ffffff' : '#94a3b8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📰</span>
                  <span>Landing Stories</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: activeTab === 'landing_stories' ? 'rgba(255,255,255,0.2)' : '#1e293b',
                    color: activeTab === 'landing_stories' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                  }}
                >
                  {landingStories.length || 3}
                </span>
              </button>

              {/* 4. Indicator Stories (3-Question Narratives) */}
              <button
                type="button"
                onClick={() => setActiveTab('indicator_stories')}
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
                  background: activeTab === 'indicator_stories' ? '#0284c7' : 'transparent',
                  color: activeTab === 'indicator_stories' ? '#ffffff' : '#94a3b8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📖</span>
                  <span>Indicator Stories</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#8b5cf6',
                    color: '#ffffff',
                    fontWeight: 800,
                  }}
                >
                  3-Q
                </span>
              </button>

              {/* 5. RBAC & Roles */}
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

              {/* 6. DB & FMES Settings */}
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

          {/* Sidebar Footer */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Connected Driver: <strong style={{ color: '#38bdf8' }}>{driverName}</strong>
            </div>
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
                {activeTab === 'indicators' && 'Indicator Catalogue & Live Management'}
                {activeTab === 'builder' && 'Indicator Builder & Live Publisher'}
                {activeTab === 'landing_stories' && 'Landing Page Stories & Civic Narratives'}
                {activeTab === 'indicator_stories' && 'Indicator Stories & 3 Core Questions Editor'}
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
              {activeTab === 'landing_stories' && (
                <button
                  type="button"
                  onClick={handleOpenCreateStory}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  + Add Landing Story
                </button>
              )}
            </div>
          </header>

          {/* Notification Toast */}
          {statusMessage && (
            <div
              style={{
                margin: '16px 36px 0 36px',
                padding: '12px 20px',
                borderRadius: '8px',
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid #0284c7',
                color: '#38bdf8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{statusMessage}</span>
              <button
                type="button"
                onClick={() => setStatusMessage('')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Content Body */}
          <main style={{ padding: '28px 36px 60px 36px', maxWidth: '1400px', width: '100%' }}>
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: INDICATOR CATALOGUE & EDIT / REMOVAL                   */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'indicators' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Published Indicators Catalogue</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                      Manage live indicators published on the public SUNCASA portal, edit metric targets & definitions, or manage narratives.
                    </p>
                  </div>

                  {canCreate && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('builder')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: '#10b981',
                        color: '#000000',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
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
                            <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
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
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <Link
                                  href={`/indicator/${ind.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ padding: '6px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}
                                >
                                  Public ↗
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditIndicator(ind)}
                                  style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid #0284c7', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNarrativeId(ind.id);
                                    setActiveTab('indicator_stories');
                                  }}
                                  style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid #8b5cf6', color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                  title="Edit 3-Question Stories for this indicator"
                                >
                                  📖 Stories
                                </button>

                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteIndicator(ind.id, ind.definition || ind.id)}
                                    style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
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
                            <option value="gesi">Gender & Inclusion (#8b5cf6)</option>
                            <option value="economy">Employment & Economy (#f59e0b)</option>
                            <option value="mypeg_benchmark">MyPeg Benchmark (#eb6b23)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                            Unique Slug ID (e.g. wetland_restored_ha)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. wetland_restored_ha"
                            value={builderId}
                            onChange={(e) => setBuilderId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                          Indicator Scientific Definition (English)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Total Area of Nyabarongo Riparian Wetland Buffer Restored"
                          value={builderDef}
                          onChange={(e) => setBuilderDef(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Unit</label>
                          <input
                            type="text"
                            value={builderUnit}
                            onChange={(e) => setBuilderUnit(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>2024 Baseline</label>
                          <input
                            type="number"
                            value={builderBaseline}
                            onChange={(e) => setBuilderBaseline(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>2025 Current</label>
                          <input
                            type="number"
                            value={builderCurrent}
                            onChange={(e) => setBuilderCurrent(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>2026 Target</label>
                          <input
                            type="number"
                            value={builderTarget}
                            onChange={(e) => setBuilderTarget(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
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
            {/* TAB 3: LANDING PAGE STORIES & CIVIC NARRATIVES                */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'landing_stories' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Landing Page Stories & Civic Narratives</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                      Manage the featured watershed stories displayed on the homepage. Edit quotes, author affiliations, and full multi-paragraph reports in English and Kinyarwanda.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCreateStory}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <span>+</span> Add New Landing Story
                  </button>
                </div>

                {loadingStories ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading stories...</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                    {landingStories.map((story) => {
                      return (
                        <div
                          key={story.id}
                          style={{
                            background: '#0f172a',
                            border: '1px solid #1e293b',
                            borderRadius: '12px',
                            padding: '22px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: '20px',
                                  background: `${story.tagColor || '#0284c7'}22`,
                                  color: story.tagColor || '#0284c7',
                                  border: `1px solid ${story.tagColor || '#0284c7'}55`,
                                }}
                              >
                                {story.en?.tag || 'Civic Story'} &bull; {story.en?.date}
                              </span>
                              <code style={{ fontSize: '0.74rem', color: '#64748b' }}>id: {story.id}</code>
                            </div>

                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                              {story.en?.title}
                            </h3>

                            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '10px', fontStyle: 'italic' }}>
                              🇷🇼 {story.rw?.title}
                            </div>

                            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
                              {story.en?.summary?.slice(0, 140)}...
                            </p>

                            <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: '8px', borderLeft: `3px solid ${story.tagColor || '#0284c7'}`, marginBottom: '14px' }}>
                              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 4px 0' }}>
                                {story.en?.quote?.slice(0, 110)}...
                              </p>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>&mdash; {story.en?.quoteAuthor}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #1e293b' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              🏛️ {story.en?.author}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditStory(story)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(2, 132, 199, 0.15)',
                                  border: '1px solid #0284c7',
                                  color: '#38bdf8',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStory(story.id, story.en?.title || story.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid #ef4444',
                                  color: '#fca5a5',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 4: INDICATOR STORIES & 3 CORE QUESTIONS EDITOR            */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'indicator_stories' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                    Indicator Stories & 3 Core Questions Editor
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                    Author and customize the 3-question narratives required by the SUNCASA RFP: 'What is this indicator?', 'Why does it matter for Kigali?', and 'What is SUNCASA doing about it?', alongside data limitations and official source lineage.
                  </p>
                </div>

                {/* Indicator Picker Banner */}
                <div
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '6px' }}>
                      Select Indicator to Edit Stories
                    </label>
                    <select
                      value={selectedNarrativeId}
                      onChange={(e) => setSelectedNarrativeId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    >
                      {indicators.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          [{ind.theme.toUpperCase()}] {ind.definition || ind.id} ({ind.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link
                      href={`/indicator/${selectedNarrativeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>🌐</span>
                      <span>Preview on Public Indicator Page ↗</span>
                    </Link>
                  </div>
                </div>

                {/* Bilingual Narratives Editor Form */}
                <form onSubmit={handleSaveNarrative} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '28px' }}>
                  {/* Locale Toggle Tabs */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setNarrativeLocaleTab('en')}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: narrativeLocaleTab === 'en' ? '#0284c7' : '#1e293b',
                          color: narrativeLocaleTab === 'en' ? '#ffffff' : '#94a3b8',
                        }}
                      >
                        🇬🇧 English Narrative
                      </button>
                      <button
                        type="button"
                        onClick={() => setNarrativeLocaleTab('rw')}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: narrativeLocaleTab === 'rw' ? '#0284c7' : '#1e293b',
                          color: narrativeLocaleTab === 'rw' ? '#ffffff' : '#94a3b8',
                        }}
                      >
                        🇷🇼 Inkuru mu Kinyarwanda
                      </button>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Editing target: <code style={{ color: '#38bdf8' }}>{selectedNarrativeId}</code>
                    </span>
                  </div>

                  {/* Indicator Display Title */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Indicator Narrative Display Title ({narrativeLocaleTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      required
                      value={currentNarrativeForm[narrativeLocaleTab]?.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentNarrativeForm((prev: any) => ({
                          ...prev,
                          [narrativeLocaleTab]: {
                            ...prev[narrativeLocaleTab],
                            title: val,
                          },
                        }));
                      }}
                      placeholder="e.g. Total Area Restored and Managed through NbS"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.92rem' }}
                    />
                  </div>

                  {/* 3 Core Questions Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                    {/* Question 1: What is this indicator? */}
                    <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                        {narrativeLocaleTab === 'en'
                          ? '1. What is this indicator and what does it measure?'
                          : '1. Iki gipimo ni iki kandi gipima iki?'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={currentNarrativeForm[narrativeLocaleTab]?.what_is || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentNarrativeForm((prev: any) => ({
                            ...prev,
                            [narrativeLocaleTab]: {
                              ...prev[narrativeLocaleTab],
                              what_is: val,
                            },
                          }));
                        }}
                        placeholder="Detailed scientific explanation of metric scope and spatial methodology..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>

                    {/* Question 2: Why does it matter? */}
                    <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                        {narrativeLocaleTab === 'en'
                          ? '2. Why does it matter for Kigali\'s climate resilience?'
                          : '2. Kuki iki gipimo gifite akamaro ku mibereho n\'ikirere by\'i Kigali?'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={currentNarrativeForm[narrativeLocaleTab]?.why_matters || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentNarrativeForm((prev: any) => ({
                            ...prev,
                            [narrativeLocaleTab]: {
                              ...prev[narrativeLocaleTab],
                              why_matters: val,
                            },
                          }));
                        }}
                        placeholder="Civic rationale connecting metric to steep slopes, erosion, floods, and household livelihood..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>

                    {/* Question 3: What is SUNCASA doing? */}
                    <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                        {narrativeLocaleTab === 'en'
                          ? '3. What is SUNCASA doing about it with City of Kigali and RFA?'
                          : '3. Ni iki SUNCASA ikorana n\'Umujyi wa Kigali na RFA kuri iki gipimo?'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={currentNarrativeForm[narrativeLocaleTab]?.what_suncasa || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentNarrativeForm((prev: any) => ({
                            ...prev,
                            [narrativeLocaleTab]: {
                              ...prev[narrativeLocaleTab],
                              what_suncasa: val,
                            },
                          }));
                        }}
                        placeholder="Specific on-the-ground interventions: vegetative check-dams, seedling nurseries, hillside terracing..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>
                  </div>

                  {/* Limitations & Citation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Methodological Limitations & Measurement Caveats
                      </label>
                      <textarea
                        rows={2}
                        value={currentNarrativeForm[narrativeLocaleTab]?.limitations || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentNarrativeForm((prev: any) => ({
                            ...prev,
                            [narrativeLocaleTab]: {
                              ...prev[narrativeLocaleTab],
                              limitations: val,
                            },
                          }));
                        }}
                        placeholder="e.g. Canopy closure takes 3-5 years; permanent sample plots have +/- 3.5% error margin..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Official Data Source Citation
                      </label>
                      <textarea
                        rows={2}
                        value={currentNarrativeForm[narrativeLocaleTab]?.source || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentNarrativeForm((prev: any) => ({
                            ...prev,
                            [narrativeLocaleTab]: {
                              ...prev[narrativeLocaleTab],
                              source: val,
                            },
                          }));
                        }}
                        placeholder="e.g. Rwanda Forestry Authority (RFA) & City of Kigali Land Use Registry (FMES-LU-01)"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={savingNarrative}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                      }}
                    >
                      {savingNarrative ? 'Saving Narrative Stories...' : `💾 Save Stories for '${selectedNarrativeId}'`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 5: ROLES & USER DELEGATION (RBAC)                          */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'rbac' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Role-Based Access Control & User Delegation</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                      Manage administrators, assign Super Administrator privileges, and delegate roles across SUNCASA partner organizations.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateUserModal(true)}
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#0284c7', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                      + Add New User
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateRoleModal(true)}
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                      + Add Custom Role
                    </button>
                  </div>
                </div>

                {/* Users List Table */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Delegated Administrators & Analysts</h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{users.length} registered accounts</span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                        <th style={{ padding: '12px 18px' }}>User Name</th>
                        <th style={{ padding: '12px 18px' }}>Email</th>
                        <th style={{ padding: '12px 18px' }}>Organization</th>
                        <th style={{ padding: '12px 18px' }}>Assigned Role</th>
                        <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const userRole = roles.find((r) => r.id === u.role_id);
                        const isSuperAdmin = u.role_id === 'super_admin';

                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '14px 18px', fontWeight: 700, color: '#f8fafc' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{u.name}</span>
                                {isSuperAdmin && <span title="Super Administrator">⭐</span>}
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{u.email}</td>
                            <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{u.organization}</td>
                            <td style={{ padding: '14px 18px' }}>
                              <span
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  background: `${userRole?.color || '#0284c7'}22`,
                                  color: userRole?.color || '#0284c7',
                                  border: `1px solid ${userRole?.color || '#0284c7'}55`,
                                }}
                              >
                                {userRole?.name || u.role_id}
                              </span>
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                                {/* Role Assignment Dropdown */}
                                <select
                                  value={u.role_id}
                                  onChange={async (e) => {
                                    const newR = e.target.value;
                                    try {
                                      const res = await fetch(`/api/admin/users?id=${u.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ roleId: newR }),
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setStatusMessage(`Role for ${u.name} updated to ${newR}.`);
                                        fetchRbacData();
                                      } else {
                                        alert(data.error || 'Failed to update role');
                                      }
                                    } catch (err: any) {
                                      alert(err.message || 'Error updating role');
                                    }
                                  }}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    background: '#1e293b',
                                    border: '1px solid #334155',
                                    color: '#ffffff',
                                    fontSize: '0.78rem',
                                  }}
                                >
                                  {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>

                                {/* Toggle Super Admin Quick Button */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const targetRole = isSuperAdmin ? 'theme_editor' : 'super_admin';
                                    try {
                                      const res = await fetch(`/api/admin/users?id=${u.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ roleId: targetRole }),
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setStatusMessage(
                                          isSuperAdmin
                                            ? `Removed super admin privilege from ${u.name}.`
                                            : `Granted Super Administrator authority to ${u.name}.`
                                        );
                                        fetchRbacData();
                                      } else {
                                        alert(data.error || 'Failed to toggle Super Admin');
                                      }
                                    } catch (err: any) {
                                      alert(err.message || 'Error toggling Super Admin');
                                    }
                                  }}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    background: isSuperAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    border: `1px solid ${isSuperAdmin ? '#ef4444' : '#10b981'}`,
                                    color: isSuperAdmin ? '#fca5a5' : '#34d399',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {isSuperAdmin ? 'Demote ⭐' : 'Make Super Admin ⭐'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 6: DATABASE CONFIGURATION & INTEROPERABILITY              */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'database' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Database & System Interoperability</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                    Configure the active database driver, sync with Rwanda Forestry Authority FMES REST APIs, or switch to Firebase Firestore.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                  {/* Driver Card 1: Memory / Local JSON */}
                  <div style={{ background: '#0f172a', border: driver === 'memory' ? '2px solid #0284c7' : '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>In-Memory / Local JSON</h3>
                      {driver === 'memory' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#0284c7', color: '#ffffff' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
                      Uses bundled indicators.json, indicator_narratives.json, and landing_stories.json files with instantaneous zero-latency in-memory query execution and disk sync.
                    </p>
                    <button
                      type="button"
                      disabled={driver === 'memory'}
                      onClick={async () => {
                        await fetch('/api/db-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ driver: 'memory' }),
                        });
                        fetchDbConfig();
                      }}
                      style={{ padding: '8px 16px', borderRadius: '6px', background: driver === 'memory' ? '#334155' : '#0284c7', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: driver === 'memory' ? 'default' : 'pointer' }}
                    >
                      {driver === 'memory' ? 'Selected Driver' : 'Switch to Local JSON'}
                    </button>
                  </div>

                  {/* Driver Card 2: RFA In-House REST Adapter */}
                  <div style={{ background: '#0f172a', border: driver === 'inhouse' ? '2px solid #10b981' : '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>RFA-FMES REST Gateway</h3>
                      {driver === 'inhouse' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#10b981', color: '#000000' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
                      Connects directly to the Rwanda Forestry Authority FMES REST endpoint for bidirectional indicators syncing.
                    </p>
                    <input
                      type="text"
                      value={inHouseUrl}
                      onChange={(e) => setInHouseUrl(e.target.value)}
                      placeholder="http://localhost:8000/api/v1"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.82rem', marginBottom: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/db-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ driver: 'inhouse', inHouseUrl }),
                        });
                        fetchDbConfig();
                      }}
                      style={{ padding: '8px 16px', borderRadius: '6px', background: '#10b981', color: '#000000', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      {driver === 'inhouse' ? 'Save & Reconnect' : 'Switch to RFA Gateway'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT INDICATOR                                         */}
      {/* ------------------------------------------------------------- */}
      {showEditIndicatorModal && editingIndicator && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
                  ✏️ Edit Indicator: {editingIndicator.id}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Updates are saved to the database adapter and synced to indicators.json
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditIndicatorModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveIndicator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Scientific Definition & Public Title
                </label>
                <input
                  type="text"
                  required
                  value={editingIndicator.definition}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, definition: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Theme</label>
                  <select
                    value={editingIndicator.theme}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, theme: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  >
                    <option value="climate">Climate Adaptation</option>
                    <option value="biodiversity">Biodiversity Protection</option>
                    <option value="gesi">Gender Equality & Inclusion (GESI)</option>
                    <option value="economy">Employment & Economy</option>
                    <option value="mypeg_benchmark">Built Environment (MyPeg)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Unit of Measure</label>
                  <input
                    type="text"
                    value={editingIndicator.unit}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, unit: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>2024 Baseline</label>
                  <input
                    type="number"
                    value={editingIndicator.baseline_2024}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, baseline_2024: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>2025 Current</label>
                  <input
                    type="number"
                    value={editingIndicator.current_2025}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, current_2025: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>2026 Target</label>
                  <input
                    type="number"
                    value={editingIndicator.target_2026}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, target_2026: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Status</label>
                  <select
                    value={editingIndicator.status}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, status: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  >
                    <option value="on-track">on-track</option>
                    <option value="exceeded">exceeded</option>
                    <option value="needs-acceleration">needs-acceleration</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>FMES Code</label>
                  <input
                    type="text"
                    value={editingIndicator.fmes_code}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, fmes_code: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>FMES Alignment</label>
                  <input
                    type="text"
                    value={editingIndicator.fmes_alignment}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, fmes_alignment: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Data Source Citation</label>
                <input
                  type="text"
                  value={editingIndicator.data_source_citation}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, data_source_citation: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Measurement Method</label>
                <input
                  type="text"
                  value={editingIndicator.measurement_method}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, measurement_method: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNarrativeId(editingIndicator.id);
                    setShowEditIndicatorModal(false);
                    setActiveTab('indicator_stories');
                  }}
                  style={{ background: 'none', border: 'none', color: '#c4b5fd', fontSize: '0.82rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  📖 Edit 3-Question Stories for this indicator &rarr;
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditIndicatorModal(false)}
                    style={{ padding: '10px 18px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingIndicator}
                    style={{ padding: '10px 22px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {savingIndicator ? 'Saving Changes...' : 'Save Indicator'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT / CREATE LANDING STORY                            */}
      {/* ------------------------------------------------------------- */}
      {showStoryModal && editingStory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
                  📰 Landing Page Story Editor
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Slug ID: <code style={{ color: '#38bdf8' }}>{editingStory.id}</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStory} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Common Story Attributes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Story Slug ID</label>
                  <input
                    type="text"
                    required
                    value={editingStory.id}
                    onChange={(e) => setEditingStory({ ...editingStory, id: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Pill Color Accent</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={editingStory.tagColor || '#0284c7'}
                      onChange={(e) => setEditingStory({ ...editingStory, tagColor: e.target.value })}
                      style={{ width: '40px', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={editingStory.tagColor || '#0284c7'}
                      onChange={(e) => setEditingStory({ ...editingStory, tagColor: e.target.value })}
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStoryLocaleTab('en')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: storyLocaleTab === 'en' ? '#0284c7' : '#1e293b',
                    color: storyLocaleTab === 'en' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  🇬🇧 English Version
                </button>
                <button
                  type="button"
                  onClick={() => setStoryLocaleTab('rw')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: storyLocaleTab === 'rw' ? '#0284c7' : '#1e293b',
                    color: storyLocaleTab === 'rw' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  🇷🇼 Kinyarwanda Version
                </button>
              </div>

              {/* Localized Story Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Tag Label ({storyLocaleTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStory[storyLocaleTab]?.tag || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingStory((prev: any) => ({
                        ...prev,
                        [storyLocaleTab]: { ...prev[storyLocaleTab], tag: val },
                      }));
                    }}
                    placeholder="e.g. Flood Resilience"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Publication Date ({storyLocaleTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStory[storyLocaleTab]?.date || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingStory((prev: any) => ({
                        ...prev,
                        [storyLocaleTab]: { ...prev[storyLocaleTab], date: val },
                      }));
                    }}
                    placeholder="e.g. February 2025"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Story Headline Title ({storyLocaleTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  required
                  value={editingStory[storyLocaleTab]?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingStory((prev: any) => ({
                      ...prev,
                      [storyLocaleTab]: { ...prev[storyLocaleTab], title: val },
                    }));
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Card Summary / Excerpt ({storyLocaleTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingStory[storyLocaleTab]?.summary || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingStory((prev: any) => ({
                      ...prev,
                      [storyLocaleTab]: { ...prev[storyLocaleTab], summary: val },
                    }));
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Featured Community Quote ({storyLocaleTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={editingStory[storyLocaleTab]?.quote || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingStory((prev: any) => ({
                        ...prev,
                        [storyLocaleTab]: { ...prev[storyLocaleTab], quote: val },
                      }));
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Quote Author ({storyLocaleTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingStory[storyLocaleTab]?.quoteAuthor || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingStory((prev: any) => ({
                        ...prev,
                        [storyLocaleTab]: { ...prev[storyLocaleTab], quoteAuthor: val },
                      }));
                    }}
                    placeholder="e.g. Chantal M."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Full Report Body Paragraphs (One paragraph per line)
                </label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(editingStory[storyLocaleTab]?.fullBody)
                      ? editingStory[storyLocaleTab]?.fullBody.join('\n\n')
                      : editingStory[storyLocaleTab]?.fullBody || ''
                  }
                  onChange={(e) => {
                    const paragraphs = e.target.value
                      .split('\n\n')
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0);
                    setEditingStory((prev: any) => ({
                      ...prev,
                      [storyLocaleTab]: { ...prev[storyLocaleTab], fullBody: paragraphs },
                    }));
                  }}
                  placeholder="Paste multi-paragraph narrative here. Separate paragraphs with a blank line."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStory}
                  style={{ padding: '10px 22px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {savingStory ? 'Saving Story...' : 'Save Landing Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE USER & DELEGATE ROLE                            */}
      {/* ------------------------------------------------------------- */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Administrator & Delegate Role</h3>
              <button type="button" onClick={() => setShowCreateUserModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Damascene Nkurunziza"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@rfa.gov.rw"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Government / Partner Organization</label>
                <input
                  type="text"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
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
