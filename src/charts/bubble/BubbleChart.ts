import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';

export interface BubbleChartOptions extends ChartOptions {
  type: 'bubble';
  bubble?: {
    minRadius?: number;
    maxRadius?: number;
  };
}

export class BubbleChart extends Chart {
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: BubbleChartOptions) {
    super(options);
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    if (!data?.series || data.series.length === 0) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const s of data.series) {
      for (const p of s.data) {
        const x = typeof p.x === 'number' ? p.x : 0;
        const y = p.y ?? 0;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (minX === Infinity) { minX = 0; maxX = 100; minY = 0; maxY = 100; }

    const padX = (maxX - minX) * 0.1 || 1;
    const padY = (maxY - minY) * 0.1 || 1;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) xScale.setDomain([minX - padX, maxX + padX]);
    if (yScale) yScale.setDomain([minY - padY, maxY + padY]);
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

    const seriesList = this.options.data.series ?? [];
    const colors = theme.seriesColors;
    const minR = 4;
    const maxR = 24;

    let minSize = Infinity, maxSize = -Infinity;
    seriesList.forEach(s => {
      s.data.forEach(p => {
        const sz = p.size ?? p.value ?? 10;
        if (sz < minSize) minSize = sz;
        if (sz > maxSize) maxSize = sz;
      });
    });
    if (minSize === Infinity) { minSize = 1; maxSize = 10; }

    seriesList.forEach((s, sIdx) => {
      if (s.visible === false) return;
      const color = s.color ?? colors[sIdx % colors.length] ?? '#2563eb';

      for (const p of s.data) {
        const xVal = typeof p.x === 'number' ? p.x : 0;
        const yVal = p.y ?? 0;
        const sz = p.size ?? p.value ?? 10;
        const t = maxSize === minSize ? 0.5 : (sz - minSize) / (maxSize - minSize);
        const radius = minR + t * (maxR - minR);

        const cx = xScale.convert(xVal);
        const cy = yScale.convert(yVal);

        const bubble = renderer.circle(cx, cy, radius, {
          fill: color,
          stroke: theme.background,
          strokeWidth: 1.5,
          opacity: 0.65
        });
        this.renderedElements.push(bubble);
      }
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
