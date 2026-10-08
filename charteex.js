import { Chart } from './core/Chart';
import { LineChart } from './charts/line/LineChart';
import { BarChart } from './charts/bar/BarChart';
import { AreaChart } from './charts/area/AreaChart';
import { PieChart } from './charts/pie/PieChart';
import { DonutChart } from './charts/donut/DonutChart';
import { RadarChart } from './charts/radar/RadarChart';
import { PolarChart } from './charts/polar/PolarChart';
import { ScatterChart } from './charts/scatter/ScatterChart';
import { BubbleChart } from './charts/bubble/BubbleChart';
import { HistogramChart } from './charts/histogram/HistogramChart';
import { HeatmapChart } from './charts/heatmap/HeatmapChart';
import { GaugeChart } from './charts/gauge/GaugeChart';
import { FunnelChart } from './charts/funnel/FunnelChart';
import { BoxPlotChart } from './charts/boxplot/BoxPlotChart';
import { CandlestickChart } from './charts/financial/CandlestickChart';
import { OHLCChart } from './charts/financial/OHLCChart';
import { VolumeChart } from './charts/financial/VolumeChart';
import { FinancialChart } from './charts/financial/FinancialChart';
import { LightTheme, DarkTheme, MidnightTheme, MinimalTheme, ProfessionalTheme, FinancialTheme, GlassTheme, EnterpriseTheme, themeRegistry, createTheme, extendTheme, resolveTheme, getSystemTheme } from './themes/Theme';
import { exportCssVariables } from './design/tokens';
import { LinearScale, TimeScale, CategoryScale, LogScale } from './scales/Scale';
import { SVGRenderer } from './rendering/SVGRenderer';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { LayoutEngine } from './layout/LayoutEngine';
import { Tooltip } from './interaction/Tooltip';
import { Crosshair } from './interaction/Crosshair';
import { ZoomPanController } from './interaction/ZoomPan';
import { A11yManager } from './accessibility/A11y';
import { createWatermarkPlugin, createThresholdPlugin } from './plugins/Plugin';
import { calculateSMA, calculateEMA, calculateWMA, calculateRSI, calculateMACD, calculateBollingerBands, calculateVWAP } from './indicators/Indicators';
import { ChartError, ScaleError, RendererError, DataError, ConfigurationError } from './utilities/errors';
import { toTimestamp, formatDate } from './utilities/date';
import { formatNumber, escapeHtml } from './utilities/format';
import { computeBoxPlotStats, describeArc, polarToCartesian } from './utilities/geometry';
export { 
// Core
Chart, 
// Basic Charts
LineChart, BarChart, AreaChart, 
// Circular Charts
PieChart, DonutChart, RadarChart, PolarChart, 
// Data Viz Charts
ScatterChart, BubbleChart, HistogramChart, HeatmapChart, GaugeChart, FunnelChart, BoxPlotChart, 
// Financial Charts
CandlestickChart, OHLCChart, VolumeChart, FinancialChart, 
// Theme Presets & Customizer
LightTheme, DarkTheme, MidnightTheme, MinimalTheme, ProfessionalTheme, FinancialTheme, GlassTheme, EnterpriseTheme, themeRegistry, createTheme, extendTheme, resolveTheme, getSystemTheme, 
// Design Tokens
exportCssVariables, 
// Scales & Renderers
LinearScale, TimeScale, CategoryScale, LogScale, SVGRenderer, CanvasRenderer, LayoutEngine, 
// Interactions & Accessibility
Tooltip, Crosshair, ZoomPanController, A11yManager, 
// Plugins
createWatermarkPlugin, createThresholdPlugin, 
// Indicators
calculateSMA, calculateEMA, calculateWMA, calculateRSI, calculateMACD, calculateBollingerBands, calculateVWAP, 
// Errors
ChartError, ScaleError, RendererError, DataError, ConfigurationError, 
// Utilities
toTimestamp, formatDate, formatNumber, escapeHtml, computeBoxPlotStats, describeArc, polarToCartesian };
export function createChart(container, options) {
    const chartOptions = {
        ...options,
        container
    };
    switch (chartOptions.type) {
        case 'line':
            return new LineChart(chartOptions);
        case 'bar':
        case 'column':
            return new BarChart(chartOptions);
        case 'area':
            return new AreaChart(chartOptions);
        case 'pie':
            return new PieChart(chartOptions);
        case 'donut':
            return new DonutChart(chartOptions);
        case 'radar':
            return new RadarChart(chartOptions);
        case 'polar':
            return new PolarChart(chartOptions);
        case 'scatter':
            return new ScatterChart(chartOptions);
        case 'bubble':
            return new BubbleChart(chartOptions);
        case 'histogram':
            return new HistogramChart(chartOptions);
        case 'heatmap':
            return new HeatmapChart(chartOptions);
        case 'gauge':
            return new GaugeChart(chartOptions);
        case 'funnel':
            return new FunnelChart(chartOptions);
        case 'boxplot':
            return new BoxPlotChart(chartOptions);
        case 'candlestick':
            if (chartOptions.indicators || chartOptions.volumePanel) {
                return new FinancialChart(chartOptions);
            }
            return new CandlestickChart(chartOptions);
        case 'ohlc':
            return new OHLCChart(chartOptions);
        case 'volume':
            return new VolumeChart(chartOptions);
        default:
            return new Chart(chartOptions);
    }
}
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
//# sourceMappingURL=index.js.map