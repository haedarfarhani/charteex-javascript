import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';

export interface HistogramChartOptions extends ChartOptions {
  type: 'histogram';
  histogram?: {
    binCount?: number;
  };
}

export class HistogramChart extends Chart {
  private binCount = 10;
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: HistogramChartOptions) {
    super(options);
    if (options.histogram?.binCount) {
      this.binCount = options.histogram.binCount;
    }
    this.updateScalesFromData();
  }

  private computeBins(): { x0: number; x1: number; count: number }[] {
    const data = this.options.data;
    const series = data.series?.[0];
    if (!series || series.data.length === 0) return [];

    const values: number[] = [];
    for (const p of series.data) {
      const v = p.y ?? (p.value as number) ?? (typeof p.x === 'number' ? p.x : 0);
      values.push(v);
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const binWidth = span / this.binCount;

    const bins = Array.from({ length: this.binCount }, (_, i) => ({
      x0: min + i * binWidth,
      x1: min + (i + 1) * binWidth,
      count: 0
    }));

    for (const val of values) {
      const idx = Math.min(this.binCount - 1, Math.floor((val - min) / binWidth));
      const b = bins[idx];
      if (b) b.count++;
    }

    return bins;
  }

  protected override updateScalesFromData(): void {
    const bins = this.computeBins();
    if (bins.length === 0) return;

    const firstBin = bins[0];
    const lastBin = bins[bins.length - 1];
    if (!firstBin || !lastBin) return;

    const minX = firstBin.x0;
    const maxX = lastBin.x1;
    const maxCount = Math.max(...bins.map(b => b.count));

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) xScale.setDomain([minX, maxX]);
    if (yScale) yScale.setDomain([0, maxCount * 1.1 || 1]);
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

    const bins = this.computeBins();
    const zeroY = yScale.convert(0);
    const color = this.options.data.series?.[0]?.color ?? theme.seriesColors[0] ?? '#2563eb';

    bins.forEach(bin => {
      const x0Px = xScale.convert(bin.x0);
      const x1Px = xScale.convert(bin.x1);
      const yPx = yScale.convert(bin.count);

      const width = Math.max(1, x1Px - x0Px - 1);
      const height = Math.max(0, zeroY - yPx);

      const rect = renderer.rect(x0Px, yPx, width, height, {
        fill: color,
        rx: 2,
        ry: 2
      });
      this.renderedElements.push(rect);
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
