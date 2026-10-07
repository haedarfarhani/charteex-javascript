export class ChartError extends Error {
  constructor(message: string) {
    super(`ChartError: ${message}`);
    this.name = 'ChartError';
  }
}

export class ScaleError extends Error {
  constructor(message: string) {
    super(`ScaleError: ${message}`);
    this.name = 'ScaleError';
  }
}

export class RendererError extends Error {
  constructor(message: string) {
    super(`RendererError: ${message}`);
    this.name = 'RendererError';
  }
}

export class DataError extends Error {
  constructor(message: string) {
    super(`DataError: ${message}`);
    this.name = 'DataError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`ConfigurationError: ${message}`);
    this.name = 'ConfigurationError';
  }
}
