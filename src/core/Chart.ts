import type {
  ChartOptions,
  ChartData,
  ChartInstance,
  ChartEvent,
  EventHandler,
  ChartPlugin,
  Theme,
  Margin,
  Padding,
  ChartBounds,
  Renderer,
  RendererType,
  DataPoint
} from './ChartConfig';
import { SVGRenderer } from '../rendering/SVGRenderer';
import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { LinearScale, TimeScale, CategoryScale, LogScale } from '../scales/Scale';
import type { Scale } from '../scales/Scale';
import { LightTheme, DarkTheme } from '../themes/Theme';
import { EventEmitter } from '../utils/events';

export class Chart implements ChartInstance {
  protected container: HTMLElement;
  protected options: ChartOptions;
  protected renderer: Renderer;
  protected bounds: ChartBounds;
  protected scales: Map<string, Scale> = new Map();
  protected plugins: ChartPlugin[] = [];
  protected eventEmitter: EventEmitter;
  protected animationFrame: number | null = null;
  protected isDestroyed = false;
  protected resizeObserver: ResizeObserver | null = null;
  protected theme: Theme;

  constructor(options: ChartOptions) {
    this.options = this.mergeOptions(options);
    this.container = this.resolveContainer(this.options.container);
    this.theme = this.resolveTheme(this.options.theme);
    this.eventEmitter = new EventEmitter();
    this.renderer = this.createRenderer(this.options.renderer);
    this.bounds = this.calculateBounds();
    this.initializeScales();
    this.initializePlugins();
    this.setupResizeObserver();
    this.renderer.init(this.container, this.bounds.width, this.bounds.height);
  }

  private mergeOptions(options: ChartOptions): ChartOptions {
    return {
      type: options.type,
      data: options.data,
      container: options.container,
      width: options.width ?? '100%',
      height: options.height ?? 400,
      renderer: options.renderer ?? 'auto',
      theme: options.theme ?? 'light',
      direction: options.direction ?? 'ltr',
      margin: options.margin ?? {},
      padding: options.padding ?? {},
      responsive: options.responsive ?? true,
      animation: options.animation ?? { enabled: true, duration: 600, easing: 'easeOut' },
      axis: options.axis ?? {},
      tooltip: options.tooltip ?? { enabled: true, mode: 'nearest' },
      crosshair: options.crosshair ?? { enabled: false },
      zoom: options.zoom ?? { enabled: false },
      pan: options.pan ?? { enabled: false },
      legend: options.legend ?? { enabled: true, position: 'bottom' },
      title: options.title ?? {},
      accessibility: options.accessibility ?? { enabled: true },
      plugins: options.plugins ?? []
    };
  }

