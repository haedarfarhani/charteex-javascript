export interface ArcConfig {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number; // in radians
  endAngle: number;   // in radians
}

export function polarToCartesian(cx: number, cy: number, radius: number, angleInRadians: number): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
}

/**
 * Generates an SVG path for an annular or pie wedge.
 */
export function describeArc(config: ArcConfig): string {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = config;
  if (!Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(outerRadius) || outerRadius <= 0) return '';
  if (endAngle - startAngle <= 0.001) return '';
  const fullCircle = Math.abs(endAngle - startAngle) >= Math.PI * 1.9999;

  if (fullCircle) {
    if (innerRadius <= 0) {
      return `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} Z`;
    }
    return [
      `M ${cx - outerRadius} ${cy}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy}`,
      `M ${cx - innerRadius} ${cy}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${cx + innerRadius} ${cy}`,
      `A ${innerRadius} ${innerRadius} 0 1 1 ${cx - innerRadius} ${cy}`,
      'Z'
    ].join(' ');
  }

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, outerRadius, startAngle);
  const p2 = polarToCartesian(cx, cy, outerRadius, endAngle);

  if (innerRadius <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${p1.x} ${p1.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
      'Z'
    ].join(' ');
  }

  const p3 = polarToCartesian(cx, cy, innerRadius, endAngle);
  const p4 = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

export interface BoxPlotStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

export function computeBoxPlotStats(values: number[]): BoxPlotStats {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  }

  const sorted = [...values].filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  }

  const getPercentile = (p: number): number => {
    const idx = (sorted.length - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    const valLower = sorted[lower] ?? 0;
    const valUpper = sorted[upper] ?? 0;
    return valLower + (valUpper - valLower) * weight;
  };

  const q1 = getPercentile(0.25);
  const median = getPercentile(0.5);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const nonOutliers = sorted.filter(v => v >= lowerFence && v <= upperFence);
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

  const min = nonOutliers.length > 0 ? (nonOutliers[0] ?? sorted[0] ?? 0) : (sorted[0] ?? 0);
  const max = nonOutliers.length > 0 ? (nonOutliers[nonOutliers.length - 1] ?? sorted[sorted.length - 1] ?? 0) : (sorted[sorted.length - 1] ?? 0);

  return { min, q1, median, q3, max, outliers };
}
