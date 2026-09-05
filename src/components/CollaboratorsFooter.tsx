'use client';

import React from 'react';

export default function CollaboratorsFooter() {
  return (
    <footer className="mypeg-collaborators-footer" id="collaborators-footer">
      <div className="collaborators-inner">
        <h3 className="collaborators-title">Our Collaborators</h3>

        <div className="collaborators-logos-row">
          {/* Peg / SUNCASA Logo Badge */}
          <div className="collab-badge peg-badge" title="Peg / SUNCASA Open Impact Platform">
            <div className="collab-circle-icon">
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e5243b' }}>◎</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">peg</span>
              <span className="collab-sub-name">Community Indicators</span>
            </div>
          </div>

          {/* IISD */}
          <div className="collab-badge" title="International Institute for Sustainable Development">
            <div className="collab-circle-icon" style={{ borderColor: '#00a3e0' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00a3e0' }}>Q</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">IISD</span>
              <span className="collab-sub-name">Sustainable Development</span>
            </div>
          </div>

          {/* WRI */}
          <div className="collab-badge" title="World Resources Institute">
            <div className="collab-circle-icon" style={{ borderColor: '#fab423' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fab423' }}>W</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">WORLD RESOURCES</span>
              <span className="collab-sub-name">INSTITUTE (WRI)</span>
            </div>
          </div>

          {/* City of Kigali */}
          <div className="collab-badge" title="City of Kigali / Umujyi wa Kigali">
            <div className="collab-circle-icon" style={{ borderColor: '#27ae60' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#27ae60' }}>🇷🇼</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">CITY OF KIGALI</span>
              <span className="collab-sub-name">Umujyi wa Kigali</span>
            </div>
          </div>

          {/* Rwanda Forestry Authority */}
          <div className="collab-badge" title="Rwanda Forestry Authority (RFA)">
            <div className="collab-circle-icon" style={{ borderColor: '#10b981' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>🌲</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">RFA</span>
              <span className="collab-sub-name">Rwanda Forestry Authority</span>
            </div>
          </div>

          {/* Global Affairs Canada */}
          <div className="collab-badge" title="Global Affairs Canada / Affaires mondiales Canada">
            <div className="collab-circle-icon" style={{ borderColor: '#ef4444' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>🍁</span>
            </div>
            <div className="collab-text-wrap">
              <span className="collab-main-name">CANADA</span>
              <span className="collab-sub-name">Global Affairs Canada</span>
            </div>
          </div>
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
