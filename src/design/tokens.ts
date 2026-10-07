export interface BackgroundColors {
  canvas: string;
  plot: string;
  surface: string;
  elevated: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  disabled: string;
}

export interface AxisColors {
  line: string;
  label: string;
  tick: string;
}

export interface GridColors {
  major: string;
  minor: string;
}

export interface TooltipColors {
  background: string;
  border: string;
  text: string;
}

export interface SemanticColors {
  positive: string;
  negative: string;
  warning: string;
  info: string;
  bullish: string;
  bearish: string;
  neutral: string;
}

export interface ColorTokens {
  background: BackgroundColors;
  text: TextColors;
  axis: AxisColors;
  grid: GridColors;
  tooltip: TooltipColors;
  series: string[];
  semantic: SemanticColors;
}

export interface TypographyStyle {
  fontSize: number;
  fontWeight: string | number;
  lineHeight?: number;
  letterSpacing?: string;
  fontFamily?: string;
}

export interface TypographyTokens {
  fontFamily: string;
  title: TypographyStyle;
  subtitle: TypographyStyle;
  axis: TypographyStyle;
  legend: TypographyStyle;
  tooltip: TypographyStyle;
}

export interface SpacingTokens {
  xs: number; // 4px
  sm: number; // 8px
  md: number; // 16px
  lg: number; // 24px
  xl: number; // 32px
}

export interface RadiusTokens {
  none: number;
  sm: number; // 4px
  md: number; // 8px
  lg: number; // 12px
  full: number; // 9999px
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
}

export interface BorderTokens {
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
}

export interface AnimationTokens {
  durationFast: number; // 200ms
  durationNormal: number; // 400ms
  durationSlow: number; // 600ms
  easing: string;
}

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  animation: AnimationTokens;
}

/**
 * Generates standard CSS custom properties (--charteex-*) from DesignTokens.
 */
export function exportCssVariables(tokens: DesignTokens): Record<string, string> {
  return {
    '--charteex-font-family': tokens.typography.fontFamily,
    '--charteex-bg-canvas': tokens.colors.background.canvas,
    '--charteex-bg-plot': tokens.colors.background.plot,
    '--charteex-bg-surface': tokens.colors.background.surface,
    '--charteex-text-primary': tokens.colors.text.primary,
    '--charteex-text-secondary': tokens.colors.text.secondary,
    '--charteex-text-muted': tokens.colors.text.muted,
    '--charteex-axis-line': tokens.colors.axis.line,
    '--charteex-axis-label': tokens.colors.axis.label,
    '--charteex-grid-major': tokens.colors.grid.major,
    '--charteex-grid-minor': tokens.colors.grid.minor,
    '--charteex-tooltip-bg': tokens.colors.tooltip.background,
    '--charteex-tooltip-border': tokens.colors.tooltip.border,
    '--charteex-tooltip-text': tokens.colors.tooltip.text,
    '--charteex-radius-sm': `${tokens.radius.sm}px`,
    '--charteex-radius-md': `${tokens.radius.md}px`,
    '--charteex-radius-lg': `${tokens.radius.lg}px`,
    '--charteex-shadow-sm': tokens.shadows.sm,
    '--charteex-shadow-md': tokens.shadows.md,
    '--charteex-semantic-positive': tokens.colors.semantic.positive,
    '--charteex-semantic-negative': tokens.colors.semantic.negative
  };
}
