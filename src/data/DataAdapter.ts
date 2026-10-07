import type { ChartData, Series, DataPoint } from '../core/ChartConfig';
import { toTimestamp } from '../utilities/date';

export class DataAdapter {
  static normalize(inputData: ChartData): { series: Series[]; categories: string[] } {
    const categories: string[] = inputData.categories ? [...inputData.categories] : [];

    let series: Series[] = [];

    if (inputData.series && Array.isArray(inputData.series)) {
      series = inputData.series.map((s, sIdx) => ({
        ...s,
        name: s.name ?? `Series ${sIdx + 1}`,
        data: this.normalizePoints(s.data)
      }));
    } else if (inputData.data && Array.isArray(inputData.data)) {
      series = [
        {
          name: 'Series 1',
          data: this.normalizePoints(inputData.data)
        }
      ];
    }

    if (categories.length === 0) {
      const firstSeries = series[0];
      if (firstSeries && firstSeries.data.length > 0) {
        for (const pt of firstSeries.data) {
          if (pt.category) {
            categories.push(pt.category);
          } else if (typeof pt.x === 'string') {
            categories.push(pt.x);
          }
        }
      }
    }

    return { series, categories };
  }

  static normalizePoints(rawPoints: DataPoint[]): DataPoint[] {
    if (!Array.isArray(rawPoints)) return [];

    return rawPoints
      .filter((p) => p !== null && p !== undefined && typeof p === 'object')
      .map((p, index) => {
        const point: DataPoint = { ...p };

        // Handle NaN/null in numeric values
        if (typeof point.y === 'number') {
          point.y = isNaN(point.y) || !isFinite(point.y) ? 0 : point.y;
        } else if (typeof point.value === 'number') {
          point.value = isNaN(point.value) || !isFinite(point.value) ? 0 : point.value;
          point.y = point.value;
        }

        if (point.x === undefined && point.category) {
          point.x = point.category;
        } else if (point.x === undefined) {
          point.x = index;
        }

        // Handle financial OHLC fields
        if (point.open !== undefined) point.open = Number(point.open) || 0;
        if (point.high !== undefined) point.high = Number(point.high) || 0;
        if (point.low !== undefined) point.low = Number(point.low) || 0;
        if (point.close !== undefined) point.close = Number(point.close) || 0;
        if (point.volume !== undefined) point.volume = Number(point.volume) || 0;
        if (point.time !== undefined) point.time = toTimestamp(point.time);

        return point;
      });
  }

  /**
   * Largest-Triangle-Three-Buckets (LTTB) decimation algorithm for high-performance large datasets
   */
  static decimateLTTB(points: { x: number; y: number }[], threshold: number): { x: number; y: number }[] {
    if (threshold >= points.length || threshold <= 2) {
      return points;
    }

    const sampled: { x: number; y: number }[] = [];
    const every = (points.length - 2) / (threshold - 2);

    let a = 0;
    const firstPoint = points[a];
    if (!firstPoint) return points;
    sampled.push(firstPoint);

    for (let i = 0; i < threshold - 2; i++) {
      let avgX = 0;
      let avgY = 0;
      const avgRangeStart = Math.floor((i + 1) * every) + 1;
      let avgRangeEnd = Math.floor((i + 2) * every) + 1;
      avgRangeEnd = avgRangeEnd < points.length ? avgRangeEnd : points.length;

      const avgRangeLength = avgRangeEnd - avgRangeStart;
      for (let j = avgRangeStart; j < avgRangeEnd; j++) {
        const pt = points[j];
        if (pt) {
          avgX += pt.x;
          avgY += pt.y;
        }
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      const rangeOffs = Math.floor(i * every) + 1;
      const rangeTo = Math.floor((i + 1) * every) + 1;

      const pointA = points[a];
      if (!pointA) continue;

      let maxArea = -1;
      let nextA = rangeOffs;

      for (let k = rangeOffs; k < rangeTo; k++) {
        const pt = points[k];
        if (!pt) continue;
        const area = Math.abs(
          (pointA.x - avgX) * (pt.y - pointA.y) - (pointA.x - pt.x) * (avgY - pointA.y)
        ) * 0.5;
        if (area > maxArea) {
          maxArea = area;
          nextA = k;
        }
      }

      const selected = points[nextA];
      if (selected) {
        sampled.push(selected);
      }
      a = nextA;
    }

    const lastPoint = points[points.length - 1];
    if (lastPoint) {
      sampled.push(lastPoint);
    }
    return sampled;
  }
}
