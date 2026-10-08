import type {
  ChartOptions,
  ChartType,
  ChartInstance,
  Theme,
  ThemeMode,
  RendererType,
  ChartPlugin,
  ChartData,
  Series,
  DataPoint,
  AxisConfig,
  TooltipConfig,
  CrosshairConfig,
  ZoomConfig,
  PanConfig,
  AnimationConfig,
  ContainerStyleConfig,
  LegendConfig
} from './core/ChartConfig';
import { Chart } from './core/Chart';
import { LineChart, type LineChartOptions } from './charts/line/LineChart';
import { BarChart, type BarChartOptions } from './charts/bar/BarChart';
import { AreaChart, type AreaChartOptions } from './charts/area/AreaChart';
import { PieChart, type PieChartOptions } from './charts/pie/PieChart';
import { DonutChart, type DonutChartOptions } from './charts/donut/DonutChart';
import { RadarChart, type RadarChartOptions } from './charts/radar/RadarChart';
import { PolarChart, type PolarChartOptions } from './charts/polar/PolarChart';
import { ScatterChart, type ScatterChartOptions } from './charts/scatter/ScatterChart';
import { BubbleChart, type BubbleChartOptions } from './charts/bubble/BubbleChart';
import { HistogramChart, type HistogramChartOptions } from './charts/histogram/HistogramChart';
import { HeatmapChart, type HeatmapChartOptions } from './charts/heatmap/HeatmapChart';
import { GaugeChart, type GaugeChartOptions } from './charts/gauge/GaugeChart';
import { FunnelChart, type FunnelChartOptions } from './charts/funnel/FunnelChart';
import { BoxPlotChart, type BoxPlotChartOptions } from './charts/boxplot/BoxPlotChart';
import { CandlestickChart, type CandlestickChartOptions } from './charts/financial/CandlestickChart';
import { OHLCChart, type OHLCChartOptions } from './charts/financial/OHLCChart';
import { VolumeChart, type VolumeChartOptions } from './charts/financial/VolumeChart';
import { FinancialChart, type FinancialChartOptions } from './charts/financial/FinancialChart';

import {
  LightTheme,
  DarkTheme,
  MidnightTheme,
  MinimalTheme,
  ProfessionalTheme,
  FinancialTheme,
  GlassTheme,
  EnterpriseTheme,
  themeRegistry,
  createTheme,
  extendTheme,
  resolveTheme,
  getSystemTheme
} from './themes/Theme';

import {
  exportCssVariables,
  type DesignTokens,
  type ColorTokens,
  type TypographyTokens,
  type SpacingTokens,
  type RadiusTokens,
  type ShadowTokens,
  type BorderTokens,
  type AnimationTokens
} from './design/tokens';

import { LinearScale, TimeScale, CategoryScale, LogScale, type Scale } from './scales/Scale';
import { SVGRenderer } from './rendering/SVGRenderer';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { LayoutEngine } from './layout/LayoutEngine';
import { Tooltip } from './interaction/Tooltip';
import { Crosshair } from './interaction/Crosshair';
import { ZoomPanController } from './interaction/ZoomPan';
import { A11yManager } from './accessibility/A11y';
import { createWatermarkPlugin, createThresholdPlugin } from './plugins/Plugin';
import {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP
} from './indicators/Indicators';
import {
  ChartError,
  ScaleError,
  RendererError,
  DataError,
  ConfigurationError
} from './utilities/errors';
import { toTimestamp, formatDate } from './utilities/date';
import { formatNumber, escapeHtml } from './utilities/format';
import { computeBoxPlotStats, describeArc, polarToCartesian } from './utilities/geometry';

export {
  // Core
  Chart,
  // Basic Charts
  LineChart,
  BarChart,
  AreaChart,
  // Circular Charts
  PieChart,
  DonutChart,
  RadarChart,
  PolarChart,
  // Data Viz Charts
  ScatterChart,
  BubbleChart,
  HistogramChart,
  HeatmapChart,
  GaugeChart,
  FunnelChart,
  BoxPlotChart,
  // Financial Charts
  CandlestickChart,
  OHLCChart,
  VolumeChart,
  FinancialChart,
  // Theme Presets & Customizer
  LightTheme,
  DarkTheme,
  MidnightTheme,
  MinimalTheme,
  ProfessionalTheme,
  FinancialTheme,
  GlassTheme,
  EnterpriseTheme,
  themeRegistry,
  createTheme,
  extendTheme,
  resolveTheme,
  getSystemTheme,
  // Design Tokens
  exportCssVariables,
  // Scales & Renderers
  LinearScale,
  TimeScale,
  CategoryScale,
  LogScale,
  SVGRenderer,
  CanvasRenderer,
  LayoutEngine,
  // Interactions & Accessibility
  Tooltip,
  Crosshair,
  ZoomPanController,
  A11yManager,
  // Plugins
  createWatermarkPlugin,
  createThresholdPlugin,
  // Indicators
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP,
  // Errors
  ChartError,
  ScaleError,
  RendererError,
  DataError,
  ConfigurationError,
  // Utilities
  toTimestamp,
  formatDate,
  formatNumber,
  escapeHtml,
  computeBoxPlotStats,
  describeArc,
  polarToCartesian
};

