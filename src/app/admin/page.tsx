'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Indicator, IndicatorGpsPoint } from '@/lib/db/types';
import { Role, AdminUser, AuthSession, Permission } from '@/lib/auth/rbacTypes';

const CatchmentMap = dynamic(() => import('@/components/CatchmentMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        background: '#0a111e',
        borderRadius: '12px',
        border: '1px solid #1e293b',
      }}
    >
      Loading Interactive GPS Map Preview...
    </div>
  ),
});

export default function AdminPortalPage() {
  // Authentication & Session State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authEmail, setAuthEmail] = useState('admin@suncasa.rw');
  const [authPassword, setAuthPassword] = useState('SuncasaKigali2025!');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<
    'indicators' | 'builder' | 'landing_stories' | 'indicator_stories' | 'gps_mapper' | 'rbac' | 'database' | 'interoperability' | 'collaborators' | 'social_links'
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

  // GPS Data & Map Generator State
  const [selectedGpsIndId, setSelectedGpsIndId] = useState<string>('area_restored_ha');
  const [gpsPoints, setGpsPoints] = useState<IndicatorGpsPoint[]>([]);
  const [newGpsLat, setNewGpsLat] = useState<string>('-1.9442');
  const [newGpsLng, setNewGpsLng] = useState<string>('30.0514');
  const [newGpsName, setNewGpsName] = useState<string>('');
  const [newGpsNameRw, setNewGpsNameRw] = useState<string>('');
  const [newGpsValue, setNewGpsValue] = useState<number>(120);
  const [newGpsSector, setNewGpsSector] = useState<string>('Gitega');
  const [newGpsDistrict, setNewGpsDistrict] = useState<string>('Nyarugenge');
  const [newGpsStatus, setNewGpsStatus] = useState<string>('Active');
  const [newGpsNotes, setNewGpsNotes] = useState<string>('');
  const [generatingMap, setGeneratingMap] = useState<boolean>(false);

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

  // Interoperability & API Gateway State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyOrgName, setNewKeyOrgName] = useState('');
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        indicator_id: 'area_restored_ha',
        current_2025: 1420,
        new_reading: {
          period: '2025 Q3',
          value: 1420,
        },
      },
      null,
      2
    )
  );
  const [testApiKey, setTestApiKey] = useState('suncasa-kigali-partner-key-2025');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testingIngest, setTestingIngest] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [testOutboundUrl, setTestOutboundUrl] = useState('/api/v1/indicators');
  const [testOutboundResponse, setTestOutboundResponse] = useState<string | null>(null);
  const [testingOutbound, setTestingOutbound] = useState(false);

  // Collaborators Management State
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [editingCollab, setEditingCollab] = useState<any | null>(null);
  const [savingCollab, setSavingCollab] = useState(false);
  const [deletingCollabId, setDeletingCollabId] = useState<string | null>(null);
  const [collabName, setCollabName] = useState('');
  const [collabUrl, setCollabUrl] = useState('');
  const [collabLogoUrl, setCollabLogoUrl] = useState('');
  const [collabDescription, setCollabDescription] = useState('');

  // Social Share Links Management State
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [loadingSocialLinks, setLoadingSocialLinks] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocial, setEditingSocial] = useState<any | null>(null);
  const [savingSocial, setSavingSocial] = useState(false);
  const [deletingSocialId, setDeletingSocialId] = useState<string | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialIcon, setSocialIcon] = useState('🔗');
  const [socialBgColor, setSocialBgColor] = useState('#0284c7');
  const [socialTextColor, setSocialTextColor] = useState('#ffffff');
  const [socialShareType, setSocialShareType] = useState('template');
  const [socialUrlTemplate, setSocialUrlTemplate] = useState('');
  const [socialIsActive, setSocialIsActive] = useState(true);
  const [socialOrder, setSocialOrder] = useState<number>(1);

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
      fetchApiKeys();
      fetchCollaborators();
      fetchSocialLinks();
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

  // Sync GPS points when selected indicator changes
  useEffect(() => {
    if (selectedGpsIndId && indicators.length > 0) {
      const ind = indicators.find((i) => i.id === selectedGpsIndId);
      if (ind && ind.gps_coordinates) {
        setGpsPoints([...ind.gps_coordinates]);
      } else {
        setGpsPoints([]);
      }
    }
  }, [selectedGpsIndId, indicators]);

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

  const fetchApiKeys = async () => {
    setLoadingKeys(true);
    try {
      const res = await fetch('/api/admin/api-keys');
      const data = await res.json();
      if (data.success) {
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error('Failed to load API keys', err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const fetchCollaborators = async () => {
    setLoadingCollaborators(true);
    try {
      const res = await fetch('/api/admin/collaborators');
      const data = await res.json();
      if (data.success) {
        setCollaborators(data.collaborators || []);
      }
    } catch (err) {
      console.error('Failed to load collaborators', err);
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const handleSaveCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabName || !collabUrl) return;
    setSavingCollab(true);
    try {
      const payload = {
        id: editingCollab?.id,
        name: collabName,
        url: collabUrl,
        logoUrl: collabLogoUrl,
        description: collabDescription,
      };
      const method = editingCollab ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/collaborators', {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': session?.token || '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(editingCollab ? `Updated ${collabName}` : `Added ${collabName}`);
        setShowCollabModal(false);
        fetchCollaborators();
      } else {
        alert(data.error || 'Failed to save collaborator');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving collaborator');
    } finally {
      setSavingCollab(false);
    }
  };

  const SOCIAL_PRESETS = [
    { name: 'WhatsApp', icon: '💬', bg_color: '#25d366', text_color: '#ffffff', share_type: 'template', url_template: 'https://api.whatsapp.com/send?text={title}%20{url}' },
    { name: 'Telegram', icon: '✈️', bg_color: '#229ed9', text_color: '#ffffff', share_type: 'template', url_template: 'https://t.me/share/url?url={url}&text={title}' },
    { name: 'Facebook', icon: 'f', bg_color: '#1877f2', text_color: '#ffffff', share_type: 'template', url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
    { name: 'LinkedIn', icon: 'in', bg_color: '#0a66c2', text_color: '#ffffff', share_type: 'template', url_template: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
    { name: 'X (Twitter)', icon: '𝕏', bg_color: '#0f172a', text_color: '#ffffff', share_type: 'template', url_template: 'https://twitter.com/intent/tweet?url={url}&text={title}' },
    { name: 'Reddit', icon: '🤖', bg_color: '#ff4500', text_color: '#ffffff', share_type: 'template', url_template: 'https://reddit.com/submit?url={url}&title={title}' },
    { name: 'Email', icon: '✉', bg_color: '#ea4335', text_color: '#ffffff', share_type: 'email', url_template: 'mailto:?subject={title}&body={url}' },
    { name: 'Copy Link', icon: '🔗', bg_color: '#475569', text_color: '#ffffff', share_type: 'copy', url_template: '' },
  ];

  const fetchSocialLinks = async () => {
    setLoadingSocialLinks(true);
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      if (data.success) {
        setSocialLinks(data.social_links || []);
      }
    } catch (err) {
      console.error('Failed to load social links', err);
    } finally {
      setLoadingSocialLinks(false);
    }
  };

  const handleOpenCreateSocial = () => {
    setEditingSocial(null);
    setSocialName('');
    setSocialIcon('🔗');
    setSocialBgColor('#0284c7');
    setSocialTextColor('#ffffff');
    setSocialShareType('template');
    setSocialUrlTemplate('');
    setSocialIsActive(true);
    setSocialOrder(socialLinks.length + 1);
    setShowSocialModal(true);
  };

  const handleOpenEditSocial = (item: any) => {
    setEditingSocial(item);
    setSocialName(item.name || '');
    setSocialIcon(item.icon || '🔗');
    setSocialBgColor(item.bg_color || '#0284c7');
    setSocialTextColor(item.text_color || '#ffffff');
    setSocialShareType(item.share_type || 'template');
    setSocialUrlTemplate(item.url_template || '');
    setSocialIsActive(item.is_active !== false);
    setSocialOrder(item.order ?? 1);
    setShowSocialModal(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialName) return;
    setSavingSocial(true);
    try {
      const payload = {
        id: editingSocial?.id,
        name: socialName,
        icon: socialIcon,
        bg_color: socialBgColor,
        text_color: socialTextColor,
        share_type: socialShareType,
        url_template: socialUrlTemplate,
        is_active: socialIsActive,
        order: socialOrder,
      };
      const method = editingSocial ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/social-links', {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': session?.token || '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(editingSocial ? `Updated '${socialName}'` : `Added '${socialName}'`);
        setShowSocialModal(false);
        fetchSocialLinks();
      } else {
        alert(data.error || 'Failed to save social link');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving social link');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleToggleSocialActive = async (item: any) => {
    try {
      const res = await fetch('/api/admin/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': session?.token || '' },
        body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
      });
      if (res.ok) {
        setSocialLinks((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, is_active: !s.is_active } : s))
        );
        setStatusMessage(`${item.name} is now ${!item.is_active ? 'Active' : 'Disabled'}`);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleMoveSocialOrder = async (item: any, direction: 'up' | 'down') => {
    const currentIndex = socialLinks.findIndex((s) => s.id === item.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const otherItem = socialLinks[targetIndex];
    const currentOrder = item.order ?? (currentIndex + 1);
    const otherOrder = otherItem.order ?? (targetIndex + 1);

    try {
      await Promise.all([
        fetch('/api/admin/social-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': session?.token || '' },
          body: JSON.stringify({ id: item.id, order: otherOrder }),
        }),
        fetch('/api/admin/social-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': session?.token || '' },
          body: JSON.stringify({ id: otherItem.id, order: currentOrder }),
        }),
      ]);
      fetchSocialLinks();
    } catch (err) {
      alert('Failed to reorder');
    }
  };

  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyOrgName) return;
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyOrgName }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`API Key generated for ${newKeyOrgName}`);
        setNewKeyOrgName('');
        fetchApiKeys();
      } else {
        alert(data.error || 'Failed to create key');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating key');
    }
  };

  const handleRevokeApiKey = async (id: string, name: string) => {
    if (!confirm(`Revoke and deactivate API key for "${name}"? External clients using this token will be immediately blocked.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/api-keys?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`API key for ${name} revoked.`);
        fetchApiKeys();
      } else {
        alert(data.error || 'Failed to revoke key');
      }
    } catch (err: any) {
      alert(err.message || 'Error revoking key');
    }
  };

  const handleRunIngestTest = async () => {
    setTestingIngest(true);
    setTestResponse(null);
    try {
      const parsedBody = JSON.parse(testPayload);
      const res = await fetch('/api/v1/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': testApiKey,
        },
        body: JSON.stringify(parsedBody),
      });
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
      if (data.success) {
        fetchIndicators();
      }
    } catch (err: any) {
      setTestResponse(`Error: ${err.message}`);
    } finally {
      setTestingIngest(false);
    }
  };

  const handleRunOutboundTest = async (endpoint: string) => {
    setTestingOutbound(true);
    setTestOutboundUrl(endpoint);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setTestOutboundResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestOutboundResponse(`Error: ${err.message}`);
    } finally {
      setTestingOutbound(false);
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
      gps_coordinates: [
        {
          id: `gps-${cleanId}-1`,
          name: `${builderDef} - Main Field Station`,
          name_rw: 'Agace k\'Ibanze k\'Igipimo',
          lat: -1.9442,
          lng: 30.0514,
          value: Number(builderCurrent),
          sector: 'Gitega',
          district: 'Nyarugenge',
          status: 'Active',
          notes: 'Initial field telemetry node.',
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

  // GPS Waypoint Handlers
  const handleAddGpsWaypoint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newGpsLat || !newGpsLng || !newGpsName) {
      alert('Please provide Latitude, Longitude, and a Station Name.');
      return;
    }

    const latNum = parseFloat(newGpsLat);
    const lngNum = parseFloat(newGpsLng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('Latitude and Longitude must be valid numbers (e.g. -1.9442, 30.0514).');
      return;
    }

    const newPt: IndicatorGpsPoint = {
      id: `gps-${Date.now().toString().slice(-6)}`,
      name: newGpsName,
      name_rw: newGpsNameRw || newGpsName,
      lat: latNum,
      lng: lngNum,
      value: Number(newGpsValue),
      sector: newGpsSector,
      district: newGpsDistrict,
      status: newGpsStatus,
      notes: newGpsNotes,
    };

    setGpsPoints((prev) => [...prev, newPt]);
    setNewGpsName('');
    setNewGpsNameRw('');
    setNewGpsNotes('');
    setStatusMessage(`GPS Waypoint "${newPt.name}" added to buffer. Click "Generate & Save Map" to commit.`);
  };

  const handleDeleteGpsWaypoint = (id: string) => {
    setGpsPoints((prev) => prev.filter((pt) => pt.id !== id));
  };

  const applyGpsPreset = (preset: { name: string; name_rw: string; lat: number; lng: number; sector: string; district: string }) => {
    setNewGpsName(preset.name);
    setNewGpsNameRw(preset.name_rw);
    setNewGpsLat(preset.lat.toString());
    setNewGpsLng(preset.lng.toString());
    setNewGpsSector(preset.sector);
    setNewGpsDistrict(preset.district);
  };

  const handleGenerateAndSaveMap = async () => {
    if (!selectedGpsIndId) return;
    setGeneratingMap(true);

    try {
      const res = await fetch(`/api/indicators/${selectedGpsIndId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gps_coordinates: gpsPoints,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`⚡ Interactive GIS Map generated and saved for indicator '${selectedGpsIndId}' with ${gpsPoints.length} GPS waypoints!`);
        setIndicators((prev) =>
          prev.map((ind) => (ind.id === selectedGpsIndId ? { ...ind, gps_coordinates: gpsPoints } : ind))
        );
      } else {
        alert(data.error || 'Failed to save GPS map data.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving GPS data.');
    } finally {
      setGeneratingMap(false);
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
      ind.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.fmes_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = themeFilter === 'all' || ind.theme === themeFilter;
    return matchesSearch && matchesTheme;
  });

  const activeGpsIndicator =
    indicators.find((i) => i.id === selectedGpsIndId) || indicators[0];

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED STATE: LOGIN SCREEN
  // -------------------------------------------------------------
  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px auto',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>🛡️</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#0f172a' }}>
              SUNCASA Admin Portal
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
              Kigali NbS Impact Monitoring Governance Console
            </p>
          </div>

          {authError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
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
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              }}
            >
              {authLoading ? 'Verifying Credentials...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {/* Pre-configured Super Admin Hint */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
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
                  color: '#0284c7',
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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
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
              Impact Monitoring, GPS Mapping & Content Governance Console
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
            backgroundColor: '#0284c7',
            borderRight: '1px solid #0369a1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: '60px',
            height: 'calc(100vh - 60px)',
            zIndex: 40,
            flexShrink: 0,
            boxShadow: '2px 0 12px rgba(2, 132, 199, 0.15)',
          }}
        >
          <div>
            <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.18)' }}>
              <div style={{ fontSize: '0.72rem', color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Administration Menu
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* 1. Indicator Catalogue */}
              <button
                type="button"
                onClick={() => setActiveTab('indicators')}
                className={`admin-sidebar-nav-btn ${activeTab === 'indicators' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'indicators' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'indicators' ? '#ffffff' : 'transparent',
                  color: activeTab === 'indicators' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'indicators' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📋</span>
                  <span>Indicator Catalogue</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: activeTab === 'indicators' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'indicators' ? '#0284c7' : '#ffffff',
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
                className={`admin-sidebar-nav-btn ${activeTab === 'builder' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'builder' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'builder' ? '#ffffff' : 'transparent',
                  color: activeTab === 'builder' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'builder' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
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
                    background: activeTab === 'builder' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'builder' ? '#0284c7' : '#ffffff',
                    fontWeight: 800,
                  }}
                >
                  BUILD
                </span>
              </button>

              {/* 3. GPS & Map Generator */}
              <button
                type="button"
                onClick={() => setActiveTab('gps_mapper')}
                className={`admin-sidebar-nav-btn ${activeTab === 'gps_mapper' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'gps_mapper' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'gps_mapper' ? '#ffffff' : 'transparent',
                  color: activeTab === 'gps_mapper' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'gps_mapper' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🗺️</span>
                  <span>GPS & Map Generator</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: activeTab === 'gps_mapper' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'gps_mapper' ? '#0284c7' : '#ffffff',
                    fontWeight: 800,
                  }}
                >
                  GPS
                </span>
              </button>

              {/* 4. Landing Stories */}
              <button
                type="button"
                onClick={() => setActiveTab('landing_stories')}
                className={`admin-sidebar-nav-btn ${activeTab === 'landing_stories' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'landing_stories' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'landing_stories' ? '#ffffff' : 'transparent',
                  color: activeTab === 'landing_stories' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'landing_stories' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📰</span>
                  <span>Landing Stories</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: activeTab === 'landing_stories' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'landing_stories' ? '#0284c7' : '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {landingStories.length || 3}
                </span>
              </button>

              {/* 5. Indicator Stories (3-Question Narratives) */}
              <button
                type="button"
                onClick={() => setActiveTab('indicator_stories')}
                className={`admin-sidebar-nav-btn ${activeTab === 'indicator_stories' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'indicator_stories' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'indicator_stories' ? '#ffffff' : 'transparent',
                  color: activeTab === 'indicator_stories' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'indicator_stories' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
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
                    background: activeTab === 'indicator_stories' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'indicator_stories' ? '#0284c7' : '#ffffff',
                    fontWeight: 800,
                  }}
                >
                  3-Q
                </span>
              </button>

              {/* 6. RBAC & Roles */}
              <button
                type="button"
                onClick={() => setActiveTab('rbac')}
                className={`admin-sidebar-nav-btn ${activeTab === 'rbac' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'rbac' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'rbac' ? '#ffffff' : 'transparent',
                  color: activeTab === 'rbac' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'rbac' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>👥</span>
                  <span>Roles & Delegation</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: activeTab === 'rbac' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'rbac' ? '#0284c7' : '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {users.length}
                </span>
              </button>

              {/* 7. DB & FMES Settings */}
              <button
                type="button"
                onClick={() => setActiveTab('database')}
                className={`admin-sidebar-nav-btn ${activeTab === 'database' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'database' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'database' ? '#ffffff' : 'transparent',
                  color: activeTab === 'database' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'database' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>⚙️</span>
                <span>DB & FMES Settings</span>
              </button>

              {/* 8. Interoperability & Open APIs */}
              <button
                type="button"
                onClick={() => setActiveTab('interoperability')}
                className={`admin-sidebar-nav-btn ${activeTab === 'interoperability' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'interoperability' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'interoperability' ? '#ffffff' : 'transparent',
                  color: activeTab === 'interoperability' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'interoperability' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <span>APIs & Interoperability</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: activeTab === 'interoperability' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'interoperability' ? '#0284c7' : '#ffffff',
                    fontWeight: 800,
                  }}
                >
                  REST
                </span>
              </button>

              {/* 9. Collaborators */}
              <button
                type="button"
                onClick={() => setActiveTab('collaborators')}
                className={`admin-sidebar-nav-btn ${activeTab === 'collaborators' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'collaborators' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'collaborators' ? '#ffffff' : 'transparent',
                  color: activeTab === 'collaborators' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'collaborators' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🤝</span>
                  <span>Collaborators</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: activeTab === 'collaborators' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'collaborators' ? '#0284c7' : '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {collaborators.length}
                </span>
              </button>

              {/* 10. Social Share Icons */}
              <button
                type="button"
                onClick={() => setActiveTab('social_links')}
                className={`admin-sidebar-nav-btn ${activeTab === 'social_links' ? 'is-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'social_links' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  background: activeTab === 'social_links' ? '#ffffff' : 'transparent',
                  color: activeTab === 'social_links' ? '#0284c7' : '#ffffff',
                  boxShadow: activeTab === 'social_links' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🌐</span>
                  <span>Social Share Icons</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: activeTab === 'social_links' ? '#e0f2fe' : 'rgba(255, 255, 255, 0.2)',
                    color: activeTab === 'social_links' ? '#0284c7' : '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  {socialLinks.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.18)' }}>
            <div style={{ fontSize: '0.74rem', color: '#e0f2fe' }}>
              Connected Driver: <strong style={{ color: '#ffffff' }}>{driverName}</strong>
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------- */}
        {/* MAIN WORKSPACE AREA (Right of Left Sidebar)                   */}
        {/* ------------------------------------------------------------- */}
        <div style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#0f172a' }}>
          {/* Top Breadcrumb Header Bar */}
          <header
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
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
              <span style={{ fontSize: '0.76rem', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Admin Console &rsaquo;
              </span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2px 0 0 0', color: '#0f172a' }}>
                {activeTab === 'indicators' && 'Indicator Catalogue & Live Management'}
                {activeTab === 'builder' && 'Indicator Builder & Live Publisher'}
                {activeTab === 'gps_mapper' && 'GPS Telemetry Entry & Dynamic Map Generator'}
                {activeTab === 'landing_stories' && 'Landing Page Stories & Civic Narratives'}
                {activeTab === 'indicator_stories' && 'Indicator Stories & 3 Core Questions Editor'}
                {activeTab === 'rbac' && 'Role-Based Access Control & User Delegation'}
                {activeTab === 'database' && 'Database Configuration & Interoperability'}
                {activeTab === 'interoperability' && 'Open REST APIs & Ingestion Gateway'}
                {activeTab === 'collaborators' && 'Collaborators & Partner Logos'}
                {activeTab === 'social_links' && 'Social Share Channels & Rail Icons'}
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
              {activeTab === 'social_links' && (
                <button
                  type="button"
                  onClick={handleOpenCreateSocial}
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
                  + Add Social Channel
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
          <main style={{ padding: '28px 36px 60px 36px', maxWidth: '1400px', width: '100%', background: '#ffffff' }}>
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: INDICATOR CATALOGUE & EDIT / REMOVAL                   */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'indicators' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Published Indicators Catalogue</h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                      Manage live indicators published on the public SUNCASA portal, edit metric targets & definitions, enter GPS data, or manage narratives.
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
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <select
                    value={themeFilter}
                    onChange={(e) => setThemeFilter(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="all">All Themes</option>
                    <option value="climate">Climate Adaptation</option>
                    <option value="biodiversity">Biodiversity Protection</option>
                    <option value="gesi">Gender & Inclusion (GESI)</option>
                    <option value="economy">Employment & Economy</option>
                    <option value="mypeg_benchmark">Built Environment</option>
                  </select>
                </div>

                {/* Indicator Table */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px' }}>Theme</th>
                        <th style={{ padding: '14px 16px' }}>Indicator ID & Definition</th>
                        <th style={{ padding: '14px 16px' }}>FMES Code</th>
                        <th style={{ padding: '14px 16px' }}>2025 Progress / 2026 Target</th>
                        <th style={{ padding: '14px 16px' }}>GPS Nodes</th>
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
                        const gpsCount = ind.gps_coordinates?.length || 0;

                        return (
                          <tr key={ind.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${col}22`, color: col, textTransform: 'uppercase' }}>
                                {ind.theme.replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                {ind.id}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                                {ind.definition}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <code style={{ fontSize: '0.76rem', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>
                                {ind.fmes_code}
                              </code>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', fontWeight: 700 }}>
                                <span>{ind.current_2025.toLocaleString()}</span>
                                <span style={{ color: '#64748b', fontSize: '0.76rem' }}>/ {ind.target_2026.toLocaleString()} {ind.unit}</span>
                              </div>
                              <div style={{ width: '120px', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: col }} />
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span
                                style={{
                                  fontSize: '0.76rem',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  color: '#1e293b',
                                  fontWeight: 600,
                                  border: '1px solid #cbd5e1',
                                }}
                              >
                                {gpsCount} points
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <Link
                                  href={`/indicator/${ind.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    border: '1px solid #cbd5e1',
                                    color: '#1e293b',
                                    textDecoration: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  Public
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditIndicator(ind)}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    border: '1px solid #cbd5e1',
                                    color: '#1e293b',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedGpsIndId(ind.id);
                                    setActiveTab('gps_mapper');
                                  }}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    border: '1px solid #cbd5e1',
                                    color: '#1e293b',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Enter GPS Coordinates & Generate Map"
                                >
                                  GPS
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNarrativeId(ind.id);
                                    setActiveTab('indicator_stories');
                                  }}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    border: '1px solid #cbd5e1',
                                    color: '#1e293b',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Edit 3-Question Stories for this indicator"
                                >
                                  Stories
                                </button>

                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteIndicator(ind.id, ind.definition || ind.id)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: 'transparent',
                                      border: '1px solid #cbd5e1',
                                      color: '#1e293b',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
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
            {/* TAB 2: GPS DATA ENTRY & DYNAMIC MAP GENERATOR                 */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'gps_mapper' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                    GPS Telemetry Entry & Dynamic Map Generator
                  </h2>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Enter field-verified GPS coordinates (lat, lng, progress metric, sector) for any indicator and generate keyless OpenStreetMap / Satellite GIS maps with auto-fit bounds.
                  </p>
                </div>

                {/* Indicator Picker Banner */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
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
                  <div style={{ flex: 1, minWidth: '320px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '6px' }}>
                      Select Target Indicator for GPS Mapping
                    </label>
                    <select
                      value={selectedGpsIndId}
                      onChange={(e) => setSelectedGpsIndId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    >
                      {indicators.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          [{ind.theme.toUpperCase()}] {ind.definition || ind.id} ({ind.gps_coordinates?.length || 0} GPS nodes)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.76rem', color: '#475569' }}>FMES System Code</div>
                      <code style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
                        {activeGpsIndicator?.fmes_code}
                      </code>
                    </div>

                    <Link
                      href={`/indicator/${selectedGpsIndId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
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
                      <span>Public Indicator View ↗</span>
                    </Link>
                  </div>
                </div>

                {/* 2-Column Workspace: Left GPS Entry & Table / Right Live Generated Map */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  {/* Left Column: GPS Input & Points Table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* GPS Entry Form Card */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0', color: '#38bdf8' }}>
                        1. Enter GPS Waypoint Data
                      </h3>

                      {/* Quick 1-Click Kigali Preset Buttons */}
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ display: 'block', fontSize: '0.74rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
                          📍 Quick Kigali Field Presets (Click to autofill GPS):
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {[
                            { name: 'Yanze River Water Intake Node', name_rw: 'Icyuma cya Yanze', lat: -1.9045, lng: 30.0381, sector: 'Gatsata', district: 'Gasabo' },
                            { name: 'Mount Kigali Summit Hillside Plot', name_rw: 'Imisozi ya Mont Kigali', lat: -1.9852, lng: 30.0245, sector: 'Kanyinya', district: 'Nyarugenge' },
                            { name: 'Mpazi Ravine Stormwater Swale', name_rw: 'Ibyobo bya Mpazi', lat: -1.9442, lng: 30.0514, sector: 'Gitega', district: 'Nyarugenge' },
                            { name: 'Nyabugogo Commercial Buffer Node', name_rw: 'Igishanga cyi Nyabugogo', lat: -1.9360, lng: 30.0442, sector: 'Muhima', district: 'Nyarugenge' },
                            { name: 'Mageragere Afforestation Belt', name_rw: 'Amashyamba ya Mageragere', lat: -2.0251, lng: 30.0152, sector: 'Mageragere', district: 'Nyarugenge' },
                            { name: 'Kimisagara Erosion Gully Barrier', name_rw: 'Urukuta rwa Kimisagara', lat: -1.9510, lng: 30.0390, sector: 'Kimisagara', district: 'Nyarugenge' },
                          ].map((pre) => (
                            <button
                              key={pre.name}
                              type="button"
                              onClick={() => applyGpsPreset(pre)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                transition: 'all 0.1s ease',
                              }}
                            >
                              {pre.name.split(' ')[0]} {pre.name.split(' ')[1]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleAddGpsWaypoint} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                              Latitude (Decimal) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="-1.9442"
                              value={newGpsLat}
                              onChange={(e) => setNewGpsLat(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                              Longitude (Decimal) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="30.0514"
                              value={newGpsLng}
                              onChange={(e) => setNewGpsLng(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                            Station / Site Name (English) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mpazi Vegetative Bio-Engineering Check Dam A"
                            value={newGpsName}
                            onChange={(e) => setNewGpsName(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                            Izina ry&apos;Agace mu Kinyarwanda (Name in Kinyarwanda)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Urugomero rw'ibiti rwa Mpazi A"
                            value={newGpsNameRw}
                            onChange={(e) => setNewGpsNameRw(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                              Measured Value ({activeGpsIndicator?.unit || ''})
                            </label>
                            <input
                              type="number"
                              required
                              value={newGpsValue}
                              onChange={(e) => setNewGpsValue(Number(e.target.value))}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                              Sector
                            </label>
                            <input
                              type="text"
                              value={newGpsSector}
                              onChange={(e) => setNewGpsSector(e.target.value)}
                              placeholder="Gitega"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                              District
                            </label>
                            <input
                              type="text"
                              value={newGpsDistrict}
                              onChange={(e) => setNewGpsDistrict(e.target.value)}
                              placeholder="Nyarugenge"
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                            Status & Verification
                          </label>
                          <select
                            value={newGpsStatus}
                            onChange={(e) => setNewGpsStatus(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                          >
                            <option value="Active">Active Intervention</option>
                            <option value="Verified">Field Verified (RFA Audited)</option>
                            <option value="Completed">Completed Milestone</option>
                            <option value="Under Monitoring">Continuous Telemetry Monitoring</option>
                            <option value="Planned">Planned / Future Swale</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#334155', marginBottom: '4px' }}>
                            Telemetry & Field Notes
                          </label>
                          <input
                            type="text"
                            value={newGpsNotes}
                            onChange={(e) => setNewGpsNotes(e.target.value)}
                            placeholder="e.g. Bio-engineering live check-dam delayed peak crest by 28%."
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                          />
                        </div>

                        <button
                          type="submit"
                          style={{
                            padding: '10px',
                            marginTop: '6px',
                            borderRadius: '6px',
                            background: '#0284c7',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                          }}
                        >
                          + Add GPS Waypoint to Indicator Buffer
                        </button>
                      </form>
                    </div>

                    {/* GPS Waypoints List Table */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>
                          2. GPS Points Stored for Indicator ({gpsPoints.length})
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                          Target: <code style={{ color: '#38bdf8' }}>{selectedGpsIndId}</code>
                        </span>
                      </div>

                      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569' }}>
                              <th style={{ padding: '8px 10px' }}>Site Name</th>
                              <th style={{ padding: '8px 10px' }}>Coordinates</th>
                              <th style={{ padding: '8px 10px' }}>Metric Value</th>
                              <th style={{ padding: '8px 10px' }}>Status</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gpsPoints.map((pt) => (
                              <tr key={pt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                                  <div>{pt.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{pt.sector}, {pt.district}</div>
                                </td>
                                <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.74rem' }}>
                                  {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                                </td>
                                <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                                  {pt.value?.toLocaleString()} {pt.unit || activeGpsIndicator?.unit}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                                    &bull; {pt.status || 'Active'}
                                  </span>
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGpsWaypoint(pt.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#fca5a5',
                                      cursor: 'pointer',
                                      fontWeight: 700,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))}

                            {gpsPoints.length === 0 && (
                              <tr>
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                  No GPS points added yet. Use the form above or click a Kigali preset to add waypoints!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Primary Generate & Save Action Button */}
                      <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <button
                          type="button"
                          disabled={generatingMap}
                          onClick={handleGenerateAndSaveMap}
                          style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.98rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>⚡</span>
                          <span>
                            {generatingMap
                              ? 'Generating & Synchronizing GIS Map...'
                              : `Generate & Save Map for '${selectedGpsIndId}' (${gpsPoints.length} GPS Points)`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Live Generated Map Preview */}
                  <div>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        position: 'sticky',
                        top: '90px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                            Interactive Generated Map Preview
                          </h3>
                          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
                            ● Keyless OpenStreetMap & Satellite Tiles (Zero API Key Required)
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '0.74rem',
                            background: 'rgba(2, 132, 199, 0.2)',
                            color: '#38bdf8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                          }}
                        >
                          {gpsPoints.length} Pins Plotted
                        </span>
                      </div>

                      {/* Map Container */}
                      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <CatchmentMap
                          currentIndicator={{
                            ...activeGpsIndicator,
                            gps_coordinates: gpsPoints,
                          }}
                          height={460}
                          showControls={true}
                          showLegend={true}
                        />
                      </div>

                      <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.76rem', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          🛰️ Live auto-fit bounds centers onto verified GPS nodes.
                        </span>
                        <Link
                          href={`/indicator/${selectedGpsIndId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
                        >
                          Open Full Spatial View ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: INDICATOR BUILDER & PUBLISHER                          */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'builder' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Build & Publish New Indicator</h2>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Author a new Nature-Based Solutions indicator with quarterly time-series, spatial breakdowns, bilingual narratives, and publish it directly to the public portal.
                  </p>
                </div>

                <form onSubmit={handleBuildAndPublish} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                  {/* Left Column: Form Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* 1. Basic Metadata Card */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#38bdf8' }}>
                        1. Core Attributes & Theme
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Communication Theme
                          </label>
                          <select
                            value={builderTheme}
                            onChange={(e) => setBuilderTheme(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          >
                            <option value="climate">Climate Adaptation (#0284c7)</option>
                            <option value="biodiversity">Biodiversity Protection (#10b981)</option>
                            <option value="gesi">Gender & Inclusion (#8b5cf6)</option>
                            <option value="economy">Employment & Economy (#f59e0b)</option>
                            <option value="mypeg_benchmark">Built Environment (#eb6b23)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Unique Slug ID (e.g. wetland_restored_ha)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. wetland_restored_ha"
                            value={builderId}
                            onChange={(e) => setBuilderId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          Indicator Scientific Definition (English)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Total Area of Nyabarongo Riparian Wetland Buffer Restored"
                          value={builderDef}
                          onChange={(e) => setBuilderDef(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Unit</label>
                          <input
                            type="text"
                            value={builderUnit}
                            onChange={(e) => setBuilderUnit(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>2024 Baseline</label>
                          <input
                            type="number"
                            value={builderBaseline}
                            onChange={(e) => setBuilderBaseline(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>2025 Current</label>
                          <input
                            type="number"
                            value={builderCurrent}
                            onChange={(e) => setBuilderCurrent(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>2026 Target</label>
                          <input
                            type="number"
                            value={builderTarget}
                            onChange={(e) => setBuilderTarget(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. RFA-FMES & Metadata Card */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#10b981' }}>
                        2. RFA-FMES Interoperability & Lineage (5-Part Standard)
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            FMES System Code
                          </label>
                          <input
                            type="text"
                            value={builderFmesCode}
                            onChange={(e) => setBuilderFmesCode(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Responsible Agency
                          </label>
                          <input
                            type="text"
                            value={builderProvider}
                            onChange={(e) => setBuilderProvider(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          Data Source Citation
                        </label>
                        <input
                          type="text"
                          value={builderSource}
                          onChange={(e) => setBuilderSource(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          Methodological Limitations & Caveats
                        </label>
                        <input
                          type="text"
                          value={builderLimitations}
                          onChange={(e) => setBuilderLimitations(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    {/* 3. The Story (3 Questions) Card */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#f59e0b' }}>
                        3. The Story (3 Core Questions)
                      </h3>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          Question 1: What is this indicator and what does it measure?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Explains what the metric represents..."
                          value={builderStoryWhatEn}
                          onChange={(e) => setBuilderStoryWhatEn(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          Question 2: Why does it matter for Kigali's climate resilience?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Explains why this matters for erosion, floods, or community welfare..."
                          value={builderStoryWhyEn}
                          onChange={(e) => setBuilderStoryWhyEn(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          Question 3: What is SUNCASA doing with the City and RFA?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Highlights specific nature-based interventions..."
                          value={builderStoryActionEn}
                          onChange={(e) => setBuilderStoryActionEn(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.86rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preview & Publish Card */}
                  <div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', position: 'sticky', top: '90px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
                        Indicator Publication Summary
                      </h3>

                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#475569', textTransform: 'uppercase' }}>Target URL</div>
                        <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
                          /indicator/{builderId || '[slug_id]'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '20px' }}>
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
            {/* TAB 4: LANDING PAGE STORIES & CIVIC NARRATIVES                */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'landing_stories' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Landing Page Stories & Civic Narratives</h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
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
                  <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>Loading stories...</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                    {landingStories.map((story) => {
                      return (
                        <div
                          key={story.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
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

                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                              {story.en?.title}
                            </h3>

                            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '10px', fontStyle: 'italic' }}>
                              🇷🇼 {story.rw?.title}
                            </div>

                            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                              {story.en?.summary?.slice(0, 140)}...
                            </p>

                            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: `3px solid ${story.tagColor || '#0284c7'}`, marginBottom: '14px' }}>
                              <p style={{ fontSize: '0.78rem', color: '#334155', fontStyle: 'italic', margin: '0 0 4px 0' }}>
                                {story.en?.quote?.slice(0, 110)}...
                              </p>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>&mdash; {story.en?.quoteAuthor}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              {story.en?.author}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditStory(story)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  border: '1px solid #cbd5e1',
                                  color: '#1e293b',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStory(story.id, story.en?.title || story.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  border: '1px solid #cbd5e1',
                                  color: '#1e293b',
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
            {/* TAB 5: INDICATOR STORIES & 3 CORE QUESTIONS EDITOR            */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'indicator_stories' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                    Indicator Stories & 3 Core Questions Editor
                  </h2>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Author and customize the 3-question narratives required by the SUNCASA RFP: &apos;What is this indicator?&apos;, &apos;Why does it matter for Kigali?&apos;, and &apos;What is SUNCASA doing about it?&apos;, alongside data limitations and official source lineage.
                  </p>
                </div>

                {/* Indicator Picker Banner */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
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
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
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
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
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
                <form onSubmit={handleSaveNarrative} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px' }}>
                  {/* Locale Toggle Tabs */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
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
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.92rem' }}
                    />
                  </div>

                  {/* 3 Core Questions Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                    {/* Question 1: What is this indicator? */}
                    <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
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
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>

                    {/* Question 2: Why does it matter? */}
                    <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                        {narrativeLocaleTab === 'en'
                          ? "2. Why does it matter for Kigali's climate resilience?"
                          : "2. Kuki iki gipimo gifite akamaro ku mibereho n'ikirere by'i Kigali?"}
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
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>

                    {/* Question 3: What is SUNCASA doing? */}
                    <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                        {narrativeLocaleTab === 'en'
                          ? '3. What is SUNCASA doing about it with City of Kigali and RFA?'
                          : "3. Ni iki SUNCASA ikorana n'Umujyi wa Kigali na RFA kuri iki gipimo?"}
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
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.6 }}
                      />
                    </div>
                  </div>

                  {/* Limitations & Citation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.85rem' }}
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
            {/* TAB 6: ROLES & USER DELEGATION (RBAC)                          */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'rbac' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Role-Based Access Control & User Delegation</h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
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
                      style={{ padding: '10px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                      + Add Custom Role
                    </button>
                  </div>
                </div>

                {/* Users List Table */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Delegated Administrators & Analysts</h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{users.length} registered accounts</span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
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
                          <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{u.name}</span>
                                {isSuperAdmin && <span title="Super Administrator">⭐</span>}
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px', color: '#475569' }}>{u.email}</td>
                            <td style={{ padding: '14px 18px', color: '#334155' }}>{u.organization}</td>
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
                                    background: '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    color: '#0f172a',
                                    fontSize: '0.78rem',
                                  }}
                                >
                                  {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>

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
            {/* TAB 7: DATABASE CONFIGURATION & INTEROPERABILITY              */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'database' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>Database & System Interoperability</h2>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Configure the active database driver, sync with Rwanda Forestry Authority FMES REST APIs, or switch to Firebase Firestore.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                  {/* Driver Card 1: Memory / Local JSON */}
                  <div style={{ background: '#ffffff', border: driver === 'memory' ? '2px solid #0284c7' : '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>In-Memory / Local JSON</h3>
                      {driver === 'memory' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#0284c7', color: '#ffffff' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
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
                  <div style={{ background: '#ffffff', border: driver === 'inhouse' ? '2px solid #10b981' : '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>RFA-FMES REST Gateway</h3>
                      {driver === 'inhouse' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#10b981', color: '#000000' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                      Connects directly to the Rwanda Forestry Authority FMES REST endpoint for bidirectional indicators syncing.
                    </p>
                    <input
                      type="text"
                      value={inHouseUrl}
                      onChange={(e) => setInHouseUrl(e.target.value)}
                      placeholder="http://localhost:8000/api/v1"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', marginBottom: '12px' }}
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

            {/* ------------------------------------------------------------- */}
            {/* TAB 8: OPEN APIs & INTEROPERABILITY GATEWAY                   */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'interoperability' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Header Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        ENTERPRISE INTEROPERABILITY
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981' }}>
                        ● CORS Unrestricted
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                      Open REST APIs, Telemetry Ingestion & Embed Syndication
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, maxWidth: '850px', lineHeight: 1.5 }}>
                      Enable seamless bidirectional communication between the SUNCASA Kigali Dashboard and external municipal portals (City of Kigali GIS, RFA-FMES, WRI Global Forest Watch, IISD SDG Knowledge Hub).
                    </p>
                  </div>

                  <a
                    href="/api/v1/indicators"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      background: '#0284c7',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <span>⚡ Test Public JSON Feed</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Status KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Public API v1 Status</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                      200 OK Active
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      GET /api/v1/indicators
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Inbound Ingest API</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                      POST /api/v1/ingest
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Secured with x-api-key
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Active Partner Keys</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                      {apiKeys.length} Registered
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Kigali, RFA, WRI & IISD
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Cross-Origin Sharing</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
                      CORS: * (Open)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Iframe & AJAX syndication
                    </div>
                  </div>
                </div>

                {/* Section 1: Registered Ingestion API Keys */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>
                        🔑 Authorized External Client API Keys
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                        These cryptographic API keys allow verified institutional partners to push live sensor and intervention telemetry into this dashboard.
                      </p>
                    </div>

                    <form onSubmit={handleGenerateApiKey} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Partner Org (e.g., MeteoRwanda)"
                        value={newKeyOrgName}
                        onChange={(e) => setNewKeyOrgName(e.target.value)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.82rem',
                          minWidth: '220px',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: '7px 14px',
                          borderRadius: '6px',
                          background: '#10b981',
                          color: '#000000',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        + Generate Key
                      </button>
                    </form>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                          <th style={{ padding: '10px 12px' }}>Client / Partner Organization</th>
                          <th style={{ padding: '10px 12px' }}>API Key Token</th>
                          <th style={{ padding: '10px 12px' }}>Permissions</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                          <th style={{ padding: '10px 12px' }}>Last Activity</th>
                          <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.map((k: any) => (
                          <tr key={k.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                            <td style={{ padding: '12px' }}>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{k.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {k.id}</span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', color: '#38bdf8', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                                  {k.key}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (navigator.clipboard) {
                                      navigator.clipboard.writeText(k.key);
                                      setCopiedKeyId(k.id);
                                      setTimeout(() => setCopiedKeyId(null), 2000);
                                    }
                                  }}
                                  style={{
                                    background: copiedKeyId === k.id ? '#10b981' : '#334155',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                  }}
                                  title="Copy Key"
                                >
                                  {copiedKeyId === k.id ? '✓' : 'Copy'}
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {(k.permissions || []).map((p: string, idx: number) => (
                                  <span key={idx} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '3px', background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8' }}>
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: k.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: k.status === 'Active' ? '#34d399' : '#fca5a5' }}>
                                {k.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px', color: '#475569', fontSize: '0.78rem' }}>
                              {k.last_used || 'Never'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleRevokeApiKey(k.id, k.name)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid #ef4444',
                                  color: '#fca5a5',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 2: Interactive Inbound Ingestion Simulator */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📥</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                        Inbound Data Ingestion Simulator (POST /api/v1/ingest)
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', marginBottom: 0 }}>
                      Simulate an automated machine-to-machine payload sent from an external IoT telemetry feed or partner server.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Client API Key (Header: x-api-key)
                        </label>
                        <input
                          type="text"
                          value={testApiKey}
                          onChange={(e) => setTestApiKey(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#38bdf8',
                            fontSize: '0.82rem',
                            fontFamily: 'monospace',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          JSON Telemetry Payload (Single reading, batch, or indicator schema)
                        </label>
                        <textarea
                          rows={9}
                          value={testPayload}
                          onChange={(e) => setTestPayload(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                            fontSize: '0.8rem',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        disabled={testingIngest}
                        onClick={handleRunIngestTest}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: testingIngest ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {testingIngest ? 'Transmitting Payload...' : '🚀 Transmit Ingestion Payload'}
                      </button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Server Response & Verification
                      </label>
                      <div
                        style={{
                          background: '#0b1324',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '12px 14px',
                          minHeight: '230px',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          fontFamily: 'monospace',
                          fontSize: '0.78rem',
                          color: testResponse?.includes('"success": true') ? '#34d399' : '#94a3b8',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {testResponse || '// Server HTTP response will appear here after transmitting...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: REST API v1 Documentation & Outbound Endpoints */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📖</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                        REST API v1 Endpoints & Developer Integration Guide
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', marginBottom: 0 }}>
                      Complete API specifications for third-party dashboards, spatial analysts, and automated harvesting bots.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Endpoint 1: Outbound Indicators List */}
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 18px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: '#10b981', color: '#000000', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>
                            GET
                          </span>
                          <code style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
                            /api/v1/indicators
                          </code>
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                            Returns full indicator catalogue with optional query filters (?theme=climate&status=on-track)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRunOutboundTest('/api/v1/indicators')}
                          style={{
                            padding: '4px 12px',
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Execute Test
                        </button>
                      </div>
                    </div>

                    {/* Endpoint 2: Single Indicator Detail */}
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 18px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: '#10b981', color: '#000000', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>
                            GET
                          </span>
                          <code style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
                            /api/v1/indicators/:id
                          </code>
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                            Returns single indicator with trends, micro-catchment GPS points, and English/Kinyarwanda narratives
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRunOutboundTest('/api/v1/indicators/area_restored_ha')}
                          style={{
                            padding: '4px 12px',
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Execute Test
                        </button>
                      </div>
                    </div>

                    {/* Endpoint 3: Embed Route */}
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 18px', border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: '#f59e0b', color: '#000000', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>
                            EMBED
                          </span>
                          <code style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
                            /embed/indicator/:id?view=chart|card|map&theme=light|dark&lang=en|rw
                          </code>
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                            Zero-dependency standalone iframe container
                          </span>
                        </div>
                        <a
                          href="/embed/indicator/area_restored_ha?view=chart"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '4px 12px',
                            background: '#334155',
                            color: '#38bdf8',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Open Widget ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Test Outbound Result Box */}
                  {testOutboundResponse && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 700 }}>
                          Live Response Output from: <code style={{ color: '#38bdf8' }}>{testOutboundUrl}</code>
                        </span>
                        <button
                          type="button"
                          onClick={() => setTestOutboundResponse(null)}
                          style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.74rem', cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      </div>
                      <div
                        style={{
                          background: '#0b1324',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '12px 14px',
                          maxHeight: '260px',
                          overflowY: 'auto',
                          fontFamily: 'monospace',
                          fontSize: '0.76rem',
                          color: '#34d399',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {testOutboundResponse}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Strategic Expansion Roadmap */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>
                    Future Expansion Architecture & Strategic Roadmap
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                    As SUNCASA expands past the initial Kigali Catchment pilot, this architecture supports the following expansion vectors:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        1. IoT Hydrometric Sensors
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                        Automated LoRaWAN ultrasonic water-level gauges and rain gauges installed at the Mpazi ravine and Nyabugogo confluence streaming 15-minute telemetry directly via <code style={{ color: '#0284c7', background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', fontSize: '0.78rem' }}>/api/v1/ingest</code>.
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        2. Citizen Science & Mobile ODK
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                        Field rangers and local community cooperatives submit geotagged tree seedling survival photos and erosion reports via ODK / KoboToolbox webhooks.
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        3. Multi-City Federation
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                        Federated node architecture allowing secondary cities in Rwanda (Musanze, Rubavu, Huye) to launch their own branded instances while synchronizing national indicators to the central Kigali node.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 9: COLLABORATORS MANAGEMENT                               */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'collaborators' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', background: 'rgba(52,211,153,0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(52,211,153,0.3)' }}>
                        LANDING PAGE
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                      Partner & Collaborator Logos
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, maxWidth: '700px', lineHeight: 1.5 }}>
                      Manage the partner and collaborator logos displayed in the landing page footer. Each entry includes a logo image URL and a link that opens when clicked.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollab(null);
                      setCollabName('');
                      setCollabUrl('');
                      setCollabLogoUrl('');
                      setCollabDescription('');
                      setShowCollabModal(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    <span>+ Add Collaborator</span>
                  </button>
                </div>

                {/* Collaborator Grid */}
                {loadingCollaborators ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading collaborators...</div>
                ) : collaborators.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #1e293b' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤝</div>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 16px 0' }}>No collaborators yet. Add your first partner logo.</p>
                    <button
                      type="button"
                      onClick={() => { setEditingCollab(null); setCollabName(''); setCollabUrl(''); setCollabLogoUrl(''); setCollabDescription(''); setShowCollabModal(true); }}
                      style={{ padding: '10px 20px', borderRadius: '8px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add First Collaborator
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {collaborators.map((collab: any) => (
                      <div
                        key={collab.id}
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.2s' }}
                      >
                        {/* Logo Preview */}
                        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff10', borderRadius: '8px', overflow: 'hidden' }}>
                          {collab.logoUrl ? (
                            <img
                              src={collab.logoUrl}
                              alt={collab.name}
                              style={{ maxHeight: '64px', maxWidth: '100%', objectFit: 'contain' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <span style={{ fontSize: '2rem' }}>🏢</span>
                          )}
                        </div>
                        {/* Info */}
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', marginBottom: '2px' }}>{collab.name}</div>
                          {collab.description && (
                            <div style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '4px' }}>{collab.description}</div>
                          )}
                          <a
                            href={collab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#38bdf8', fontSize: '0.78rem', textDecoration: 'none', wordBreak: 'break-all' }}
                          >
                            {collab.url}
                          </a>
                        </div>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCollab(collab);
                              setCollabName(collab.name || '');
                              setCollabUrl(collab.url || '');
                              setCollabLogoUrl(collab.logoUrl || '');
                              setCollabDescription(collab.description || '');
                              setShowCollabModal(true);
                            }}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'transparent', border: '1px solid #cbd5e1', color: '#1e293b', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={deletingCollabId === collab.id}
                            onClick={async () => {
                              if (!confirm(`Remove ${collab.name} from collaborators?`)) return;
                              setDeletingCollabId(collab.id);
                              try {
                                const res = await fetch(`/api/admin/collaborators?id=${collab.id}`, { method: 'DELETE', headers: { 'x-admin-token': session?.token || '' } });
                                if (res.ok) {
                                  setCollaborators((prev) => prev.filter((c: any) => c.id !== collab.id));
                                  setStatusMessage(`Removed ${collab.name}`);
                                } else {
                                  setStatusMessage('Failed to delete collaborator.');
                                }
                              } catch {
                                setStatusMessage('Network error.');
                              } finally {
                                setDeletingCollabId(null);
                              }
                            }}
                            style={{ padding: '8px 12px', borderRadius: '6px', background: 'transparent', border: '1px solid #cbd5e1', color: '#1e293b', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                          >
                            {deletingCollabId === collab.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live Preview */}
                {collaborators.length > 0 && (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Landing Page Preview</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                      {collaborators.map((collab: any) => (
                        <div key={collab.id} style={{ background: '#ffffff0d', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {collab.logoUrl ? (
                            <img src={collab.logoUrl} alt={collab.name} style={{ height: '28px', maxWidth: '80px', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>🏢</span>
                          )}
                          <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>{collab.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 10: SOCIAL SHARE LINKS MANAGEMENT                         */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'social_links' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                        PUBLIC PORTAL RAIL
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                      Social Share Icons Management
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
                      Configure, edit, and reorder the social sharing channels anchored to the right side of the SUNCASA platform. You can add new networks (e.g. WhatsApp, Telegram, Bluesky), edit brand colors and icons, or disable platforms at any time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateSocial}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <span>+ Add Social Channel</span>
                  </button>
                </div>

                {/* Social Share Grid */}
                {loadingSocialLinks ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading social links...</div>
                ) : socialLinks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌐</div>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 16px 0' }}>No social channels configured. Add your first sharing link.</p>
                    <button
                      type="button"
                      onClick={handleOpenCreateSocial}
                      style={{ padding: '10px 20px', borderRadius: '8px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add First Social Channel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {socialLinks.map((item: any, idx: number) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          border: `1px solid ${item.is_active ? '#e2e8f0' : '#f1f5f9'}`,
                          borderRadius: '12px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          opacity: item.is_active ? 1 : 0.65,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Top Row: Icon badge + Name + Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '6px',
                                background: item.bg_color || '#0284c7',
                                color: item.text_color || '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.15rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                              }}
                            >
                              {item.icon || '🔗'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{item.name}</div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                ID: <code>{item.id}</code> &bull; Type: <strong>{item.share_type}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Active / Inactive Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleSocialActive(item)}
                            title={item.is_active ? 'Click to disable' : 'Click to enable'}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              background: item.is_active ? '#dcfce7' : '#f1f5f9',
                              color: item.is_active ? '#15803d' : '#64748b',
                            }}
                          >
                            {item.is_active ? '● Active' : '○ Disabled'}
                          </button>
                        </div>

                        {/* URL Template or description */}
                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569', wordBreak: 'break-all' }}>
                          {item.share_type === 'copy' && '📋 Copies the platform link to user clipboard with a toast notification.'}
                          {item.share_type === 'email' && (item.url_template || '✉️ Launches user default email client with platform title & link.')}
                          {item.share_type === 'template' && (
                            <div>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>Template: </span>
                              <code>{item.url_template}</code>
                            </div>
                          )}
                        </div>

                        {/* Footer: Order & Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '4px' }}>
                              Order: <strong>#{item.order ?? idx + 1}</strong>
                            </span>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveSocialOrder(item, 'up')}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                background: idx === 0 ? '#f8fafc' : '#ffffff',
                                color: idx === 0 ? '#cbd5e1' : '#1e293b',
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                              }}
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === socialLinks.length - 1}
                              onClick={() => handleMoveSocialOrder(item, 'down')}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                background: idx === socialLinks.length - 1 ? '#f8fafc' : '#ffffff',
                                color: idx === socialLinks.length - 1 ? '#cbd5e1' : '#1e293b',
                                cursor: idx === socialLinks.length - 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                              }}
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSocial(item)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#0284c7',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingSocialId === item.id}
                              onClick={async () => {
                                if (!confirm(`Remove '${item.name}' from social share icons?`)) return;
                                setDeletingSocialId(item.id);
                                try {
                                  const res = await fetch(`/api/admin/social-links?id=${item.id}`, {
                                    method: 'DELETE',
                                    headers: { 'x-admin-token': session?.token || '' },
                                  });
                                  if (res.ok) {
                                    setSocialLinks((prev) => prev.filter((s: any) => s.id !== item.id));
                                    setStatusMessage(`Removed '${item.name}'`);
                                  } else {
                                    setStatusMessage('Failed to delete social link.');
                                  }
                                } catch {
                                  setStatusMessage('Network error.');
                                } finally {
                                  setDeletingSocialId(null);
                                }
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid #fecaca',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                              }}
                            >
                              {deletingSocialId === item.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Real-time Right Rail Preview */}
                {socialLinks.length > 0 && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Public Rail Visual Preview
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                          This shows how the buttons render on the right edge of the public portal. Only active items are shown.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '8px 6px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <div
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: '#64748b',
                            letterSpacing: '0.08em',
                            padding: '4px 0',
                          }}
                        >
                          SHARE:
                        </div>
                        {socialLinks
                          .filter((s: any) => s.is_active !== false)
                          .map((s: any) => (
                            <div
                              key={s.id}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                background: s.bg_color || '#0284c7',
                                color: s.text_color || '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                              }}
                              title={s.name}
                            >
                              {s.icon}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
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
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
                  ✏️ Edit Indicator: {editingIndicator.id}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                  Updates are saved to the database adapter and synced to indicators.json
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditIndicatorModal(false)}
                style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveIndicator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Scientific Definition & Public Title
                </label>
                <input
                  type="text"
                  required
                  value={editingIndicator.definition}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, definition: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Theme</label>
                  <select
                    value={editingIndicator.theme}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, theme: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  >
                    <option value="climate">Climate Adaptation</option>
                    <option value="biodiversity">Biodiversity Protection</option>
                    <option value="gesi">Gender Equality & Inclusion (GESI)</option>
                    <option value="economy">Employment & Economy</option>
                    <option value="mypeg_benchmark">Built Environment</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Unit of Measure</label>
                  <input
                    type="text"
                    value={editingIndicator.unit}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, unit: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>2024 Baseline</label>
                  <input
                    type="number"
                    value={editingIndicator.baseline_2024}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, baseline_2024: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>2025 Current</label>
                  <input
                    type="number"
                    value={editingIndicator.current_2025}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, current_2025: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>2026 Target</label>
                  <input
                    type="number"
                    value={editingIndicator.target_2026}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, target_2026: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Status</label>
                  <select
                    value={editingIndicator.status}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, status: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  >
                    <option value="on-track">on-track</option>
                    <option value="exceeded">exceeded</option>
                    <option value="needs-acceleration">needs-acceleration</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>FMES Code</label>
                  <input
                    type="text"
                    value={editingIndicator.fmes_code}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, fmes_code: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>FMES Alignment</label>
                  <input
                    type="text"
                    value={editingIndicator.fmes_alignment}
                    onChange={(e) => setEditingIndicator({ ...editingIndicator, fmes_alignment: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Data Source Citation</label>
                <input
                  type="text"
                  value={editingIndicator.data_source_citation}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, data_source_citation: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Measurement Method</label>
                <input
                  type="text"
                  value={editingIndicator.measurement_method}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, measurement_method: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGpsIndId(editingIndicator.id);
                    setShowEditIndicatorModal(false);
                    setActiveTab('gps_mapper');
                  }}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  🗺️ Open GPS & Map Generator for this indicator &rarr;
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditIndicatorModal(false)}
                    style={{ padding: '10px 18px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingIndicator}
                    style={{ padding: '10px 22px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {savingIndicator ? 'Saving Indicator...' : 'Save Indicator'}
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
          <div style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
                  📰 Landing Page Story Editor
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                  Slug ID: <code style={{ color: '#38bdf8' }}>{editingStory.id}</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStory} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Common Story Attributes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Story Slug ID</label>
                  <input
                    type="text"
                    required
                    value={editingStory.id}
                    onChange={(e) => setEditingStory({ ...editingStory, id: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Pill Color Accent</label>
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
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
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
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
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
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
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
          <div style={{ width: '100%', maxWidth: '480px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Administrator & Delegate Role</h3>
              <button type="button" onClick={() => setShowCreateUserModal(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Damascene Nkurunziza"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@rfa.gov.rw"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Initial Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Government / Partner Organization</label>
                <input
                  type="text"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Assigned Delegated Role</label>
                <select
                  value={newUserRoleId}
                  onChange={(e) => setNewUserRoleId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
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
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
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
          <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Custom Delegated Role</h3>
              <button type="button" onClick={() => setShowCreateRoleModal(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateRole} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yanze Basin Coordinator"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>Description</label>
                <input
                  type="text"
                  placeholder="Role scope and authority..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '8px' }}>Permissions</label>
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
                    <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
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
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
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
      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT COLLABORATOR                               */}
      {/* ------------------------------------------------------------- */}
      {showCollabModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {editingCollab ? '✏️ Edit Collaborator' : '+ Add Collaborator'}
              </h3>
              <button type="button" onClick={() => setShowCollabModal(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveCollab} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
                  Partner / Organization Name <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rwanda Forestry Authority"
                  value={collabName}
                  onChange={(e) => setCollabName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
                  Website URL <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.example.rw"
                  value={collabUrl}
                  onChange={(e) => setCollabUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
                  Logo Image URL
                  <span style={{ color: '#64748b', marginLeft: '6px', fontSize: '0.74rem' }}>(direct link to PNG/SVG/JPG)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.rw/logo.png"
                  value={collabLogoUrl}
                  onChange={(e) => setCollabLogoUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
                {collabLogoUrl && (
                  <div style={{ marginTop: '8px', padding: '10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={collabLogoUrl}
                      alt="Logo preview"
                      style={{ maxHeight: '48px', maxWidth: '200px', objectFit: 'contain' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).alt = 'Invalid URL'; }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>
                  Short Description <span style={{ color: '#64748b', fontSize: '0.74rem' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. National forest management authority"
                  value={collabDescription}
                  onChange={(e) => setCollabDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowCollabModal(false)}
                  style={{ padding: '9px 18px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCollab}
                  style={{ padding: '9px 22px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {savingCollab ? 'Saving...' : editingCollab ? 'Update Collaborator' : 'Add Collaborator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT SOCIAL LINK                                 */}
      {/* ------------------------------------------------------------- */}
      {showSocialModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '28px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {editingSocial ? `✏️ Edit '${editingSocial.name}'` : '+ Add Social Share Channel'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                  Configure the brand icon, share behavior, and destination for this channel.
                </p>
              </div>
              <button type="button" onClick={() => setShowSocialModal(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Presets Row */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Quick Fill from Popular Presets:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SOCIAL_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSocialName(p.name);
                      setSocialIcon(p.icon);
                      setSocialBgColor(p.bg_color);
                      setSocialTextColor(p.text_color);
                      setSocialShareType(p.share_type);
                      setSocialUrlTemplate(p.url_template);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '16px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#1e293b',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveSocial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    Platform Name <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WhatsApp"
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    Icon / Glyph <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 💬, f, 𝕏"
                    value={socialIcon}
                    onChange={(e) => setSocialIcon(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', textAlign: 'center', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Color Controls & Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    Background Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={socialBgColor}
                      onChange={(e) => setSocialBgColor(e.target.value)}
                      style={{ width: '36px', height: '36px', padding: 0, border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={socialBgColor}
                      onChange={(e) => setSocialBgColor(e.target.value)}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    Text / Icon Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={socialTextColor}
                      onChange={(e) => setSocialTextColor(e.target.value)}
                      style={{ width: '36px', height: '36px', padding: 0, border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={socialTextColor}
                      onChange={(e) => setSocialTextColor(e.target.value)}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Real-time Preview Pill */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    Button Preview
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '36px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        background: socialBgColor,
                        color: socialTextColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    >
                      {socialIcon || '🔗'}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{socialName || 'Sample'}</span>
                  </div>
                </div>
              </div>

              {/* Share Action Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                  Share Action Type
                </label>
                <select
                  value={socialShareType}
                  onChange={(e) => setSocialShareType(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                >
                  <option value="template">URL Template (opens web sharing page in new tab)</option>
                  <option value="copy">Direct Copy Link (copies current page URL to clipboard)</option>
                  <option value="email">Email Mailto (opens email compose with subject & link)</option>
                </select>
              </div>

              {/* URL Template (if applicable) */}
              {socialShareType !== 'copy' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>
                    {socialShareType === 'email' ? 'Custom Mailto Template (Optional)' : 'Share URL Template'}
                    <span style={{ color: '#64748b', fontSize: '0.72rem', marginLeft: '6px' }}>
                      (use <code>{'{url}'}</code> and <code>{'{title}'}</code> tokens)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://api.whatsapp.com/send?text={title}%20{url}"
                    value={socialUrlTemplate}
                    onChange={(e) => setSocialUrlTemplate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    Variables supported: <code>{'{url}'}</code> (current page URL) and <code>{'{title}'}</code> (portal title).
                  </div>
                </div>
              )}

              {/* Order and Active state */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>Display Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={socialOrder}
                    onChange={(e) => setSocialOrder(parseInt(e.target.value) || 1)}
                    style={{ width: '60px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', textAlign: 'center' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={socialIsActive}
                    onChange={(e) => setSocialIsActive(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Active on Public Portal</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowSocialModal(false)}
                  style={{ padding: '9px 18px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSocial}
                  style={{ padding: '9px 24px', borderRadius: '6px', background: '#0284c7', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {savingSocial ? 'Saving...' : editingSocial ? 'Update Channel' : 'Add Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
