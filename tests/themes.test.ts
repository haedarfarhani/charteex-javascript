import { describe, it, expect } from 'vitest';
import {
  LightTheme,
  DarkTheme,
  MidnightTheme,
  MinimalTheme,
  ProfessionalTheme,
  FinancialTheme,
  GlassTheme,
  EnterpriseTheme,
  createTheme,
  extendTheme,
  resolveTheme,
  exportCssVariables,
  themeRegistry
} from '../src/index';

describe('Design Tokens and Theming Engine', () => {
  it('should provide complete built-in themes with tokens', () => {
    const themes = [
      LightTheme,
      DarkTheme,
      MidnightTheme,
      MinimalTheme,
      ProfessionalTheme,
      FinancialTheme,
      GlassTheme,
      EnterpriseTheme
    ];

    themes.forEach(theme => {
      expect(theme.name).toBeDefined();
      expect(theme.background).toBeDefined();
      expect(theme.text).toBeDefined();
      expect(theme.seriesColors.length).toBeGreaterThan(0);
      expect(theme.tokens).toBeDefined();
      expect(theme.tokens?.colors.background.canvas).toBeDefined();
      expect(theme.tokens?.colors.semantic.positive).toBeDefined();
      expect(theme.tokens?.typography.fontFamily).toBeDefined();
      expect(theme.tokens?.radius.md).toBeGreaterThanOrEqual(0);
    });
  });

  it('should resolve theme names correctly from themeRegistry', () => {
    expect(resolveTheme('dark').name).toBe('dark');
    expect(resolveTheme('midnight').name).toBe('midnight');
    expect(resolveTheme('minimal').name).toBe('minimal');
    expect(resolveTheme('financial').name).toBe('financial');
    expect(resolveTheme('enterprise').name).toBe('enterprise');
    expect(resolveTheme('unknown' as any).name).toBe('light');
  });

  it('should create a custom theme using createTheme', () => {
    const custom = createTheme({
      name: 'sunset',
      background: '#2b1055',
      tokens: {
        colors: {
          ...LightTheme.tokens!.colors,
          background: {
            ...LightTheme.tokens!.colors.background,
            canvas: '#2b1055'
          },
          series: ['#ff7e5f', '#feb47b']
        }
      }
    });

    expect(custom.name).toBe('sunset');
    expect(custom.background).toBe('#2b1055');
    expect(custom.seriesColors).toEqual(['#ff7e5f', '#feb47b']);
    expect(custom.tokens?.colors.series).toEqual(['#ff7e5f', '#feb47b']);
  });

  it('should extend an existing theme using extendTheme', () => {
    const extended = extendTheme('dark', {
      primary: '#9333ea',
      seriesColors: ['#9333ea', '#ec4899']
    });

    expect(extended.primary).toBe('#9333ea');
    expect(extended.seriesColors[0]).toBe('#9333ea');
    expect(extended.background).toBe(DarkTheme.background);
  });

  it('should export valid CSS variables with --charteex- prefix', () => {
    const cssVars = exportCssVariables(LightTheme.tokens!);
    expect(cssVars['--charteex-font-family']).toBeDefined();
    expect(cssVars['--charteex-bg-canvas']).toBe(LightTheme.tokens!.colors.background.canvas);
    expect(cssVars['--charteex-radius-md']).toBe(`${LightTheme.tokens!.radius.md}px`);
    expect(cssVars['--charteex-semantic-positive']).toBeDefined();
  });
});
