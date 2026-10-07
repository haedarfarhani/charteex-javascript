import type { EasingType, AnimationConfig } from '../core/ChartConfig';

export type EasingFunction = (t: number) => number;

export const easings: Record<EasingType, EasingFunction> = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  cubic: (t) => t * t * t,
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export class AnimationManager {
  private frameId: number | null = null;
  private startTime: number | null = null;

  animate(
    config: AnimationConfig,
    onProgress: (progress: number) => void,
    onComplete?: () => void
  ): void {
    this.cancel();

    if (!config.enabled || (config.duration ?? 0) <= 0) {
      onProgress(1);
      onComplete?.();
      return;
    }

    const duration = config.duration ?? 600;
    const easingFn = easings[config.easing ?? 'easeOut'] ?? easings.easeOut;

    const step = (timestamp: number) => {
      if (!this.startTime) this.startTime = timestamp;
      const elapsed = timestamp - this.startTime;
      const rawProgress = Math.min(1, Math.max(0, elapsed / duration));
      const easedProgress = easingFn(rawProgress);

      onProgress(easedProgress);

      if (rawProgress < 1) {
        this.frameId = requestAnimationFrame(step);
      } else {
        this.frameId = null;
        this.startTime = null;
        onComplete?.();
      }
    };

    this.frameId = requestAnimationFrame(step);
  }

  cancel(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.startTime = null;
  }
}
