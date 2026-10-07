import type { ZoomConfig, PanConfig, ChartInstance } from '../core/ChartConfig';

export class ZoomPanController {
  private container: HTMLElement;
  private chart: ChartInstance;
  private zoomConfig: ZoomConfig;
  private panConfig: PanConfig;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialPinchDist = 0;

  constructor(
    container: HTMLElement,
    chart: ChartInstance,
    zoomConfig: ZoomConfig = {},
    panConfig: PanConfig = {}
  ) {
    this.container = container;
    this.chart = chart;
    this.zoomConfig = zoomConfig;
    this.panConfig = panConfig;

    this.bindEvents();
  }

  private onWheel = (e: WheelEvent): void => {
    if (!this.zoomConfig.enabled || this.zoomConfig.wheel === false) return;
    e.preventDefault();

    const rect = this.container.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    const delta = e.deltaY;
    const factor = delta > 0 ? 0.9 : 1.1;

    this.chart.zoom(factor, centerX, centerY);
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (!this.panConfig.enabled || this.panConfig.drag === false) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.container.setPointerCapture?.(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging) return;
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;

    this.chart.pan(deltaX, deltaY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.releasePointerCapture?.(e.pointerId);
  };

  private onTouchStart = (e: TouchEvent): void => {
    if (e.touches.length === 2 && this.zoomConfig.enabled && this.zoomConfig.pinch !== false) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      if (t1 && t2) {
        this.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      }
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 2 && this.zoomConfig.enabled && this.zoomConfig.pinch !== false) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      if (!t1 || !t2) return;

      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (this.initialPinchDist > 0) {
        const factor = dist / this.initialPinchDist;
        const rect = this.container.getBoundingClientRect();
        const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
        const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

        this.chart.zoom(factor, midX, midY);
        this.initialPinchDist = dist;
      }
    }
  };

  private bindEvents(): void {
    this.container.addEventListener('wheel', this.onWheel, { passive: false });
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerUp);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: false });
  }

  destroy(): void {
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointercancel', this.onPointerUp);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
  }
}
