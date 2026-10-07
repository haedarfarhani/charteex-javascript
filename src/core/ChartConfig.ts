import type { DesignTokens } from '../design/tokens';

export type ChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'polar'
  | 'histogram'
  | 'heatmap'
  | 'gauge'
  | 'funnel'
  | 'boxplot'
  | 'candlestick'
  | 'ohlc'
  | 'volume';

export type RendererType = 'svg' | 'canvas' | 'auto';

export type ThemeMode =
  | 'default'
  | 'light'
  | 'dark'
  | 'midnight'
  | 'minimal'
  | 'professional'
  | 'financial'
  | 'glass'
  | 'enterprise'
  | 'system';

export type Direction = 'ltr' | 'rtl';

export type ScaleType = 'linear' | 'time' | 'category' | 'log';

export interface Point {
  x: number;
  y: number;
}

export interface DataPoint {
  x?: number | string | Date;
  y?: number;
  value?: number;
  category?: string;
  time?: number | string | Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  size?: number;
  color?: string;
  min?: number;
  q1?: number;
  median?: number;
  q3?: number;
  max?: number;
  values?: number[];
  [key: string]: unknown;
}

export interface SeriesPointConfig {
  visible?: boolean;
  radius?: number;
  hoverRadius?: number;
}

export interface SeriesAreaConfig {
  visible?: boolean;
  opacity?: number;
  fill?: 'solid' | 'gradient';
}

export interface Series {
  name?: string;
  data: DataPoint[];
  color?: string;
  visible?: boolean;
  opacity?: number;
  hoverOpacity?: number;
  lineWidth?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  point?: SeriesPointConfig;
  area?: SeriesAreaConfig;
  [key: string]: unknown;
}

export interface ChartData {
  series?: Series[];
  data?: DataPoint[];
  categories?: string[];
  [key: string]: unknown;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartBounds extends Bounds {
  plot: Bounds;
  margins: Margin;
  padding: Padding;
}

export interface AxisConfig {
  type?: ScaleType;
  position?: 'top' | 'bottom' | 'left' | 'right';
  domain?: [number, number] | [Date, Date] | string[];
  range?: [number, number];
  ticks?: number;
  tickFormat?: (value: number | string | Date) => string;
  label?: string;
  grid?: boolean;
  gridColor?: string;
  gridDash?: number[];
  min?: number | Date;
  max?: number | Date;
  nice?: boolean;
  logBase?: number;
}

export interface TooltipConfig {
  enabled?: boolean;
  mode?: 'nearest' | 'index' | 'dataset';
  formatter?: (value: DataPoint, context: TooltipContext) => string;
  render?: (context: TooltipContext) => string | HTMLElement;
  position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  background?: string;
  color?: string;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontFamily?: string;
  theme?: 'light' | 'dark' | 'auto';
  followCursor?: boolean;
}

export interface TooltipContext {
  series: Series;
  dataIndex: number;
  dataPoint: DataPoint;
  xValue: number | string | Date;
  yValue: number;
}

export interface CrosshairConfig {
  enabled?: boolean;
  vertical?: boolean;
  horizontal?: boolean;
  color?: string;
  dash?: number[];
  lineWidth?: number;
  snapToData?: boolean;
}

export interface ZoomConfig {
  enabled?: boolean;
  mode?: 'x' | 'y' | 'xy';
  minZoom?: number;
  maxZoom?: number;
  wheel?: boolean;
  pinch?: boolean;
  drag?: boolean;
}

export interface PanConfig {
  enabled?: boolean;
  mode?: 'x' | 'y' | 'xy';
  drag?: boolean;
}

export interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: EasingType;
  delay?: number;
}

export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'cubic'
  | 'spring';

export interface ContainerStyleConfig {
  background?: string;
  border?: boolean | string;
  borderRadius?: number;
  padding?: number;
  shadow?: boolean | string;
}

export interface LegendConfig {
  enabled?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  orientation?: 'horizontal' | 'vertical';
  interactive?: boolean;
  onSeriesClick?: (seriesIndex: number, visible: boolean) => void;
  onSeriesHover?: (seriesIndex: number | null) => void;
}

