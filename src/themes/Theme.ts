import type { Theme } from '../core/ChartConfig';

export const LightTheme: Theme = {
  name: 'light',
  background: '#ffffff',
  text: '#1f2937',
  grid: '#e5e7eb',
  axis: '#9ca3af',
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  tooltipBackground: '#1f2937',
  tooltipColor: '#ffffff',
  crosshairColor: '#9ca3af',
  seriesColors: [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16'
  ],
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 12
};

export const DarkTheme: Theme = {
  name: 'dark',
  background: '#111827',
  text: '#f9fafb',
  grid: '#374151',
  axis: '#9ca3af',
  primary: '#3b82f6',
  secondary: '#94a3b8',
  accent: '#fbbf24',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  tooltipBackground: '#1f2937',
  tooltipColor: '#ffffff',
  crosshairColor: '#6b7280',
  seriesColors: [
    '#3b82f6',
    '#34d399',
    '#fbbf24',
    '#f87171',
    '#a78bfa',
    '#f472b6',
    '#22d3ee',
    '#a3e635'
  ],
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 12
};

export function createTheme(base: Theme, overrides: Partial<Theme>): Theme {
  return {
    ...base,
    ...overrides,
    seriesColors: overrides.seriesColors ?? base.seriesColors
  };
}