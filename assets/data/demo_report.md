# Ag Vol Arb — Run `demo`

## Overview

Historical simulation of a long-volatility corn straddle trade triggered by early drought-stress signals. This run uses the `mock` data provider and the `mock` forecast provider.

## Headline numbers

- Events simulated: **1**
- Entry date: **2025-07-15**
- Partial exit: **2025-07-20**
- Final exit date: **2025-08-01**
- Gross P&L: **$114,064**
- Total costs: **$8,122**
- Net P&L: **$105,942**
- Max drawdown: **$-11,448**

## Trade blotter

| date | action | contracts | underlying | iv | straddle_px | cash_flow | cumulative_pnl | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-15 | ENTRY | 100 | 4.9154 | 0.3392 | 0.7759 | -392,088.7416 | -4,115.0000 | strike=4.9 cost=$4115 |
| 2025-07-20 | PARTIAL_EXIT | 50 | 5.1784 | 0.3915 | 0.9278 | 229,876.6085 | 69,736.3505 | remaining=50 |
| 2025-08-01 | FINAL_EXIT | 50 | 5.7110 | 0.3697 | 1.0804 | 268,153.9996 | 105,941.8666 | position closed |

## Attribution totals

- **futures_pnl**: $80,893
- **vol_pnl**: $51,052
- **theta_pnl**: $-18,052
- **cross_gamma**: $172
- **costs**: $-8,122

## Caveats

- Data and forecasts are synthetic unless a real provider is wired in.
- ATM IV is a proxy input, not a reconstructed vol surface.
- One event per run in the MVP; multi-event looping is a natural extension.
- GraphCast and Earth-2 providers are stubbed with file-backed + mock fallbacks.
