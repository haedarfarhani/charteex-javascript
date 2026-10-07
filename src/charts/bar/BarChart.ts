import type { ChartOptions, ChartBounds, Theme, Renderer, RenderElement } from '../../core/ChartConfig';
import { Chart } from '../../core/Chart';
import { Axis } from '../../axes/Axis';

export interface BarChartOptions extends ChartOptions {
  type: 'bar' | 'column';
  bar?: {
    orientation?: 'vertical' | 'horizontal';
    mode?: 'grouped' | 'stacked';
    barWidth?: number;
    borderRadius?: number;
    gap?: number;
  };
}

export class BarChart extends Chart {
  private barOptions: NonNullable<BarChartOptions['bar']>;
  private axisX: Axis | null = null;
  private axisY: Axis | null = null;
  private renderedElements: RenderElement[] = [];

  constructor(options: BarChartOptions) {
    super(options);
    const orientation = options.type === 'column' ? 'vertical' : (options.bar?.orientation ?? 'vertical');
    this.barOptions = {
      orientation,
      mode: options.bar?.mode ?? 'grouped',
      borderRadius: options.bar?.borderRadius ?? 4,
      gap: options.bar?.gap ?? 0.2
    };
    this.updateScalesFromData();
  }

  protected override updateScalesFromData(): void {
    const data = this.options.data;
    if (!data || !data.series || data.series.length === 0) return;

    const isHorizontal = this.barOptions.orientation === 'horizontal';
    const isStacked = this.barOptions.mode === 'stacked';

    const numCategories = Math.max(...data.series.map(s => s.data.length), 1);
    let minVal = 0;
    let maxVal = 0;

    if (isStacked) {
      for (let i = 0; i < numCategories; i++) {
        let positiveSum = 0;
        let negativeSum = 0;
        for (const s of data.series) {
          const val = s.data[i]?.y ?? (s.data[i]?.value as number) ?? 0;
          if (val >= 0) positiveSum += val;
          else negativeSum += val;
        }
        if (positiveSum > maxVal) maxVal = positiveSum;
        if (negativeSum < minVal) minVal = negativeSum;
      }
    } else {
      for (const s of data.series) {
        for (const p of s.data) {
          const val = p.y ?? (p.value as number) ?? 0;
          if (val > maxVal) maxVal = val;
          if (val < minVal) minVal = val;
        }
      }
    }

    if (maxVal === 0 && minVal === 0) maxVal = 10;
    const padding = (maxVal - minVal) * 0.1 || 1;
    const valueDomain: [number, number] = [minVal < 0 ? minVal - padding : 0, maxVal + padding];

    const valueScale = isHorizontal ? this.getScale('x') : this.getScale('y');
    const catScale = isHorizontal ? this.getScale('y') : this.getScale('x');

    if (valueScale) {
      valueScale.setDomain(valueDomain);
    }

    if (catScale) {
      catScale.setDomain([0, numCategories]);
    }
  }

  override render(): void {
    super.render();
    const bounds = this.getBounds();
    const theme = this.getTheme();
    const renderer = (this as unknown as { renderer: Renderer }).renderer;

    this.renderAxes(renderer, bounds, theme);
    this.renderBars(renderer, bounds, theme);
  }

  private renderAxes(renderer: Renderer, bounds: ChartBounds, theme: Theme): void {
    const xScale = this.getScale('x');
    const yScale = this.getScale('y');

    if (xScale && this.options.axis?.x) {
      this.axisX = new Axis(xScale, this.options.axis.x);
      this.axisX.render({ bounds, theme, renderer });
    }

    if (yScale && this.options.axis?.y) {
      this.axisY = new Axis(yScale, this.options.axis.y);
      this.axisY.render({ bounds, theme, renderer });
    }
  }

