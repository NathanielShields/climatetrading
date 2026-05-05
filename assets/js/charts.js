// Chart.js wrapper helpers — assumes Chart is loaded globally via CDN.

export const COLORS = {
  primary: '#7aa7ff',
  accent:  '#f5b041',
  good:    '#4ade80',
  bad:     '#f87171',
  warn:    '#fbbf24',
  purple:  '#a78bfa',
  cyan:    '#67e8f9',
  text:    '#e6e9ef',
  dim:     '#a3acc0',
  muted:   '#6b7486',
  grid:    'rgba(255,255,255,0.06)',
  bgCard:  '#151925',
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { labels: { color: COLORS.dim, font: { size: 12 } } },
    tooltip: {
      backgroundColor: COLORS.bgCard,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: COLORS.text,
      bodyColor: COLORS.dim,
      padding: 10,
      callbacks: {},
    },
  },
  scales: {
    x: {
      grid: { color: COLORS.grid, drawBorder: false },
      ticks: { color: COLORS.muted, font: { size: 11 } },
    },
    y: {
      grid: { color: COLORS.grid, drawBorder: false },
      ticks: { color: COLORS.muted, font: { size: 11 } },
    },
  },
};

function deepMerge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b || {})) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) {
      out[k] = deepMerge(a[k] || {}, b[k]);
    } else { out[k] = b[k]; }
  }
  return out;
}

export function lineChart(canvas, { labels, datasets, options }) {
  if (!canvas) return null;
  const ctx = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map(d => ({
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 4,
        ...d,
      })),
    },
    options: deepMerge(baseOptions, options || {}),
  });
}

export function barChart(canvas, { labels, datasets, options }) {
  if (!canvas) return null;
  const ctx = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: deepMerge(baseOptions, options || {}),
  });
}

export function moneyFormatter(v, dec = 0) {
  if (v == null || Number.isNaN(v)) return '—';
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  if (abs >= 1e6) return sign + '$' + (abs/1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs/1e3).toFixed(1) + 'k';
  return sign + '$' + abs.toFixed(dec);
}
