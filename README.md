# Charteex JavaScript (`charteex-javascript` / `@smart-chart/core`)

> Professional, zero-dependency JavaScript and TypeScript charting engine and visual design system built from the ground up for modern web applications.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success.svg)](https://haedarfarhani.github.io/charteex-javascript/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Demo & Interactive Showcase

Experience the live interactive chart catalog, design token studio, and financial trading terminal directly in your browser:

👉 **[https://haedarfarhani.github.io/charteex-javascript/](https://haedarfarhani.github.io/charteex-javascript/)**

---

## 🌟 Why Charteex?

Most charting libraries either weigh down your bundles with hundreds of kilobytes of transitive dependencies, lock you into specific front-end frameworks (like React or Vue), or fail to offer first-class financial trading charts.

**SmartChart** changes that:
- **Zero Runtime Dependencies**: No D3, Chart.js, Lodash, Moment, or external polyfills.
- **Framework Agnostic**: Works natively in Vanilla JS, TypeScript, React, Vue, Svelte, Angular, Solid, Astro, Next.js, and Nuxt.
- **Dual Rendering Engine**: Vector SVG for sharp, inspectable graphics and hardware-accelerated Canvas for high-volume datasets (10,000+ to 100,000+ points).
- **First-Class Financial Engine**: Candlesticks, OHLC, Volume bars, and built-in technical indicators (SMA, EMA, WMA, RSI, MACD, Bollinger Bands, VWAP).
- **TypeScript-First**: Strict type safety with comprehensive interfaces and discriminated unions.
- **Extensible & Accessible**: Plugin system, ARIA support, custom formatters, crosshair, and responsive auto-resize.

---

## 📦 Installation

```bash
npm install @smart-chart/core
```

---

## 🚀 Quick Start

### Basic Line Chart

```typescript
import { createChart } from '@smart-chart/core';

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

---

## 📈 Financial Trading Chart

```typescript
import { createChart } from '@smart-chart/core';

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
```

---

## 📊 Supported Chart Types (17+)

| Category | Chart Types | Description |
|---|---|---|
| **Basic** | `line`, `bar`, `column`, `area` | Smooth/straight lines, grouped/stacked bars, gradient fills |
| **Circular** | `pie`, `donut`, `radar`, `polar` | Slices, center metrics, multi-axis polygons, rose petals |
| **Data Viz** | `scatter`, `bubble`, `histogram`, `heatmap`, `gauge`, `funnel`, `boxplot` | Continuous/binned data, 2D matrix grids, tachometer dials, quartile stats |
| **Financial** | `candlestick`, `ohlc`, `volume`, `financial` | Multi-panel trading candles, open/close ticks, indicators |

---

## 🧮 Technical Indicators

SmartChart includes pure, unit-tested indicator calculation algorithms:

```typescript
import {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP
} from '@smart-chart/core';

const closePrices = [44.2, 44.8, 45.1, 45.9, 46.3, 46.1, 46.8];

// Simple Moving Average
const sma = calculateSMA(closePrices, 5);

// Relative Strength Index
const rsi = calculateRSI(closePrices, 14);

// Bollinger Bands (Upper, Middle, Lower)
const { upper, middle, lower } = calculateBollingerBands(closePrices, 20, 2);
```

---

## 🔌 Plugin System

Extend chart functionality with custom plugins:

```typescript
import { createChart, createWatermarkPlugin, createThresholdPlugin } from '@smart-chart/core';

const chart = createChart('#chart', {
  type: 'line',
  plugins: [
    createWatermarkPlugin({ text: 'DRAFT', opacity: 0.1 }),
    createThresholdPlugin({ yValue: 100, label: 'Target', color: '#ef4444' })
  ],
  data: { /* ... */ }
});
```

---

## 🛠️ API Methods

| Method | Parameters | Description |
|---|---|---|
| `render()` | — | Draws the chart and all axes, legends, and series |
| `setData(data)` | `ChartData` | Updates data, recalibrates scales, and rerenders |
| `appendData(point, seriesIndex)` | `DataPoint, number?` | Appends a single data point in real-time |
| `update(options)` | `Partial<ChartOptions>` | Mutates options (theme, dimensions, margins, scales) |
| `zoom(factor, cx, cy)` | `number, number?, number?` | Programmatic zoom |
| `pan(deltaX, deltaY)` | `number, number` | Programmatic pan |
| `resetZoom()` | — | Resets scales to original range |
| `export(format)` | `'svg' \| 'png'` | Returns serialized SVG string or PNG Blob |
| `on(event, handler)` | `string, Function` | Subscribes to events (`hover`, `click`, `datachange`, `zoom`, `pan`) |
| `destroy()` | — | Cleans up DOM, event listeners, and timers |

---

## 🧪 Development & Testing

```bash
# Run development demo server
npm run dev

# Run Vitest unit & integration test suite
npm run test

# Typecheck TypeScript source
npm run typecheck

# Lint with ESLint
npm run lint

# Build production bundle & declaration files
npm run build
```

---

## 📄 License

MIT © SmartChart Contributors
