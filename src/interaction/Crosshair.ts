import type { CrosshairConfig, Theme, Renderer, ChartBounds, RenderElement } from '../core/ChartConfig';

export class Crosshair {
  private config: CrosshairConfig;
  private theme: Theme;
  private renderer: Renderer;
  private bounds: ChartBounds;
  private vLine: RenderElement | null = null;
  private hLine: RenderElement | null = null;

  constructor(renderer: Renderer, bounds: ChartBounds, config: CrosshairConfig, theme: Theme) {
    this.renderer = renderer;
    this.bounds = bounds;
    this.config = config;
    this.theme = theme;
  }

  updateBounds(bounds: ChartBounds): void {
    this.bounds = bounds;
  }

  show(x: number, y: number): void {
    if (this.config.enabled === false) return;

    const { plot } = this.bounds;
    const clampedX = Math.max(plot.x, Math.min(plot.x + plot.width, x));
    const clampedY = Math.max(plot.y, Math.min(plot.y + plot.height, y));
    const color = this.config.color ?? this.theme.crosshairColor ?? '#9ca3af';
    const strokeDasharray = this.config.dash ?? [3, 3];
    const strokeWidth = this.config.lineWidth ?? 1;

    this.hide();

    if (this.config.vertical !== false) {
      this.vLine = this.renderer.line(clampedX, plot.y, clampedX, plot.y + plot.height, {
        stroke: color,
        strokeWidth,
        strokeDasharray
      });
    }

    if (this.config.horizontal) {
      this.hLine = this.renderer.line(plot.x, clampedY, plot.x + plot.width, clampedY, {
        stroke: color,
        strokeWidth,
        strokeDasharray
      });
    }
  }

  hide(): void {
    if (this.vLine) {
      this.vLine.destroy();
      this.vLine = null;
    }
    if (this.hLine) {
      this.hLine.destroy();
      this.hLine = null;
    }
  }

  destroy(): void {
    this.hide();
  }
}
