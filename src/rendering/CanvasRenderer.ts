import type {
  Renderer,
  RenderElement,
  LineOptions,
  RectOptions,
  CircleOptions,
  PathOptions,
  TextOptions
} from '../core/ChartConfig';

interface CanvasRenderElement extends RenderElement {
  _draw: (ctx: CanvasRenderingContext2D) => void;
  _type: string;
  _bounds: { x: number; y: number; width: number; height: number };
}

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private container: HTMLElement | null = null;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private elements: CanvasRenderElement[] = [];
  private elementId = 0;
  private gradients: Map<string, CanvasGradient> = new Map();

  init(container: HTMLElement, width: number, height: number): void {
    this.container = container;
    this.width = width;
    this.height = height;
    this.dpr = window.devicePixelRatio || 1;

    this.container.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.display = 'block';

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.dpr, this.dpr);

    this.container.appendChild(this.canvas);
    this.elements = [];
  }

  clear(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    this.elements = [];
  }

  private generateId(): string {
    return `cc-${++this.elementId}`;
  }

  private createRenderElement(draw: (ctx: CanvasRenderingContext2D) => void, type: string, bounds: { x: number; y: number; width: number; height: number }): CanvasRenderElement {
    if (this.ctx) {
      draw(this.ctx);
    }
    const element: CanvasRenderElement = {
      id: this.generateId(),
      type,
      setAttribute: () => {},
      removeAttribute: () => {},
      setStyle: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      removeChild: () => {},
      destroy: () => {
        const index = this.elements.indexOf(element);
        if (index !== -1) this.elements.splice(index, 1);
      },
      _draw: draw,
      _type: type,
      _bounds: bounds
    };
    this.elements.push(element);
    return element;
  }

  line(x1: number, y1: number, x2: number, y2: number, options: LineOptions = {}): RenderElement {
    return this.createRenderElement(
      (ctx) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = options.stroke ?? '#000';
        ctx.lineWidth = options.strokeWidth ?? 1;
        if (options.strokeDasharray) {
          let dash: number[];
          if (Array.isArray(options.strokeDasharray)) {
            dash = options.strokeDasharray.filter((d): d is number => typeof d === 'number');
          } else {
            dash = typeof options.strokeDasharray === 'number' ? [options.strokeDasharray] : [];
          }
          if (dash.length > 0) ctx.setLineDash(dash);
        }
        ctx.lineCap = options.strokeLinecap ?? 'butt';
        ctx.lineJoin = options.strokeLinejoin ?? 'miter';
        ctx.globalAlpha = options.opacity ?? 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      },
      'line',
      { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) }
    );
  }

  rect(x: number, y: number, width: number, height: number, options: RectOptions = {}): RenderElement {
    const w = Math.max(0, width);
    const h = Math.max(0, height);
    return this.createRenderElement(
      (ctx) => {
        ctx.beginPath();
        const rx = options.rx ?? 0;
        const ry = options.ry ?? 0;
        if (rx > 0 || ry > 0) {
          const r = Math.min(rx, ry, w / 2, h / 2);
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
        } else {
          ctx.rect(x, y, w, h);
        }
        if (options.fill) {
          ctx.fillStyle = options.fill;
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.fill();
        }
        if (options.stroke) {
          ctx.strokeStyle = options.stroke;
          ctx.lineWidth = options.strokeWidth ?? 1;
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      },
      'rect',
      { x, y, width: w, height: h }
    );
  }

  circle(cx: number, cy: number, r: number, options: CircleOptions = {}): RenderElement {
    const radius = Math.max(0, r);
    return this.createRenderElement(
      (ctx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (options.fill) {
          ctx.fillStyle = options.fill;
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.fill();
        }
        if (options.stroke) {
          ctx.strokeStyle = options.stroke;
          ctx.lineWidth = options.strokeWidth ?? 1;
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      },
      'circle',
      { x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 }
    );
  }

  path(d: string, options: PathOptions = {}): RenderElement {
    return this.createRenderElement(
      (ctx) => {
        const path = new Path2D(d);
        if (options.fill) {
          ctx.fillStyle = options.fill;
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.fill(path);
        }
        if (options.stroke) {
          ctx.strokeStyle = options.stroke;
          ctx.lineWidth = options.strokeWidth ?? 1;
          if (options.strokeDasharray) {
            let dash: number[];
            if (Array.isArray(options.strokeDasharray)) {
              dash = options.strokeDasharray.filter((d): d is number => typeof d === 'number');
            } else {
              dash = typeof options.strokeDasharray === 'number' ? [options.strokeDasharray] : [];
            }
            if (dash.length > 0) ctx.setLineDash(dash);
          }
          ctx.globalAlpha = options.opacity ?? 1;
          ctx.stroke(path);
          ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
      },
      'path',
      { x: 0, y: 0, width: this.width, height: this.height }
    );
  }

  text(x: number, y: number, text: string, options: TextOptions = {}): RenderElement {
    const fontSize = options.fontSize ?? 12;
    const fontFamily = options.fontFamily ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const fontWeight = options.fontWeight ?? 'normal';

    // Convert dominantBaseline to valid CanvasTextBaseline
    const getCanvasBaseline = (baseline?: string): CanvasTextBaseline => {
      switch (baseline) {
        case 'top':
        case 'text-top':
        case 'hanging':
          return 'top';
        case 'middle':
        case 'central':
        case 'mathematical':
          return 'middle';
        case 'bottom':
        case 'text-bottom':
        case 'ideographic':
        case 'alphabetic':
        default:
          return 'alphabetic';
      }
    };

    return this.createRenderElement(
      (ctx) => {
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = options.fill ?? '#000';
        ctx.textAlign = options.textAnchor === 'middle' ? 'center' : options.textAnchor === 'end' ? 'right' : 'left';
        ctx.textBaseline = getCanvasBaseline(options.dominantBaseline);
        ctx.globalAlpha = options.opacity ?? 1;

        if (options.rotate) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((options.rotate * Math.PI) / 180);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(text, x, y);
        }
        ctx.globalAlpha = 1;
      },
      'text',
      { x: x - 50, y: y - fontSize, width: 100, height: fontSize * 2 }
    );
  }

  group(children: RenderElement[] = []): RenderElement {
    const childElements = children as CanvasRenderElement[];
    return this.createRenderElement(
      (ctx) => {
        for (const child of childElements) {
          child._draw(ctx);
        }
      },
      'group',
      { x: 0, y: 0, width: this.width, height: this.height }
    );
  }

  render(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const element of this.elements) {
      element._draw(this.ctx);
    }
  }

  destroy(): void {
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.ctx = null;
    this.container = null;
    this.elements = [];
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  createGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%'): string {
    if (!this.ctx) return id;
    const parsePercent = (val: string, max: number) => {
      if (val.endsWith('%')) return (parseFloat(val) / 100) * max;
      return parseFloat(val);
    };
    const gradient = this.ctx.createLinearGradient(
      parsePercent(x1, this.width),
      parsePercent(y1, this.height),
      parsePercent(x2, this.width),
      parsePercent(y2, this.height)
    );
    for (const stop of stops) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    this.gradients.set(id, gradient);
    return id;
  }

  createRadialGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], cx = '50%', cy = '50%', r = '50%'): string {
    if (!this.ctx) return id;
    const parsePercent = (val: string, max: number) => {
      if (val.endsWith('%')) return (parseFloat(val) / 100) * max;
      return parseFloat(val);
    };
    const gradient = this.ctx.createRadialGradient(
      parsePercent(cx, this.width),
      parsePercent(cy, this.height),
      0,
      parsePercent(cx, this.width),
      parsePercent(cy, this.height),
      parsePercent(r, Math.max(this.width, this.height))
    );
    for (const stop of stops) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    this.gradients.set(id, gradient);
    return id;
  }
}