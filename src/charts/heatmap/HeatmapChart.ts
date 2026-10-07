import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';

export interface HeatmapPoint {
  x: number | string;
  y: number | string;
  value: number;
}

export interface HeatmapChartOptions extends ChartOptions {
  type: 'heatmap';
  heatmap?: {
    colorRange?: [string, string];
    showValues?: boolean;
  };
}

export class HeatmapChart extends Chart {
  private renderedElements: RenderElement[] = [];

  constructor(options: HeatmapChartOptions) {
    super(options);
  }

  private interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple hex color interpolation
    const parseHex = (hex: string) => {
      const clean = hex.replace('#', '');
      return {
        r: parseInt(clean.substring(0, 2), 16) || 0,
        g: parseInt(clean.substring(2, 4), 16) || 0,
        b: parseInt(clean.substring(4, 6), 16) || 0
      };
    };

    const c1 = parseHex(color1);
    const c2 = parseHex(color2);

    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;
    const { plot } = bounds;

    const data = this.options.data;
    const series = data.series?.[0];
    const points = (series?.data ?? data.data ?? []) as HeatmapPoint[];
    if (points.length === 0) return;

    // Collect distinct X and Y labels
    const xLabels = Array.from(new Set(points.map(p => String(p.x))));
    const yLabels = Array.from(new Set(points.map(p => String(p.y))));

    let minVal = Infinity;
    let maxVal = -Infinity;
    points.forEach(p => {
      if (p.value < minVal) minVal = p.value;
      if (p.value > maxVal) maxVal = p.value;
    });
    if (minVal === Infinity) { minVal = 0; maxVal = 100; }
    if (minVal === maxVal) maxVal = minVal + 1;

    const cellW = plot.width / xLabels.length;
    const cellH = plot.height / yLabels.length;

    // Render axis labels
    xLabels.forEach((label, i) => {
      renderer.text(plot.x + i * cellW + cellW / 2, plot.y + plot.height + 15, label, {
        fill: theme.text,
        fontSize: 11,
        textAnchor: 'middle',
        dominantBaseline: 'hanging'
      });
    });

    yLabels.forEach((label, j) => {
      renderer.text(plot.x - 10, plot.y + j * cellH + cellH / 2, label, {
        fill: theme.text,
        fontSize: 11,
        textAnchor: 'end',
        dominantBaseline: 'middle'
      });
    });

    const lowColor = '#e0f2fe';
    const highColor = '#1d4ed8';

    points.forEach(p => {
      const xIdx = xLabels.indexOf(String(p.x));
      const yIdx = yLabels.indexOf(String(p.y));
      if (xIdx === -1 || yIdx === -1) return;

      const t = Math.max(0, Math.min(1, (p.value - minVal) / (maxVal - minVal)));
      const fill = this.interpolateColor(lowColor, highColor, t);

      const cellX = plot.x + xIdx * cellW + 1;
      const cellY = plot.y + yIdx * cellH + 1;
      const w = Math.max(0, cellW - 2);
      const h = Math.max(0, cellH - 2);

      const rect = renderer.rect(cellX, cellY, w, h, { fill, rx: 3, ry: 3 });
      this.renderedElements.push(rect);

      // Cell value text
      const text = renderer.text(cellX + w / 2, cellY + h / 2, String(Math.round(p.value)), {
        fill: t > 0.5 ? '#ffffff' : '#1e293b',
        fontSize: 11,
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
