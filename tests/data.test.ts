import { describe, it, expect } from 'vitest';
import { DataAdapter } from '../src/data/DataAdapter';

describe('DataAdapter', () => {
  it('should normalize plain array data into series', () => {
    const raw = {
      data: [{ x: 1, y: 10 }, { x: 2, y: 20 }]
    };
    const normalized = DataAdapter.normalize(raw);
    expect(normalized.series.length).toBe(1);
    expect(normalized.series[0]?.name).toBe('Series 1');
    expect(normalized.series[0]?.data.length).toBe(2);
  });

  it('should handle NaN, Infinity, and nulls safely without throwing', () => {
    const raw = {
      data: [
        { x: 1, y: NaN },
        { x: 2, y: Infinity },
        { x: 3, y: -Infinity },
        { x: 4, y: 50 }
      ]
    };
    const normalized = DataAdapter.normalize(raw);
    const pts = normalized.series[0]?.data ?? [];
    expect(pts[0]?.y).toBe(0);
    expect(pts[1]?.y).toBe(0);
    expect(pts[2]?.y).toBe(0);
    expect(pts[3]?.y).toBe(50);
  });

  it('should perform LTTB decimation correctly', () => {
    const original = Array.from({ length: 100 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 5) * 10
    }));
    const decimated = DataAdapter.decimateLTTB(original, 20);
    expect(decimated.length).toBe(20);
    expect(decimated[0]?.x).toBe(0);
    expect(decimated[decimated.length - 1]?.x).toBe(99);
  });
});
