import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: './coverage',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/test/**/*.test.ts'],
};

export default config;
