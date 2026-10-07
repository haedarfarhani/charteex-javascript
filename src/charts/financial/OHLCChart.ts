import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';
import { toTimestamp } from '../../utilities/date';

export interface OHLCChartOptions extends ChartOptions {
  type: 'ohlc';
  ohlc?: {
    upColor?: string;
    downColor?: string;
    tickWidth?: number;
  };
}

export class OHLCChart extends Chart {
  protected upColor = '#10b981';
  protected downColor = '#ef4444';
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: OHLCChartOptions) {
    super(options);
    if (options.ohlc) {
      if (options.ohlc.upColor) this.upColor = options.ohlc.upColor;
      if (options.ohlc.downColor) this.downColor = options.ohlc.downColor;
    }
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    const series = data.series?.[0];
    const points = series?.data ?? data.data ?? [];
    if (points.length === 0) return;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    const times: number[] = [];

    points.forEach((p, i) => {
      const open = p.open ?? p.y ?? 0;
      const high = p.high ?? Math.max(open, p.close ?? open);
      const low = p.low ?? Math.min(open, p.close ?? open);
      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : i);

      times.push(t);
      if (low < minPrice) minPrice = low;
      if (high > maxPrice) maxPrice = high;
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

    const tickSpan = Math.max(3, (bounds.plot.width / points.length) * 0.35);

    points.forEach((p, idx) => {
      const open = p.open ?? p.y ?? 0;
      const high = p.high ?? Math.max(open, p.close ?? open);
      const low = p.low ?? Math.min(open, p.close ?? open);
      const close = p.close ?? open;
      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : idx);

      const cx = xScale.convert(t);
      const yOpen = yScale.convert(open);
      const yHigh = yScale.convert(high);
      const yLow = yScale.convert(low);
      const yClose = yScale.convert(close);

      const isBullish = close >= open;
      const color = isBullish ? this.upColor : this.downColor;

      // High to Low bar
      const bar = renderer.line(cx, yHigh, cx, yLow, { stroke: color, strokeWidth: 1.5 });
      // Left Open tick
      const openTick = renderer.line(cx - tickSpan, yOpen, cx, yOpen, { stroke: color, strokeWidth: 1.5 });
      // Right Close tick
      const closeTick = renderer.line(cx, yClose, cx + tickSpan, yClose, { stroke: color, strokeWidth: 1.5 });

      this.renderedElements.push(bar, openTick, closeTick);
    });
  }

  override destroy(): void {
    for (const el of this.renderedElements) {
      el.destroy();
    }
    this.renderedElements = [];
    this.axisX?.destroy();
    this.axisY?.destroy();
    super.destroy();
  }
}
