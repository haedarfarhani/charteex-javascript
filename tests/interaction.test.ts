import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createChart,
  createWatermarkPlugin,
  createThresholdPlugin,
  DarkTheme,
  LightTheme
} from '../src/index';

describe('Interactions, Themes, Plugins, and Accessibility', () => {
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

  it('should apply accessibility attributes and accessible summary', () => {
    const chart = createChart(container, {
      type: 'line',
      accessibility: {
        enabled: true,
        label: 'Revenue 2026',
        description: 'Quarterly financial revenue'
      },
      data: {
        series: [{ name: 'Revenue', data: [{ x: 1, y: 100 }, { x: 2, y: 200 }] }]
      }
    });

    chart.render();
    expect(container.getAttribute('role')).toBe('img');
    expect(container.getAttribute('aria-label')).toBe('Revenue 2026');
    const srOnly = container.querySelector('.smart-chart-sr-only');
    expect(srOnly).not.toBeNull();
    expect(srOnly?.innerHTML).toContain('Quarterly financial revenue');
    chart.destroy();
  });

  it('should support themes and custom theme overrides', () => {
    const chart = createChart(container, {
      type: 'line',
      theme: 'dark',
      data: {
        series: [{ name: 'S1', data: [{ x: 0, y: 10 }] }]
      }
    });

    chart.render();
    expect(chart.getTheme().name).toBe('dark');
    expect(chart.getTheme().background).toBe(DarkTheme.background);

    chart.update({ theme: 'light' });
    expect(chart.getTheme().name).toBe('light');
    expect(chart.getTheme().background).toBe(LightTheme.background);
    chart.destroy();
  });

  it('should install and execute plugins', () => {
    const watermark = createWatermarkPlugin({ text: 'CONFIDENTIAL' });
    const threshold = createThresholdPlugin({ yValue: 50, label: 'Target' });

    const chart = createChart(container, {
      type: 'line',
      plugins: [watermark, threshold],
      data: {
        series: [{ name: 'S1', data: [{ x: 0, y: 10 }, { x: 1, y: 90 }] }]
      }
    });

    chart.render();
    const texts = Array.from(container.querySelectorAll('text')).map(t => t.textContent);
    expect(texts).toContain('CONFIDENTIAL');
    expect(texts).toContain('Target');
    chart.destroy();
  });

  it('should support programmatic zoom and pan', () => {
    const chart = createChart(container, {
      type: 'line',
      zoom: { enabled: true },
      pan: { enabled: true },
      data: {
        series: [{ name: 'S1', data: [{ x: 0, y: 10 }, { x: 10, y: 90 }] }]
      }
    });

    chart.render();
    let zoomFired = false;
    let panFired = false;

    chart.on('zoom', () => { zoomFired = true; });
    chart.on('pan', () => { panFired = true; });

    chart.zoom(1.5);
    expect(zoomFired).toBe(true);

    chart.pan(20, 0);
    expect(panFired).toBe(true);

    chart.resetZoom();
    chart.destroy();
  });
});