export interface Theme {
  name: string;
  background: string;
  text: string;
  grid: string;
  axis: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  tooltipBackground: string;
  tooltipColor: string;
  crosshairColor: string;
  seriesColors: string[];
  fontFamily: string;
  fontSize: number;
  tokens?: import('../design/tokens').DesignTokens;
}

export interface ChartOptions {
  type: ChartType;
  data: ChartData;
  container: string | HTMLElement;
  containerStyle?: ContainerStyleConfig;
  width?: number | string;
  height?: number | string;
  renderer?: RendererType;
  theme?: ThemeMode | Theme;
  direction?: Direction;
  margin?: Partial<Margin>;
  padding?: Partial<Padding>;
  responsive?: boolean;
  animation?: AnimationConfig;
  axis?: {
    x?: AxisConfig;
    y?: AxisConfig;
    y2?: AxisConfig;
  };
  tooltip?: TooltipConfig;
  crosshair?: CrosshairConfig;
  zoom?: ZoomConfig;
  pan?: PanConfig;
  legend?: LegendConfig;
  title?: {
    text?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    padding?: number;
    align?: 'left' | 'center' | 'right';
  };
  accessibility?: {
    enabled?: boolean;
    label?: string;
    description?: string;
  };
  plugins?: ChartPlugin[];
}

export interface ChartPlugin {
  name: string;
  install(chart: ChartInstance): void;
  destroy?(chart: ChartInstance): void;
}

export interface ChartInstance {
  render(): void;
  destroy(): void;
  resize(): void;
  setData(data: ChartData): void;
  update(options: Partial<ChartOptions>): void;
  appendData(point: DataPoint, seriesIndex?: number): void;
  removeData(count: number, seriesIndex?: number): void;
  zoom(factor: number, centerX?: number, centerY?: number): void;
  pan(deltaX: number, deltaY: number): void;
  resetZoom(): void;
  export(format: 'svg' | 'png'): Promise<string | Blob>;
  on(event: string, handler: EventHandler): () => void;
  off(event: string, handler: EventHandler): void;
}

export type EventHandler = (event: ChartEvent) => void;

export interface ChartEvent {
  type: string;
  target: ChartInstance;
  data?: unknown;
  originalEvent?: Event;
  series?: string;
  seriesIndex?: number;
  dataIndex?: number;
  value?: number;
  x?: number;
  y?: number;
}

export interface ScaleConfig {
  type: ScaleType;
  domain?: [number, number] | [Date, Date] | string[];
  range?: [number, number];
  min?: number | Date;
  max?: number | Date;
  nice?: boolean;
  logBase?: number;
}

export interface Renderer {
  init(container: HTMLElement, width: number, height: number): void;
  clear(): void;
  line(x1: number, y1: number, x2: number, y2: number, options?: LineOptions): RenderElement;
  rect(x: number, y: number, width: number, height: number, options?: RectOptions): RenderElement;
  circle(cx: number, cy: number, r: number, options?: CircleOptions): RenderElement;
  path(d: string, options?: PathOptions): RenderElement;
  text(x: number, y: number, text: string, options?: TextOptions): RenderElement;
  group(children?: RenderElement[]): RenderElement;
  createGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], x1?: string, y1?: string, x2?: string, y2?: string): string;
  createRadialGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], cx?: string, cy?: string, r?: string): string;
  destroy(): void;
}

export interface LineOptions {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string | number[];
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  fill?: string;
  opacity?: number;
}

export interface RectOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number;
  ry?: number;
  opacity?: number;
}

export interface CircleOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface PathOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string | number[];
  opacity?: number;
}

export interface TextOptions {
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'auto' | 'text-bottom' | 'alphabetic' | 'ideographic' | 'middle' | 'central' | 'mathematical' | 'hanging';
  opacity?: number;
  rotate?: number;
  transform?: string;
}

export interface RenderElement {
  id: string;
  type: string;
  setAttribute(name: string, value: string | number): void;
  removeAttribute(name: string): void;
  setStyle(name: string, value: string): void;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  appendChild(child: RenderElement): void;
  removeChild(child: RenderElement): void;
  destroy(): void;
}