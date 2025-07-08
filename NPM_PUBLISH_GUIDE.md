# NPM 배포 가이드

이 문서는 `react-history-stack-manager` 패키지를 npm에 배포하는 방법을 안내합니다.

## 🚀 배포 전 준비사항

### 1. npm 계정 생성 및 로그인

```bash
# npm 계정이 없다면 회원가입
npm adduser

# 이미 계정이 있다면 로그인
npm login
```

### 2. 패키지명 확인 및 변경

현재 패키지명 `react-history-stack-manager`가 이미 사용 중일 수 있습니다.

```bash
# 패키지명 사용 가능 여부 확인
npm info react-history-stack-manager

# 사용 중이라면 고유한 이름으로 변경
# 예: @your-username/react-history-stack-manager
# 또는: react-history-stack-manager-yourname
```

`package.json`에서 패키지명 수정:

```json
{
  "name": "@your-username/react-history-stack-manager",
  // 또는
  "name": "react-history-stack-manager-yourname"
}
```

### 3. 작성자 정보 업데이트

`package.json`에서 작성자 정보를 실제 정보로 변경:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/react-history-stack-manager.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/react-history-stack-manager/issues"
  },
  "homepage": "https://github.com/your-username/react-history-stack-manager#readme"
}
```

## 🔧 빌드 및 테스트

### 1. 라이브러리 빌드

```bash
# 의존성 설치
npm install

# 빌드 실행
npm run build
```

빌드 후 `dist/` 폴더에 다음 파일들이 생성되어야 합니다:
- `index.js` (CommonJS)
- `index.esm.js` (ES Module)
- `index.umd.min.js` (UMD, minified)
- `index.d.ts` (TypeScript 타입 정의)

### 2. 로컬 테스트

```bash
# 로컬에서 패키지 링크 생성
npm link

# 테스트 프로젝트에서 링크된 패키지 사용
cd ../your-test-project
npm link react-history-stack-manager
```

### 3. 패키지 구조 확인

```bash
# 배포될 파일 목록 확인
npm pack --dry-run
```

## 📦 npm 배포

### 1. 첫 번째 배포

```bash
# 버전 확인 (package.json에서 1.0.0인지 확인)
npm version

# 패키지 배포
npm publish
```

### 2. Scoped Package 배포 (@ 사용 시)

```bash
# Public scoped package로 배포
npm publish --access public
```

### 3. 배포 확인

```bash
# 배포된 패키지 확인
npm info your-package-name

# 실제 설치 테스트
npm install your-package-name
```

## 🔄 업데이트 배포

### 버전 업데이트

```bash
# 패치 버전 업데이트 (1.0.0 → 1.0.1)
npm version patch

# 마이너 버전 업데이트 (1.0.0 → 1.1.0)
npm version minor

# 메이저 버전 업데이트 (1.0.0 → 2.0.0)
npm version major
```

### 업데이트 배포

```bash
# 빌드
npm run build

# 배포
npm publish
```

## 📋 체크리스트

배포 전 다음 사항들을 확인하세요:

- [ ] 패키지명이 고유한가?
- [ ] 작성자 정보가 올바른가?
- [ ] 라이센스가 명시되어 있는가?
- [ ] README.md가 완성되어 있는가?
- [ ] 빌드가 성공적으로 완료되는가?
- [ ] TypeScript 타입 정의가 포함되어 있는가?
- [ ] 필요한 파일만 배포되는가? (`files` 필드 확인)
- [ ] 의존성이 올바르게 설정되어 있는가?

## 🛡️ 보안 및 품질

### 1. 취약점 검사

```bash
# 보안 취약점 검사
npm audit

# 자동 수정 (가능한 경우)
npm audit fix
```

### 2. 배포 태그

```bash
# 베타 버전 배포
npm publish --tag beta

# 특정 태그로 설치
npm install your-package-name@beta
```

## 📊 배포 후 관리

### 1. 사용 통계 확인

npm 웹사이트에서 패키지 다운로드 통계를 확인할 수 있습니다:
`https://www.npmjs.com/package/your-package-name`

### 2. 패키지 업데이트

정기적으로 의존성을 업데이트하고 새로운 기능을 추가하세요:

```bash
# 의존성 업데이트
npm update

# 보안 업데이트
npm audit fix
```

### 3. 이슈 관리

GitHub Issues를 통해 사용자 피드백을 받고 버그를 수정하세요.

## 🚨 주의사항

1. **패키지명 충돌**: 이미 존재하는 패키지명은 사용할 수 없습니다.
2. **버전 관리**: Semantic Versioning을 따르세요.
3. **Breaking Changes**: 메이저 버전 업데이트 시 CHANGELOG에 명시하세요.
4. **보안**: 민감한 정보가 포함되지 않도록 주의하세요.
5. **라이센스**: 사용하는 라이브러리의 라이센스를 확인하세요.

## 📞 도움이 필요한 경우

- [npm 공식 문서](https://docs.npmjs.com/)
- [패키지 배포 가이드](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/) 