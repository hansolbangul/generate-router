import { generateTypeDefinition } from '../src/generator';
import { getPageRoutes, getAppRoutes } from '../src/utils/routeUtils';
import mockFs from 'mock-fs';

describe('Route utilities', () => {
    afterEach(() => {
        mockFs.restore(); // Reset the mocked filesystem after each test
    });

    test('should generate correct type definitions for static and dynamic routes', () => {
        const routes = ['/about', '/user/${string}'];
        const typeDef = generateTypeDefinition(routes);
        expect(typeDef).toContain("type StaticPaths =");
        expect(typeDef).toContain("type DynamicPaths =");
    });

    test('should generate page routes correctly', () => {
        mockFs({
            'pages/about.tsx': '',
            'pages/user/[id].tsx': '',
        });

        const routes = getPageRoutes('pages');
        expect(routes).toContain('/about');
        expect(routes).toContain('/user/${string}');
    });

    test('should generate app routes correctly', () => {
        mockFs({
            'app/dashboard/page.tsx': '',
            'app/profile/[id]/page.tsx': '',
        });

        const routes = getAppRoutes('app');
        expect(routes).toContain('/dashboard');
        expect(routes).toContain('/profile/${string}');
    });
});
