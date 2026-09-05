'use client';

import React, { useEffect, useState } from 'react';
import defaultCollaboratorsData from '@/data/collaborators.json';

interface Collaborator {
  id: string;
  name: string;
  sub_name?: string;
  description?: string;
  logo_url?: string;
  logoUrl?: string;
  icon_emoji?: string;
  icon_color?: string;
  website_url?: string;
  url?: string;
  order?: number;
  is_active?: boolean;
}

export default function CollaboratorsFooter() {
  const initialList = (defaultCollaboratorsData.collaborators || []) as Collaborator[];
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialList);

  // Fetch live collaborators list so admin edits reflect immediately
  useEffect(() => {
    let isMounted = true;
    fetch('/api/collaborators')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCollaborators(data.data);
        }
      })
      .catch((err) => {
        // Fallback gracefully to default imported list
        console.warn('Could not fetch dynamic collaborators list, using fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="mypeg-collaborators-footer" id="collaborators-footer">
      <div className="collaborators-inner">
        <h3 className="collaborators-title">Our Collaborators</h3>

        <div className="collaborators-logos-row">
          {collaborators.map((collab) => {
            const iconColor = collab.icon_color || '#38bdf8';

            return (
              <a
                key={collab.id}
                href={collab.url || collab.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="collab-badge"
                title={`Visit ${collab.name} official portal`}
                style={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {/* Logo Image or Fallback Icon */}
                {(collab.logoUrl || collab.logo_url) ? (
                  <div
                    className="collab-circle-icon"
                    style={{
                      borderColor: iconColor,
                      overflow: 'hidden',
                      padding: '3px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={collab.logoUrl || collab.logo_url}
                      alt={collab.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        // Fallback to emoji or first letter if external image URL fails
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.background = 'transparent';
                          const span = document.createElement('span');
                          span.style.fontSize = '1.1rem';
                          span.style.fontWeight = '800';
                          span.style.color = iconColor;
                          span.innerText = collab.icon_emoji || collab.name.charAt(0);
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="collab-circle-icon" style={{ borderColor: iconColor }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: iconColor }}>
                      {collab.icon_emoji || collab.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Text Wrap with Name, Subtitle and External Link indicator */}
                <div className="collab-text-wrap">
                  <span className="collab-main-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{collab.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', opacity: 0.85 }}>↗</span>
                  </span>
                  {(collab.sub_name || collab.description) && (
                    <span className="collab-sub-name">{collab.sub_name || collab.description}</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        <div className="collaborators-subtext">
          <p>
            An indicator-driven, narrative-supported open data system developed in accordance with MyPeg standards (
            <a href="https://www.mypeg.ca" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>
              www.mypeg.ca
            </a>
            ) for community engagement and evidence-based decision-making.
          </p>
        </div>
      </div>
    </footer>
  );
}
