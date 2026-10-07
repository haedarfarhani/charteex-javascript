import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';
import { toTimestamp } from '../../utilities/date';

export interface VolumeChartOptions extends ChartOptions {
  type: 'volume';
  volume?: {
    upColor?: string;
    downColor?: string;
  };
}

export class VolumeChart extends Chart {
  protected upColor = '#10b981';
  protected downColor = '#ef4444';
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: VolumeChartOptions) {
    super(options);
    if (options.volume?.upColor) this.upColor = options.volume.upColor;
    if (options.volume?.downColor) this.downColor = options.volume.downColor;
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    const series = data.series?.[0];
    const points = series?.data ?? data.data ?? [];
    if (points.length === 0) return;

    let maxVol = 0;
    const times: number[] = [];

    points.forEach((p, i) => {
      const vol = p.volume ?? p.y ?? 0;
      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : i);
      times.push(t);
      if (vol > maxVol) maxVol = vol;
    });

    if (maxVol === 0) maxVol = 1000;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) {
      const minT = Math.min(...times);
      const maxT = Math.max(...times);
      const span = maxT - minT || 1;
      xScale.setDomain([minT - span * 0.02, maxT + span * 0.02]);
    }

    if (yScale) {
      yScale.setDomain([0, maxVol * 1.15]);
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

    const barW = Math.max(2, (bounds.plot.width / points.length) * 0.7);
    const zeroY = yScale.convert(0);

    points.forEach((p, idx) => {
      const vol = p.volume ?? p.y ?? 0;
      const open = p.open ?? 0;
      const close = p.close ?? open;
      const isBullish = close >= open;
      const color = isBullish ? this.upColor : this.downColor;

      const t = p.time !== undefined ? toTimestamp(p.time) : (typeof p.x === 'number' ? p.x : idx);
      const cx = xScale.convert(t);
      const yVal = yScale.convert(vol);
      const h = Math.max(0, zeroY - yVal);

      const bar = renderer.rect(cx - barW / 2, yVal, barW, h, {
        fill: color,
        opacity: 0.8,
        rx: 1,
        ry: 1
      });
      this.renderedElements.push(bar);
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
