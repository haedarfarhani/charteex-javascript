import type { Renderer, ChartBounds, Theme } from '../core/ChartConfig';

export interface RenderContext {
  renderer: Renderer;
  bounds: ChartBounds;
  theme: Theme;
  width: number;
  height: number;
}

export function createRenderContext(
  renderer: Renderer,
  bounds: ChartBounds,
  theme: Theme
): RenderContext {
  return {
    renderer,
    bounds,
    theme,
    width: bounds.width,
    height: bounds.height
  };
}