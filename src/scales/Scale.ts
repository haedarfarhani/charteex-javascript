export interface ScaleConfig {
  domain?: [number, number] | [Date, Date] | string[];
  range: [number, number];
  min?: number | Date;
  max?: number | Date;
  nice?: boolean;
  logBase?: number;
}

export abstract class Scale {
  protected domain: [number, number] | [Date, Date] | string[] = [0, 1];
  protected range: [number, number] = [0, 1];
  protected originalDomain: [number, number] | [Date, Date] | string[] = [0, 1];
  protected originalRange: [number, number] = [0, 1];

  constructor(config: ScaleConfig) {
    if (config.domain) {
      this.domain = config.domain;
      this.originalDomain = [...config.domain] as [number, number] | [Date, Date] | string[];
    }
    this.range = config.range;
    this.originalRange = [...config.range];
    if (config.min !== undefined || config.max !== undefined) {
      this.domain = this.applyMinMax(config.min, config.max);
    }
  }

  protected applyMinMax(min?: number | Date, max?: number | Date): [number, number] | [Date, Date] | string[] {
    const [dMin, dMax] = this.domain as [number, number] | [Date, Date];
    const newMin = min !== undefined ? min : dMin;
    const newMax = max !== undefined ? max : dMax;
    return [newMin, newMax] as [number, number] | [Date, Date];
  }

  abstract convert(value: number | Date | string): number;
  abstract invert(value: number): number | Date | string;

  setRange(range: [number, number]): void {
    this.range = range;
  }

  setDomain(domain: [number, number] | [Date, Date] | string[]): void {
    this.domain = domain;
    this.originalDomain = [...domain] as [number, number] | [Date, Date] | string[];
  }

  getDomain(): [number, number] | [Date, Date] | string[] {
    return this.domain;
  }

  getRange(): [number, number] {
    return this.range;
  }

  zoom(factor: number, centerX?: number, _centerY?: number): void {
    const [rMin, rMax] = this.range;
    const center = centerX ?? (rMin + rMax) / 2;
    const newMin = center - (center - rMin) * factor;
    const newMax = center + (rMax - center) * factor;
    this.range = [newMin, newMax];
  }

  pan(deltaX: number, deltaY: number): void {
    const delta = deltaX !== 0 ? deltaX : deltaY;
    this.range = [this.range[0] + delta, this.range[1] + delta];
  }

  reset(): void {
    this.domain = [...this.originalDomain] as [number, number] | [Date, Date] | string[];
    this.range = [...this.originalRange];
  }

  abstract getTicks(count?: number): { value: number | Date | string; label: string }[];

  protected lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  protected clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

export class LinearScale extends Scale {
  private niceDomain: boolean = false;

  constructor(config: ScaleConfig) {
    super(config);
    this.niceDomain = config.nice ?? false;
    if (this.niceDomain) {
      this.domain = this.nice(this.domain as [number, number]);
    }
  }

  convert(value: number | Date | string): number {
    const num = typeof value === 'number' ? value : Number(value);
    const [dMin, dMax] = this.domain as [number, number];
    const [rMin, rMax] = this.range;

    if (dMax === dMin) return rMin;

    const t = (num - dMin) / (dMax - dMin);
    return this.lerp(rMin, rMax, t);
  }

  invert(value: number): number {
    const [dMin, dMax] = this.domain as [number, number];
    const [rMin, rMax] = this.range;

    if (rMax === rMin) return dMin;

    const t = (value - rMin) / (rMax - rMin);
    return this.lerp(dMin, dMax, t);
  }

  override getTicks(count = 10): { value: number; label: string }[] {
    const [dMin, dMax] = this.domain as [number, number];
    const span = dMax - dMin;
    if (span <= 0) return [{ value: dMin, label: String(dMin) }];

    const step = this.niceStep(span / count);
    const start = Math.ceil(dMin / step) * step;
    const ticks: { value: number; label: string }[] = [];

    for (let v = start; v <= dMax + step * 0.5; v += step) {
      ticks.push({ value: v, label: this.formatTick(v) });
    }
    return ticks;
  }

  private niceStep(step: number): number {
    const exp = Math.floor(Math.log10(step));
    const frac = step / Math.pow(10, exp);
    let niceFrac: number;
    if (frac <= 1) niceFrac = 1;
    else if (frac <= 2) niceFrac = 2;
    else if (frac <= 5) niceFrac = 5;
    else niceFrac = 10;
    return niceFrac * Math.pow(10, exp);
  }

  private nice(domain: [number, number]): [number, number] {
    const [min, max] = domain;
    if (min === max) return [min - 1, max + 1];
    const step = this.niceStep((max - min) / 10);
    return [
      Math.floor(min / step) * step,
      Math.ceil(max / step) * step
    ];
  }

  private formatTick(value: number): string {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-3 && value !== 0)) {
      return value.toExponential(1);
    }
    return value.toString();
  }
}

export class TimeScale extends Scale {
  convert(value: number | Date | string): number {
    const date = value instanceof Date ? value : new Date(value);
    const time = date.getTime();
    const [dMin, dMax] = this.domain as [Date, Date];
    const [rMin, rMax] = this.range;

    const dMinTime = dMin.getTime();
    const dMaxTime = dMax.getTime();

    if (dMaxTime === dMinTime) return rMin;

    const t = (time - dMinTime) / (dMaxTime - dMinTime);
    return this.lerp(rMin, rMax, t);
  }

