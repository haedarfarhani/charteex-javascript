import type { TooltipConfig, Theme, TooltipContext } from '../core/ChartConfig';
import { escapeHtml, formatNumber } from '../utilities/format';

export class Tooltip {
  private element: HTMLElement | null = null;
  private container: HTMLElement;
  private config: TooltipConfig;
  private theme: Theme;
  private visible = false;

  constructor(container: HTMLElement, config: TooltipConfig, theme: Theme) {
    this.container = container;
    this.config = config;
    this.theme = theme;
    if (this.config.enabled !== false) {
      this.init();
    }
  }

  private init(): void {
    if (this.element) return;
    this.element = document.createElement('div');
    this.element.className = 'charteex-tooltip';
    this.element.style.position = 'absolute';
    this.element.style.display = 'none';
    this.element.style.pointerEvents = 'none';
    this.element.style.zIndex = '9999';
    this.element.style.transition = 'opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s ease-out';
    this.element.style.padding = `${this.config.padding ?? 8}px 12px`;
    this.element.style.borderRadius = `${this.config.borderRadius ?? (this.theme.tokens?.radius?.md ?? 6)}px`;
    this.element.style.fontSize = `${this.config.fontSize ?? 12}px`;
    this.element.style.fontFamily = this.config.fontFamily ?? this.theme.fontFamily;
    this.element.style.boxShadow = '0 4px 14px -1px rgba(0,0,0,0.18), 0 2px 6px -1px rgba(0,0,0,0.12)';
    this.element.style.backdropFilter = 'blur(8px)';

    this.updateThemeStyles();

    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(this.element);
  }

  private updateThemeStyles(): void {
    if (!this.element) return;
    const isDark = this.config.theme === 'dark' || (this.config.theme !== 'light' && this.theme.name !== 'light' && this.theme.name !== 'minimal');
    const defaultBg = isDark ? '#1e293b' : '#ffffff';
    const defaultColor = isDark ? '#f8fafc' : '#0f172a';
    const defaultBorder = isDark ? '#334155' : '#e2e8f0';

    this.element.style.backgroundColor = this.config.background ?? this.theme.tooltipBackground ?? defaultBg;
    this.element.style.color = this.config.color ?? this.theme.tooltipColor ?? defaultColor;
    this.element.style.border = `1px solid ${this.theme.tokens?.colors?.tooltip?.border ?? defaultBorder}`;
  }

  show(x: number, y: number, context: TooltipContext): void {
    if (!this.element || this.config.enabled === false) return;

    if (this.config.render) {
      const customOutput = this.config.render(context);
      if (typeof customOutput === 'string') {
        this.element.innerHTML = customOutput;
      } else if (customOutput instanceof HTMLElement) {
        this.element.innerHTML = '';
        this.element.appendChild(customOutput);
      }
    } else if (this.config.formatter) {
      this.element.innerHTML = this.config.formatter(context.dataPoint, context);
    } else {
      const seriesName = escapeHtml(context.series.name ?? 'Series');
      const point = context.dataPoint;
      const xVal = point.x !== undefined ? escapeHtml(String(point.x)) : (point.time !== undefined ? escapeHtml(String(point.time)) : '');
      const yVal = point.y !== undefined ? formatNumber(point.y) : (point.value !== undefined ? formatNumber(point.value) : '');

      let extra = '';
      if (point.open !== undefined && point.close !== undefined) {
        extra = `<div style="font-size:11px;opacity:0.85;margin-top:4px;display:flex;gap:8px;"><span>O: <b>${formatNumber(point.open)}</b></span> <span>H: <b>${formatNumber(point.high ?? 0)}</b></span> <span>L: <b>${formatNumber(point.low ?? 0)}</b></span> <span>C: <b>${formatNumber(point.close)}</b></span></div>`;
      }

      const bulletColor = context.series.color ?? '#2563eb';
      this.element.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;font-weight:600;margin-bottom:2px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${bulletColor};display:inline-block;"></span>
          <span>${seriesName}</span>
        </div>
        ${xVal ? `<div style="font-size:11px;opacity:0.75;margin-bottom:2px;">${xVal}</div>` : ''}
        ${yVal ? `<div style="font-weight:600;font-size:13px;">${yVal}</div>` : ''}
        ${extra}
      `;
    }

    this.element.style.display = 'block';
    this.element.style.opacity = '1';

    const rect = this.container.getBoundingClientRect();
    const tooltipRect = this.element.getBoundingClientRect();

    let posX = x + 15;
    let posY = y - tooltipRect.height / 2;

    if (posX + tooltipRect.width > rect.width) {
      posX = x - tooltipRect.width - 15;
    }
    if (posY < 6) posY = 6;
    if (posY + tooltipRect.height > rect.height) {
      posY = rect.height - tooltipRect.height - 6;
    }

    this.element.style.left = `${posX}px`;
    this.element.style.top = `${posY}px`;
    this.visible = true;
  }

  hide(): void {
    if (!this.element || !this.visible) return;
    this.element.style.display = 'none';
    this.element.style.opacity = '0';
    this.visible = false;
  }

  destroy(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
