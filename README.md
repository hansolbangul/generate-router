### English README

# Generate Router

A utility to generate TypeScript route definitions for Next.js projects. This tool supports both `pages` (Page Router) and `app` (App Router) structures, allowing you to create type-safe route definitions.

## Installation

You can install the library using `pnpm`, `npm`, or `yarn`:

```bash
pnpm add generate-router
```

## Usage

### CLI Usage

The library provides a CLI tool to generate TypeScript route definitions. After installation, you can use the `generate-router` command:

```bash
npx generate-router --pagesDir=./pages --outputFile=./types/routes.d.ts --route=pages
```

### Options

- `--pagesDir` (or `-p`): Path to the `pages` or `app` directory in your Next.js project. (Required)
- `--outputFile` (or `-o`): Path to the output TypeScript definition file. (Required)
- `--route` (or `-r`): Routing type, either `pages` for Page Router or `app` for App Router. (Required)

### Example

If your `pages` directory contains the following structure:

```
pages/
├── about.tsx
├── index.tsx
└── user/
    └── [id].tsx
```

Running the following command:

```bash
npx generate-router --pagesDir=./pages --outputFile=./types/routes.d.ts --route=pages
```

Will generate a file at `./types/routes.d.ts` with the following content:

```typescript
// This file is auto-generated. Do not edit manually.
type StaticPaths =
  | '/'
  | '/about';

type DynamicPaths =
  | `/user/${string}`;

type RoutePath = StaticPaths | DynamicPaths | `${StaticPaths}?${string}`;
```

### Programmatic Usage

You can also use the library in your TypeScript or JavaScript code:

```typescript
import { generateRoutes } from 'generate-router';

generateRoutes('./pages', './types/routes.d.ts', 'pages');
```

## Development

### Scripts

- **Build**: Run the Rollup bundler to create the production build:
  ```bash
  pnpm run build
  ```
- **Test**: Run Jest tests:
  ```bash
  pnpm run test
  ```

### File Structure

```
project-root/
├── src/
│   ├── index.ts             # Entry point
│   ├── generator.ts         # Core logic
│   ├── utils/
│       ├── fileUtils.ts     # File utilities
│       ├── routeUtils.ts    # Route generation utilities
├── test/
│   ├── generator.test.ts    # Tests for generator.ts
│   ├── utils/
│       ├── fileUtils.test.ts # Tests for fileUtils.ts
│       ├── routeUtils.test.ts # Tests for routeUtils.ts
├── dist/                    # Build output
├── package.json             # Project configuration
├── jest.config.js           # Jest configuration
├── rollup.config.js         # Rollup configuration
├── tsconfig.json            # TypeScript configuration
```

## License

This project is licensed under the ISC License.