'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Indicator } from '@/lib/db/types';

// Register Chart.js modules
ChartJS.register(...registerables);

interface IndicatorTrendChartProps {
  indicator: Indicator;
  themeColor?: string;
  locale?: 'en' | 'rw';
}

export default function IndicatorTrendChart({
  indicator,
  themeColor = '#10b981',
  locale = 'en',
}: IndicatorTrendChartProps) {
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartInstanceRef = useRef<ChartJS | null>(null);
  const barChartInstanceRef = useRef<ChartJS | null>(null);

  const [activeChartTab, setActiveChartTab] = useState<'trajectory' | 'catchments'>('trajectory');

  // Build Trajectory Line Chart
  useEffect(() => {
    if (!lineCanvasRef.current) return;

    if (lineChartInstanceRef.current) {
      lineChartInstanceRef.current.destroy();
    }

    const ctx = lineCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const history = indicator.trend_history || [];
    const labels = [...history.map((h) => h.period), '2026 Target'];
    const historicalValues: (number | null)[] = history.map((h) => h.value);
    historicalValues.push(null); // No actual value yet at target

    // Projected target trajectory
    const lastValue = history.length > 0 ? history[history.length - 1].value : indicator.baseline_2024;
    const projectedValues: (number | null)[] = new Array(history.length - 1).fill(null);
    projectedValues.push(lastValue); // Connect projection from last actual point
    projectedValues.push(indicator.target_2026); // Target point

    const isRw = locale === 'rw';

    lineChartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: isRw ? 'Umusaruro Ugezweho' : 'Actual Progress',
            data: historicalValues as number[],
            borderColor: themeColor,
            backgroundColor: `${themeColor}22`,
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: themeColor,
            pointBorderWidth: 2.5,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: isRw ? 'Intego yifuzwa (2026)' : 'Target Projection (2026)',
            data: projectedValues as number[],
            borderColor: '#94a3b8',
            borderDash: [6, 6],
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: (ctx) => (ctx.dataIndex === labels.length - 1 ? 7 : 0),
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#cbd5e1',
              font: { family: 'Inter', size: 12 },
              usePointStyle: true,
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                if (context.raw === null || context.raw === undefined) return '';
                const val = (context.raw as number).toLocaleString();
                return ` ${context.dataset.label}: ${val} ${indicator.unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 11 },
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 11 },
              callback: (val) => Number(val).toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      if (lineChartInstanceRef.current) {
        lineChartInstanceRef.current.destroy();
      }
    };
  }, [indicator, themeColor, locale]);

  // Build Catchment Breakdown Bar Chart
  useEffect(() => {
    if (!barCanvasRef.current || activeChartTab !== 'catchments') return;

    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }

    const ctx = barCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const breakdown = indicator.site_breakdown || [];
    const isRw = locale === 'rw';

    barChartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: breakdown.map((b) => b.site),
        datasets: [
          {
            label: isRw ? 'Umusaruro mu gace' : 'Catchment Volume',
            data: breakdown.map((b) => b.value),
            backgroundColor: [
              `${themeColor}dd`,
              '#0284c7dd',
              '#8b5cf6dd',
              '#f59e0bdd',
            ],
            borderColor: [
              themeColor,
              '#0284c7',
              '#8b5cf6',
              '#f59e0b',
            ],
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bars for clean site name reading
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 12,
            callbacks: {
              label: (context) => {
                const val = (context.raw as number).toLocaleString();
                return ` ${val} ${indicator.unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              callback: (val) => Number(val).toLocaleString(),
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#f1f5f9',
              font: { family: 'Inter', size: 12 },
            },
          },
        },
      },
    });

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
    };
  }, [indicator, themeColor, activeChartTab, locale]);

  return (
    <div className="mypeg-chart-box">
      <div className="mypeg-chart-toolbar">
        <div className="chart-view-toggles" role="tablist">
          <button
            type="button"
            className={`chart-toggle-btn ${activeChartTab === 'trajectory' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('trajectory')}
          >
            📈 {locale === 'rw' ? 'Igihe n\'Intego (2024-2026)' : 'Quarterly Trend & 2026 Target'}
          </button>
          <button
            type="button"
            className={`chart-toggle-btn ${activeChartTab === 'catchments' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('catchments')}
          >
            📊 {locale === 'rw' ? 'Ibibaya bitandukanye' : 'Micro-Catchment Breakdown'}
          </button>
        </div>

        <div className="chart-unit-tag">
          {locale === 'rw' ? 'Igipimo:' : 'Unit:'} <strong>{indicator.unit}</strong>
        </div>
      </div>

      <div className="chart-canvas-container" style={{ position: 'relative', height: '320px', width: '100%' }}>
        <canvas
          ref={lineCanvasRef}
          style={{ display: activeChartTab === 'trajectory' ? 'block' : 'none' }}
        />
        <canvas
          ref={barCanvasRef}
          style={{ display: activeChartTab === 'catchments' ? 'block' : 'none' }}
        />
      </div>

      <div className="chart-stat-strip">
        <div className="stat-chip">
          <span className="stat-chip-label">{locale === 'rw' ? 'Aho Byatangiriye' : '2024 Baseline'}</span>
          <span className="stat-chip-value">{indicator.baseline_2024.toLocaleString()}</span>
        </div>
        <div className="stat-chip highlight" style={{ borderColor: themeColor }}>
          <span className="stat-chip-label" style={{ color: themeColor }}>{locale === 'rw' ? 'Umusaruro w\'Ubu (2025)' : 'Current Status (2025)'}</span>
          <span className="stat-chip-value" style={{ color: themeColor }}>{indicator.current_2025.toLocaleString()}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-chip-label">{locale === 'rw' ? 'Intego ya 2026' : '2026 Target'}</span>
          <span className="stat-chip-value">{indicator.target_2026.toLocaleString()}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-chip-label">{locale === 'rw' ? 'Icyagezweho' : 'Progress Achieved'}</span>
          <span className="stat-chip-value" style={{ color: '#10b981' }}>
            {Math.min(100, Math.round((indicator.current_2025 / indicator.target_2026) * 100))}%
          </span>
        </div>
      </div>
    </div>
  );
}
