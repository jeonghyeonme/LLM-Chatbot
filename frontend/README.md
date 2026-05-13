# 📱 인하-봇 프론트엔드 (Frontend)

React 19와 TypeScript, Vite를 사용한 인하-봇의 사용자 인터페이스입니다.

## 🛠️ 시작하기

### 권장 환경
- Node.js 20.x 이상
- npm 10.x 이상

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

### 주요 스크립트
- `npm run dev`: Vite 개발 서버 실행 (HMR 지원)
- `npm run build`: 프로덕션 빌드 생성
- `npm run lint`: ESLint를 통한 코드 린팅
- `npm run preview`: 빌드된 결과물 미리보기

## 📁 디렉토리 구조
- `src/components`: 재사용 가능한 UI 컴포넌트
- `src/pages`: 각 라우트별 페이지 컴포넌트
- `src/assets`: 이미지, SVG 등 정적 자산
- `public/`: 정적 파일 (파비콘, 아이콘 등)

## 🎨 스타일 가이드
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크를 사용합니다.
- **Icon**: `lucide-react`를 기본 아이콘 라이브러리로 사용합니다.

## 🔗 관련 문서
- [프로젝트 전체 가이드라인](../GEMINI.md)
- [기여 방법](../CONTRIBUTING.md)
