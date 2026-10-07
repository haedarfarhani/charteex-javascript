import type {
  Renderer,
  RenderElement,
  LineOptions,
  RectOptions,
  CircleOptions,
  PathOptions,
  TextOptions
} from '../core/ChartConfig';

const SVG_NS = 'http://www.w3.org/2000/svg';

export class SVGRenderer implements Renderer {
  private svg: SVGSVGElement | null = null;
  private container: HTMLElement | null = null;
  private width = 0;
  private height = 0;
  private elementId = 0;
  private defs: SVGDefsElement | null = null;

  init(container: HTMLElement, width: number, height: number): void {
    this.container = container;
    this.width = width;
    this.height = height;

    this.container.innerHTML = '';

    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('width', String(width));
    this.svg.setAttribute('height', String(height));
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.style.display = 'block';
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.svg.style.overflow = 'visible';

    this.defs = document.createElementNS(SVG_NS, 'defs');
    this.svg.appendChild(this.defs);

    this.container.appendChild(this.svg);
  }

  clear(): void {
    if (this.svg) {
      while (this.svg.firstChild) {
        if (this.svg.firstChild !== this.defs) {
          this.svg.removeChild(this.svg.firstChild);
        } else {
          break;
        }
      }
      if (this.defs) {
        while (this.defs.firstChild) {
          this.defs.removeChild(this.defs.firstChild);
        }
      }
    }
  }

  private createElement<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attributes: Record<string, string | number> = {}
  ): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, String(value));
    }
    return element;
  }

  private generateId(): string {
    return `sc-${++this.elementId}`;
  }

  private wrapElement(element: SVGElement): RenderElement {
    return {
      id: element.id || this.generateId(),
      type: element.tagName,
      setAttribute: (name: string, value: string | number) => element.setAttribute(name, String(value)),
      removeAttribute: (name: string) => element.removeAttribute(name),
      setStyle: (name: string, value: string) => { (element.style as unknown as Record<string, string>)[name] = value; },
      addEventListener: (type: string, listener: EventListener) => element.addEventListener(type, listener),
      removeEventListener: (type: string, listener: EventListener) => element.removeEventListener(type, listener),
      appendChild: (child: RenderElement) => {
        if ('_element' in child) {
          element.appendChild((child as RenderElement & { _element: SVGElement })._element);
        }
      },
      removeChild: (child: RenderElement) => {
        if ('_element' in child) {
          element.removeChild((child as RenderElement & { _element: SVGElement })._element);
        }
      },
      destroy: () => element.remove(),
      _element: element
    } as RenderElement & { _element: SVGElement };
  }

  line(x1: number, y1: number, x2: number, y2: number, options: LineOptions = {}): RenderElement {
    const line = this.createElement('line', {
      x1,
      y1,
      x2,
      y2,
      stroke: options.stroke ?? 'currentColor',
      'stroke-width': options.strokeWidth ?? 1,
      'stroke-dasharray': options.strokeDasharray ? (Array.isArray(options.strokeDasharray) ? options.strokeDasharray.join(',') : options.strokeDasharray) : 'none',
      'stroke-linecap': options.strokeLinecap ?? 'butt',
      'stroke-linejoin': options.strokeLinejoin ?? 'miter',
      fill: options.fill ?? 'none',
      opacity: options.opacity ?? 1
    });
    return this.wrapElement(line);
  }

  rect(x: number, y: number, width: number, height: number, options: RectOptions = {}): RenderElement {
    const rect = this.createElement('rect', {
      x,
      y,
      width: Math.max(0, width),
      height: Math.max(0, height),
      fill: options.fill ?? 'none',
      stroke: options.stroke ?? 'none',
      'stroke-width': options.strokeWidth ?? 1,
      rx: options.rx ?? 0,
      ry: options.ry ?? 0,
      opacity: options.opacity ?? 1
    });
    return this.wrapElement(rect);
  }

  circle(cx: number, cy: number, r: number, options: CircleOptions = {}): RenderElement {
    const circle = this.createElement('circle', {
      cx,
      cy,
      r: Math.max(0, r),
      fill: options.fill ?? 'none',
      stroke: options.stroke ?? 'none',
      'stroke-width': options.strokeWidth ?? 1,
      opacity: options.opacity ?? 1
    });
    return this.wrapElement(circle);
  }

  path(d: string, options: PathOptions = {}): RenderElement {
    const path = this.createElement('path', {
      d,
      fill: options.fill ?? 'none',
      stroke: options.stroke ?? 'none',
      'stroke-width': options.strokeWidth ?? 1,
      'stroke-dasharray': options.strokeDasharray ? (Array.isArray(options.strokeDasharray) ? options.strokeDasharray.join(',') : options.strokeDasharray) : 'none',
      opacity: options.opacity ?? 1
    });
    return this.wrapElement(path);
  }

  text(x: number, y: number, text: string, options: TextOptions = {}): RenderElement {
    const textElement = this.createElement('text', {
      x,
      y,
      fill: options.fill ?? 'currentColor',
      'font-size': options.fontSize ?? 12,
      'font-family': options.fontFamily ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-weight': options.fontWeight ?? 'normal',
      'text-anchor': options.textAnchor ?? 'start',
      'dominant-baseline': options.dominantBaseline ?? 'alphabetic',
      opacity: options.opacity ?? 1
    });
    textElement.textContent = text;

    if (options.rotate) {
      textElement.setAttribute('transform', `rotate(${options.rotate} ${x} ${y})`);
    } else if (options.transform) {
      textElement.setAttribute('transform', options.transform);
    }

    return this.wrapElement(textElement);
  }

  group(children: RenderElement[] = []): RenderElement {
    const group = this.createElement('g', {});
    for (const child of children) {
      if ('_element' in child) {
        group.appendChild((child as RenderElement & { _element: SVGElement })._element);
      }
    }
    return this.wrapElement(group);
  }

  createGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%'): string {
    if (!this.defs) return id;

    const gradient = this.createElement('linearGradient', {
      id,
      x1, y1, x2, y2
    });

    for (const stop of stops) {
      const stopElement = this.createElement('stop', {
        offset: `${stop.offset * 100}%`,
        'stop-color': stop.color,
        'stop-opacity': stop.opacity ?? 1
      });
      gradient.appendChild(stopElement);
    }

    this.defs.appendChild(gradient);
    return `url(#${id})`;
  }

  createRadialGradient(id: string, stops: { offset: number; color: string; opacity?: number }[], cx = '50%', cy = '50%', r = '50%'): string {
    if (!this.defs) return id;

    const gradient = this.createElement('radialGradient', {
      id,
      cx, cy, r
    });

    for (const stop of stops) {
      const stopElement = this.createElement('stop', {
        offset: `${stop.offset * 100}%`,
        'stop-color': stop.color,
        'stop-opacity': stop.opacity ?? 1
      });
      gradient.appendChild(stopElement);
    }

    this.defs.appendChild(gradient);
    return `url(#${id})`;
  }

  destroy(): void {
    if (this.svg) {
      this.svg.remove();
      this.svg = null;
    }
    this.container = null;
    this.defs = null;
  }

  getSVG(): SVGSVGElement | null {
    return this.svg;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}