import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateRoutes } from './generator';

yargs(hideBin(process.argv))
    .command(
        '$0 <pagesDir> <outputFile> <route>',
        'Generate TypeScript route definitions for Next.js projects',
        (yargs) => {
            return yargs
                .positional('pagesDir', {
                    describe: 'Path to the Next.js pages or app directory',
                    type: 'string',
                    demandOption: true,
                })
                .positional('outputFile', {
                    describe: 'Path to the output TypeScript definition file',
                    type: 'string',
                    demandOption: true,
                })
                .positional('route', {
                    describe: 'Route type (pages or app)',
                    type: 'string',
                    choices: ['pages', 'app'],
                    demandOption: true,
                });
        },
        (argv) => {
            // Call the generateRoutes function with parsed arguments
            generateRoutes(argv.pagesDir, argv.outputFile, argv.route as 'pages' | 'app');
        }
    )
    .help()
    .alias('help', 'h')
    .strict()
    .argv;
