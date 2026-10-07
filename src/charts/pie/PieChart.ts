import type { ChartOptions, Theme, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { describeArc, polarToCartesian } from '../../utilities/geometry';

export interface PieChartOptions extends ChartOptions {
  type: 'pie';
  pie?: {
    innerRadiusRatio?: number;
    padAngle?: number;
    showLabels?: boolean;
  };
}

export class PieChart extends Chart {
  protected innerRadiusRatio = 0;
  protected padAngle = 0.02;
  protected showLabels = true;
  private renderedElements: RenderElement[] = [];

  constructor(options: PieChartOptions) {
    super(options);
    if (options.pie) {
      if (options.pie.innerRadiusRatio !== undefined) this.innerRadiusRatio = options.pie.innerRadiusRatio;
      if (options.pie.padAngle !== undefined) this.padAngle = options.pie.padAngle;
      if (options.pie.showLabels !== undefined) this.showLabels = options.pie.showLabels;
    }
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;

    this.renderSlices(renderer, bounds.plot, theme);
  }

  protected renderSlices(renderer: Renderer, plot: { x: number; y: number; width: number; height: number }, theme: Theme): void {
    const data = this.options.data;
    const series = data.series?.[0];
    const items = series?.data ?? data.data ?? [];
    if (items.length === 0) return;

    const total = items.reduce((sum, item) => sum + Math.max(0, item.y ?? (item.value as number) ?? 0), 0);
    if (total <= 0) return;

    const cx = plot.x + plot.width / 2;
    const cy = plot.y + plot.height / 2;
    const radius = Math.min(plot.width, plot.height) / 2 * 0.85;
    const innerRadius = radius * this.innerRadiusRatio;

    let currentAngle = -Math.PI / 2;
    const colors = theme.seriesColors;

    items.forEach((item, idx) => {
      const val = Math.max(0, item.y ?? (item.value as number) ?? 0);
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = currentAngle + sliceAngle;

      if (sliceAngle > 0.001) {
        const pathData = describeArc({
          cx,
          cy,
          innerRadius,
          outerRadius: radius,
          startAngle: currentAngle + (this.padAngle / 2),
          endAngle: endAngle - (this.padAngle / 2)
        });

        const color = (item.color as string) ?? colors[idx % colors.length] ?? '#2563eb';
        const sliceEl = renderer.path(pathData, {
          fill: color,
          stroke: theme.background,
          strokeWidth: 2
        });
        this.renderedElements.push(sliceEl);

        // Labels
        if (this.showLabels && sliceAngle > 0.15) {
          const midAngle = currentAngle + sliceAngle / 2;
          const labelDist = radius * 0.7;
          const labelPos = polarToCartesian(cx, cy, labelDist, midAngle);
          const percent = `${((val / total) * 100).toFixed(1)}%`;

          const textEl = renderer.text(labelPos.x, labelPos.y, percent, {
            fill: '#ffffff',
            fontSize: 11,
            fontWeight: 'bold',
            textAnchor: 'middle',
            dominantBaseline: 'middle'
          });
          this.renderedElements.push(textEl);
        }
      }

      currentAngle = endAngle;
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
