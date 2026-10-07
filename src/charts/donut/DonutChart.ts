import type { ChartOptions, Renderer } from '../../core/ChartConfig';
import { PieChart, type PieChartOptions } from '../pie/PieChart';

export interface DonutChartOptions extends ChartOptions {
  type: 'donut';
  donut?: {
    innerRadiusRatio?: number;
    padAngle?: number;
    showLabels?: boolean;
    centerText?: string;
    centerSubtext?: string;
  };
}

export class DonutChart extends PieChart {
  private centerText?: string;
  private centerSubtext?: string;

  constructor(options: DonutChartOptions) {
    const pieOptions: PieChartOptions = {
      ...options,
      type: 'pie',
      pie: {
        innerRadiusRatio: options.donut?.innerRadiusRatio ?? 0.6,
        padAngle: options.donut?.padAngle ?? 0.03,
        showLabels: options.donut?.showLabels ?? true
      }
    };
    super(pieOptions);
    this.innerRadiusRatio = options.donut?.innerRadiusRatio ?? 0.6;
    this.centerText = options.donut?.centerText;
    this.centerSubtext = options.donut?.centerSubtext;
  }

  override render(): void {
    super.render();
    if (this.centerText || this.centerSubtext) {
      const bounds = this.getBounds();
      const theme = this.getTheme();
      const renderer = (this as unknown as { renderer: Renderer }).renderer;
      const cx = bounds.plot.x + bounds.plot.width / 2;
      const cy = bounds.plot.y + bounds.plot.height / 2;

      if (this.centerText) {
        renderer.text(cx, this.centerSubtext ? cy - 6 : cy, this.centerText, {
          fill: theme.text,
          fontSize: 18,
          fontWeight: 'bold',
          textAnchor: 'middle',
          dominantBaseline: 'middle'
        });
      }
      if (this.centerSubtext) {
        renderer.text(cx, cy + 14, this.centerSubtext, {
          fill: '#6b7280',
          fontSize: 12,
          textAnchor: 'middle',
          dominantBaseline: 'middle'
        });
      }
    }
  }
}
