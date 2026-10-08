# Charteex 📊 — `charteex-javascript`

> Professional, **zero-dependency** JavaScript + TypeScript charting engine for modern web apps.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success.svg)](https://haedarfarhani.github.io/charteex-javascript/)
[![npm version](https://img.shields.io/npm/v/charteex-javascript.svg)](https://www.npmjs.com/package/charteex-javascript)
[![npm downloads](https://img.shields.io/npm/dm/charteex-javascript.svg)](https://www.npmjs.com/package/charteex-javascript)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](https://www.npmjs.com/package/charteex-javascript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Demo & Interactive Showcase

Experience the live interactive chart catalog, design token studio, and financial trading terminal directly in your browser:

👉 **[https://haedarfarhani.github.io/charteex-javascript/](https://haedarfarhani.github.io/charteex-javascript/)**

---

## 🌟 Why Charteex?

Most charting libraries bloat your bundle with hundreds of kilobytes of transitive dependencies, lock you into a specific front-end framework, or treat financial charts as an afterthought.

**Charteex** is different:

- **Zero runtime dependencies** — no D3, no Lodash, no Moment, no polyfills.
- **Framework agnostic** — Vanilla JS, TypeScript, React, Vue, Svelte, Angular, Solid, Astro, Next.js, Nuxt.
- **Dual rendering engine** — crisp vector **SVG** for everyday charts, hardware-accelerated **Canvas** for 10,000+ point datasets (auto-switches by data size, or pick manually).
- **First-class financial engine** — candlestick, OHLC, volume panels, and built-in indicators (SMA, EMA, WMA, RSI, MACD, Bollinger Bands, VWAP).
- **TypeScript-first** — strict types for every option, series, event, and plugin.
- **Accessible & extensible** — ARIA labels, keyboard-friendly legend, plugin system, crosshair, tooltips, zoom/pan, responsive auto-resize.

---

## 📦 Installation

```bash
npm install charteex-javascript
# or
yarn add charteex-javascript
# or
pnpm add charteex-javascript
```

**CDN (no build step):**

```html
<script type="module">
  import { createChart } from 'https://unpkg.com/charteex-javascript@latest/dist/index.js';
  // ... use createChart as below
</script>
```

---

## 🚀 Quick Start

### Line chart (Vanilla JS / TypeScript)

```typescript
import { createChart } from 'charteex-javascript';

const chart = createChart('#chart-container', {
  type: 'line',
  data: {
    series: [
      {
        name: 'Quarterly Revenue',
        data: [
          { x: 'Q1', y: 120 },
          { x: 'Q2', y: 180 },
          { x: 'Q3', y: 150 },
          { x: 'Q4', y: 240 }
        ],
        color: '#2563eb'
      }
    ]
  },
  theme: 'light',
  animation: { enabled: true, duration: 600 }
});

chart.render();
```

### React

```tsx
import { useEffect, useRef } from 'react';
import { createChart, type ChartInstance } from 'charteex-javascript';

export function RevenueChart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart: ChartInstance = createChart(ref.current, {
      type: 'bar',
      data: {
        series: [{ name: 'Revenue', data: [{ x: 'Q1', y: 120 }, { x: 'Q2', y: 180 }] }]
      }
    });
    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={ref} style={{ height: 400 }} />;
}
```

### Vue

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createChart, type ChartInstance } from 'charteex-javascript';

const el = ref<HTMLElement | null>(null);
let chart: ChartInstance | null = null;

onMounted(() => {
  if (!el.value) return;
  chart = createChart(el.value, {
    type: 'line',
    data: { series: [{ name: 'Growth', data: [{ x: 1, y: 10 }, { x: 2, y: 25 }] }] }
  });
  chart.render();
});
onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <div ref="el" style="height: 400px"></div>
</template>
```

---

## 📈 Financial Trading Chart

```typescript
import { createChart } from 'charteex-javascript';

const chart = createChart('#trading-view', {
  type: 'candlestick',
  volumePanel: true,
  indicators: [
    { type: 'sma', period: 20, color: '#f59e0b' },
    { type: 'bollinger', period: 20, color: '#8b5cf6' }
  ],
  data: {
    series: [
      {
        name: 'BTC/USD',
        data: [
          { time: 1700000000000, open: 64100, high: 64500, low: 63900, close: 64400, volume: 820 },
          { time: 1700000060000, open: 64400, high: 64800, low: 64300, close: 64750, volume: 1150 }
        ]
      }
    ]
  },
  crosshair: { enabled: true }
});

chart.render();

// Stream live candles
chart.appendData({ time: Date.now(), open: 64750, high: 64900, low: 64600, close: 64820, volume: 940 });
```

---

## 📊 Supported Chart Types (19)

| Category | Types | Notes |
|---|---|---|
| **Basic** | `line`, `bar`, `column`, `area` | Grouped/stacked bars, gradient fills |
| **Circular** | `pie`, `donut`, `radar`, `polar` | Slices, center metrics, multi-axis polygons |
| **Data Viz** | `scatter`, `bubble`, `histogram`, `heatmap`, `gauge`, `funnel`, `boxplot` | 2D grids, dials, quartile stats |
| **Financial** | `candlestick`, `ohlc`, `volume`, `financial` | Multi-panel candles, indicators, volume |

Use `type: 'financial'` for the full trading layout (price panel + volume panel + indicator overlays).

---

## 🧮 Technical Indicators

Pure, dependency-free, unit-tested calculation functions — usable with or without rendering a chart:

```typescript
import {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP
} from 'charteex-javascript';

const closes = [44.2, 44.8, 45.1, 45.9, 46.3, 46.1, 46.8];

calculateSMA(closes, 5);                    // Simple Moving Average
calculateEMA(closes, 12);                   // Exponential Moving Average
calculateRSI(closes, 14);                   // Relative Strength Index
calculateBollingerBands(closes, 20, 2);     // { upper, middle, lower }
calculateMACD(closes, 12, 26, 9);           // { macd, signal, histogram }
```

---

## 🎨 Themes

9 built-in themes, plus custom theme support:

```typescript
import { createChart, createTheme } from 'charteex-javascript';

// Built-in: 'light' | 'dark' | 'midnight' | 'minimal' |
//           'professional' | 'financial' | 'glass' | 'enterprise' | 'system'
const chart = createChart('#c', { type: 'line', data, theme: 'financial' });

// Custom theme
const brand = createTheme({ name: 'brand', primary: '#7c3aed', background: '#0f172a' });
chart.update({ theme: brand });
```

---

## 🔌 Plugin System

```typescript
import { createChart, createWatermarkPlugin, createThresholdPlugin } from 'charteex-javascript';

const chart = createChart('#chart', {
  type: 'line',
  data,
  plugins: [
    createWatermarkPlugin({ text: 'DRAFT', opacity: 0.1 }),
    createThresholdPlugin({ yValue: 100, label: 'Target', color: '#ef4444' })
  ]
});

// Custom plugin
chart.use({
  name: 'my-plugin',
  install(instance) { /* hook into instance.on('render', ...) */ },
  destroy() { /* cleanup */ }
});
```

---

## 🛠️ API Reference

| Method | Signature | Description |
|---|---|---|
| `render()` | `() => void` | Draws axes, legend, and all series |
| `setData(data)` | `(data: ChartData) => void` | Replaces data, recalibrates scales, rerenders |
| `appendData(point, i?)` | `(point: DataPoint, seriesIndex?: number) => void` | Streams one point (live updates) |
| `removeData(count, i?)` | `(count: number, seriesIndex?: number) => void` | Drops the oldest `count` points |
| `update(options)` | `(options: Partial<ChartOptions>) => void` | Merges options (theme, size, axes…) and rerenders |
| `zoom(f, cx?, cy?)` | `(factor: number, cx?: number, cy?: number) => void` | Programmatic zoom |
| `pan(dx, dy)` | `(dx: number, dy: number) => void` | Programmatic pan |
| `resetZoom()` | `() => void` | Restores original domains |
| `export(fmt)` | `(fmt: 'svg' \| 'png') => Promise<string \| Blob>` | SVG string or PNG blob |
| `on / off` | `(event, handler)` | `hover` · `click` · `datachange` · `zoom` · `pan` · `legendclick` |
| `destroy()` | `() => void` | Removes listeners, observers, and DOM output |
| `resize()` | `() => void` | Recalculates bounds (auto via `ResizeObserver` when `responsive: true`) |

### Key options (`ChartOptions`)

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `ChartType` | — | Any of the 19 chart types |
| `data` | `ChartData` | — | `{ series: [{ name, data, color, … }] }` |
| `renderer` | `'svg' \| 'canvas' \| 'auto'` | `'auto'` | Auto picks Canvas above ~2,500 points |
| `theme` | `ThemeMode \| Theme` | `'light'` | Built-in name or custom theme object |
| `responsive` | `boolean` | `true` | Auto-resize with `ResizeObserver` |
| `animation` | `{ enabled, duration, easing }` | on / 600ms | Entrance animation |
| `axis.x / axis.y` | `AxisConfig` | linear | `type: 'linear' \| 'time' \| 'category' \| 'log'`, ticks, grid, min/max |
| `tooltip` | `TooltipConfig` | enabled | Mode, formatter, custom render |
| `crosshair` | `CrosshairConfig` | disabled | Snap-to-data lines |
| `zoom / pan` | `ZoomConfig / PanConfig` | disabled | Wheel, drag, pinch |
| `legend` | `LegendConfig` | bottom | Interactive show/hide |
| `indicators` | `FinancialIndicatorConfig[]` | — | SMA / EMA / Bollinger overlays (financial) |
| `volumePanel` | `boolean` | — | Volume sub-panel (financial) |

---

## 📦 Bundle & Requirements

- **Size:** ~127 kB minified (~29 kB gzip), **0 runtime dependencies**.
- **Targets:** ES2022, modern browsers (Chrome/Edge/Firefox/Safari). SSR-safe import (no DOM access until `createChart`/`render` runs).
- **Types:** full `.d.ts` declarations shipped in the package.

---

## 🧪 Development

```bash
npm run dev            # demo playground at http://localhost:3000
npm run test           # 57 unit tests (Vitest)
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run build          # bundle + declarations into dist/
```

---

## 🔄 Migrating from `@smart-chart/core`

`charteex-javascript` is the published distribution of SmartChart. Only the import specifier changes:

```diff
- import { createChart } from '@smart-chart/core';
+ import { createChart } from 'charteex-javascript';
```

The legacy `createCharteex` alias is still exported (deprecated — prefer `createChart`).

---

## 📄 License

MIT © Charteex Contributors
