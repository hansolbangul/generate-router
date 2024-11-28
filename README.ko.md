### 한글 README

# Generate Router

Next.js 프로젝트용 TypeScript 경로 정의를 생성하는 유틸리티입니다. 이 도구는 `pages`(Page Router) 및 `app`(App Router) 구조를 모두 지원하며, 타입 안전한 경로 정의를
생성할 수 있습니다.

## 설치

`pnpm`, `npm`, 또는 `yarn`을 사용하여 라이브러리를 설치합니다:

```bash
pnpm add generate-router
```

## 사용법

### CLI 사용

라이브러리는 CLI 도구를 제공합니다. 설치 후 `generate-router` 명령어를 사용할 수 있습니다:

```bash
npx generate-router --pagesDir=./pages --outputFile=./types/routes.d.ts --route=pages
```

### 옵션

- `--pagesDir` (또는 `-p`): Next.js 프로젝트의 `pages` 또는 `app` 디렉토리 경로. (필수)
- `--outputFile` (또는 `-o`): 생성된 TypeScript 정의 파일의 출력 경로. (필수)
- `--route` (또는 `-r`): 라우팅 유형, `pages`(Page Router) 또는 `app`(App Router). (필수)

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
npx generate-router --pagesDir=./pages --outputFile=./types/routes.d.ts --route=pages
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
```

### 코드 내에서 사용

TypeScript 또는 JavaScript 코드 내에서 라이브러리를 사용할 수도 있습니다:

```typescript
import {generateRoutes} from 'generate-router';

generateRoutes('./pages', './types/routes.d.ts', 'pages');
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
```

## 라이선스

이 프로젝트는 ISC 라이선스에 따라 라이선스가 부여됩니다.

