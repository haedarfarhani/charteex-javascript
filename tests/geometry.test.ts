import { describe, it, expect } from 'vitest';
import { describeArc, polarToCartesian, computeBoxPlotStats } from '../src/utilities/geometry';

describe('Geometry Utilities', () => {
  it('should convert polar to cartesian coordinates', () => {
    const center = { cx: 100, cy: 100 };
    // Angle 0 is (cx + r, cy)
    const p0 = polarToCartesian(center.cx, center.cy, 50, 0);
    expect(p0.x).toBeCloseTo(150);
    expect(p0.y).toBeCloseTo(100);

    // Angle PI/2 is (cx, cy + r)
    const p90 = polarToCartesian(center.cx, center.cy, 50, Math.PI / 2);
    expect(p90.x).toBeCloseTo(100);
    expect(p90.y).toBeCloseTo(150);
  });

  it('should describe pie arc path', () => {
    const arcPath = describeArc({
      cx: 100,
      cy: 100,
      innerRadius: 0,
      outerRadius: 50,
      startAngle: 0,
      endAngle: Math.PI / 2
    });
    expect(arcPath).toContain('M 100 100');
    expect(arcPath).toContain('A 50 50');
    expect(arcPath).toContain('Z');
  });

  it('should describe donut arc path with inner radius', () => {
    const donutPath = describeArc({
      cx: 100,
      cy: 100,
      innerRadius: 30,
      outerRadius: 50,
      startAngle: 0,
      endAngle: Math.PI / 2
    });
    expect(donutPath).toContain('M 150 100');
    expect(donutPath).toContain('A 50 50');
    expect(donutPath).toContain('A 30 30');
    expect(donutPath).toContain('Z');
  });

  it('should compute box plot statistics correctly', () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const stats = computeBoxPlotStats(data);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(100);
    expect(stats.median).toBe(55);
    expect(stats.q1).toBeCloseTo(32.5);
    expect(stats.q3).toBeCloseTo(77.5);
  });
});
