import type { ChartOptions, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { describeArc, polarToCartesian } from '../../utilities/geometry';
import { formatNumber } from '../../utilities/format';

export interface GaugeChartOptions extends ChartOptions {
  type: 'gauge';
  gauge?: {
    min?: number;
    max?: number;
    unit?: string;
  };
}

export class GaugeChart extends Chart {
  private min = 0;
  private max = 100;
  private unit = '%';
  private renderedElements: RenderElement[] = [];

  constructor(options: GaugeChartOptions) {
    super(options);
    if (options.gauge?.min !== undefined) this.min = options.gauge.min;
    if (options.gauge?.max !== undefined) this.max = options.gauge.max;
    if (options.gauge?.unit !== undefined) this.unit = options.gauge.unit;
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;
    const { plot } = bounds;

    const val = this.options.data.series?.[0]?.data?.[0]?.value ?? this.options.data.series?.[0]?.data?.[0]?.y ?? 65;
    const clampedVal = Math.max(this.min, Math.min(this.max, val));
    const t = (clampedVal - this.min) / (this.max - this.min || 1);

    const cx = plot.x + plot.width / 2;
    const cy = plot.y + plot.height * 0.65;
    const radius = Math.min(plot.width, plot.height * 1.3) / 2 * 0.85;
    const innerRadius = radius * 0.72;

    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const totalAngleSpan = endAngle - startAngle;

    // Background track arc
    const bgArc = describeArc({
      cx,
      cy,
      innerRadius,
      outerRadius: radius,
      startAngle,
      endAngle
    });
    const bgEl = renderer.path(bgArc, { fill: theme.grid, opacity: 0.5 });
    this.renderedElements.push(bgEl);

    // Value active arc
    const valAngle = startAngle + t * totalAngleSpan;
    if (t > 0.001) {
      const valArc = describeArc({
        cx,
        cy,
        innerRadius,
        outerRadius: radius,
        startAngle,
        endAngle: valAngle
      });
      const activeColor = t < 0.5 ? '#10b981' : t < 0.8 ? '#f59e0b' : '#ef4444';
      const valEl = renderer.path(valArc, { fill: activeColor });
      this.renderedElements.push(valEl);
    }

    // Needle
    const needleTip = polarToCartesian(cx, cy, innerRadius - 8, valAngle);
    const needleBaseLeft = polarToCartesian(cx, cy, 10, valAngle - Math.PI / 2);
    const needleBaseRight = polarToCartesian(cx, cy, 10, valAngle + Math.PI / 2);

    const needlePath = `M ${needleBaseLeft.x} ${needleBaseLeft.y} L ${needleTip.x} ${needleTip.y} L ${needleBaseRight.x} ${needleBaseRight.y} Z`;
    const needleEl = renderer.path(needlePath, { fill: theme.text });
    this.renderedElements.push(needleEl);

    const pivotEl = renderer.circle(cx, cy, 6, { fill: theme.text });
    this.renderedElements.push(pivotEl);

    // Center value text
    const textEl = renderer.text(cx, cy + 28, `${formatNumber(clampedVal)}${this.unit}`, {
      fill: theme.text,
      fontSize: 22,
      fontWeight: 'bold',
      textAnchor: 'middle',
      dominantBaseline: 'middle'
    });
    this.renderedElements.push(textEl);
  }

  override destroy(): void {
    for (const el of this.renderedElements) {
      el.destroy();
    }
    this.renderedElements = [];
    super.destroy();
  }
}
