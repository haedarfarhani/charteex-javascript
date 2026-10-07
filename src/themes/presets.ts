import type { DesignTokens } from '../design/tokens';

const defaultFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const baseTypography = {
  fontFamily: defaultFont,
  title: { fontSize: 16, fontWeight: 600, lineHeight: 1.25 },
  subtitle: { fontSize: 13, fontWeight: 400, lineHeight: 1.4 },
  axis: { fontSize: 11, fontWeight: 400, lineHeight: 1.2 },
  legend: { fontSize: 12, fontWeight: 500, lineHeight: 1.3 },
  tooltip: { fontSize: 12, fontWeight: 400, lineHeight: 1.3 }
};

const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

const baseRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999
};

const baseAnimation = {
  durationFast: 200,
  durationNormal: 400,
  durationSlow: 600,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

/**
 * Modern Clean Light (Default)
 */
export const LightThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#ffffff',
      plot: '#ffffff',
      surface: '#f8fafc',
      elevated: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      disabled: '#cbd5e1'
    },
    axis: {
      line: '#cbd5e1',
      label: '#64748b',
      tick: '#94a3b8'
    },
    grid: {
      major: '#f1f5f9',
      minor: '#f8fafc'
    },
    tooltip: {
      background: '#0f172a',
      border: '#334155',
      text: '#f8fafc'
    },
    series: [
      '#2563eb', // Blue
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#8b5cf6', // Violet
      '#ef4444', // Red
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#6366f1'  // Indigo
    ],
    semantic: {
      positive: '#10b981',
      negative: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      bullish: '#10b981',
      bearish: '#ef4444',
      neutral: '#64748b'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: baseRadius,
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#e2e8f0'
  },
  animation: baseAnimation
};

/**
 * Elegant Slate Dark Mode
 */
export const DarkThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#0f172a',
      plot: '#0f172a',
      surface: '#1e293b',
      elevated: '#1e293b'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
      disabled: '#475569'
    },
    axis: {
      line: '#334155',
      label: '#94a3b8',
      tick: '#475569'
    },
    grid: {
      major: '#1e293b',
      minor: '#172033'
    },
    tooltip: {
      background: '#1e293b',
      border: '#334155',
      text: '#f8fafc'
    },
    series: [
      '#3b82f6',
      '#34d399',
      '#fbbf24',
      '#a78bfa',
      '#f87171',
      '#22d3ee',
      '#f472b6',
      '#818cf8'
    ],
    semantic: {
      positive: '#34d399',
      negative: '#f87171',
      warning: '#fbbf24',
      info: '#60a5fa',
      bullish: '#34d399',
      bearish: '#f87171',
      neutral: '#94a3b8'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: baseRadius,
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#1e293b'
  },
  animation: baseAnimation
};

/**
 * Midnight Deep Navy
 */
export const MidnightThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#090d16',
      plot: '#090d16',
      surface: '#0f172a',
      elevated: '#17223b'
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      muted: '#475569',
      disabled: '#334155'
    },
    axis: {
      line: '#1e293b',
      label: '#64748b',
      tick: '#334155'
    },
    grid: {
      major: '#141d30',
      minor: '#0e1524'
    },
    tooltip: {
      background: '#0f172a',
      border: '#1e293b',
      text: '#f8fafc'
    },
    series: [
      '#60a5fa',
      '#4ade80',
      '#facc15',
      '#c084fc',
      '#fb7185',
      '#38bdf8',
      '#f472b6',
      '#a5b4fc'
    ],
    semantic: {
      positive: '#4ade80',
      negative: '#fb7185',
      warning: '#facc15',
      info: '#60a5fa',
      bullish: '#4ade80',
      bearish: '#fb7185',
      neutral: '#64748b'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: baseRadius,
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.6)',
    md: '0 4px 8px rgba(0,0,0,0.5)',
    lg: '0 12px 24px rgba(0,0,0,0.5)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#1e293b'
  },
  animation: baseAnimation
};

/**
 * Minimalist Clean Monochromatic
 */
export const MinimalThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#ffffff',
      plot: '#ffffff',
      surface: '#fafafa',
      elevated: '#ffffff'
    },
    text: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#a3a3a3',
      disabled: '#d4d4d4'
    },
    axis: {
      line: '#e5e5e5',
      label: '#737373',
      tick: '#d4d4d4'
    },
    grid: {
      major: '#f5f5f5',
      minor: 'transparent'
    },
    tooltip: {
      background: '#171717',
      border: '#262626',
      text: '#fafafa'
    },
    series: [
      '#171717',
      '#525252',
      '#737373',
      '#a3a3a3',
      '#404040',
      '#262626'
    ],
    semantic: {
      positive: '#171717',
      negative: '#737373',
      warning: '#525252',
      info: '#404040',
      bullish: '#171717',
      bearish: '#737373',
      neutral: '#a3a3a3'
    }
  },
  typography: {
    ...baseTypography,
    title: { fontSize: 15, fontWeight: 500, lineHeight: 1.2 },
    subtitle: { fontSize: 12, fontWeight: 400, lineHeight: 1.3 }
  },
  spacing: baseSpacing,
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 6,
    full: 9999
  },
  shadows: {
    none: 'none',
    sm: 'none',
    md: '0 1px 3px rgba(0,0,0,0.06)',
    lg: '0 2px 6px rgba(0,0,0,0.08)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#e5e5e5'
  },
  animation: baseAnimation
};

/**
 * Professional Analytics / FactSet / Bloomberg style
 */
