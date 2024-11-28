import { getPageRoutes, getAppRoutes } from './utils/routeUtils';
import { ensureFileExists } from './utils/fileUtils';
import fs from 'fs';
import path from 'path';

/**
 * Generate TypeScript type definitions for Next.js routes.
 * @param routes - Array of routes.
 * @returns A string containing the TypeScript type definitions.
 */
export const generateTypeDefinition = (routes: string[]): string => {
    const staticRoutes = routes.filter((route) => !route.includes('${'));
    const dynamicRoutes = routes.filter((route) => route.includes('${'));

    return `// This file is auto-generated. Do not edit manually.
type StaticPaths =
  ${staticRoutes.map((route) => `| '${route}'`).join('\n  ')};

type DynamicPaths =
  ${dynamicRoutes.map((route) => `| \`${route}\``).join('\n  ')};

type RoutePath = StaticPaths | DynamicPaths | \`\$\{StaticPaths\}?\$\{string\}\`;
`;
};

/**
 * Main function to generate route types.
 * @param pagesDir - Path to the Next.js pages or app directory.
 * @param outputFile - Path to the output TypeScript file.
 * @param routeType - Either "pages" for Page Router or "app" for App Router.
 */
export const generateRoutes = (
    pagesDir: string,
    outputFile: string,
    routeType: 'pages' | 'app'
): void => {
    const resolvedPagesDir = path.resolve(pagesDir);
    const resolvedOutputFile = path.resolve(outputFile);

    ensureFileExists(resolvedOutputFile);

    const routes =
        routeType === 'app'
            ? getAppRoutes(resolvedPagesDir)
            : getPageRoutes(resolvedPagesDir);

    const typeDefinition = generateTypeDefinition(routes);

    fs.writeFileSync(resolvedOutputFile, typeDefinition);
    console.log(`RoutePath types generated at ${resolvedOutputFile}`);
};
