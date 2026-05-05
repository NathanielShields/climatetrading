// Single source of truth for site data — loaded once, cached.
let _siteData = null;
let _loadPromise = null;

export function loadSiteData() {
  if (_siteData) return Promise.resolve(_siteData);
  if (_loadPromise) return _loadPromise;
  _loadPromise = fetch('assets/data/site-data.json')
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load site data: ${r.status}`);
      return r.json();
    })
    .then(data => { _siteData = data; return data; });
  return _loadPromise;
}

// ----- Formatters -----
export const fmt = {
  money: (v, dec = 0) => {
    if (v === null || v === undefined || Number.isNaN(v)) return '—';
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);
    return sign + '$' + abs.toLocaleString(undefined, { maximumFractionDigits: dec, minimumFractionDigits: dec });
  },
  signed: (v, dec = 0) => (v >= 0 ? '+' : '') + fmt.money(v, dec).replace('-', ''),
  pct: (v, dec = 1) => v === null || v === undefined || Number.isNaN(v) ? '—' : (v * 100).toFixed(dec) + '%',
  num: (v, dec = 2) => v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toLocaleString(undefined, { maximumFractionDigits: dec }),
  date: (s) => s,
};

// ----- Sortable, filterable table -----
export function buildTable(opts) {
  // opts: { container, rows, columns: [{ key, label, fmt?, num?, color?(row,val)? }], searchable, defaultSort }
  const root = typeof opts.container === 'string'
    ? document.querySelector(opts.container) : opts.container;
  if (!root) return;

  const state = {
    rows: opts.rows || [],
    sortKey: opts.defaultSort?.key || null,
    sortDir: opts.defaultSort?.dir || 'asc',
    filter: '',
  };

  function render() {
    let rows = state.rows.slice();
    if (state.filter) {
      const f = state.filter.toLowerCase();
      rows = rows.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(f)));
    }
    if (state.sortKey) {
      const k = state.sortKey, dir = state.sortDir === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const av = a[k], bv = b[k];
        if (av === bv) return 0;
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        return (av > bv ? 1 : -1) * dir;
      });
    }

    const searchHtml = opts.searchable
      ? `<div class="table-search">
           <input type="text" placeholder="Filter…" value="${state.filter}">
           <span class="muted" style="font-size:12px;">${rows.length} of ${state.rows.length}</span>
         </div>` : '';

    const headHtml = opts.columns.map(c => {
      const sortInd = state.sortKey === c.key
        ? (state.sortDir === 'asc' ? '▲' : '▼') : '↕';
      const cls = state.sortKey === c.key ? `sort-${state.sortDir}` : '';
      return `<th data-key="${c.key}" class="${cls}">${c.label}<span class="sort-ind">${sortInd}</span></th>`;
    }).join('');

    const bodyHtml = rows.map(r => {
      const tds = opts.columns.map(c => {
        let v = r[c.key];
        const formatted = c.fmt ? c.fmt(v, r) : (v ?? '');
        const colorCls = c.color ? c.color(r, v) : '';
        const numCls = c.num ? 'num' : '';
        return `<td class="${numCls} ${colorCls}">${formatted}</td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('') || `<tr><td colspan="${opts.columns.length}" class="muted" style="text-align:center; padding:20px;">No data</td></tr>`;

    root.innerHTML = `
      ${searchHtml}
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
    `;

    if (opts.searchable) {
      const input = root.querySelector('.table-search input');
      input.addEventListener('input', e => { state.filter = e.target.value; render(); });
      // restore focus + caret if it was being typed in
      if (document.activeElement?.tagName === 'INPUT' && state.filter) {
        input.focus();
        input.setSelectionRange(state.filter.length, state.filter.length);
      }
    }
    root.querySelectorAll('th[data-key]').forEach(th => {
      th.addEventListener('click', () => {
        const k = th.dataset.key;
        if (state.sortKey === k) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else { state.sortKey = k; state.sortDir = 'asc'; }
        render();
      });
    });
  }

  render();
  return { setRows(rows) { state.rows = rows; render(); } };
}

// Color helper: positive = good, negative = bad
export function pnlColor(_row, val) {
  if (val == null || Number.isNaN(val)) return '';
  return val >= 0 ? 'good' : 'bad';
}