export const ProfessionalThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#ffffff',
      plot: '#fbfcfd',
      surface: '#f1f5f9',
      elevated: '#ffffff'
    },
    text: {
      primary: '#091e42',
      secondary: '#253858',
      muted: '#6b778c',
      disabled: '#a5b2c6'
    },
    axis: {
      line: '#dfe1e6',
      label: '#5e6c84',
      tick: '#c1c7d0'
    },
    grid: {
      major: '#ebecf0',
      minor: '#f4f5f7'
    },
    tooltip: {
      background: '#091e42',
      border: '#172b4d',
      text: '#ffffff'
    },
    series: [
      '#0052cc',
      '#00875a',
      '#ff991f',
      '#de350b',
      '#5243aa',
      '#00b8d9',
      '#403294'
    ],
    semantic: {
      positive: '#00875a',
      negative: '#de350b',
      warning: '#ff991f',
      info: '#0052cc',
      bullish: '#00875a',
      bearish: '#de350b',
      neutral: '#6b778c'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: {
    none: 0,
    sm: 3,
    md: 6,
    lg: 8,
    full: 9999
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(9, 30, 66, 0.08)',
    md: '0 3px 6px rgba(9, 30, 66, 0.12)',
    lg: '0 8px 16px rgba(9, 30, 66, 0.15)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#dfe1e6'
  },
  animation: baseAnimation
};

/**
 * Financial / TradingView Dark Terminal
 */
export const FinancialThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#131722',
      plot: '#131722',
      surface: '#1e222d',
      elevated: '#2a2e39'
    },
    text: {
      primary: '#d1d4dc',
      secondary: '#b2b5be',
      muted: '#787b86',
      disabled: '#50535e'
    },
    axis: {
      line: '#2a2e39',
      label: '#787b86',
      tick: '#363a45'
    },
    grid: {
      major: '#1e222d',
      minor: '#161922'
    },
    tooltip: {
      background: '#1e222d',
      border: '#363a45',
      text: '#d1d4dc'
    },
    series: [
      '#2962ff',
      '#26a69a',
      '#ef5350',
      '#ff9800',
      '#ab47bc',
      '#00bcd4',
      '#ffeb3b'
    ],
    semantic: {
      positive: '#26a69a',
      negative: '#ef5350',
      warning: '#ff9800',
      info: '#2962ff',
      bullish: '#26a69a',
      bearish: '#ef5350',
      neutral: '#787b86'
    }
  },
  typography: {
    ...baseTypography,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    axis: { fontSize: 10, fontWeight: 500, lineHeight: 1.1 }
  },
  spacing: baseSpacing,
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 6,
    full: 9999
  },
  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(0,0,0,0.5)',
    md: '0 4px 8px rgba(0,0,0,0.6)',
    lg: '0 8px 16px rgba(0,0,0,0.7)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#2a2e39'
  },
  animation: baseAnimation
};

/**
 * Modern Glassmorphic Look
 */
export const GlassThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: 'rgba(255, 255, 255, 0.75)',
      plot: 'rgba(255, 255, 255, 0.45)',
      surface: 'rgba(255, 255, 255, 0.85)',
      elevated: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#64748b',
      disabled: '#94a3b8'
    },
    axis: {
      line: 'rgba(148, 163, 184, 0.35)',
      label: '#475569',
      tick: 'rgba(148, 163, 184, 0.5)'
    },
    grid: {
      major: 'rgba(226, 232, 240, 0.6)',
      minor: 'rgba(241, 245, 249, 0.4)'
    },
    tooltip: {
      background: 'rgba(15, 23, 42, 0.85)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: '#ffffff'
    },
    series: [
      '#6366f1',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#ec4899',
      '#3b82f6'
    ],
    semantic: {
      positive: '#10b981',
      negative: '#f43f5e',
      warning: '#f59e0b',
      info: '#6366f1',
      bullish: '#10b981',
      bearish: '#f43f5e',
      neutral: '#64748b'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: {
    none: 0,
    sm: 6,
    md: 12,
    lg: 16,
    full: 9999
  },
  shadows: {
    none: 'none',
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  animation: baseAnimation
};

/**
 * Enterprise Solid Corporate Palette
 */
export const EnterpriseThemeTokens: DesignTokens = {
  colors: {
    background: {
      canvas: '#ffffff',
      plot: '#fafafa',
      surface: '#f4f6f8',
      elevated: '#ffffff'
    },
    text: {
      primary: '#1c2536',
      secondary: '#4f5e74',
      muted: '#637381',
      disabled: '#919eab'
    },
    axis: {
      line: '#e0e6ed',
      label: '#637381',
      tick: '#c4cdd5'
    },
    grid: {
      major: '#edf2f7',
      minor: '#f8fafc'
    },
    tooltip: {
      background: '#1c2536',
      border: '#2d3b51',
      text: '#ffffff'
    },
    series: [
      '#0284c7', // Sky Blue
      '#0d9488', // Teal
      '#d97706', // Amber
      '#dc2626', // Red
      '#4f46e5', // Indigo
      '#059669', // Emerald
      '#7c3aed'  // Purple
    ],
    semantic: {
      positive: '#059669',
      negative: '#dc2626',
      warning: '#d97706',
      info: '#0284c7',
      bullish: '#059669',
      bearish: '#dc2626',
      neutral: '#637381'
    }
  },
  typography: baseTypography,
  spacing: baseSpacing,
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 10,
    full: 9999
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 12px 24px rgba(0,0,0,0.1)'
  },
  borders: {
    width: 1,
    style: 'solid',
    color: '#e0e6ed'
  },
  animation: baseAnimation
};
