// Shared navigation injected at runtime so all pages stay in sync.
const NAV_ITEMS = [
  { section: 'Overview', items: [
    { href: 'index.html',         label: 'Home',           icon: '◆' },
    { href: 'architecture.html',  label: 'Architecture',   icon: '⌬' },
  ]},
  { section: 'Stack', items: [
    { href: 'datasets.html',      label: 'Datasets',       icon: '☷' },
    { href: 'models.html',        label: 'Forecast Models', icon: '☁' },
    { href: 'signals.html',       label: 'Signal Engine',  icon: '⚡' },
  ]},
  { section: 'Strategy', items: [
    { href: 'trade-flow.html',    label: 'Trade Flow',     icon: '⇆' },
    { href: 'results.html',       label: 'Results',        icon: '▮' },
  ]},
  { section: 'Reference', items: [
    { href: 'limitations.html',   label: 'Limitations',    icon: '!' },
  ]},
];

function currentPage() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1);
  return file === '' ? 'index.html' : file;
}

function buildNav() {
  const here = currentPage();
  const nav = document.createElement('aside');
  nav.className = 'nav-rail';
  nav.innerHTML = `
    <a class="nav-brand" href="index.html">
      <span class="dot"></span>
      <span>
        ag_vol_arb
        <div class="subtitle">drought → vol → P&amp;L</div>
      </span>
    </a>
    ${NAV_ITEMS.map(group => `
      <div class="nav-section">${group.section}</div>
      <ul class="nav-links">
        ${group.items.map(item => `
          <li>
            <a href="${item.href}" class="${item.href === here ? 'active' : ''}">
              <span class="icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          </li>`).join('')}
      </ul>
    `).join('')}
    <div class="nav-footer">
      <div>v0.1 · MVP backtest</div>
      <div style="margin-top:6px;">
        <a href="https://github.com/" target="_blank">GitHub</a> ·
        <a href="assets/data/demo_report.md">Report</a>
      </div>
    </div>
  `;

  // Mobile toggle
  const toggle = document.createElement('button');
  toggle.className = 'mobile-toggle';
  toggle.innerHTML = '☰';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.addEventListener('click', () => {
    document.querySelector('.site').classList.toggle('mobile-nav-open');
  });

  document.body.prepend(toggle);
  document.querySelector('.site').prepend(nav);
}

document.addEventListener('DOMContentLoaded', buildNav);
