/**
 * SUNCASA Kigali Charts & Visual Analytics (Chart.js)
 */

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  BarController,
  BarElement
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  BarController,
  BarElement
);

class ChartManager {
  constructor() {
    this.modalChart = null;
  }

  renderModalTrendChart(canvasId, indicator, isRw) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.modalChart) {
      this.modalChart.destroy();
    }

    const labels = indicator.trend_history.map(item => item.period);
    const dataValues = indicator.trend_history.map(item => item.value);

    // Color theme mappings
    const themeColors = {
      climate: { border: '#0284c7', fill: 'rgba(2, 132, 199, 0.15)' },
      biodiversity: { border: '#10b981', fill: 'rgba(16, 185, 129, 0.15)' },
      gesi: { border: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)' },
      economy: { border: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)' }
    };

    const colors = themeColors[indicator.theme] || themeColors.climate;

    this.modalChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: isRw ? `Aho Bigeze (${indicator.unit})` : `Observed Progress (${indicator.unit})`,
            data: dataValues,
            borderColor: colors.border,
            backgroundColor: colors.fill,
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colors.border,
            pointBorderWidth: 2
          },
          {
            label: isRw ? `Intego ya 2026 (${indicator.target_2026} ${indicator.unit})` : `2026 Target (${indicator.target_2026} ${indicator.unit})`,
            data: new Array(labels.length).fill(indicator.target_2026),
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  destroy() {
    if (this.modalChart) {
      this.modalChart.destroy();
      this.modalChart = null;
    }
  }
}

export const chartManager = new ChartManager();
