export interface IndicatorPoint {
  time?: number | string | Date;
  value?: number;
  [key: string]: unknown;
}

export interface MACDResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  if (period <= 0 || values.length === 0) return result;

  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const val = values[i] ?? 0;
    sum += val;
    if (i >= period) {
      sum -= values[i - period] ?? 0;
    }
    if (i >= period - 1) {
      result.push(sum / period);
    } else {
      result.push(null);
    }
  }
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  if (period <= 0 || values.length === 0) return result;

  const multiplier = 2 / (period + 1);
  let previousEMA: number | null = null;

  // Initial SMA for first EMA seed
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const val = values[i] ?? 0;
    if (i < period - 1) {
      sum += val;
      result.push(null);
    } else if (i === period - 1) {
      sum += val;
      previousEMA = sum / period;
      result.push(previousEMA);
    } else {
      if (previousEMA !== null) {
        previousEMA = (val - previousEMA) * multiplier + previousEMA;
        result.push(previousEMA);
      } else {
        result.push(null);
      }
    }
  }
  return result;
}

/**
 * Weighted Moving Average (WMA)
 */
export function calculateWMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  if (period <= 0 || values.length === 0) return result;

  const denominator = (period * (period + 1)) / 2;

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    let weightedSum = 0;
    for (let j = 0; j < period; j++) {
      const weight = j + 1;
      const val = values[i - period + 1 + j] ?? 0;
      weightedSum += val * weight;
    }
    result.push(weightedSum / denominator);
  }
  return result;
}

/**
 * Relative Strength Index (RSI)
 */
export function calculateRSI(values: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (period <= 0 || values.length <= period) {
    return values.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < values.length; i++) {
    const change = (values[i] ?? 0) - (values[i - 1] ?? 0);
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // First output at index 0 has no change
  result.push(null);

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    avgGain += gains[i] ?? 0;
    avgLoss += losses[i] ?? 0;
    if (i < period - 1) {
      result.push(null);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = avgLoss === 0 ? 100 : 100 - (100 / (1 + firstRS));
  result.push(firstRSI);

  for (let i = period; i < gains.length; i++) {
    const curGain = gains[i] ?? 0;
    const curLoss = losses[i] ?? 0;

    avgGain = (avgGain * (period - 1) + curGain) / period;
    avgLoss = (avgLoss * (period - 1) + curLoss) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(100 - (100 / (1 + rs)));
    }
  }

  return result;
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(
  values: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult {
  const fastEMA = calculateEMA(values, fastPeriod);
  const slowEMA = calculateEMA(values, slowPeriod);

  const macdLine: (number | null)[] = [];
  const macdValuesOnly: number[] = [];
  const macdIndices: number[] = [];

  for (let i = 0; i < values.length; i++) {
    const fast = fastEMA[i];
    const slow = slowEMA[i];
    if (fast !== null && fast !== undefined && slow !== null && slow !== undefined) {
      const val = fast - slow;
      macdLine.push(val);
      macdValuesOnly.push(val);
      macdIndices.push(i);
    } else {
      macdLine.push(null);
    }
  }

  const signalSub = calculateEMA(macdValuesOnly, signalPeriod);
  const signalLine: (number | null)[] = new Array(values.length).fill(null);
  const histogram: (number | null)[] = new Array(values.length).fill(null);

  for (let j = 0; j < signalSub.length; j++) {
    const origIdx = macdIndices[j];
    if (origIdx !== undefined) {
      const sig = signalSub[j] ?? null;
      signalLine[origIdx] = sig;
      const macdVal = macdLine[origIdx];
      if (macdVal !== null && macdVal !== undefined && sig !== null) {
        histogram[origIdx] = macdVal - sig;
      }
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram
  };
}

/**
 * Bollinger Bands
 */
export function calculateBollingerBands(
  values: number[],
  period = 20,
  stdDevMultiplier = 2
): BollingerBandsResult {
  const sma = calculateSMA(values, period);
  const upper: (number | null)[] = [];
  const middle: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < values.length; i++) {
    const m = sma[i] ?? null;
    middle.push(m);

    if (m === null || i < period - 1) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    let sumSquaredDiff = 0;
    for (let j = 0; j < period; j++) {
      const val = values[i - period + 1 + j] ?? 0;
      const diff = val - m;
      sumSquaredDiff += diff * diff;
    }

    const stdDev = Math.sqrt(sumSquaredDiff / period);
    upper.push(m + stdDevMultiplier * stdDev);
    lower.push(m - stdDevMultiplier * stdDev);
  }

  return { upper, middle, lower };
}

export interface OHLCVItem {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Volume Weighted Average Price (VWAP)
 */
export function calculateVWAP(items: OHLCVItem[]): (number | null)[] {
  const result: (number | null)[] = [];
  let cumulativeTypicalPriceVolume = 0;
  let cumulativeVolume = 0;

  for (const item of items) {
    const typicalPrice = (item.high + item.low + item.close) / 3;
    const vol = item.volume || 0;

    cumulativeTypicalPriceVolume += typicalPrice * vol;
    cumulativeVolume += vol;

    if (cumulativeVolume === 0) {
      result.push(typicalPrice);
    } else {
      result.push(cumulativeTypicalPriceVolume / cumulativeVolume);
    }
  }

  return result;
}
