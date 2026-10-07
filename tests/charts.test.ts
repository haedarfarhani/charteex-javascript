import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createChart } from '../src/index';

describe('Chart Engine and Chart Types', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should create and render a line chart', () => {
    const chart = createChart(container, {
      type: 'line',
      data: {
        series: [
          { name: 'S1', data: [{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 15 }] }
        ]
      }
    });

    chart.render();
    expect(container.querySelector('svg')).not.toBeNull();
    chart.destroy();
  });

  it('should create and render a bar chart', () => {
    const chart = createChart(container, {
      type: 'bar',
      data: {
        series: [
          { name: 'Sales', data: [{ x: 'Jan', y: 100 }, { x: 'Feb', y: 120 }] }
        ]
      }
    });

    chart.render();
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
    chart.destroy();
  });

  it('should create and render an area chart', () => {
    const chart = createChart(container, {
      type: 'area',
      data: {
        series: [
          { name: 'Growth', data: [{ x: 0, y: 10 }, { x: 1, y: 40 }, { x: 2, y: 35 }] }
        ]
      }
    });

    chart.render();
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(1);
    chart.destroy();
  });

  it('should create and render a pie chart', () => {
    const chart = createChart(container, {
      type: 'pie',
      data: {
        data: [
          { category: 'A', value: 40 },
          { category: 'B', value: 60 }
        ]
      }
    });

    chart.render();
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(2);
    chart.destroy();
  });

  it('should create and render a donut chart with center text', () => {
    const chart = createChart(container, {
      type: 'donut',
      donut: { centerText: '100%', centerSubtext: 'Total' },
      data: {
        data: [
          { category: 'A', value: 50 },
          { category: 'B', value: 50 }
        ]
      }
    });

    chart.render();
    const texts = Array.from(container.querySelectorAll('text')).map(t => t.textContent);
    expect(texts).toContain('100%');
    expect(texts).toContain('Total');
    chart.destroy();
  });

  it('should create and render a radar chart', () => {
    const chart = createChart(container, {
      type: 'radar',
      data: {
        series: [
          {
            name: 'Stats',
            data: [
              { category: 'Speed', value: 80 },
              { category: 'Power', value: 90 },
              { category: 'Stamina', value: 70 }
            ]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    chart.destroy();
  });

  it('should create and render a scatter chart', () => {
    const chart = createChart(container, {
      type: 'scatter',
      data: {
        series: [
          {
            name: 'Cluster',
            data: [
              { x: 5, y: 12 },
              { x: 15, y: 24 }
            ]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
    chart.destroy();
  });

  it('should create and render a bubble chart', () => {
    const chart = createChart(container, {
      type: 'bubble',
      data: {
        series: [
          {
            name: 'Bubbles',
            data: [
              { x: 10, y: 20, size: 50 },
              { x: 30, y: 40, size: 100 }
            ]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
    chart.destroy();
  });

  it('should create and render a histogram chart', () => {
    const chart = createChart(container, {
      type: 'histogram',
      data: {
        series: [
          {
            name: 'Dist',
            data: Array.from({ length: 50 }, (_, i) => ({ y: (i % 10) * 5 }))
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    chart.destroy();
  });

  it('should create and render a heatmap chart', () => {
    const chart = createChart(container, {
      type: 'heatmap',
      data: {
        data: [
          { x: 'Mon', y: 'Morning', value: 20 },
          { x: 'Mon', y: 'Evening', value: 80 },
          { x: 'Tue', y: 'Morning', value: 45 },
          { x: 'Tue', y: 'Evening', value: 65 }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(4);
    chart.destroy();
  });

  it('should create and render a gauge chart', () => {
    const chart = createChart(container, {
      type: 'gauge',
      data: {
        series: [{ data: [{ value: 75 }] }]
      }
    });

    chart.render();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    chart.destroy();
  });

  it('should create and render a funnel chart', () => {
    const chart = createChart(container, {
      type: 'funnel',
      data: {
        data: [
          { category: 'Visits', value: 1000 },
          { category: 'Signups', value: 400 },
          { category: 'Paid', value: 100 }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('path').length).toBe(3);
    chart.destroy();
  });

  it('should create and render a boxplot chart', () => {
    const chart = createChart(container, {
      type: 'boxplot',
      data: {
        series: [
          {
            name: 'Group A',
            data: [{ values: [10, 20, 25, 40, 50, 60, 80] }]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    chart.destroy();
  });

  it('should create and render a candlestick chart', () => {
    const chart = createChart(container, {
      type: 'candlestick',
      data: {
        series: [
          {
            name: 'BTC/USD',
            data: [
              { time: 1700000000000, open: 100, high: 110, low: 95, close: 105, volume: 500 }
            ]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelector('svg')).not.toBeNull();
    chart.destroy();
  });

  it('should create and render a composite financial chart with volume and SMA', () => {
    const chart = createChart(container, {
      type: 'candlestick',
      volumePanel: true,
      indicators: [{ type: 'sma', period: 2, color: '#f59e0b' }],
      data: {
        series: [
          {
            name: 'ETH/USD',
            data: [
              { time: 1700000000000, open: 100, high: 110, low: 95, close: 105, volume: 500 },
              { time: 1700000060000, open: 105, high: 115, low: 100, close: 110, volume: 800 },
              { time: 1700000120000, open: 110, high: 120, low: 108, close: 115, volume: 600 }
            ]
          }
        ]
      }
    });

    chart.render();
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(3);
    chart.destroy();
  });

  it('should update data and emit datachange event', () => {
    const chart = createChart(container, {
      type: 'line',
      data: {
        series: [{ name: 'S1', data: [{ x: 0, y: 10 }] }]
      }
    });

    chart.render();

    let eventEmitted = false;
    chart.on('datachange', () => {
      eventEmitted = true;
    });

    chart.setData({
      series: [{ name: 'S1', data: [{ x: 0, y: 50 }, { x: 1, y: 80 }] }]
    });

    expect(eventEmitted).toBe(true);
    chart.destroy();
  });

  it('should export SVG string', async () => {
    const chart = createChart(container, {
      type: 'line',
      renderer: 'svg',
      data: {
        series: [{ name: 'S1', data: [{ x: 0, y: 10 }] }]
      }
    });

    chart.render();
    const svgExport = await chart.export('svg');
    expect(typeof svgExport).toBe('string');
    expect(svgExport).toContain('<svg');
    chart.destroy();
  });
});
