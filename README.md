# Generate Router

[![npm version](https://badge.fury.io/js/generate-router.svg)][npm_url]
[![downloads](https://img.shields.io/npm/dt/generate-router.svg)][npm_url]
[![license](https://img.shields.io/npm/l/generate-router.svg)][npm_url]

[npm_url]: https://www.npmjs.com/package/generate-router

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
npx generate-router ./pages ./types/routes.d.ts
```

### Arguments

1. `<pagesDir>`: Path to the `pages` or `app` directory in your Next.js project. (Required)
2. `<outputFile>`: Path to the output TypeScript definition file. (Required)

### Options

- `-o, --override`: Override Next.js router types to provide type-safe routing. When enabled, it adds type definitions for `next/router` and `next/navigation` modules. (Optional, defaults to false)

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
npx generate-router ./pages ./types/routes.d.ts --override
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

// Next.js Router Type Overrides (when --override option is used)
declare module 'next/router' {
  import type { NextRouter as OriginalNextRouter } from 'next/router';

  interface UrlObject {
    pathname: RoutePath;
  }

  interface NextRouter extends OriginalNextRouter {
    push(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions,
    ): Promise<boolean>;
    replace(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions,
    ): Promise<boolean>;
  }

  export function useRouter(): NextRouter;
}

declare module 'next/navigation' {
  interface NavigationRouter {
    push(href: RoutePath, options?: { scroll?: boolean }): void;
    replace(href: RoutePath, options?: { scroll?: boolean }): void;
    prefetch(href: RoutePath): void;
    back(): void;
    forward(): void;
    refresh(): void;
  }

  export function useRouter(): NavigationRouter;
  export function usePathname(): RoutePath;
  export function useSearchParams(): URLSearchParams;
}
```

### Using npm scripts

You can also define a script in your `package.json` for easier usage:

```json
"scripts": {
  "generate:routes": "generate-router ./pages ./src/routes.d.ts --override"
}
```

Now you can run:

```bash
yarn generate:routes
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