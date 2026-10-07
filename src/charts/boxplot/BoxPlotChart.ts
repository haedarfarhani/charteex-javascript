import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';
import { computeBoxPlotStats, type BoxPlotStats } from '../../utilities/geometry';

export interface BoxPlotChartOptions extends ChartOptions {
  type: 'boxplot';
}

export class BoxPlotChart extends Chart {
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: BoxPlotChartOptions) {
    super(options);
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    const seriesList = data.series ?? [];
    if (seriesList.length === 0) return;

    let overallMin = Infinity;
    let overallMax = -Infinity;

    seriesList.forEach(s => {
      s.data.forEach(p => {
        const rawVals = Array.isArray(p.values) ? p.values : (typeof p.y === 'number' ? [p.y] : []);
        if (rawVals.length > 0) {
          const stats = computeBoxPlotStats(rawVals);
          if (stats.min < overallMin) overallMin = stats.min;
          if (stats.max > overallMax) overallMax = stats.max;
          for (const o of stats.outliers) {
            if (o < overallMin) overallMin = o;
            if (o > overallMax) overallMax = o;
          }
        } else if (typeof p.min === 'number' && typeof p.max === 'number') {
          if (p.min < overallMin) overallMin = p.min;
          if (p.max > overallMax) overallMax = p.max;
        }
      });
    });

    if (overallMin === Infinity) { overallMin = 0; overallMax = 100; }
    const pad = (overallMax - overallMin) * 0.1 || 1;

    const numCats = Math.max(...seriesList.map(s => s.data.length), 1);
    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) xScale.setDomain([0, numCats]);
    if (yScale) yScale.setDomain([overallMin - pad, overallMax + pad]);
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

    const { plot } = bounds;
    const series = this.options.data.series?.[0];
    if (!series || series.data.length === 0) return;

    const count = series.data.length;
    const colW = plot.width / count;
    const boxW = colW * 0.5;
    const color = series.color ?? theme.seriesColors[0] ?? '#2563eb';

    series.data.forEach((p, idx) => {
      let stats: BoxPlotStats;
      if (typeof p.min === 'number' && typeof p.max === 'number') {
        const minVal = p.min;
        const maxVal = p.max;
        const q1Val = typeof p.q1 === 'number' ? p.q1 : minVal;
        const q3Val = typeof p.q3 === 'number' ? p.q3 : maxVal;
        const medVal = typeof p.median === 'number' ? p.median : (minVal + maxVal) / 2;
        stats = { min: minVal, q1: q1Val, median: medVal, q3: q3Val, max: maxVal, outliers: [] };
      } else {
        const rawVals = Array.isArray(p.values) ? p.values : [10, 25, 50, 75, 90];
        stats = computeBoxPlotStats(rawVals);
      }

      const cx = plot.x + idx * colW + colW / 2;
      const yMin = yScale.convert(stats.min);
      const yQ1 = yScale.convert(stats.q1);
      const yMed = yScale.convert(stats.median);
      const yQ3 = yScale.convert(stats.q3);
      const yMax = yScale.convert(stats.max);

      // Whisker vertical lines
      const whiskerTop = renderer.line(cx, yQ3, cx, yMax, { stroke: color, strokeWidth: 1.5 });
      const whiskerBottom = renderer.line(cx, yQ1, cx, yMin, { stroke: color, strokeWidth: 1.5 });
      this.renderedElements.push(whiskerTop, whiskerBottom);

      // Caps
      const capTop = renderer.line(cx - boxW * 0.25, yMax, cx + boxW * 0.25, yMax, { stroke: color, strokeWidth: 1.5 });
      const capBot = renderer.line(cx - boxW * 0.25, yMin, cx + boxW * 0.25, yMin, { stroke: color, strokeWidth: 1.5 });
      this.renderedElements.push(capTop, capBot);

      // Box body
      const boxH = Math.max(1, Math.abs(yQ1 - yQ3));
      const boxY = Math.min(yQ1, yQ3);
      const box = renderer.rect(cx - boxW / 2, boxY, boxW, boxH, {
        fill: color,
        opacity: 0.35,
        stroke: color,
        strokeWidth: 1.5,
        rx: 2,
        ry: 2
      });
      this.renderedElements.push(box);

      // Median line
      const medLine = renderer.line(cx - boxW / 2, yMed, cx + boxW / 2, yMed, {
        stroke: color,
        strokeWidth: 2
      });
      this.renderedElements.push(medLine);

      // Outlier dots
      stats.outliers.forEach(outVal => {
        const outY = yScale.convert(outVal);
        const dot = renderer.circle(cx, outY, 3, { fill: '#ef4444' });
        this.renderedElements.push(dot);
      });
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
