import { describe, it, expect } from 'vitest';
import { LinearScale, TimeScale, CategoryScale, LogScale } from '../src/scales/Scale';

describe('LinearScale', () => {
  it('should convert values correctly', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    expect(scale.convert(0)).toBe(0);
    expect(scale.convert(50)).toBe(250);
    expect(scale.convert(100)).toBe(500);
  });

  it('should invert values correctly', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    expect(scale.invert(0)).toBe(0);
    expect(scale.invert(250)).toBe(50);
    expect(scale.invert(500)).toBe(100);
  });

  it('should generate ticks', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    const ticks = scale.getTicks(5);
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks[0]).toHaveProperty('value');
    expect(ticks[0]).toHaveProperty('label');
  });

  it('should handle zoom', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    scale.zoom(2, 250);
    expect(scale.getRange()[0]).toBeLessThan(0);
    expect(scale.getRange()[1]).toBeGreaterThan(500);
  });

  it('should handle pan', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    scale.pan(100, 0);
    expect(scale.getRange()[0]).toBe(100);
    expect(scale.getRange()[1]).toBe(600);
  });

  it('should reset to original domain and range', () => {
    const scale = new LinearScale({ domain: [0, 100], range: [0, 500] });
    scale.zoom(2);
    scale.pan(100, 0);
    scale.reset();
    expect(scale.getDomain()).toEqual([0, 100]);
    expect(scale.getRange()).toEqual([0, 500]);
  });
});

describe('TimeScale', () => {
  it('should convert dates correctly', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    const scale = new TimeScale({ domain: [start, end], range: [0, 500] });
    
    const mid = new Date('2024-07-01');
    const result = scale.convert(mid);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(500);
  });

  it('should invert to dates', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    const scale = new TimeScale({ domain: [start, end], range: [0, 500] });
    
    const date = scale.invert(250);
    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(date.getTime()).toBeLessThanOrEqual(end.getTime());
  });

  it('should generate ticks', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    const scale = new TimeScale({ domain: [start, end], range: [0, 500] });
    const ticks = scale.getTicks(5);
    expect(ticks.length).toBeGreaterThan(0);
  });
});

describe('CategoryScale', () => {
  it('should convert categories correctly', () => {
    const scale = new CategoryScale({ domain: ['A', 'B', 'C'], range: [0, 300] });
    expect(scale.convert('A')).toBe(50);
    expect(scale.convert('B')).toBe(150);
    expect(scale.convert('C')).toBe(250);
  });

  it('should invert to categories', () => {
    const scale = new CategoryScale({ domain: ['A', 'B', 'C'], range: [0, 300] });
    expect(scale.invert(50)).toBe('A');
    expect(scale.invert(150)).toBe('B');
    expect(scale.invert(250)).toBe('C');
  });

  it('should return band width', () => {
    const scale = new CategoryScale({ domain: ['A', 'B', 'C'], range: [0, 300] });
    expect(scale.getBandWidth()).toBe(100);
  });

  it('should generate ticks', () => {
    const scale = new CategoryScale({ domain: ['A', 'B', 'C'], range: [0, 300] });
    const ticks = scale.getTicks();
    expect(ticks.length).toBe(3);
    expect(ticks[0].value).toBe('A');
  });
});

describe('LogScale', () => {
  it('should convert log values correctly', () => {
    const scale = new LogScale({ domain: [1, 1000], range: [0, 500] });
    expect(scale.convert(1)).toBe(0);
    expect(scale.convert(1000)).toBe(500);
    expect(scale.convert(10)).toBeGreaterThan(0);
    expect(scale.convert(10)).toBeLessThan(500);
  });

  it('should invert log values', () => {
    const scale = new LogScale({ domain: [1, 1000], range: [0, 500] });
    expect(scale.invert(0)).toBe(1);
    expect(scale.invert(500)).toBeCloseTo(1000, 0);
  });

  it('should generate ticks', () => {
    const scale = new LogScale({ domain: [1, 10000], range: [0, 500] });
    const ticks = scale.getTicks(5);
    expect(ticks.length).toBeGreaterThan(0);
  });
});