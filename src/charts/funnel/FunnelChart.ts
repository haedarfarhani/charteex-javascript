import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { formatNumber } from '../../utilities/format';

export interface FunnelChartOptions extends ChartOptions {
  type: 'funnel';
  funnel?: {
    neckWidthRatio?: number;
    gap?: number;
  };
}

export class FunnelChart extends Chart {
  private renderedElements: RenderElement[] = [];

  constructor(options: FunnelChartOptions) {
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

    const maxVal = Math.max(...items.map(it => it.value ?? it.y ?? 0), 1);
    const count = items.length;
    const gap = 4;
    const stageH = (plot.height - (count - 1) * gap) / count;
    const colors = theme.seriesColors;

    const cx = plot.x + plot.width / 2;
    const maxHalfW = plot.width * 0.42;
    const minHalfW = maxHalfW * 0.2;

    items.forEach((item, idx) => {
      const curVal = item.value ?? item.y ?? 0;
      const nextVal = idx < count - 1 ? (items[idx + 1]?.value ?? items[idx + 1]?.y ?? curVal * 0.7) : curVal * 0.8;

      const topRatio = curVal / maxVal;
      const botRatio = nextVal / maxVal;

      const topHalfW = minHalfW + (maxHalfW - minHalfW) * topRatio;
      const botHalfW = minHalfW + (maxHalfW - minHalfW) * botRatio;

      const topY = plot.y + idx * (stageH + gap);
      const botY = topY + stageH;

      const path = `M ${cx - topHalfW} ${topY} L ${cx + topHalfW} ${topY} L ${cx + botHalfW} ${botY} L ${cx - botHalfW} ${botY} Z`;
      const color = (item.color as string) ?? colors[idx % colors.length] ?? '#2563eb';

      const trapezoid = renderer.path(path, { fill: color, opacity: 0.9 });
      this.renderedElements.push(trapezoid);

      // Stage label and count inside trapezoid
      const label = (item.category as string) || (item.x as string) || `Stage ${idx + 1}`;
      const midY = topY + stageH / 2;

      const text = renderer.text(cx, midY, `${label}: ${formatNumber(curVal)}`, {
        fill: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
      });
      this.renderedElements.push(text);
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
