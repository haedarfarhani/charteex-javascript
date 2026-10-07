import type { ChartOptions, ChartBounds, Theme, Renderer, RenderElement, DataPoint } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';

export interface AreaChartOptions extends ChartOptions {
  type: 'area';
  area?: {
    smooth?: boolean;
    fillOpacity?: number;
    strokeWidth?: number;
    showPoints?: boolean;
    stacked?: boolean;
  };
}

export class AreaChart extends Chart {
  private areaOptions: NonNullable<AreaChartOptions['area']>;
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: AreaChartOptions) {
    super(options);
    this.areaOptions = {
      smooth: options.area?.smooth ?? true,
      fillOpacity: options.area?.fillOpacity ?? 0.25,
      strokeWidth: options.area?.strokeWidth ?? 2,
      showPoints: options.area?.showPoints ?? false,
      stacked: options.area?.stacked ?? false
    };
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    if (!data || !data.series || data.series.length === 0) return;

    const allPoints: DataPoint[] = [];
    for (const s of data.series) {
      allPoints.push(...s.data);
    }
    if (allPoints.length === 0) return;

    const xValues = allPoints.map((p, i) => (typeof p.x === 'number' ? p.x : i));
    const yValues = allPoints.map(p => p.y ?? 0);

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) {
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      xScale.setDomain([minX, maxX]);
    }

    if (yScale) {
      const minY = Math.min(0, Math.min(...yValues));
      const maxY = Math.max(...yValues);
      const pad = (maxY - minY) * 0.1 || 1;
      yScale.setDomain([minY, maxY + pad]);
    }
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;

    this.renderAxes(renderer, bounds, theme);
    this.renderAreas(renderer, bounds, theme);
  }

  private renderAxes(renderer: Renderer, bounds: ChartBounds, theme: Theme): void {
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
  }

  private renderAreas(renderer: Renderer, bounds: ChartBounds, theme: Theme): void {
    const data = this.options.data;
    if (!data || !data.series) return;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');
    if (!xScale || !yScale) return;

    const seriesColors = theme.seriesColors;
    const baseZeroY = yScale.convert(0);

    data.series.forEach((series, sIdx) => {
      if (series.visible === false || !series.data || series.data.length < 2) return;

      const color = series.color ?? seriesColors[sIdx % seriesColors.length] ?? '#2563eb';
      const points = series.data.map((p, idx) => ({
        x: xScale.convert(typeof p.x === 'number' ? p.x : idx),
        y: yScale.convert(p.y ?? 0)
      }));

      const linePath = this.areaOptions.smooth ? this.createSmoothPath(points) : this.createStraightPath(points);
      const firstPt = points[0];
      const lastPt = points[points.length - 1];
      if (!firstPt || !lastPt) return;

      const fillPath = `${linePath} L ${lastPt.x} ${baseZeroY} L ${firstPt.x} ${baseZeroY} Z`;

      const gradientId = `area-gradient-${sIdx}-${Date.now()}`;
      const fillColor = renderer.createGradient(
        gradientId,
        [
          { offset: 0, color, opacity: this.areaOptions.fillOpacity ?? 0.3 },
          { offset: 1, color, opacity: 0.02 }
        ],
        '0%',
        '0%',
        '0%',
        '100%'
      );

      const areaEl = renderer.path(fillPath, { fill: fillColor, stroke: 'none' });
      this.renderedElements.push(areaEl);

      const lineEl = renderer.path(linePath, {
        stroke: color,
        strokeWidth: this.areaOptions.strokeWidth ?? 2,
        fill: 'none'
      });
      this.renderedElements.push(lineEl);

      if (this.areaOptions.showPoints) {
        points.forEach(pt => {
          const c = renderer.circle(pt.x, pt.y, 3.5, { fill: color, stroke: theme.background, strokeWidth: 1.5 });
          this.renderedElements.push(c);
        });
      }
    });
  }

  private createStraightPath(points: { x: number; y: number }[]): string {
    const firstPoint = points[0];
    if (!firstPoint) return '';
    let path = `M ${firstPoint.x} ${firstPoint.y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      if (p) path += ` L ${p.x} ${p.y}`;
    }
    return path;
  }

  private createSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 3) return this.createStraightPath(points);
    const firstPoint = points[0];
    if (!firstPoint) return '';
    let path = `M ${firstPoint.x} ${firstPoint.y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i > 0 ? i - 1 : i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      if (!p0 || !p1 || !p2 || !p3) continue;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
    }
    return path;
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