  invert(value: number): Date {
    const [dMin, dMax] = this.domain as [Date, Date];
    const [rMin, rMax] = this.range;

    const dMinTime = dMin.getTime();
    const dMaxTime = dMax.getTime();

    if (rMax === rMin) return dMin;

    const t = (value - rMin) / (rMax - rMin);
    const time = this.lerp(dMinTime, dMaxTime, t);
    return new Date(time);
  }

  override getTicks(count = 10): { value: Date; label: string }[] {
    const [dMin, dMax] = this.domain as [Date, Date];
    const span = dMax.getTime() - dMin.getTime();
    if (span <= 0) return [{ value: dMin, label: this.formatDate(dMin) }];

    const intervals = [
      { unit: 'millisecond', step: 1 },
      { unit: 'second', step: 1000 },
      { unit: 'minute', step: 60 * 1000 },
      { unit: 'hour', step: 60 * 60 * 1000 },
      { unit: 'day', step: 24 * 60 * 60 * 1000 },
      { unit: 'week', step: 7 * 24 * 60 * 60 * 1000 },
      { unit: 'month', step: 30 * 24 * 60 * 60 * 1000 },
      { unit: 'year', step: 365 * 24 * 60 * 60 * 1000 }
    ];

    const targetStep = span / count;
    let bestInterval = intervals[0];
    for (const interval of intervals) {
      if (interval.step >= targetStep) {
        bestInterval = interval;
        break;
      }
    }

    const step = bestInterval!.step;
    const start = new Date(Math.ceil(dMin.getTime() / step) * step);
    const ticks: { value: Date; label: string }[] = [];

    for (let time = start.getTime(); time <= dMax.getTime() + step * 0.5; time += step) {
      const date = new Date(time);
      ticks.push({ value: date, label: this.formatDate(date) });
    }
    return ticks;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  }
}

export class CategoryScale extends Scale {
  private categories: string[] = [];
  private bandWidth: number = 0;

  constructor(config: ScaleConfig) {
    super(config);
    if (config.domain) {
      this.categories = config.domain as string[];
    }
    this.updateBandWidth();
  }

  convert(value: number | Date | string): number {
    const str = String(value);
    const index = this.categories.indexOf(str);
    if (index === -1) return this.range[0];

    const [rMin, rMax] = this.range;
    const step = (rMax - rMin) / this.categories.length;
    return rMin + index * step + step / 2;
  }

  invert(value: number): string {
    const [rMin, rMax] = this.range;
    if (rMax === rMin) return this.categories[0] ?? '';

    const t = (value - rMin) / (rMax - rMin);
    const index = Math.floor(t * this.categories.length);
    const clamped = this.clamp(index, 0, this.categories.length - 1);
    return this.categories[clamped] ?? '';
  }

  override setDomain(domain: [number, number] | [Date, Date] | string[]): void {
    super.setDomain(domain);
    this.categories = domain as string[];
    this.updateBandWidth();
  }

  private updateBandWidth(): void {
    const [rMin, rMax] = this.range;
    this.bandWidth = this.categories.length > 0 ? (rMax - rMin) / this.categories.length : 0;
  }

  getBandWidth(): number {
    return this.bandWidth;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  override getTicks(): { value: string; label: string }[] {
    return this.categories.map((c) => ({ value: c, label: c }));
  }
}

export class LogScale extends Scale {
  private logBase: number = 10;

  constructor(config: ScaleConfig) {
    super(config);
    this.logBase = config.logBase ?? 10;
    if (config.domain) {
      this.domain = this.logDomain(config.domain as [number, number]);
    }
  }

  private logDomain(domain: [number, number]): [number, number] {
    const [min, max] = domain;
    if (min <= 0 || max <= 0) {
      return [1, this.logBase];
    }
    return [Math.log(min) / Math.log(this.logBase), Math.log(max) / Math.log(this.logBase)];
  }

  convert(value: number | Date | string): number {
    const num = typeof value === 'number' ? value : Number(value);
    if (num <= 0) return this.range[0];

    const logValue = Math.log(num) / Math.log(this.logBase);
    const [dMin, dMax] = this.domain as [number, number];
    const [rMin, rMax] = this.range;

    if (dMax === dMin) return rMin;

    const t = (logValue - dMin) / (dMax - dMin);
    return this.lerp(rMin, rMax, t);
  }

  invert(value: number): number {
    const [dMin, dMax] = this.domain as [number, number];
    const [rMin, rMax] = this.range;

    if (rMax === rMin) return Math.pow(this.logBase, dMin);

    const t = (value - rMin) / (rMax - rMin);
    const logValue = this.lerp(dMin, dMax, t);
    return Math.pow(this.logBase, logValue);
  }

  override getTicks(count = 10): { value: number; label: string }[] {
    const [dMin, dMax] = this.domain as [number, number];
    const ticks: { value: number; label: string }[] = [];

    const minExp = Math.ceil(dMin);
    const maxExp = Math.floor(dMax);

    for (let exp = minExp; exp <= maxExp; exp++) {
      const value = Math.pow(this.logBase, exp);
      ticks.push({ value, label: this.formatTick(value) });
    }

    if (ticks.length > count) {
      const step = Math.ceil(ticks.length / count);
      return ticks.filter((_t, i) => i % step === 0);
    }
    return ticks;
  }

  private formatTick(value: number): string {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(0) + 'M';
    }
    if (value >= 1e3) {
      return (value / 1e3).toFixed(0) + 'K';
    }
    return value.toString();
  }
}