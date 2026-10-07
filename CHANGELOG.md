# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-07

### Added
- **Core Engine**: Zero-dependency charting engine supporting SVG and hardware-accelerated Canvas renderers.
- **Scale Engine**: `LinearScale`, `TimeScale`, `CategoryScale`, and `LogScale` with zoom and pan transforms.
- **Layout Engine**: Automatic plot bounds, title margins, and responsive legend placement.
- **17+ Chart Types**:
  - Basic: Line, Bar (Grouped & Stacked), Column, Area
  - Circular: Pie, Donut, Radar, Polar
  - Data Visualization: Scatter, Bubble, Histogram, Heatmap, Radial Gauge, Funnel, Box Plot
  - Financial: Candlestick, OHLC, Volume bars, Composite Financial Chart
- **Technical Indicators**: Unit-tested calculations for SMA, EMA, WMA, RSI, MACD, Bollinger Bands, and VWAP.
- **Interactions**: Crosshair synchronization, customizable sanitized Tooltips, wheel zoom, pointer pan, touch pinch.
- **Accessibility**: ARIA image roles, labels, and hidden tabular data summaries for screen readers.
- **Plugin Architecture**: `createWatermarkPlugin` and `createThresholdPlugin`.
- **Exporting**: Native browser SVG string serialization and PNG Blob rasterization.
- **Interactive Showcase**: Comprehensive demo portal with Chart Catalog, Financial Trading Terminal, Performance Stress-Test, and Code Playground.
- **Test Suite**: 52 unit and integration tests with Vitest covering core, geometry, indicators, data normalization, and charts.
