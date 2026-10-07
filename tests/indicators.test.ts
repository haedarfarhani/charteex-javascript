import { describe, it, expect } from 'vitest';
import {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP
} from '../src/indicators/Indicators';

describe('Technical Indicators', () => {
  const prices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  describe('SMA', () => {
    it('should calculate SMA correctly', () => {
      const sma = calculateSMA(prices, 5);
      expect(sma.length).toBe(prices.length);
      expect(sma[0]).toBeNull();
      expect(sma[3]).toBeNull();
      // At index 4, values are [10, 11, 12, 13, 14] -> avg = 12
      expect(sma[4]).toBe(12);
      // At index 5, values are [11, 12, 13, 14, 15] -> avg = 13
      expect(sma[5]).toBe(13);
    });

    it('should handle period larger than array', () => {
      const sma = calculateSMA([10, 20], 5);
      expect(sma).toEqual([null, null]);
    });
  });

  describe('EMA', () => {
    it('should calculate EMA correctly', () => {
      const ema = calculateEMA(prices, 3);
      expect(ema.length).toBe(prices.length);
      expect(ema[0]).toBeNull();
      expect(ema[1]).toBeNull();
      // Seed is SMA of first 3 items: (10 + 11 + 12) / 3 = 11
      expect(ema[2]).toBe(11);
      // Next multiplier = 2 / (3 + 1) = 0.5; val = 13; EMA = (13 - 11) * 0.5 + 11 = 12
      expect(ema[3]).toBe(12);
    });
  });

  describe('WMA', () => {
    it('should calculate WMA correctly', () => {
      const wma = calculateWMA([1, 2, 3, 4], 3);
      expect(wma.length).toBe(4);
      expect(wma[0]).toBeNull();
      expect(wma[1]).toBeNull();
      // (1*1 + 2*2 + 3*3) / (1+2+3) = (1 + 4 + 9) / 6 = 14 / 6 = 2.333
      expect(wma[2]).toBeCloseTo(14 / 6, 2);
    });
  });

  describe('RSI', () => {
    it('should calculate RSI with proper range (0-100)', () => {
      const oscillatingPrices = [
        44, 44.3, 44.1, 43.9, 44.5, 44.8, 45.2, 45.1, 45.3, 45.7, 46.1, 46.3, 45.8, 46.2, 46.5, 46.8, 46.4
      ];
      const rsi = calculateRSI(oscillatingPrices, 14);
      expect(rsi.length).toBe(oscillatingPrices.length);
      const validRsi = rsi.filter((v): v is number => v !== null);
      expect(validRsi.length).toBeGreaterThan(0);
      for (const val of validRsi) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('MACD', () => {
    it('should calculate MACD lines and histogram', () => {
      const sample = Array.from({ length: 40 }, (_, i) => 100 + Math.sin(i / 5) * 10);
      const result = calculateMACD(sample, 12, 26, 9);
      expect(result.macd.length).toBe(40);
      expect(result.signal.length).toBe(40);
      expect(result.histogram.length).toBe(40);
      // Valid histogram points exist towards the end
      const validHist = result.histogram.filter((v): v is number => v !== null);
      expect(validHist.length).toBeGreaterThan(0);
    });
  });

  describe('Bollinger Bands', () => {
    it('should calculate upper, middle, and lower bands', () => {
      const sample = Array.from({ length: 30 }, (_, i) => 50 + i);
      const bb = calculateBollingerBands(sample, 10, 2);
      expect(bb.middle.length).toBe(30);
      expect(bb.upper.length).toBe(30);
      expect(bb.lower.length).toBe(30);

      const lastIdx = 29;
      expect(bb.upper[lastIdx]).toBeGreaterThan(bb.middle[lastIdx]!);
      expect(bb.lower[lastIdx]).toBeLessThan(bb.middle[lastIdx]!);
    });
  });

  describe('VWAP', () => {
    it('should calculate VWAP correctly', () => {
      const items = [
        { high: 10, low: 8, close: 9, volume: 100 },
        { high: 12, low: 10, close: 11, volume: 200 }
      ];
      const vwap = calculateVWAP(items);
      expect(vwap.length).toBe(2);
      // First typical = 9, vol = 100 -> vwap = 9
      expect(vwap[0]).toBe(9);
      // Second typical = 11, vol = 200 -> cumTPV = 9*100 + 11*200 = 3100; cumVol = 300 -> 3100/300 = 10.333
      expect(vwap[1]).toBeCloseTo(10.333, 2);
    });
  });
});
