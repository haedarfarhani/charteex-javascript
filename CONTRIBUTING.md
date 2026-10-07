# Contributing to SmartChart

Thank you for your interest in contributing to SmartChart!

## Development Setup

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the demo server:
   ```bash
   npm run dev
   ```

## Development Workflow

Before submitting a Pull Request, verify that all quality checks pass:

```bash
npm run typecheck    # TypeScript compiler check
npm run lint         # ESLint validation
npm run test         # Vitest unit & integration tests
npm run build        # Production build verification
```

## Adding New Chart Types

1. Create chart implementation in `src/charts/<category>/<Name>Chart.ts` extending `Chart`.
2. Override `updateScalesFromData()` and `render()`.
3. Export chart class and options in `src/index.ts`.
4. Add unit tests in `tests/charts.test.ts`.
5. Add interactive example to `index.html`.

## Code Style

- Zero runtime dependencies policy (no third-party runtime npm packages).
- Strict TypeScript with explicit typing.
- Safe DOM handling (no unsafe `innerHTML` with unsanitized user inputs).
- Comprehensive error handling with custom `ChartError` classes.
