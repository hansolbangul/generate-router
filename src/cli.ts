import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateRoutes } from './generator';
import path from 'path';
import fs from 'fs';

/**
 * Determine the route type (pages or app) based on the directory structure.
 * @param dir - Directory to check.
 * @returns 'pages' if the directory contains a pages structure, 'app' otherwise.
 */
const determineRouteType = (dir: string): 'pages' | 'app' => {
    const resolvedDir = path.resolve(dir);
    if(!fs.existsSync(resolvedDir)) {
        throw new Error(`Invalid directory structure: '${dir}'. Expected 'pages' or 'app' directory.`);
    }

    if (path.basename(dir) === 'app') {
        return 'app';
    }
    if (path.basename(dir) === 'pages') {
        return 'pages';
    }
    throw new Error(`Invalid directory structure: '${dir}'. Expected 'pages' or 'app' directory.`);
};

// CLI definition
yargs(hideBin(process.argv))
    .command(
        '$0 <pagesDir> <outputFile>',
        'Generate TypeScript route definitions for Next.js projects',
        (yargs) => {
            return yargs
                .positional('pagesDir', {
                    describe: 'Path to the Next.js root directory containing pages or app',
                    type: 'string',
                    demandOption: true,
                })
                .positional('outputFile', {
                    describe: 'Path to the output TypeScript definition file',
                    type: 'string',
                    demandOption: true,
                })
                .option('o', {
                    alias: 'override',
                    type: 'boolean',
                    describe: 'Override Next.js router types',
                    default: false
                });
        },
        (argv) => {
            try {
                const routeType = determineRouteType(argv.pagesDir as string);
                generateRoutes(
                    argv.pagesDir as string, 
                    argv.outputFile as string, 
                    routeType,
                    argv.override as boolean
                );
                console.log(`Route definitions generated successfully for ${routeType} router.`);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('Unknown error', error);
                }
            }
        }
    )
    .help()
    .alias('help', 'h')
    .strict()
    .argv;
