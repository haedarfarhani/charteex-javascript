import type { ChartOptions, ChartBounds, Bounds } from '../core/ChartConfig';

export interface LayoutResult {
  chart: Bounds;
  title?: Bounds;
  legend?: Bounds;
  axes: {
    top?: Bounds;
    bottom?: Bounds;
    left?: Bounds;
    right?: Bounds;
  };
  plot: Bounds;
  bounds: ChartBounds;
}

export class LayoutEngine {
  static compute(container: HTMLElement, options: ChartOptions): LayoutResult {
    const rect = container.getBoundingClientRect();
    const width = typeof options.width === 'number'
      ? options.width
      : rect.width || 800;
    const height = typeof options.height === 'number'
      ? options.height
      : rect.height || 400;

    const margin = {
      top: options.margin?.top ?? 20,
      right: options.margin?.right ?? 20,
      bottom: options.margin?.bottom ?? 40,
      left: options.margin?.left ?? 60
    };

    const padding = {
      top: options.padding?.top ?? 10,
      right: options.padding?.right ?? 10,
      bottom: options.padding?.bottom ?? 10,
      left: options.padding?.left ?? 10
    };

    let titleBounds: Bounds | undefined;
    let titleHeight = 0;
    if (options.title?.text) {
      titleHeight = (options.title.fontSize ?? 16) + (options.title.padding ?? 16);
      titleBounds = {
        x: margin.left,
        y: margin.top,
        width: Math.max(0, width - margin.left - margin.right),
        height: titleHeight
      };
    }

    let legendBounds: Bounds | undefined;
    let legendHeight = 0;
    let legendWidth = 0;
    if (options.legend?.enabled !== false && options.legend?.position) {
      const pos = options.legend.position;
      if (pos === 'top' || pos === 'bottom') {
        legendHeight = 30;
      } else {
        legendWidth = 80;
      }
    }

    const isRtl = options.direction === 'rtl';

    let plotX = margin.left + padding.left;
    const plotY = margin.top + padding.top + titleHeight;
    let plotW = width - margin.left - margin.right - padding.left - padding.right - legendWidth;
    let plotH = height - margin.top - margin.bottom - padding.top - padding.bottom - titleHeight - legendHeight;

    if (isRtl) {
      plotX = margin.right + padding.right;
    }

    plotW = Math.max(0, plotW);
    plotH = Math.max(0, plotH);

    const plotBounds: Bounds = {
      x: plotX,
      y: plotY,
      width: plotW,
      height: plotH
    };

    if (options.legend?.enabled !== false && options.legend?.position) {
      const pos = options.legend.position;
      if (pos === 'bottom') {
        legendBounds = {
          x: plotX,
          y: plotY + plotH + padding.bottom + 10,
          width: plotW,
          height: legendHeight
        };
      } else if (pos === 'top') {
        legendBounds = {
          x: plotX,
          y: margin.top + titleHeight,
          width: plotW,
          height: legendHeight
        };
      }
    }

    const chartBounds: ChartBounds = {
      x: 0,
      y: 0,
      width,
      height,
      margins: margin,
      padding: padding,
      plot: plotBounds
    };

    return {
      chart: { x: 0, y: 0, width, height },
      title: titleBounds,
      legend: legendBounds,
      axes: {
        bottom: { x: plotX, y: plotY + plotH, width: plotW, height: margin.bottom },
        left: { x: 0, y: plotY, width: margin.left, height: plotH },
        top: { x: plotX, y: margin.top, width: plotW, height: margin.top },
        right: { x: plotX + plotW, y: plotY, width: margin.right, height: plotH }
      },
      plot: plotBounds,
      bounds: chartBounds
    };
  }
}
