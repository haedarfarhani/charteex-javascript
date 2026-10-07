/**
 * Zero-dependency date utilities for TimeScale and Financial charts.
 */

export function toTimestamp(value: number | string | Date | undefined | null): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (value instanceof Date) {
    const t = value.getTime();
    return isNaN(t) ? 0 : t;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) return parsed;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function formatDate(timestamp: number, format: 'auto' | 'time' | 'date' | 'datetime' | 'year' = 'auto'): string {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  if (format === 'time') return `${hours}:${minutes}:${seconds}`;
  if (format === 'date') return `${year}-${month}-${day}`;
  if (format === 'datetime') return `${year}-${month}-${day} ${hours}:${minutes}`;
  if (format === 'year') return `${year}`;

  return `${month}/${day} ${hours}:${minutes}`;
}
