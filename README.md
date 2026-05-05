# climatetrading

Static documentation site for **ag_vol_arb** — a research backtest that buys
corn-options vol when satellite + ERA5 + USDA signals agree on emerging drought
stress. The site explains the data layer, forecast models, signal engine, trade
flow, results, and limitations.

This repository contains the published site only. The backtest source code,
adapters, and Docker GPU pipeline live in a separate private repository.

**Live site:** https://nathanielshields.github.io/climatetrading/

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080/
```

No build step. No package install. Static HTML + a small amount of vanilla JS,
plus Chart.js loaded via CDN.

## Deploy

GitHub Pages serves the repo root directly. Under **Settings → Pages**:

- *Source*: `Deploy from a branch`
- *Branch*: `main` / folder `/ (root)`

The `.nojekyll` marker in the repo root disables Jekyll processing so files and
folders starting with `_` (if any are added later) ship verbatim.

## Structure

```
.
├── index.html                # Home
├── architecture.html
├── datasets.html
├── models.html
├── signals.html
├── trade-flow.html
├── results.html
├── limitations.html
├── reproducibility.html
├── .nojekyll                 # disable Jekyll
└── assets/
    ├── css/styles.css
    ├── js/
    │   ├── nav.js            # injected nav
    │   ├── data.js           # data loader + sortable table
    │   └── charts.js         # Chart.js wrappers
    ├── data/
    │   ├── site-data.json    # demo + historical artifacts
    │   └── demo_report.md
    └── img/                  # PNG figures from the backtest
```

## Refreshing the data

The contents of `assets/data/` and `assets/img/` are exported from a backtest
run in the upstream private repo. To refresh: regenerate the artifacts there,
copy `docs/` into this repo, and push.
