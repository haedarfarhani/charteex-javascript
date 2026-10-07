import type {
  ChartOptions,
  ChartType,
  ChartInstance,
  Theme,
  RendererType,
  ChartPlugin
} from './core/ChartConfig';
import type { ChartData, Series } from './core/ChartConfig';
import { Chart } from './core/Chart';
import { LineChart, type LineChartOptions } from './charts/line/LineChart';
import { LightTheme, DarkTheme } from './themes/Theme';

export { Chart, LineChart };
export type {
  ChartOptions,
  ChartData,
  ChartType,
  ChartInstance,
  Theme,
  RendererType,
  Series,
  ChartPlugin
};

export function createChart(container: string | HTMLElement, options: Omit<ChartOptions, 'container'>): ChartInstance {
  const chartOptions: ChartOptions = {
    ...options,
    container
  };

  switch (chartOptions.type) {
    case 'line':
      return new LineChart(chartOptions as LineChartOptions);
    default:
      return new Chart(chartOptions);
  }
}

export const themes = {
  light: LightTheme,
  dark: DarkTheme
};