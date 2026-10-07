import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { describeArc } from '../../utilities/geometry';

export interface PolarChartOptions extends ChartOptions {
  type: 'polar';
  polar?: {
    rings?: number;
    showGrid?: boolean;
  };
}

export class PolarChart extends Chart {
  private renderedElements: RenderElement[] = [];

  constructor(options: PolarChartOptions) {
    super(options);
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;
    const { plot } = bounds;

    const data = this.options.data;
    const series = data.series?.[0];
    const items = series?.data ?? data.data ?? [];
    if (items.length === 0) return;

    const cx = plot.x + plot.width / 2;
    const cy = plot.y + plot.height / 2;
    const maxRadius = Math.min(plot.width, plot.height) / 2 * 0.85;

    let maxVal = 0;
    items.forEach(it => {
      const v = it.y ?? (it.value as number) ?? 0;
      if (v > maxVal) maxVal = v;
    });
    if (maxVal <= 0) maxVal = 100;

    // Draw circular grid rings
    const rings = 4;
    for (let r = 1; r <= rings; r++) {
      const ringRadius = (maxRadius * r) / rings;
      const c = renderer.circle(cx, cy, ringRadius, {
        fill: 'none',
        stroke: theme.grid,
        strokeWidth: 1
      });
      this.renderedElements.push(c);
    }

    const count = items.length;
    const angleStep = (Math.PI * 2) / count;
    const colors = theme.seriesColors;

    items.forEach((item, idx) => {
      const val = Math.max(0, item.y ?? (item.value as number) ?? 0);
      const radius = (val / maxVal) * maxRadius;
      const startAngle = -Math.PI / 2 + idx * angleStep;
      const endAngle = startAngle + angleStep;

      const pathData = describeArc({
        cx,
        cy,
        innerRadius: 0,
        outerRadius: radius,
        startAngle: startAngle + 0.02,
        endAngle: endAngle - 0.02
      });

      const color = (item.color as string) ?? colors[idx % colors.length] ?? '#2563eb';
      const wedge = renderer.path(pathData, {
        fill: color,
        stroke: theme.background,
        strokeWidth: 1.5,
        opacity: 0.85
      });
      this.renderedElements.push(wedge);
    });
  }

  override destroy(): void {
    for (const el of this.renderedElements) {
      el.destroy();
    }
    this.renderedElements = [];
    super.destroy();
  }
}
