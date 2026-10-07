import type { ChartOptions } from '../core/ChartConfig';
import { escapeHtml } from '../utilities/format';

export class A11yManager {
  private container: HTMLElement;
  private options: ChartOptions;
  private srElement: HTMLElement | null = null;

  constructor(container: HTMLElement, options: ChartOptions) {
    this.container = container;
    this.options = options;
    this.apply();
  }

  apply(): void {
    if (this.options.accessibility?.enabled === false) return;

    const label = this.options.accessibility?.label ?? (this.options.title?.text || `${this.options.type} chart`);
    const description = this.options.accessibility?.description;

    this.container.setAttribute('role', 'img');
    this.container.setAttribute('aria-roledescription', 'chart');
    this.container.setAttribute('aria-label', label);

    if (!this.srElement) {
      this.srElement = document.createElement('div');
      this.srElement.className = 'smart-chart-sr-only';
      this.srElement.style.position = 'absolute';
      this.srElement.style.width = '1px';
      this.srElement.style.height = '1px';
      this.srElement.style.padding = '0';
      this.srElement.style.margin = '-1px';
      this.srElement.style.overflow = 'hidden';
      this.srElement.style.clip = 'rect(0, 0, 0, 0)';
      this.srElement.style.whiteSpace = 'nowrap';
      this.srElement.style.border = '0';
      this.container.appendChild(this.srElement);
    }

    const series = this.options.data.series ?? [];
    let summary = `<p>${escapeHtml(label)}${description ? `: ${escapeHtml(description)}` : ''}</p>`;
    if (series.length > 0) {
      summary += `<ul>`;
      for (const s of series) {
        summary += `<li>${escapeHtml(s.name ?? 'Series')}: ${s.data.length} data points</li>`;
      }
      summary += `</ul>`;
    }
    this.srElement.innerHTML = summary;
  }

  destroy(): void {
    if (this.srElement) {
      this.srElement.remove();
      this.srElement = null;
    }
    this.container.removeAttribute('role');
    this.container.removeAttribute('aria-roledescription');
    this.container.removeAttribute('aria-label');
  }
}
