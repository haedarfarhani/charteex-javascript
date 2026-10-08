import type {
  ChartOptions,
  ChartData,
  ChartInstance,
  ChartEvent,
  EventHandler,
  ChartPlugin,
  Theme,
  ChartBounds,
  Renderer,
  RendererType,
  DataPoint,
  TooltipContext
} from './ChartConfig';
import { SVGRenderer } from '../rendering/SVGRenderer';
import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { LinearScale, TimeScale, CategoryScale, LogScale } from '../scales/Scale';
import type { Scale } from '../scales/Scale';
import { resolveTheme } from '../themes/Theme';
import { EventEmitter } from '../utils/events';
import { LayoutEngine } from '../layout/LayoutEngine';
import { Tooltip } from '../interaction/Tooltip';
import { Crosshair } from '../interaction/Crosshair';
import { ZoomPanController } from '../interaction/ZoomPan';
import { A11yManager } from '../accessibility/A11y';
import { DataAdapter } from '../data/DataAdapter';
import { ChartError } from '../utilities/errors';

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
  protected tooltip: Tooltip | null = null;
  protected crosshair: Crosshair | null = null;
  protected zoomPan: ZoomPanController | null = null;
  protected a11y: A11yManager | null = null;

  constructor(options: ChartOptions) {
    this.options = this.mergeOptions(options);
    this.container = this.resolveContainer(this.options.container);
    this.theme = this.resolveTheme(this.options.theme);
    this.eventEmitter = new EventEmitter();

    // Data normalization
    const normalized = DataAdapter.normalize(this.options.data);
    this.options.data.series = normalized.series;
    if (normalized.categories.length > 0 && !this.options.data.categories) {
      this.options.data.categories = normalized.categories;
    }

    this.renderer = this.createRenderer(this.options.renderer);
    this.bounds = this.calculateBounds();
    this.initializeScales();
    this.initializePlugins();
    this.setupResizeObserver();
    this.renderer.init(this.container, this.bounds.width, this.bounds.height);
    this.applyContainerStyle();
    this.setupInteractions();
    this.setupA11y();
  }

  private applyContainerStyle(): void {
    const style = this.options.containerStyle;
    if (!style) return;
    if (style.background) this.container.style.backgroundColor = style.background;
    if (style.borderRadius !== undefined) this.container.style.borderRadius = `${style.borderRadius}px`;
    if (style.padding !== undefined) this.container.style.padding = `${style.padding}px`;
    if (style.border) {
      this.container.style.border = typeof style.border === 'string' ? style.border : `1px solid ${this.theme.grid}`;
    }
    if (style.shadow) {
      this.container.style.boxShadow = typeof style.shadow === 'string' ? style.shadow : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
  }

  private mergeOptions(options: ChartOptions): ChartOptions {
    return {
      ...options,
      type: options.type,
      data: options.data ?? { series: [] },
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
        throw new ChartError(`Container element "${container}" was not found.`);
      }
      return element as HTMLElement;
    }
    return container;
  }

  private resolveTheme(theme: ChartOptions['theme']): Theme {
    return resolveTheme(theme);
  }

  protected createRenderer(type: RendererType | undefined): Renderer {
    if (type === 'canvas') {
      return new CanvasRenderer();
    }
    if (type === 'svg') {
      return new SVGRenderer();
    }

    // Auto mode strategy:
    // If dataset contains > 2500 points, use high-performance CanvasRenderer.
    // Otherwise use SVG for crisper vector rendering and inspectable elements.
    let totalPoints = 0;
    for (const s of this.options.data.series ?? []) {
      totalPoints += s.data?.length ?? 0;
    }
    if (totalPoints > 2500) {
      return new CanvasRenderer();
    }
    return new SVGRenderer();
  }

  private calculateBounds(): ChartBounds {
    const layout = LayoutEngine.compute(this.container, this.options);
    return layout.bounds;
  }

  private initializeScales(): void {
    const { axis } = this.options;
    this.scales.set('x', this.createScale('x', axis?.x ?? { type: 'linear' }));
    this.scales.set('y', this.createScale('y', axis?.y ?? { type: 'linear' }));
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
        return new TimeScale({ domain: domain as [Date, Date], range, min: cfg.min, max: cfg.max });
      case 'category':
        return new CategoryScale({ domain: domain as string[], range, min: cfg.min, max: cfg.max });
      case 'log':
        return new LogScale({ domain: domain as [number, number], range, min: cfg.min, max: cfg.max, logBase: cfg.logBase });
      default:
        return new LinearScale({ domain: domain as [number, number], range, min: cfg.min, max: cfg.max, nice: cfg.nice });
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
    if (!this.options.responsive || typeof ResizeObserver === 'undefined') return;
    let rafId = 0;
    this.resizeObserver = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        this.resize();
      });
    });
    this.resizeObserver.observe(this.container);
  }

  protected setupInteractions(): void {
    if (this.options.tooltip?.enabled !== false) {
      this.tooltip = new Tooltip(this.container, this.options.tooltip ?? {}, this.theme);
    }

    if (this.options.crosshair?.enabled) {
      this.crosshair = new Crosshair(this.renderer, this.bounds, this.options.crosshair, this.theme);
    }

    if (this.options.zoom?.enabled || this.options.pan?.enabled) {
      this.zoomPan = new ZoomPanController(
        this.container,
        this,
        this.options.zoom,
        this.options.pan
      );
    }

    this.container.addEventListener('pointermove', this.handlePointerMove);
    this.container.addEventListener('pointerleave', this.handlePointerLeave);
    this.container.addEventListener('click', this.handleClick);
  }

  protected setupA11y(): void {
    if (this.options.accessibility?.enabled !== false) {
      this.a11y = new A11yManager(this.container, this.options);
    }
  }

  private handlePointerMove = (e: PointerEvent): void => {
    if (this.isDestroyed) return;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { plot } = this.bounds;
    const inPlot = x >= plot.x && x <= plot.x + plot.width && y >= plot.y && y <= plot.y + plot.height;

    if (!inPlot) {
      this.tooltip?.hide();
      this.crosshair?.hide();
      return;
    }

    this.crosshair?.show(x, y);

    const nearest = this.findNearestDataPoint(x, y);
    if (nearest && this.tooltip) {
      this.tooltip.show(x, y, nearest.context);
      this.emit('hover', {
        series: nearest.context.series.name,
        seriesIndex: nearest.seriesIndex,
        dataIndex: nearest.dataIndex,
        value: nearest.context.yValue,
        x,
        y,
        originalEvent: e
      });
    } else {
      this.tooltip?.hide();
    }
  };

  private handlePointerLeave = (): void => {
    this.tooltip?.hide();
    this.crosshair?.hide();
  };

  private handleClick = (e: MouseEvent): void => {
    if (this.isDestroyed) return;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nearest = this.findNearestDataPoint(x, y);
    if (nearest) {
      this.emit('click', {
        series: nearest.context.series.name,
        seriesIndex: nearest.seriesIndex,
        dataIndex: nearest.dataIndex,
        value: nearest.context.yValue,
        x,
        y,
        originalEvent: e
      });
    }
  };

  protected findNearestDataPoint(
    pixelX: number,
    pixelY: number
  ): { context: TooltipContext; seriesIndex: number; dataIndex: number } | null {
    const seriesList = this.options.data.series ?? [];
    // Skip tooltip search for charts where x/y mapping is meaningless
    if (['pie', 'donut', 'gauge', 'heatmap', 'funnel'].includes(this.options.type)) return null;
    const xScale = this.scales.get('x');
    const yScale = this.scales.get('y');

    if (!xScale || !yScale || seriesList.length === 0) return null;

    let closestDist = Infinity;
    let closestItem: { context: TooltipContext; seriesIndex: number; dataIndex: number } | null = null;

    for (let sIdx = 0; sIdx < seriesList.length; sIdx++) {
      const s = seriesList[sIdx];
      if (!s || s.visible === false || !Array.isArray(s.data)) continue;

      // Decimate very large series so hover stays O(visible) not O(N)
      const stride = s.data.length > 2000 ? Math.ceil(s.data.length / 2000) : 1;

      for (let dIdx = 0; dIdx < s.data.length; dIdx += stride) {
        const pt = s.data[dIdx];
        if (!pt) continue;

        const rawX = pt.x ?? pt.time ?? pt.category ?? dIdx;
        const ptX = xScale.convert(rawX as number | string | Date);
        const ptY = yScale.convert(pt.y ?? pt.close ?? pt.value ?? 0);

        if (!Number.isFinite(ptX) || !Number.isFinite(ptY)) continue;
        const dist = Math.hypot(pixelX - ptX, pixelY - ptY);
        if (dist < closestDist && dist < 60) {
          closestDist = dist;
          closestItem = {
            seriesIndex: sIdx,
            dataIndex: dIdx,
            context: {
              series: s,
              dataIndex: dIdx,
              dataPoint: pt,
              xValue: (pt.x ?? pt.time ?? dIdx) as number | string | Date,
              yValue: (pt.y ?? pt.close ?? pt.value ?? 0) as number
            }
          };
        }
      }
    }

    return closestItem;
  }

  render(): void {
    if (this.isDestroyed) return;
    this.renderer.clear();
    this.renderTitle();
    this.renderLegend();
    this.emit('render', { chart: this });
  }

  protected renderTitle(): void {
    const title = this.options.title;
    if (!title?.text) return;

    const fontSize = title.fontSize ?? 16;
    const fontWeight = title.fontWeight ?? '600';
    const color = title.color ?? this.theme.text;
    const x = this.bounds.margins.left;
    const y = this.bounds.margins.top + fontSize;

    this.renderer.text(x, y, title.text, {
      fill: color,
      fontSize,
      fontWeight,
      fontFamily: this.theme.fontFamily,
      textAnchor: 'start',
      dominantBaseline: 'alphabetic'
    });
  }

  protected renderLegend(): void {
    const legend = this.options.legend;
    if (legend?.enabled === false) return;

    const seriesList = this.options.data.series ?? [];
    if (seriesList.length <= 1 && !this.options.data.categories) return;

    const pos = legend?.position ?? 'bottom';
    const startX = this.bounds.plot.x;
    const startY = pos === 'bottom'
      ? this.bounds.plot.y + this.bounds.plot.height + 25
      : this.bounds.margins.top + 10;

    let curX = startX;
    const itemGap = 20;

    seriesList.forEach((s, idx) => {
      const isVisible = s.visible !== false;
      const baseColor = s.color ?? this.theme.seriesColors[idx % this.theme.seriesColors.length] ?? '#2563eb';
      const color = isVisible ? baseColor : '#94a3b8';
      const label = s.name ?? `Series ${idx + 1}`;
      const itemWidth = 20 + label.length * 7;

      // Colored bullet indicator
      this.renderer.circle(curX + 6, startY, 4, {
        fill: color,
        opacity: isVisible ? 1 : 0.4
      });

      // Series text
      this.renderer.text(curX + 16, startY, label, {
        fill: isVisible ? this.theme.text : '#94a3b8',
        fontSize: 12,
        fontFamily: this.theme.fontFamily,
        dominantBaseline: 'middle',
        opacity: isVisible ? 1 : 0.5
      });

      if (legend?.interactive !== false) {
        const hit = this.renderer.rect(curX, startY - 10, itemWidth, 20, {
          fill: 'transparent'
        });
        hit.addEventListener('click', () => {
          s.visible = s.visible === false;
          legend?.onSeriesClick?.(idx, s.visible);
          this.emit('legendclick', { seriesIndex: idx, visible: s.visible });
          this.render();
        });
        hit.addEventListener('pointerenter', () => {
          legend?.onSeriesHover?.(idx);
          this.emit('legendhover', { seriesIndex: idx });
        });
        hit.addEventListener('pointerleave', () => {
          legend?.onSeriesHover?.(null);
          this.emit('legendhover', { seriesIndex: null });
        });
      }

      curX += itemWidth + itemGap;
    });
  }

  resize(): void {
    if (this.isDestroyed) return;
    // Skip re-render when container is hidden (0-size) — caller can resize on tab show
    if (this.container.clientWidth === 0 || this.container.clientHeight === 0) return;
    const newBounds = this.calculateBounds();
    const widthChanged = newBounds.width !== this.bounds.width;
    const heightChanged = newBounds.height !== this.bounds.height;
    if (!widthChanged && !heightChanged) return;

    this.bounds = newBounds;
    this.renderer.init(this.container, this.bounds.width, this.bounds.height);

    for (const [name, scale] of this.scales) {
      scale.setRange(this.getDefaultRange(name));
    }

    this.crosshair?.updateBounds(this.bounds);

    if (widthChanged || heightChanged) {
      this.emit('resize', { chart: this, bounds: this.bounds });
    }
    this.render();
  }

  setData(data: ChartData): void {
    const normalized = DataAdapter.normalize(data);
    this.options.data = {
      ...data,
      series: normalized.series,
      categories: normalized.categories.length > 0 ? normalized.categories : data.categories
    };
    this.updateScalesFromData();
    this.a11y?.apply();
    this.render();
    this.emit('datachange', { chart: this, data: this.options.data });
  }

  update(options: Partial<ChartOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.theme) {
      this.theme = this.resolveTheme(options.theme);
    }
    if (options.data) {
      const normalized = DataAdapter.normalize(options.data);
      this.options.data = {
        ...options.data,
        series: normalized.series,
        categories: normalized.categories.length > 0 ? normalized.categories : options.data.categories
      };
    }
    if (options.margin || options.padding || options.width || options.height || options.title || options.legend) {
      this.bounds = this.calculateBounds();
      this.renderer.init(this.container, this.bounds.width, this.bounds.height);
      this.crosshair?.updateBounds(this.bounds);
    }
    if (options.axis || options.data) {
      if (options.axis) {
        this.initializeScales();
      }
      this.updateScalesFromData();
    }
    this.a11y?.apply();
    this.render();
    this.emit('update', { chart: this, options });
  }

  appendData(point: DataPoint, seriesIndex = 0): void {
    const series = this.options.data.series;
    if (series && series[seriesIndex]) {
      const normalizedPt = DataAdapter.normalizePoints([point])[0];
      if (normalizedPt) {
        series[seriesIndex].data.push(normalizedPt);
        this.updateScalesFromData();
        this.render();
        this.emit('dataappend', { chart: this, point: normalizedPt, seriesIndex });
      }
    }
  }

  removeData(count: number, seriesIndex = 0): void {
    if (count <= 0) return;
    const series = this.options.data.series;
    if (series && series[seriesIndex]) {
      const arr = series[seriesIndex].data;
      arr.splice(Math.max(0, arr.length - count), count);
      this.updateScalesFromData();
      this.render();
      this.emit('dataremove', { chart: this, count, seriesIndex });
    }
  }

  protected updateScalesFromData(): void {
    // Implemented in chart subclasses
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
    throw new ChartError('SVG export not available for current renderer');
  }

  private async exportPNG(): Promise<Blob> {
    const canvas = this.container.querySelector('canvas');
    if (canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new ChartError('PNG export failed'));
        }, 'image/png');
      });
    }
    // If rendered as SVG, draw SVG onto temp canvas to export PNG
    const svg = this.container.querySelector('svg');
    if (svg) {
      return new Promise((resolve, reject) => {
        const svgString = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.bounds.width;
          tempCanvas.height = this.bounds.height;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            tempCanvas.toBlob((blob) => {
              URL.revokeObjectURL(blobURL);
              if (blob) resolve(blob);
              else reject(new ChartError('PNG export failed'));
            }, 'image/png');
          } else {
            URL.revokeObjectURL(blobURL);
            reject(new ChartError('Canvas context unavailable'));
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobURL);
          reject(new ChartError('Failed to load SVG for export'));
        };
        img.src = blobURL;
      });
    }
    throw new ChartError('PNG export not available');
  }

  on(event: string, handler: EventHandler): () => void {
    this.eventEmitter.on(event, handler as (data?: unknown) => void);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    this.eventEmitter.off(event, handler as (data?: unknown) => void);
  }

  protected emit(type: string, data?: ChartEvent['data']): void {
    this.eventEmitter.emit(type, { type, target: this, data } as ChartEvent);
  }

  use(plugin: ChartPlugin): void {
    plugin.install(this);
    this.plugins.push(plugin);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.container.removeEventListener('pointermove', this.handlePointerMove);
    this.container.removeEventListener('pointerleave', this.handlePointerLeave);
    this.container.removeEventListener('click', this.handleClick);

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.tooltip?.destroy();
    this.crosshair?.destroy();
    this.zoomPan?.destroy();
    this.a11y?.destroy();

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