  private renderBars(renderer: Renderer, bounds: ChartBounds, theme: Theme): void {
    const data = this.options.data;
    if (!data || !data.series || data.series.length === 0) return;

    const isHorizontal = this.barOptions.orientation === 'horizontal';
    const isStacked = this.barOptions.mode === 'stacked';
    const seriesList = data.series.filter(s => s.visible !== false);
    if (seriesList.length === 0) return;

    const numCategories = Math.max(...seriesList.map(s => s.data.length), 1);
    const { plot } = bounds;

    const catSpan = isHorizontal ? plot.height / numCategories : plot.width / numCategories;
    const gapRatio = this.barOptions.gap ?? 0.2;
    const availableSpan = catSpan * (1 - gapRatio);

    const baseValScale = isHorizontal ? this.getScale('x') : this.getScale('y');
    if (!baseValScale) return;
    const zeroPixel = baseValScale.convert(0);

    const seriesColors = theme.seriesColors;

    if (isStacked) {
      for (let cIdx = 0; cIdx < numCategories; cIdx++) {
        let currentPosPos = zeroPixel;
        let currentNegPos = zeroPixel;

        const catStart = isHorizontal
          ? plot.y + cIdx * catSpan + (catSpan * gapRatio) / 2
          : plot.x + cIdx * catSpan + (catSpan * gapRatio) / 2;

        seriesList.forEach((series, sIdx) => {
          const val = series.data[cIdx]?.y ?? (series.data[cIdx]?.value as number) ?? 0;
          const color = (series.color ?? seriesColors[sIdx % seriesColors.length]) as string;
          const valPx = baseValScale.convert(val);

          let barX = 0, barY = 0, barW = 0, barH = 0;

          if (isHorizontal) {
            const width = Math.abs(valPx - zeroPixel);
            if (val >= 0) {
              barX = currentPosPos;
              barW = width;
              currentPosPos += width;
            } else {
              barX = currentNegPos - width;
              barW = width;
              currentNegPos -= width;
            }
            barY = catStart;
            barH = availableSpan;
          } else {
            const height = Math.abs(valPx - zeroPixel);
            if (val >= 0) {
              barY = currentPosPos - height;
              barH = height;
              currentPosPos -= height;
            } else {
              barY = currentNegPos;
              barH = height;
              currentNegPos += height;
            }
            barX = catStart;
            barW = availableSpan;
          }

          if (barW > 0 && barH > 0) {
            const el = renderer.rect(barX, barY, barW, barH, {
              fill: color,
              rx: this.barOptions.borderRadius,
              ry: this.barOptions.borderRadius
            });
            this.renderedElements.push(el);
          }
        });
      }
    } else {
      // Grouped bars
      const barSpan = availableSpan / seriesList.length;

      for (let cIdx = 0; cIdx < numCategories; cIdx++) {
        const catStart = isHorizontal
          ? plot.y + cIdx * catSpan + (catSpan * gapRatio) / 2
          : plot.x + cIdx * catSpan + (catSpan * gapRatio) / 2;

        seriesList.forEach((series, sIdx) => {
          const val = series.data[cIdx]?.y ?? (series.data[cIdx]?.value as number) ?? 0;
          const color = (series.color ?? seriesColors[sIdx % seriesColors.length]) as string;
          const valPx = baseValScale.convert(val);

          let barX = 0, barY = 0, barW = 0, barH = 0;

          if (isHorizontal) {
            barY = catStart + sIdx * barSpan;
            barH = barSpan - 2;
            if (val >= 0) {
              barX = zeroPixel;
              barW = Math.max(0, valPx - zeroPixel);
            } else {
              barX = valPx;
              barW = Math.max(0, zeroPixel - valPx);
            }
          } else {
            barX = catStart + sIdx * barSpan;
            barW = barSpan - 2;
            if (val >= 0) {
              barY = valPx;
              barH = Math.max(0, zeroPixel - valPx);
            } else {
              barY = zeroPixel;
              barH = Math.max(0, valPx - zeroPixel);
            }
          }

          if (barW > 0 && barH > 0) {
            const el = renderer.rect(barX, barY, barW, barH, {
              fill: color,
              rx: this.barOptions.borderRadius,
              ry: this.barOptions.borderRadius
            });
            this.renderedElements.push(el);
          }
        });
      }
    }
  }

  override destroy(): void {
    for (const el of this.renderedElements) {
      el.destroy();
    }
    this.renderedElements = [];
    this.axisX?.destroy();
    this.axisY?.destroy();
    super.destroy();
  }
}
