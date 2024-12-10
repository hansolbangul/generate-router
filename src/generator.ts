import { getPageRoutes, getAppRoutes } from './utils/routeUtils';
import { ensureFileExists } from './utils/fileUtils';
import fs from 'fs';
import path from 'path';

/**
 * Generate TypeScript type definitions for Next.js routes.
 * @param routes - Array of routes.
 * @param override - Whether to override Next.js router types.
 * @returns A string containing the TypeScript type definitions.
 */
export const generateTypeDefinition = (routes: string[], override: boolean = false): string => {
  const staticRoutes = routes.filter((route) => !route.includes('${'));
  const dynamicRoutes = routes.filter((route) => route.includes('${'));

  const staticPathsType = `type StaticPaths =
  ${staticRoutes.map((route) => `| '${route}'`).join('\n  ')};

`;

  const dynamicPathsType = dynamicRoutes.length > 0
    ? `type DynamicPaths =
  ${dynamicRoutes.map((route) => `| \`${route}\``).join('\n  ')};

`
    : '';

  const routePathType = `type RoutePath = StaticPaths${
    dynamicRoutes.length > 0 ? ' | DynamicPaths' : ''
  } | \`\$\{StaticPaths\}?\$\{string\}\`;
`;

  const nextRouterOverrides = override ? `
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
}` : '';

  return `// This file is auto-generated. Do not edit manually.
${staticPathsType}${dynamicPathsType}${routePathType}${nextRouterOverrides}`;
};


/**
 * Main function to generate route types.
 * @param pagesDir - Path to the Next.js pages or app directory.
 * @param outputFile - Path to the output TypeScript file.
 * @param routeType - Either "pages" for Page Router or "app" for App Router.
 * @param override - Whether to override Next.js router types.
 */
export const generateRoutes = (
    pagesDir: string,
    outputFile: string,
    routeType: 'pages' | 'app',
    override: boolean = false
): void => {
    const resolvedPagesDir = path.resolve(pagesDir);
    const resolvedOutputFile = path.resolve(outputFile);

    ensureFileExists(resolvedOutputFile);

    const routes =
        routeType === 'app'
            ? getAppRoutes(resolvedPagesDir)
            : getPageRoutes(resolvedPagesDir);

    const typeDefinition = generateTypeDefinition(routes, override);

    fs.writeFileSync(resolvedOutputFile, typeDefinition);
    console.log(`RoutePath types generated at ${resolvedOutputFile}`);
};
