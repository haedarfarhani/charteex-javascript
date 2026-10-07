import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { polarToCartesian } from '../../utilities/geometry';

export interface RadarChartOptions extends ChartOptions {
  type: 'radar';
  radar?: {
    levels?: number;
    showPoints?: boolean;
    fillOpacity?: number;
  };
}

export class RadarChart extends Chart {
  private radarOptions: NonNullable<RadarChartOptions['radar']>;
  private renderedElements: RenderElement[] = [];

  constructor(options: RadarChartOptions) {
    super(options);
    this.radarOptions = {
      levels: options.radar?.levels ?? 4,
      showPoints: options.radar?.showPoints ?? true,
      fillOpacity: options.radar?.fillOpacity ?? 0.25
    };
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;
    const { plot } = bounds;

    const data = this.options.data;
    const seriesList = data.series ?? [];
    if (seriesList.length === 0) return;

    const firstSeries = seriesList[0];
    if (!firstSeries || firstSeries.data.length < 3) return;

    const numAxes = firstSeries.data.length;
    const cx = plot.x + plot.width / 2;
    const cy = plot.y + plot.height / 2;
    const maxRadius = Math.min(plot.width, plot.height) / 2 * 0.8;

    // Find max value across all series
    let maxVal = 0;
    seriesList.forEach(s => {
      s.data.forEach(p => {
        const val = p.y ?? (p.value as number) ?? 0;
        if (val > maxVal) maxVal = val;
      });
    });
    if (maxVal <= 0) maxVal = 100;

    const angleStep = (Math.PI * 2) / numAxes;

    // Draw concentric level polygons
    const levels = this.radarOptions.levels ?? 4;
    for (let lvl = 1; lvl <= levels; lvl++) {
      const lvlRadius = (maxRadius * lvl) / levels;
      let path = '';
      for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const pt = polarToCartesian(cx, cy, lvlRadius, angle);
        path += (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
      }
      path += ' Z';
      const gridEl = renderer.path(path, {
        stroke: theme.grid,
        strokeWidth: 1,
        fill: 'none'
      });
      this.renderedElements.push(gridEl);
    }

    // Draw axis radial spokes and category labels
    for (let i = 0; i < numAxes; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const pt = polarToCartesian(cx, cy, maxRadius, angle);
      const spoke = renderer.line(cx, cy, pt.x, pt.y, {
        stroke: theme.axis,
        strokeWidth: 1
      });
      this.renderedElements.push(spoke);

      const labelPt = polarToCartesian(cx, cy, maxRadius + 16, angle);
      const catName = (firstSeries.data[i]?.category as string) || (firstSeries.data[i]?.x as string) || `Axis ${i + 1}`;
      const textEl = renderer.text(labelPt.x, labelPt.y, catName, {
        fill: theme.text,
        fontSize: 11,
        textAnchor: 'middle',
        dominantBaseline: 'middle'
      });
      this.renderedElements.push(textEl);
    }

    // Draw series polygons
    const colors = theme.seriesColors;
    seriesList.forEach((series, sIdx) => {
      if (series.visible === false) return;
      const color = series.color ?? colors[sIdx % colors.length] ?? '#2563eb';
      let path = '';
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const val = series.data[i]?.y ?? (series.data[i]?.value as number) ?? 0;
        const r = (Math.max(0, val) / maxVal) * maxRadius;
        const pt = polarToCartesian(cx, cy, r, angle);
        points.push(pt);
        path += (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
      }
      path += ' Z';

      const polyEl = renderer.path(path, {
        fill: color,
        stroke: color,
        strokeWidth: 2,
        opacity: this.radarOptions.fillOpacity ?? 0.25
      });
      this.renderedElements.push(polyEl);

      const outlineEl = renderer.path(path, {
        fill: 'none',
        stroke: color,
        strokeWidth: 2
      });
      this.renderedElements.push(outlineEl);

      if (this.radarOptions.showPoints) {
        points.forEach(pt => {
          const c = renderer.circle(pt.x, pt.y, 3.5, {
            fill: color,
            stroke: theme.background,
            strokeWidth: 1.5
          });
          this.renderedElements.push(c);
        });
      }
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
