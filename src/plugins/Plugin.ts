import type { ChartPlugin, ChartInstance, Renderer } from '../core/ChartConfig';
import type { Chart } from '../core/Chart';

export interface WatermarkOptions {
  text: string;
  color?: string;
  fontSize?: number;
  opacity?: number;
}

export function createWatermarkPlugin(options: WatermarkOptions): ChartPlugin {
  return {
    name: 'watermark',
    install(chartInstance: ChartInstance) {
      const chart = chartInstance as Chart;
      chart.on('render', () => {
        const bounds = chart.getBounds();
        const renderer = (chart as unknown as { renderer: Renderer }).renderer;
        const cx = bounds.plot.x + bounds.plot.width / 2;
        const cy = bounds.plot.y + bounds.plot.height / 2;
        renderer.text(cx, cy, options.text, {
          fill: options.color ?? '#6b7280',
          fontSize: options.fontSize ?? 28,
          opacity: options.opacity ?? 0.12,
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          fontWeight: 'bold',
          rotate: -20
        });
      });
    }
  };
}

export interface ThresholdLineOptions {
  yValue: number;
  label?: string;
  color?: string;
  dash?: number[];
}

export function createThresholdPlugin(options: ThresholdLineOptions): ChartPlugin {
  return {
    name: 'threshold-line',
    install(chartInstance: ChartInstance) {
      const chart = chartInstance as Chart;
      chart.on('render', () => {
        const yScale = chart.getScale('y');
        if (!yScale) return;
        const yPixel = yScale.convert(options.yValue);
        const bounds = chart.getBounds();
        const renderer = (chart as unknown as { renderer: Renderer }).renderer;

        renderer.line(bounds.plot.x, yPixel, bounds.plot.x + bounds.plot.width, yPixel, {
          stroke: options.color ?? '#ef4444',
          strokeWidth: 1.5,
          strokeDasharray: options.dash ?? [4, 4]
        });

        if (options.label) {
          renderer.text(bounds.plot.x + bounds.plot.width - 5, yPixel - 5, options.label, {
            fill: options.color ?? '#ef4444',
            fontSize: 10,
            textAnchor: 'end'
          });
        }
      });
    }
  };
}