export type {
  ChartOptions,
  ChartData,
  ChartType,
  ChartInstance,
  Theme,
  ThemeMode,
  RendererType,
  Series,
  DataPoint,
  ChartPlugin,
  Scale,
  AxisConfig,
  TooltipConfig,
  CrosshairConfig,
  ZoomConfig,
  PanConfig,
  AnimationConfig,
  ContainerStyleConfig,
  LegendConfig,
  DesignTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  BorderTokens,
  AnimationTokens,
  LineChartOptions,
  BarChartOptions,
  AreaChartOptions,
  PieChartOptions,
  DonutChartOptions,
  RadarChartOptions,
  PolarChartOptions,
  ScatterChartOptions,
  BubbleChartOptions,
  HistogramChartOptions,
  HeatmapChartOptions,
  GaugeChartOptions,
  FunnelChartOptions,
  BoxPlotChartOptions,
  CandlestickChartOptions,
  OHLCChartOptions,
  VolumeChartOptions,
  FinancialChartOptions
};

export function createChart(container: string | HTMLElement, options: Omit<ChartOptions, 'container'> & Record<string, unknown>): ChartInstance {
  const chartOptions: ChartOptions = {
    ...options,
    container
  } as ChartOptions;

  switch (chartOptions.type) {
    case 'line':
      return new LineChart(chartOptions as LineChartOptions);
    case 'bar':
    case 'column':
      return new BarChart(chartOptions as BarChartOptions);
    case 'area':
      return new AreaChart(chartOptions as AreaChartOptions);
    case 'pie':
      return new PieChart(chartOptions as PieChartOptions);
    case 'donut':
      return new DonutChart(chartOptions as DonutChartOptions);
    case 'radar':
      return new RadarChart(chartOptions as RadarChartOptions);
    case 'polar':
      return new PolarChart(chartOptions as PolarChartOptions);
    case 'scatter':
      return new ScatterChart(chartOptions as ScatterChartOptions);
    case 'bubble':
      return new BubbleChart(chartOptions as BubbleChartOptions);
    case 'histogram':
      return new HistogramChart(chartOptions as HistogramChartOptions);
    case 'heatmap':
      return new HeatmapChart(chartOptions as HeatmapChartOptions);
    case 'gauge':
      return new GaugeChart(chartOptions as GaugeChartOptions);
    case 'funnel':
      return new FunnelChart(chartOptions as FunnelChartOptions);
    case 'boxplot':
      return new BoxPlotChart(chartOptions as BoxPlotChartOptions);
    case 'financial':
      return new FinancialChart(chartOptions as FinancialChartOptions);
    case 'candlestick':
      if ((chartOptions as FinancialChartOptions).indicators || (chartOptions as FinancialChartOptions).volumePanel) {
        return new FinancialChart(chartOptions as FinancialChartOptions);
      }
      return new CandlestickChart(chartOptions as CandlestickChartOptions);
    case 'ohlc':
      return new OHLCChart(chartOptions as OHLCChartOptions);
    case 'volume':
      return new VolumeChart(chartOptions as VolumeChartOptions);
    default:
      return new Chart(chartOptions);
  }
}

/** @deprecated Use `createChart` instead. Kept for backwards compatibility. */
export const createCharteex = createChart;

export const themes = {
  default: LightTheme,
  light: LightTheme,
  dark: DarkTheme,
  midnight: MidnightTheme,
  minimal: MinimalTheme,
  professional: ProfessionalTheme,
  financial: FinancialTheme,
  glass: GlassTheme,
  enterprise: EnterpriseTheme
};

export const Charteex = {
  createChart,
  createCharteex,
  createTheme,
  extendTheme,
  resolveTheme,
  exportCssVariables,
  themes
};
