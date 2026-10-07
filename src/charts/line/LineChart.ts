import type { ChartOptions, DataPoint, ChartBounds, Theme, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import type { Scale } from '../../scales/Scale';
import { Axis } from '../../axes/Axis';

export interface LineChartOptions extends ChartOptions {
  type: 'line';
  line?: {
    smooth?: boolean;
    showPoints?: boolean;
    pointRadius?: number;
    pointHoverRadius?: number;
    fill?: boolean;
    fillOpacity?: number;
    strokeWidth?: number;
  };
}

export class LineChart extends Chart {
  private lineOptions: LineChartOptions['line'];
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private seriesElements: Map<number, RenderElement[]> = new Map();

  constructor(options: LineChartOptions) {
    super(options);
    this.lineOptions = {
      smooth: options.line?.smooth ?? true,
      showPoints: options.line?.showPoints ?? true,
      pointRadius: options.line?.pointRadius ?? 4,
      pointHoverRadius: options.line?.pointHoverRadius ?? 6,
      fill: options.line?.fill ?? false,
      fillOpacity: options.line?.fillOpacity ?? 0.1,
      strokeWidth: options.line?.strokeWidth ?? 2
    };
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    if (!data || !data.series) return;

    const allPoints: DataPoint[] = [];
    for (const series of data.series) {
      allPoints.push(...series.data);
    }

    if (allPoints.length === 0) return;

    const xValues = allPoints.map(p => {
      const x = p.x;
      if (typeof x === 'number') return x;
      if (x instanceof Date) return x.getTime();
      if (typeof x === 'string') return new Date(x).getTime();
      return 0;
    });
    const yValues = allPoints.map(p => p.y ?? 0);

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale) {
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      xScale.setDomain([xMin, xMax]);
    }

    if (yScale) {
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      const padding = (yMax - yMin) * 0.1;
      yScale.setDomain([yMin - padding, yMax + padding]);
    }
  }

  override render(): void {
    super.render();
    const { renderer, bounds, theme } = this.getRenderContext();
    this.renderAxes(renderer, bounds, theme);
    this.renderSeries(renderer, bounds, theme);
  }

  private getRenderContext() {
    return {
      renderer: this['renderer'] as Renderer,
      bounds: this.getBounds(),
      theme: this.getTheme()
    };
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

  private renderSeries(renderer: Renderer, bounds: ChartBounds, theme: Theme): void {
    const data = this.options.data;
    if (!data || !data.series) return;

    const xScale = this.getScale('x');
    const yScale = this.getScale('y');
    if (!xScale || !yScale) return;

    const seriesColors = theme.seriesColors;

    for (let i = 0; i < data.series.length; i++) {
      const series = data.series[i];
      if (!series) continue;
      if (!series.visible && series.visible !== undefined) continue;
      if (!series.data || series.data.length === 0) continue;

      const color = (series.color ?? seriesColors[i % seriesColors.length]) as string;
      const points = this.transformPoints(series.data, xScale, yScale);

      if (points.length === 0) continue;

      const elements = this.renderLineSeries(renderer, points, color, theme, i);
      this.seriesElements.set(i, elements);
    }
  }

  private transformPoints(data: DataPoint[], xScale: Scale, yScale: Scale): { x: number; y: number; original: DataPoint }[] {
    return data.map((point, index) => ({
      x: xScale.convert(point.x ?? index),
      y: yScale.convert(point.y ?? 0),
      original: point
    }));
  }

  private renderLineSeries(
    renderer: Renderer,
    points: { x: number; y: number; original: DataPoint }[],
    color: string,
    theme: Theme,
    seriesIndex: number
  ): RenderElement[] {
    const elements: RenderElement[] = [];
    const lineOpts = this.lineOptions ?? {};
    const { smooth = true, showPoints = true, pointRadius = 4, fill = false, fillOpacity = 0.1, strokeWidth = 2 } = lineOpts;

    if (points.length < 2) return elements;

    const pathData = smooth ? this.createSmoothPath(points) : this.createStraightPath(points);

    const line = renderer.path(pathData, {
      stroke: color,
      strokeWidth,
      fill: 'none'
    });
    elements.push(line);

    if (fill) {
      const fillPath = this.createFillPath(points, pathData);
      const gradientId = `fill-gradient-${seriesIndex}-${Date.now()}`;
      const fillColor = renderer.createGradient(gradientId, [
        { offset: 0, color, opacity: fillOpacity },
        { offset: 1, color, opacity: 0 }
      ]);
      const fillElement = renderer.path(fillPath, {
        fill: fillColor,
        stroke: 'none'
      });
      elements.push(fillElement);
    }

    if (showPoints) {
      for (const point of points) {
        const circle = renderer.circle(point.x, point.y, pointRadius, {
          fill: color,
          stroke: theme.background,
          strokeWidth: 2
        });
        elements.push(circle);
      }
    }

    return elements;
  }

  private createStraightPath(points: { x: number; y: number }[]): string {
    const firstPoint = points[0];
    if (!firstPoint) return '';
    let path = `M ${firstPoint.x} ${firstPoint.y}`;
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      if (!point) continue;
      path += ` L ${point.x} ${point.y}`;
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

  private createFillPath(points: { x: number; y: number }[], linePath: string): string {
    const { plot } = this.getBounds();
    const bottomY = plot.y + plot.height;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    if (!firstPoint || !lastPoint) return linePath;

    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
  }

  override destroy(): void {
    for (const elements of this.seriesElements.values()) {
      for (const element of elements) {
        element.destroy();
      }
    }
    this.seriesElements.clear();
    this.axisX?.destroy();
    this.axisY?.destroy();
    super.destroy();
  }
}

export function createLineChart(options: LineChartOptions): LineChart {
  return new LineChart(options);
}