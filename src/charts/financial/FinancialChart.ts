import type { ChartOptions, Renderer, RenderElement, DataPoint } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';
import type { Scale } from '../../scales/Scale';
import { toTimestamp } from '../../utilities/date';
import { calculateSMA, calculateEMA, calculateBollingerBands } from '../../indicators/Indicators';

export interface FinancialIndicatorConfig {
  type: 'sma' | 'ema' | 'bollinger' | 'rsi';
  period?: number;
  color?: string;
}

export interface FinancialChartOptions extends ChartOptions {
  type: 'candlestick';
  indicators?: FinancialIndicatorConfig[];
  volumePanel?: boolean;
}

export class FinancialChart extends Chart {
  private indicators: FinancialIndicatorConfig[] = [];
  private volumePanel = true;
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private axisYVol: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: FinancialChartOptions) {
    super(options);
    if (options.indicators) this.indicators = options.indicators;
    if (options.volumePanel !== undefined) this.volumePanel = options.volumePanel;
    this.updateScalesFromData();
  }

  addIndicator(indicator: FinancialIndicatorConfig): void {
    this.indicators.push(indicator);
    this.render();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    const series = data.series?.[0];
    const points = series?.data ?? data.data ?? [];
    if (points.length === 0) return;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;
    const times: number[] = [];

    points.forEach((p, i) => {
      const open = p.open ?? p.y ?? 0;
      const high = p.high ?? Math.max(open, p.close ?? open);
      const low = p.low ?? Math.min(open, p.close ?? open);
      const vol = p.volume ?? 0;
      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : i);

      times.push(t);
      if (low < minPrice) minPrice = low;
      if (high > maxPrice) maxPrice = high;
      if (vol > maxVol) maxVol = vol;
    });

    if (minPrice === Infinity) { minPrice = 100; maxPrice = 110; }
    const pad = (maxPrice - minPrice) * 0.05 || 1;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) {
      const minT = Math.min(...times);
      const maxT = Math.max(...times);
      const span = maxT - minT || 1;
      xScale.setDomain([minT - span * 0.02, maxT + span * 0.02]);
    }

    if (yScale) {
      yScale.setDomain([minPrice - pad, maxPrice + pad]);
    }
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale && this.options.axis?.x) {
      this.axisX = new Axis(xScale, this.options.axis.x);
      this.axisX.render({ bounds, theme, renderer });
    }
    if (yScale && this.options.axis?.y) {
      this.axisY = new Axis(yScale, this.options.axis.y);
      this.axisY.render({ bounds, theme, renderer });
    }

    if (!xScale || !yScale) return;

    const data = this.options.data;
    const series = data.series?.[0];
    const points = series?.data ?? data.data ?? [];
    if (points.length === 0) return;

    const { plot } = bounds;
    const pricePlotH = this.volumePanel ? plot.height * 0.75 : plot.height;
    const volPlotY = plot.y + pricePlotH;
    const volPlotH = plot.height - pricePlotH;

    const count = points.length;
    const candleSlotW = plot.width / count;
    const candleW = Math.max(2, candleSlotW * 0.7);

    // Calculate max volume for volume panel
    const maxVol = Math.max(...points.map(p => p.volume ?? 0), 1000);

    // Render Candles and Volume
    points.forEach((p, idx) => {
      const open = p.open ?? p.y ?? 0;
      const high = p.high ?? Math.max(open, p.close ?? open);
      const low = p.low ?? Math.min(open, p.close ?? open);
      const close = p.close ?? open;
      const vol = p.volume ?? 0;
      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : idx);

      const cx = xScale.convert(t);
      const yOpen = yScale.convert(open);
      const yHigh = yScale.convert(high);
      const yLow = yScale.convert(low);
      const yClose = yScale.convert(close);

      const isBullish = close >= open;
      const color = isBullish ? '#10b981' : '#ef4444';

      // Candlestick
      const wick = renderer.line(cx, yHigh, cx, yLow, { stroke: color, strokeWidth: 1 });
      const bodyH = Math.max(1, Math.abs(yOpen - yClose));
      const bodyY = Math.min(yOpen, yClose);
      const body = renderer.rect(cx - candleW / 2, bodyY, candleW, bodyH, {
        fill: color,
        stroke: color,
        strokeWidth: 1
      });
      this.renderedElements.push(wick, body);

      // Volume bar
      if (this.volumePanel) {
        const volH = (vol / maxVol) * (volPlotH - 8);
        const volY = volPlotY + volPlotH - volH;
        const vBar = renderer.rect(cx - candleW / 2, volY, candleW, volH, {
          fill: color,
          opacity: 0.45
        });
        this.renderedElements.push(vBar);
      }
    });

    // Volume divider line
    if (this.volumePanel) {
      const divider = renderer.line(plot.x, volPlotY, plot.x + plot.width, volPlotY, {
        stroke: theme.grid,
        strokeWidth: 1,
        strokeDasharray: [3, 3]
      });
      const volLabel = renderer.text(plot.x + 6, volPlotY + 12, 'Volume', {
        fill: '#9ca3af',
        fontSize: 10,
        fontFamily: theme.fontFamily
      });
      this.renderedElements.push(divider, volLabel);
    }

    // Render Indicator Overlays
    const closePrices = points.map(p => p.close ?? p.y ?? 0);
    this.indicators.forEach((ind) => {
      const period = ind.period ?? 14;
      if (ind.type === 'sma') {
        const smaVals = calculateSMA(closePrices, period);
        this.renderIndicatorLine(xScale, yScale, points, smaVals, ind.color ?? '#f59e0b', `SMA (${period})`, renderer);
      } else if (ind.type === 'ema') {
        const emaVals = calculateEMA(closePrices, period);
        this.renderIndicatorLine(xScale, yScale, points, emaVals, ind.color ?? '#3b82f6', `EMA (${period})`, renderer);
      } else if (ind.type === 'bollinger') {
        const bb = calculateBollingerBands(closePrices, period);
        this.renderIndicatorLine(xScale, yScale, points, bb.upper, '#8b5cf6', `BB Upper`, renderer);
        this.renderIndicatorLine(xScale, yScale, points, bb.middle, '#6366f1', `BB Mid`, renderer);
        this.renderIndicatorLine(xScale, yScale, points, bb.lower, '#8b5cf6', `BB Lower`, renderer);
      }
    });
  }

  private renderIndicatorLine(
    xScale: Scale,
    yScale: Scale,
    points: DataPoint[],
    values: (number | null)[],
    color: string,
    label: string,
    renderer: Renderer
  ): void {
    let path = '';
    let started = false;

    values.forEach((v, idx) => {
      if (v === null || v === undefined) return;
      const pt = points[idx];
      if (!pt) return;
      const t = pt.time !== undefined ? toTimestamp(pt.time) : (typeof pt.x === 'number' ? pt.x : idx);
      const px = xScale.convert(t);
      const py = yScale.convert(v);

      if (!started) {
        path = `M ${px} ${py}`;
        started = true;
      } else {
        path += ` L ${px} ${py}`;
      }
    });

    if (path) {
      const lineEl = renderer.path(path, { stroke: color, strokeWidth: 1.5, fill: 'none' });
      this.renderedElements.push(lineEl);
    }
  }

  override destroy(): void {
    for (const el of this.renderedElements) {
      el.destroy();
    }
    this.renderedElements = [];
    this.axisX?.destroy();
    this.axisY?.destroy();
    this.axisYVol?.destroy();
    super.destroy();
  }
}
