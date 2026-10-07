import type { AxisConfig, ChartBounds, Theme, Renderer, RenderElement } from '../core/ChartConfig';
import type { Scale } from '../scales/Scale';

export interface AxisRenderOptions {
  scale: Scale;
  bounds: ChartBounds;
  theme: Theme;
  config: AxisConfig;
  renderer: Renderer;
}

export function renderAxis(options: AxisRenderOptions): RenderElement[] {
  const { scale, bounds, theme, config, renderer } = options;
  const elements: RenderElement[] = [];
  const position = config.position ?? 'bottom';
  const showGrid = config.grid ?? true;

  const ticks = scale.getTicks(config.ticks);

  const axisLine = createAxisLine(position, bounds, theme, renderer);
  if (axisLine) elements.push(axisLine);

  for (const tick of ticks) {
    const tickElements = createTick(scale, tick, position, bounds, theme, config, renderer, showGrid);
    elements.push(...tickElements);
  }

  const label = createAxisLabel(config.label, position, bounds, theme, renderer);
  if (label) elements.push(label);

  return elements;
}

function createAxisLine(
  position: string,
  bounds: ChartBounds,
  theme: Theme,
  renderer: Renderer
): RenderElement | null {
  const { plot } = bounds;
  let x1, y1, x2, y2;

  switch (position) {
    case 'top':
      x1 = plot.x; y1 = plot.y; x2 = plot.x + plot.width; y2 = plot.y;
      break;
    case 'bottom':
      x1 = plot.x; y1 = plot.y + plot.height; x2 = plot.x + plot.width; y2 = plot.y + plot.height;
      break;
    case 'left':
      x1 = plot.x; y1 = plot.y; x2 = plot.x; y2 = plot.y + plot.height;
      break;
    case 'right':
      x1 = plot.x + plot.width; y1 = plot.y; x2 = plot.x + plot.width; y2 = plot.y + plot.height;
      break;
    default:
      return null;
  }

  return renderer.line(x1, y1, x2, y2, {
    stroke: theme.axis,
    strokeWidth: 1
  });
}

function createTick(
  scale: Scale,
  tick: { value: number | Date | string; label: string },
  position: string,
  bounds: ChartBounds,
  theme: Theme,
  config: AxisConfig,
  renderer: Renderer,
  showGrid: boolean
): RenderElement[] {
  const elements: RenderElement[] = [];
  const { plot } = bounds;
  const value = scale.convert(tick.value);

  let tickX = 0, tickY = 0;
  let labelX = 0, labelY = 0;
  let gridX1 = 0, gridY1 = 0, gridX2 = 0, gridY2 = 0;

  const isHorizontal = position === 'top' || position === 'bottom';
  const isVertical = position === 'left' || position === 'right';

  if (isHorizontal) {
    tickX = value;
    tickY = position === 'bottom' ? plot.y + plot.height : plot.y;
    labelX = value;
    labelY = position === 'bottom' ? plot.y + plot.height + 8 : plot.y - 8;
    gridX1 = value;
    gridY1 = plot.y;
    gridX2 = value;
    gridY2 = plot.y + plot.height;
  } else if (isVertical) {
    tickX = position === 'left' ? plot.x : plot.x + plot.width;
    tickY = value;
    labelX = position === 'left' ? plot.x - 8 : plot.x + plot.width + 8;
    labelY = value;
    gridX1 = plot.x;
    gridY1 = value;
    gridX2 = plot.x + plot.width;
    gridY2 = value;
  }

  const tickLength = 6;
  let tickX1 = tickX, tickY1 = tickY, tickX2 = tickX, tickY2 = tickY;

  if (position === 'bottom') {
    tickY1 = tickY; tickY2 = tickY + tickLength;
  } else if (position === 'top') {
    tickY1 = tickY - tickLength; tickY2 = tickY;
  } else if (position === 'left') {
    tickX1 = tickX - tickLength; tickX2 = tickX;
  } else if (position === 'right') {
    tickX1 = tickX; tickX2 = tickX + tickLength;
  }

  const tickLine = renderer.line(tickX1, tickY1, tickX2, tickY2, {
    stroke: theme.axis,
    strokeWidth: 1
  });
  elements.push(tickLine);

  if (showGrid && config.grid !== false) {
    const gridLine = renderer.line(gridX1, gridY1, gridX2, gridY2, {
      stroke: config.gridColor ?? theme.grid,
      strokeWidth: 1,
      strokeDasharray: config.gridDash ?? [4, 4]
    });
    elements.push(gridLine);
  }

  const textAnchor: 'start' | 'middle' | 'end' = isHorizontal ? 'middle' : position === 'left' ? 'end' : 'start';
  const dominantBaseline: 'auto' | 'text-bottom' | 'alphabetic' | 'ideographic' | 'middle' | 'central' | 'mathematical' | 'hanging' = isVertical ? 'middle' : position === 'bottom' ? 'hanging' : 'alphabetic';

  const label = renderer.text(labelX, labelY, tick.label, {
    fill: theme.text,
    fontSize: 11,
    fontFamily: theme.fontFamily,
    textAnchor,
    dominantBaseline
  });
  elements.push(label);

  return elements;
}

function createAxisLabel(
  labelText: string | undefined,
  position: string,
  bounds: ChartBounds,
  theme: Theme,
  renderer: Renderer
): RenderElement | null {
  if (!labelText) return null;

  const { plot } = bounds;
  let x = 0, y = 0, rotate = 0;
  const textAnchor: 'start' | 'middle' | 'end' = 'middle';
  const dominantBaseline: 'auto' | 'text-bottom' | 'alphabetic' | 'ideographic' | 'middle' | 'central' | 'mathematical' | 'hanging' = 'middle';

  switch (position) {
    case 'bottom':
      x = plot.x + plot.width / 2;
      y = plot.y + plot.height + 35;
      break;
    case 'top':
      x = plot.x + plot.width / 2;
      y = plot.y - 25;
      break;
    case 'left':
      x = plot.x - 40;
      y = plot.y + plot.height / 2;
      rotate = -90;
      break;
    case 'right':
      x = plot.x + plot.width + 40;
      y = plot.y + plot.height / 2;
      rotate = 90;
      break;
  }

  return renderer.text(x, y, labelText, {
    fill: theme.text,
    fontSize: 12,
    fontFamily: theme.fontFamily,
    fontWeight: '500',
    textAnchor,
    dominantBaseline,
    rotate
  });
}

export class Axis {
  private scale: Scale;
  private config: AxisConfig;
  private elements: RenderElement[] = [];

  constructor(scale: Scale, config: AxisConfig) {
    this.scale = scale;
    this.config = config;
  }

  render(context: { bounds: ChartBounds; theme: Theme; renderer: Renderer }): RenderElement[] {
    this.elements = renderAxis({
      scale: this.scale,
      bounds: context.bounds,
      theme: context.theme,
      config: this.config,
      renderer: context.renderer
    });
    return this.elements;
  }

  getScale(): Scale {
    return this.scale;
  }

  getConfig(): AxisConfig {
    return this.config;
  }

  destroy(): void {
    for (const element of this.elements) {
      element.destroy();
    }
    this.elements = [];
  }
}