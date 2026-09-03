'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Indicator } from '@/lib/db/types';

export default function AdminPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState('memory');
  const [driverName, setDriverName] = useState('In-Memory / Local JSON');
  const [inHouseUrl, setInHouseUrl] = useState('http://localhost:8000/api/v1');
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  useEffect(() => {
    fetchDbConfig();
    fetchIndicators();
  }, []);

  const fetchDbConfig = async () => {
    try {
      const res = await fetch('/api/db-config');
      const data = await res.json();
      if (data.success) {
        setDriver(data.activeDriver);
        setDriverName(data.adapterName);
      }
    } catch (err) {
      console.error('Failed to fetch DB config', err);
    }
  };

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/indicators');
      const data = await res.json();
      if (data.success) {
        setIndicators(data.data);
      }
    } catch (err) {
      console.error('Failed to load indicators', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchDriver = async (newDriver: string) => {
    try {
      setStatusMessage(`Switching database to ${newDriver}...`);
      const body: any = { driver: newDriver };
      if (newDriver === 'inhouse') {
        body.inHouseUrl = inHouseUrl;
      }
      if (newDriver === 'firestore') {
        body.firebaseConfig = {
          apiKey: firebaseApiKey,
          projectId: firebaseProjectId
        };
      }
      const res = await fetch('/api/db-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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

  const handleQuickSave = async (id: string, updates: Partial<Indicator>) => {
    try {
      const res = await fetch(`/api/indicators/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setIndicators(prev => prev.map(ind => ind.id === id ? data.data : ind));
        setStatusMessage(`Saved updates for ${id}`);
      } else {
        setStatusMessage(`Failed to update ${id}: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error updating: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a111e', color: '#f8fafc', padding: '30px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#10b981', color: '#000', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>APP ROUTER ADMIN</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>SUNCASA Kigali Data & Database Management</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Manage live indicator metrics, sync targets, and plug/unplug backend database drivers.
            </p>
          </div>
          <Link href="/" style={{ background: 'rgba(255,255,255,0.08)', color: '#38bdf8', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.15)' }}>
            &larr; Back to Public Dashboard
          </Link>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', marginBottom: '24px' }}>
            {statusMessage}
          </div>
        )}

        {/* Database Plug / Unplug Settings Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Active Database Driver: <span style={{ color: '#38bdf8' }}>{driverName}</span></h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Select and configure your preferred storage provider without restarting the server.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleSwitchDriver('memory')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: driver === 'memory' ? '#10b981' : 'rgba(255,255,255,0.08)',
                  color: driver === 'memory' ? '#000' : '#fff',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                In-Memory / JSON
              </button>
              <button
                onClick={() => handleSwitchDriver('inhouse')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: driver === 'inhouse' ? '#0284c7' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                In-House REST / DB
              </button>
              <button
                onClick={() => handleSwitchDriver('firestore')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: driver === 'firestore' ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                  color: '#000',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                Firebase Firestore
              </button>
            </div>
          </div>

          {/* In-House REST Settings Panel */}
          {driver === 'inhouse' && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', marginTop: '10px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>In-House API Base URL:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={inHouseUrl}
                  onChange={(e) => setInHouseUrl(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                />
                <button onClick={() => handleSwitchDriver('inhouse')} style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Connect In-House DB
                </button>
              </div>
            </div>
          )}

          {/* Firestore Settings Panel */}
          {driver === 'firestore' && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', marginTop: '10px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Firebase Project ID"
                value={firebaseProjectId}
                onChange={(e) => setFirebaseProjectId(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              />
              <input
                type="password"
                placeholder="Firebase API Key"
                value={firebaseApiKey}
                onChange={(e) => setFirebaseApiKey(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              />
              <button onClick={() => handleSwitchDriver('firestore')} style={{ padding: '8px 16px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                Connect Firestore
              </button>
            </div>
          )}
        </div>

        {/* Indicators Data Management Table */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Indicators Registry ({indicators.length})</h2>
            <button onClick={fetchIndicators} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              Refresh Data
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading indicator records...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8' }}>
                    <th style={{ padding: '10px' }}>FMES Code</th>
                    <th style={{ padding: '10px' }}>Theme</th>
                    <th style={{ padding: '10px' }}>Unit</th>
                    <th style={{ padding: '10px' }}>Current (2025)</th>
                    <th style={{ padding: '10px' }}>Target (2026)</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((ind) => (
                    <tr key={ind.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#38bdf8' }}>{ind.fmes_code}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>{ind.theme}</td>
                      <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{ind.unit}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <input
                          type="number"
                          defaultValue={ind.current_2025}
                          onBlur={(e) => handleQuickSave(ind.id, { current_2025: parseFloat(e.target.value) || 0 })}
                          style={{ width: '90px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#10b981', fontWeight: 700 }}
                        />
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <input
                          type="number"
                          defaultValue={ind.target_2026}
                          onBlur={(e) => handleQuickSave(ind.id, { target_2026: parseFloat(e.target.value) || 0 })}
                          style={{ width: '90px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#f8fafc' }}
                        />
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <select
                          defaultValue={ind.status}
                          onChange={(e) => handleQuickSave(ind.id, { status: e.target.value as any })}
                          style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                          <option value="on-track">On Track</option>
                          <option value="exceeded">Exceeded</option>
                          <option value="needs-acceleration">Needs Acceleration</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <button
                          onClick={() => setEditingIndicator(ind)}
                          style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#38bdf8', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Edit All
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Full Indicator Edit */}
        {editingIndicator && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#38bdf8' }}>Edit Indicator: {editingIndicator.fmes_code}</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>FMES Alignment Layer</label>
                <input
                  type="text"
                  defaultValue={editingIndicator.fmes_alignment}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, fmes_alignment: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Unit of Measurement</label>
                <input
                  type="text"
                  defaultValue={editingIndicator.unit}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, unit: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setEditingIndicator(null)} style={{ padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleQuickSave(editingIndicator.id, editingIndicator);
                    setEditingIndicator(null);
                  }}
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#10b981', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
