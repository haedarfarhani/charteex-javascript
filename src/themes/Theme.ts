import type { Theme, ThemeMode } from '../core/ChartConfig';
import type { DesignTokens } from '../design/tokens';
import {
  LightThemeTokens,
  DarkThemeTokens,
  MidnightThemeTokens,
  MinimalThemeTokens,
  ProfessionalThemeTokens,
  FinancialThemeTokens,
  GlassThemeTokens,
  EnterpriseThemeTokens
} from './presets';

export function tokensToTheme(name: string, tokens: DesignTokens): Theme {
  return {
    name,
    background: tokens.colors.background.canvas,
    text: tokens.colors.text.primary,
    grid: tokens.colors.grid.major,
    axis: tokens.colors.axis.label,
    primary: tokens.colors.series[0] ?? '#2563eb',
    secondary: tokens.colors.text.secondary,
    accent: tokens.colors.series[2] ?? '#f59e0b',
    success: tokens.colors.semantic.positive,
    warning: tokens.colors.semantic.warning,
    danger: tokens.colors.semantic.negative,
    tooltipBackground: tokens.colors.tooltip.background,
    tooltipColor: tokens.colors.tooltip.text,
    crosshairColor: tokens.colors.axis.tick,
    seriesColors: [...tokens.colors.series],
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.axis.fontSize,
    tokens
  };
}

export const LightTheme: Theme = tokensToTheme('light', LightThemeTokens);
export const DarkTheme: Theme = tokensToTheme('dark', DarkThemeTokens);
export const MidnightTheme: Theme = tokensToTheme('midnight', MidnightThemeTokens);
export const MinimalTheme: Theme = tokensToTheme('minimal', MinimalThemeTokens);
export const ProfessionalTheme: Theme = tokensToTheme('professional', ProfessionalThemeTokens);
export const FinancialTheme: Theme = tokensToTheme('financial', FinancialThemeTokens);
export const GlassTheme: Theme = tokensToTheme('glass', GlassThemeTokens);
export const EnterpriseTheme: Theme = tokensToTheme('enterprise', EnterpriseThemeTokens);

export const themeRegistry: Record<string, Theme> = {
  default: LightTheme,
  light: LightTheme,
  dark: DarkTheme,
  midnight: MidnightTheme,
  minimal: MinimalTheme,
  professional: ProfessionalTheme,
  financial: FinancialTheme,
  glass: GlassTheme,
  enterprise: EnterpriseTheme
};

export function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DarkTheme;
  }
  return LightTheme;
}

export function createTheme(overrides: Partial<Theme> & { tokens?: Partial<DesignTokens> }): Theme {
  const base = (overrides.name && themeRegistry[overrides.name]) ? themeRegistry[overrides.name] : LightTheme;
  const baseTokens = base?.tokens ?? LightThemeTokens;
  const mergedTokens: DesignTokens = {
    colors: {
      ...baseTokens.colors,
      ...(overrides.tokens?.colors ?? {})
    },
    typography: {
      ...baseTokens.typography,
      ...(overrides.tokens?.typography ?? {})
    },
    spacing: {
      ...baseTokens.spacing,
      ...(overrides.tokens?.spacing ?? {})
    },
    radius: {
      ...baseTokens.radius,
      ...(overrides.tokens?.radius ?? {})
    },
    shadows: {
      ...baseTokens.shadows,
      ...(overrides.tokens?.shadows ?? {})
    },
    borders: {
      ...baseTokens.borders,
      ...(overrides.tokens?.borders ?? {})
    },
    animation: {
      ...baseTokens.animation,
      ...(overrides.tokens?.animation ?? {})
    }
  };

  const generated = tokensToTheme(overrides.name ?? 'custom', mergedTokens);
  return {
    ...generated,
    ...overrides,
    seriesColors: overrides.seriesColors ?? overrides.tokens?.colors?.series ?? generated.seriesColors,
    tokens: mergedTokens
  };
}

export function extendTheme(
  baseTheme: ThemeMode | Theme,
  overrides: Partial<Theme> & { tokens?: Partial<DesignTokens> }
): Theme {
  const resolvedBase = typeof baseTheme === 'string'
    ? (baseTheme === 'system' ? getSystemTheme() : (themeRegistry[baseTheme] ?? LightTheme))
    : baseTheme;

  const baseTokens = resolvedBase.tokens ?? LightThemeTokens;
  const mergedTokens: DesignTokens = {
    colors: {
      ...baseTokens.colors,
      ...(overrides.tokens?.colors ?? {})
    },
    typography: {
      ...baseTokens.typography,
      ...(overrides.tokens?.typography ?? {})
    },
    spacing: {
      ...baseTokens.spacing,
      ...(overrides.tokens?.spacing ?? {})
    },
    radius: {
      ...baseTokens.radius,
      ...(overrides.tokens?.radius ?? {})
    },
    shadows: {
      ...baseTokens.shadows,
      ...(overrides.tokens?.shadows ?? {})
    },
    borders: {
      ...baseTokens.borders,
      ...(overrides.tokens?.borders ?? {})
    },
    animation: {
      ...baseTokens.animation,
      ...(overrides.tokens?.animation ?? {})
    }
  };

  return createTheme({
    ...resolvedBase,
    ...overrides,
    tokens: mergedTokens
  });
}

export function resolveTheme(themeInput?: ThemeMode | Theme): Theme {
  if (!themeInput) return LightTheme;
  if (typeof themeInput === 'string') {
    if (themeInput === 'system') return getSystemTheme();
    return themeRegistry[themeInput] ?? LightTheme;
  }
  return themeInput;
}
