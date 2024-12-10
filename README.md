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

### Using Type Overrides

This library overrides the types for Next.js's `useRouter` (from `next/router` and `next/navigation`) and the `href` prop of the `Link` component. This ensures type safety and will result in TypeScript compilation errors if you try to use undefined routes.

```typescript
// Correct usage
router.push('/about'); // Works fine
router.push('/user/123'); // Works fine

// Incorrect usage
router.push('/invalid-path'); // Compilation error
<Link href="/undefined-route">Invalid</Link> // Compilation error
```

To enable type overriding, add the `--override` or `-o` option when running the CLI:

```bash
npx generate-router ./pages ./types/routes.d.ts --override
# or
npx generate-router ./pages ./types/routes.d.ts -o
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
  interface UrlObject {
    pathname: RoutePath;
    query?: { [key: string]: string | number | boolean | readonly string[] | undefined };
    hash?: string;
  }

  interface NextRouter extends Omit<import('next/dist/shared/lib/router/router').NextRouter, 'push' | 'replace'> {
    push(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions
    ): Promise<boolean>;
    replace(
      url: RoutePath | UrlObject,
      as?: string | UrlObject,
      options?: TransitionOptions
    ): Promise<boolean>;
  }

  export function useRouter(): NextRouter;
}

declare module 'next/navigation' {
  interface NavigationUrlObject {
    pathname: RoutePath;
    query?: { [key: string]: string | number | boolean | readonly string[] | undefined };
    hash?: string;
  }

  interface NavigationRouter extends Omit<import('next/dist/shared/lib/app-router-context.shared-runtime').AppRouterInstance, 'push' | 'replace'> {
    push(href: RoutePath | NavigationUrlObject, options?: { scroll?: boolean }): void;
    replace(href: RoutePath | NavigationUrlObject, options?: { scroll?: boolean }): void;
    query: { [key: string]: string | string[] | undefined };
  }

  export { NavigationRouter };
  export function useRouter(): NavigationRouter;
  export function usePathname(): RoutePath;
  export function useSearchParams(): URLSearchParams & {
    get(key: string): string | null;
    getAll(): { [key: string]: string | string[] };
  };
}

declare module 'next/link' {
  export interface LinkProps
    extends Omit<import('next/dist/client/link').LinkProps, 'href'> {
    href:
      | RoutePath
      | {
          pathname: RoutePath;
          query?: {
            [key: string]:
              | string
              | number
              | boolean
              | readonly string[]
              | undefined;
          };
          hash?: string;
        };
  }

  export default function Link(props: LinkProps): JSX.Element;
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