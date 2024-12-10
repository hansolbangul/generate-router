# Generate Router

[![npm version](https://badge.fury.io/js/generate-router.svg)][npm_url]
[![downloads](https://img.shields.io/npm/dt/generate-router.svg)][npm_url]
[![license](https://img.shields.io/npm/l/generate-router.svg)][npm_url] 

[npm_url]: https://www.npmjs.com/package/generate-router 


Next.js 프로젝트용 TypeScript 경로 정의를 생성하는 유틸리티입니다. 이 도구는 `pages`(Page Router)와 `app`(App Router) 구조를 모두 지원하며, 타입 안전한 경로 정의를 생성할 수 있습니다.

## 설치

`pnpm`, `npm`, 또는 `yarn`을 사용하여 라이브러리를 설치할 수 있습니다:

```bash
pnpm add generate-router
```

## 사용법

### CLI 사용

라이브러리는 TypeScript 경로 정의를 생성하기 위한 CLI 도구를 제공합니다. 설치 후, `generate-router` 명령어를 사용할 수 있습니다:

```bash
npx generate-router ./pages ./types/routes.d.ts
```

### 인자

1. `<pagesDir>`: Next.js 프로젝트의 `pages` 또는 `app` 디렉토리 경로. (필수)
2. `<outputFile>`: 생성된 TypeScript 정의 파일의 출력 경로. (필수)

### 옵션

- `-o, --override`: Next.js 라우터 타입을 오버라이드하여 타입 안전한 라우팅을 제공합니다. 활성화하면 `next/router`와 `next/navigation` 모듈에 대한 타입 정의가 추가됩니다. (선택, 기본값: false)

### 예시

`pages` 디렉토리가 다음과 같은 구조를 가진 경우:

```
pages/
├── about.tsx
├── index.tsx
└── user/
    └── [id].tsx
```

아래 명령어를 실행하면:

```bash
npx generate-router ./pages ./types/routes.d.ts --override
```

`./types/routes.d.ts` 파일이 다음 내용으로 생성됩니다:

```typescript
// This file is auto-generated. Do not edit manually.
type StaticPaths =
  | '/'
  | '/about';

type DynamicPaths =
  | `/user/${string}`;

type RoutePath = StaticPaths | DynamicPaths | `${StaticPaths}?${string}`;

// Next.js 라우터 타입 오버라이드 (--override 옵션 사용 시)
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

### npm 스크립트 사용

더 간단히 사용하려면 `package.json`에 스크립트를 정의하세요:

```json
"scripts": {
  "generate:routes": "generate-router ./pages ./src/routes.d.ts --override"
}
```

이제 아래 명령어로 실행할 수 있습니다:

```bash
yarn generate:routes
```

## 개발

### 스크립트

- **Build**: Rollup 번들러를 실행하여 프로덕션 빌드를 생성합니다:
  ```bash
  pnpm run build
  ```
- **Test**: Jest 테스트를 실행합니다:
  ```bash
  pnpm run test
  ```

### 파일 구조

```
project-root/
├── src/
│   ├── index.ts             # 엔트리 포인트
│   ├── generator.ts         # 주요 로직
│   ├── utils/
│       ├── fileUtils.ts     # 파일 관련 유틸리티
│       ├── routeUtils.ts    # 경로 생성 유틸리티
├── test/
│   ├── generator.test.ts    # generator.ts 테스트
│   ├── utils/
│       ├── fileUtils.test.ts # fileUtils.ts 테스트
│       ├── routeUtils.test.ts # routeUtils.ts 테스트
├── dist/                    # 빌드 출력
├── package.json             # 프로젝트 설정
├── jest.config.js           # Jest 설정
├── rollup.config.js         # Rollup 설정
├── tsconfig.json            # TypeScript 설정

## 라이선스

이 프로젝트는 ISC 라이선스에 따라 라이선스가 부여됩니다.
