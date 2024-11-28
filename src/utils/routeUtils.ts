import fs from 'fs';
import path from 'path';

/**
 * Generate routes for a Next.js pages-based project.
 * @param dir - Directory to scan.
 * @param basePath - Base path for routes.
 */
export const getPageRoutes = (dir: string, basePath = ''): string[] => {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    const routes: string[] = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
                const dynamicSegment = entry.name.replace(/\[.*\]/, '${string}');
                routes.push(...getPageRoutes(path.join(dir, entry.name), `${basePath}/${dynamicSegment}`));
            } else {
                routes.push(...getPageRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`));
            }
        } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
            const fileName = entry.name.replace('.tsx', '');
            if (fileName === 'index') {
                routes.push(basePath || '/');
            } else if (fileName.startsWith('[') && fileName.endsWith(']')) {
                routes.push(`${basePath}/${fileName.replace(/\[.*\]/, '${string}')}`);
            } else {
                routes.push(`${basePath}/${fileName}`);
            }
        }
    }

    return routes;
};

/**
 * Generate routes for a Next.js app-based project.
 * @param dir - Directory to scan.
 * @param basePath - Base path for routes.
 */
export const getAppRoutes = (dir: string, basePath = ''): string[] => {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    const routes: string[] = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name === 'page' || entry.name === 'layout') continue;

            if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
                const dynamicSegment = entry.name.replace(/\[.*\]/, '${string}');
                routes.push(...getAppRoutes(path.join(dir, entry.name), `${basePath}/${dynamicSegment}`));
            } else {
                routes.push(...getAppRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`));
            }
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
            const fileName = entry.name.replace(/\.(tsx|js)$/, '');
            if (fileName === 'page' || fileName === 'layout') {
                routes.push(basePath || '/');
            } else if (fileName.startsWith('[') && fileName.endsWith(']')) {
                routes.push(`${basePath}/${fileName.replace(/\[.*\]/, '${string}')}`);
            } else {
                routes.push(`${basePath}/${fileName}`);
            }
        }
    }

    return routes;
};
