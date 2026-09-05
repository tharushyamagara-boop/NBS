'use client';

import React from 'react';

interface RadialEmblemProps {
  size?: number;
  className?: string;
}

export default function MyPegRadialEmblem({ size = 260, className = '' }: RadialEmblemProps) {
  // 12 inward-pointing arrows in circular rainbow spectrum matching the MyPeg emblem in Screenshot 1
  const arrowColors = [
    '#e5243b', // 0 deg - Red (pointing straight down)
    '#e84e2a', // 30 deg - Orange-Red
    '#f2722b', // 60 deg - Orange
    '#fab423', // 90 deg - Amber-Gold
    '#f7dc1a', // 120 deg - Bright Yellow
    '#b0d335', // 150 deg - Lime Green
    '#27ae60', // 180 deg - Green
    '#00a887', // 210 deg - Teal
    '#00a3e0', // 240 deg - Cyan
    '#2b6cb0', // 270 deg - Blue
    '#6b46c1', // 300 deg - Purple
    '#b83280', // 330 deg - Magenta
  ];

  return (
    <div
      className={`mypeg-radial-wheel ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.45))',
      }}
    >
      <svg
        viewBox="-160 -160 320 320"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
        aria-label="MyPeg Tracking Progress Radial Emblem"
      >
        <defs>
          {/* Subtle glow filter */}
          <filter id="emblem-subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {arrowColors.map((color, index) => {
          const angle = index * 30; // 30 degrees per slice
          return (
            <g
              key={index}
              transform={`rotate(${angle})`}
              filter="url(#emblem-subtle-glow)"
              style={{ transition: 'transform 0.3s ease' }}
            >
              {/* 
                An arrow pointing towards center (0,0):
                Shaft: starts at outer radius -145 down to -82, width 18 (x: -9 to 9)
                Arrowhead: wings at y = -82 (x: -24 to 24), tip pointing down at y = -46 (x: 0)
              */}
              <path
                d="M -8 -145 
                   L 8 -145 
                   L 8 -82 
                   L 25 -82 
                   L 0 -44 
                   L -25 -82 
                   L -8 -82 
                   Z"
                fill={color}
              />
            </g>
          );
        })}

        {/* Center circular focal point */}
        <circle cx="0" cy="0" r="30" fill="transparent" />
      </svg>
    </div>
  );
}