  private resolveContainer(container: string | HTMLElement): HTMLElement {
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`ChartError: Container element "${container}" was not found.`);
      }
      return element as HTMLElement;
    }
    return container;
  }

  private resolveTheme(theme: ChartOptions['theme']): Theme {
    if (typeof theme === 'string') {
      return theme === 'dark' ? DarkTheme : LightTheme;
    }
    if (theme) {
      return { ...LightTheme, ...theme };
    }
    return LightTheme;
  }

  protected createRenderer(type: RendererType | undefined): Renderer {
    if (type === 'svg') {
      return new SVGRenderer();
    }
    if (type === 'canvas') {
      return new CanvasRenderer();
    }
    return new SVGRenderer();
  }

  private calculateBounds(): ChartBounds {
    const rect = this.container.getBoundingClientRect();
    const width = typeof this.options.width === 'number'
      ? this.options.width
      : rect.width || 800;
    const height = typeof this.options.height === 'number'
      ? this.options.height
      : rect.height || 400;

    const margin: Margin = {
      top: this.options.margin?.top ?? 20,
      right: this.options.margin?.right ?? 20,
      bottom: this.options.margin?.bottom ?? 40,
      left: this.options.margin?.left ?? 60
    };

    const padding: Padding = {
      top: this.options.padding?.top ?? 10,
      right: this.options.padding?.right ?? 10,
      bottom: this.options.padding?.bottom ?? 10,
      left: this.options.padding?.left ?? 10
    };

    const plotWidth = width - margin.left - margin.right - padding.left - padding.right;
    const plotHeight = height - margin.top - margin.bottom - padding.top - padding.bottom;

    return {
      x: 0,
      y: 0,
      width,
      height,
      margins: margin,
      padding: padding,
      plot: {
        x: margin.left + padding.left,
        y: margin.top + padding.top,
        width: Math.max(0, plotWidth),
        height: Math.max(0, plotHeight)
      }
    };
  }

  private initializeScales(): void {
    const { axis } = this.options;
    if (axis?.x) {
      this.scales.set('x', this.createScale('x', axis.x));
    }
    if (axis?.y) {
      this.scales.set('y', this.createScale('y', axis.y));
    }
    if (axis?.y2) {
      this.scales.set('y2', this.createScale('y2', axis.y2));
    }
  }

  protected createScale(name: string, config: NonNullable<ChartOptions['axis']>['x']): Scale {
    const cfg = config ?? {};
    const scaleType = cfg.type ?? 'linear';
    const domain = cfg.domain;
    const range = cfg.range ?? this.getDefaultRange(name);

    switch (scaleType) {
      case 'time':
        return new TimeScale({ domain: domain as [Date, Date], range });
      case 'category':
        return new CategoryScale({ domain: domain as string[], range });
      case 'log':
        return new LogScale({ domain: domain as [number, number], range, logBase: cfg.logBase });
      default:
        return new LinearScale({ domain: domain as [number, number], range, nice: cfg.nice });
    }
  }

  protected getDefaultRange(name: string): [number, number] {
    if (name === 'x') {
      return [this.bounds.plot.x, this.bounds.plot.x + this.bounds.plot.width];
    }
    return [this.bounds.plot.y + this.bounds.plot.height, this.bounds.plot.y];
  }

  protected initializePlugins(): void {
    for (const plugin of this.options.plugins ?? []) {
      this.use(plugin);
    }
  }

  protected setupResizeObserver(): void {
    if (!this.options.responsive) return;
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.container);
  }

  render(): void {
    if (this.isDestroyed) return;
    this.renderer.clear();
    this.emit('render', { chart: this });
  }

  resize(): void {
    if (this.isDestroyed) return;
    const newBounds = this.calculateBounds();
    const widthChanged = newBounds.width !== this.bounds.width;
    const heightChanged = newBounds.height !== this.bounds.height;

    this.bounds = newBounds;
    this.renderer.init(this.container, this.bounds.width, this.bounds.height);

    for (const [name, scale] of this.scales) {
      scale.setRange(this.getDefaultRange(name));
    }

    if (widthChanged || heightChanged) {
      this.emit('resize', { chart: this, bounds: this.bounds });
    }
    this.render();
  }

  setData(data: ChartData): void {
    this.options.data = data;
    this.updateScalesFromData();
    this.render();
    this.emit('datachange', { chart: this, data });
  }

  update(options: Partial<ChartOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.theme) {
      this.theme = this.resolveTheme(options.theme);
    }
    if (options.margin || options.padding || options.width || options.height) {
      this.bounds = this.calculateBounds();
      this.renderer.init(this.container, this.bounds.width, this.bounds.height);
    }
    if (options.axis) {
      this.initializeScales();
    }
    this.render();
    this.emit('update', { chart: this, options });
  }

  appendData(point: DataPoint, seriesIndex = 0): void {
    const series = this.options.data.series;
    if (series && series[seriesIndex]) {
      series[seriesIndex].data.push(point);
      this.updateScalesFromData();
      this.render();
      this.emit('dataappend', { chart: this, point, seriesIndex });
    }
  }

  removeData(count: number, seriesIndex = 0): void {
    const series = this.options.data.series;
    if (series && series[seriesIndex]) {
      series[seriesIndex].data.splice(-count);
      this.updateScalesFromData();
      this.render();
      this.emit('dataremove', { chart: this, count, seriesIndex });
    }
  }

  protected updateScalesFromData(): void {
    // Override in specific chart implementations
  }

  zoom(factor: number, centerX?: number, centerY?: number): void {
    const { zoom } = this.options;
    if (!zoom?.enabled) return;

    const minZoom = zoom.minZoom ?? 0.1;
    const maxZoom = zoom.maxZoom ?? 10;
    const clampedFactor = Math.max(minZoom, Math.min(maxZoom, factor));

    for (const scale of this.scales.values()) {
      scale.zoom(clampedFactor, centerX, centerY);
    }
    this.render();
    this.emit('zoom', { chart: this, factor: clampedFactor });
  }

  pan(deltaX: number, deltaY: number): void {
    const { pan } = this.options;
    if (!pan?.enabled) return;

    for (const scale of this.scales.values()) {
      scale.pan(deltaX, deltaY);
    }
    this.render();
    this.emit('pan', { chart: this, deltaX, deltaY });
  }

  resetZoom(): void {
    for (const scale of this.scales.values()) {
      scale.reset();
    }
    this.render();
    this.emit('zoomreset', { chart: this });
  }

  async export(format: 'svg' | 'png'): Promise<string | Blob> {
    if (format === 'svg') {
      return this.exportSVG();
    }
    return this.exportPNG();
  }

  private exportSVG(): string {
    const svg = this.container.querySelector('svg');
    if (svg) {
      return new XMLSerializer().serializeToString(svg);
    }
    throw new Error('SVG export not available');
  }

  private async exportPNG(): Promise<Blob> {
    const canvas = this.container.querySelector('canvas');
    if (canvas) {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('PNG export failed');
        }, 'image/png');
      });
    }
    throw new Error('PNG export not available');
  }

  on(event: string, handler: EventHandler): () => void {
    this.eventEmitter.on(event, handler as (data?: unknown) => void);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    this.eventEmitter.off(event, handler as (data?: unknown) => void);
  }

  private emit(type: string, data?: ChartEvent['data']): void {
    this.eventEmitter.emit(type, { type, target: this, data } as ChartEvent);
  }

  use(plugin: ChartPlugin): void {
    plugin.install(this);
    this.plugins.push(plugin);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    for (const plugin of this.plugins) {
      plugin.destroy?.(this);
    }
    this.renderer.destroy();
    this.eventEmitter.removeAllListeners();
    this.container.innerHTML = '';
  }

  getBounds(): ChartBounds {
    return this.bounds;
  }

  getScale(name: string): Scale | undefined {
    return this.scales.get(name);
  }

  getTheme(): Theme {
    return this.theme;
  }

  getOptions(): ChartOptions {
    return { ...this.options };
  }
}